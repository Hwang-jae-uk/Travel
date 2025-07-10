import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import HotelHeader from './HotelHeader';
import { requestPayment } from "@portone/browser-sdk/v2";
import Button from '../../ui/Button';
import './Hotel.css';

const HotelReservationPage = () => {
    const [basketItems, setBasketItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [confirmLoading, setConfirmLoading] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        fetchBasketItems();
    }, []);

    // 날짜 범위 생성 함수 (체크인부터 체크아웃 전날까지)
    const getStayDates = (checkInDate, checkOutDate) => {
        const dates = [];
        const start = new Date(checkInDate);
        const end = new Date(checkOutDate);
        
        const current = new Date(start);
        while (current < end) {
            dates.push(new Date(current));
            current.setDate(current.getDate() + 1);
        }
        
        return dates;
    };

    // 날짜별 roomInventory 조회
    const fetchRoomInventoriesForDateRange = async (roomId, checkInDate, checkOutDate) => {
        const stayDates = getStayDates(checkInDate, checkOutDate);
        const inventories = [];
        
        console.log(`[바구니] Room ${roomId} 날짜 범위 조회:`, stayDates.map(d => d.toISOString().split('T')[0]));
        
        for (const date of stayDates) {
            const dateStr = date.toISOString().split('T')[0];
            try {
                const response = await axios.get(`/api/room/inventory/${roomId}/${dateStr}`);
                console.log(`[바구니] Room ${roomId}, ${dateStr} 조회 성공:`, response.data);
                inventories.push(response.data);
            } catch (error) {
                console.log(`[바구니] Room ${roomId}, ${dateStr} 조회 실패, 기본값 사용`);
                // API 실패 시 기본값 생성 (room.capacity 사용)
                inventories.push({
                    roomId: roomId,
                    date: dateStr,
                    availableCount: null // 나중에 room.capacity로 설정
                });
            }
        }
        
        return inventories;
    };

    // 최소 예약 가능 수 계산
    const getMinAvailableCount = (roomInventories, roomCapacity) => {
        if (!roomInventories || roomInventories.length === 0) {
            return roomCapacity;
        }
        
        const counts = roomInventories.map(inv => 
            inv.availableCount !== null ? inv.availableCount : roomCapacity
        );
        
        return Math.min(...counts);
    };

    // 예약 불가능한 날짜 찾기
    const getUnavailableDates = (roomInventories, roomCapacity) => {
        if (!roomInventories || roomInventories.length === 0) {
            return [];
        }
        
        return roomInventories
            .filter(inv => {
                const count = inv.availableCount !== null ? inv.availableCount : roomCapacity;
                return count === 0;
            })
            .map(inv => inv.date);
    };

    // 날짜 한국어 포맷팅
    const formatDateKorean = (dateString) => {
        return new Date(dateString).toLocaleDateString('ko-KR', {
            month: 'long',
            day: 'numeric',
            weekday: 'short'
        });
    };
    

    // 예약
    const fetchBasketItems = async () => {
        try {
            
            const response = await axios.get('/api/room/basketList', {
                params: {
                    userEmail: sessionStorage.getItem("userEmail")
                  }                
            });            
            
            console.log("response", response.data);
            
            const itemsWithDetails = await Promise.all(
            response.data.map(async(item)=>{
                const hotelResponse = await axios.get(`/api/hotel/${item.hotelId}`);
                const hotel = hotelResponse.data;

                const roomResponse = await axios.get(`/api/room/${item.roomId}`);
                const room = roomResponse.data;

                // roomInventory 정보 가져오기
                const roomInventories = await fetchRoomInventoriesForDateRange(
                    item.roomId, 
                    item.checkInDate, 
                    item.checkOutDate
                );

                const minAvailable = getMinAvailableCount(roomInventories, room.capacity);
                const unavailableDates = getUnavailableDates(roomInventories, room.capacity);
                const isAvailable = minAvailable > 0 && unavailableDates.length === 0;

                return {
                    ...item,
                    hotel: hotel,
                    room: room,
                    roomInventories: roomInventories,
                    minAvailable: minAvailable,
                    unavailableDates: unavailableDates,
                    isAvailable: isAvailable
                };
            }));


            console.log("itemsWithDetails", itemsWithDetails);
            setBasketItems(itemsWithDetails);
            setLoading(false);
        } catch (error) {
            console.error('바구니 목록을 불러오는데 실패했습니다:', error);
            if (error.response?.status === 401) {
                alert('로그인이 필요합니다.');
                navigate('/login');
            } else {
                alert('바구니 목록을 불러오는데 실패했습니다.');
            }
            setLoading(false);
        }
    };

    const removeFromBasket = async (basketId) => {
        if (!window.confirm('이 예약을 바구니에서 삭제하시겠습니까?')) {
            return;
        }

        try {
            await axios.delete(`/api/room/basket/${basketId}`);
            alert('바구니에서 삭제되었습니다.');
            fetchBasketItems(); // 목록 새로고침
        } catch (error) {
            console.error('바구니 삭제 실패:', error);
            alert('바구니 삭제에 실패했습니다.');
        }
    };

    const confirmReservation = async (basketItem) => {

        const userEmail = sessionStorage.getItem("userEmail");

        // 예약 가능 여부 재확인
        if (!basketItem.isAvailable || basketItem.minAvailable === 0) {
            alert('죄송합니다. 해당 날짜에 예약 가능한 객실이 없습니다.');
            // 바구니 목록 새로고침
            fetchBasketItems();
            return;
        }

        if (!window.confirm('예약을 확정하시겠습니까?')) {
            return;
        }

        setConfirmLoading(true);


        try {
            function randomId() {
                return [...crypto.getRandomValues(new Uint32Array(2))]
                  .map((word) => word.toString(16).padStart(8, "0"))
                  .join("")
              }
            const paymentId = randomId()
            const rsp = await requestPayment({
                storeId: "store-fd69f593-4992-4593-9d12-f269b22f36ac",
                channelKey: "channel-key-ddf7f157-2c1a-4dbc-872e-4d9bbf26dbe8",
                paymentId,
                orderName: "호텔 예약",
                totalAmount: 1000,
                currency: "KRW",
                pgProvider: "PG_PROVIDER_HTML5_INICIS",
                payMethod: "CARD",
                isTestChannel: true,
                customer: {
                    fullName: "홍길동",
                    email: "ghkdwodnr93@naver.com",
                    phoneNumber: "01012345678"
                },
                channelType: "WEB"
            });



            if (rsp && rsp.code === undefined) {
                alert("결제가 완료되었습니다!");
                
                // 선택된 항목에 결제 정보와 상태 저장
                console.log(basketItems);
                const updated = basketItems.map((itm, idx) => {
                    return {
                        ...itm,
                        paid: true,
                        paymentInfo: {
                            paymentId,
                            txId: rsp.txId,
                            amount: 1000
                        }
                    };
                });
                setBasketItems(updated);

                try {
                    // 1. 예약 확정
                    const response = await axios.post('/api/room/reservation', {
                        paymentId: paymentId,
                        roomId : basketItem.roomId,
                        hotelId: basketItem.hotelId,
                        reservationBasketId: basketItem.id,
                        checkInDate: basketItem.checkInDate,
                        checkOutDate: basketItem.checkOutDate,
                        userEmail: userEmail,
                        price: basketItem.room.price*calculateNights(basketItem.checkInDate, basketItem.checkOutDate)
                    });
                    console.log("response", response.data);
        
                    // 2. 예약 확정 성공 시 바구니에서 해당 항목 삭제
                    await axios.delete(`/api/room/basket/${basketItem.id}`);
        
                    alert('예약이 확정되었습니다!');
                    fetchBasketItems(); // 목록 새로고침
                } catch (error) {
                    console.error('예약 확정 실패:', error);
                    alert(error.response?.data?.error || '예약 확정에 실패했습니다.');
                } finally {
                    setConfirmLoading(false);
                }

            } else {
                alert(`결제가 실패되었습니다.: ${rsp?.message || rsp?.code || 'Unknown error'}`);
            }
        } catch (err) {
            console.error(err);
            alert("결제 처리 중 오류가 발생했습니다.");
        }


        
    };

    const calculateNights = (checkIn, checkOut) => {
        const checkInDate = new Date(checkIn);
        const checkOutDate = new Date(checkOut);
        return Math.ceil((checkOutDate - checkInDate) / (1000 * 60 * 60 * 24));
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('ko-KR', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            weekday: 'short'
        });
    };

    if (loading) {
        return (
            <div className="hotel-reservation-container">
                <HotelHeader
                    title="🛒 예약 바구니"
                    leftChild={<Button text={"◀"} onClick={() => navigate('/HotelPage')}/>}
                />
                <div className="loading">바구니 목록을 불러오는 중...</div>
            </div>
        );
    }

    return (
        <div className="hotel-reservation-container">
            <HotelHeader
                title="🛒 예약 바구니"
                leftChild={<Button text={"◀"} onClick={() => navigate('/HotelPage')}/>}
            />
            
            <div className="reservation-content">
                {basketItems.length === 0 ? (
                    <div className="empty-basket">
                        <div className="empty-basket-icon">🛒</div>
                        <h2>바구니가 비어있습니다</h2>
                        <p>호텔을 둘러보고 마음에 드는 객실을 바구니에 담아보세요!</p>
                        <button 
                            className="go-to-hotels-btn"
                            onClick={() => navigate('/HotelPage')}
                        >
                            호텔 둘러보기
                        </button>
                    </div>
                ) : (
                    <>
                        <div className="basket-summary">
                            <h2>총 {basketItems.length}개의 예약이 담겨있습니다</h2>
                        </div>
                        
                        <div className="basket-items">
                            {basketItems.map((item, index) => (
                                <div key={item.id} className={`basket-item ${!item.isAvailable ? 'unavailable' : ''}`}>
                                    <div className="item-number">{index + 1}</div>
                                    <div className="hotel-info">
                                        
                                    {item.hotel?.images?.[0]?.imageUrl ? (
                                        <img
                                            src={`http://10.100.105.22:8080/api/images${encodeURI(item.hotel.images[0].imageUrl)}`}
                                            alt="호텔 이미지"
                                            style={{ width: '100px', height: 'auto' }}
                                        />
                                        ) : (
                                        <div className="no-image">이미지 없음</div>
                                    )}
                                        
                                        {/* <img src={'http://10.100.105.22:8080/api/images'+encodeURI(item.hotel.images[0].imageUrl)} alt="호텔 이미지" /> */}
                                        <h3>{item.hotel.name || '호텔 정보 없음'}</h3>
                                        <p className="hotel-address">{item.hotel.address}</p>
                                    </div>
                                    
                                    <div className="room-info">
                                        <h4>{item.room.name || '객실 정보 없음'}</h4>
                                        <div className="room-details">
                                            <span>👥 최대 {item.room.people || 0}명</span>
                                            <span>🛏️ 침대 {item.room.beds || 0}개</span>
                                            <span>🚿 욕실 {item.room.bathrooms || 0}개</span>
                                        </div>
                                        
                                        {/* 예약 가능 여부 표시 */}
                                        <div className="availability-status">
                                            {item.isAvailable ? (
                                                <span className="available-count" style={{color: 'green', fontWeight: 'bold'}}>
                                                    ✅ 예약 가능 (남은 객실: {item.minAvailable}개)
                                                </span>
                                            ) : (
                                                <div className="unavailable-info">
                                                    <span className="unavailable-count" style={{color: 'red', fontWeight: 'bold'}}>
                                                        ❌ 예약 불가능
                                                    </span>
                                                    {item.unavailableDates.length > 0 && (
                                                        <p className="unavailable-dates" style={{color: 'red', fontSize: '0.9em', margin: '5px 0'}}>
                                                            불가능한 날짜: {item.unavailableDates.map(date => formatDateKorean(date)).join(', ')}
                                                        </p>
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                    
                                    <div className="reservation-details">
                                        <div className="dates">
                                            <p><strong>📅 체크인:</strong> {formatDate(item.checkInDate)}</p>
                                            <p><strong>📅 체크아웃:</strong> {formatDate(item.checkOutDate)}</p>
                                            <p><strong>🌙 숙박:</strong> {calculateNights(item.checkInDate, item.checkOutDate)}박</p>
                                        </div>
                                        
                                        {item.isAvailable && (
                                            <div className="price-info">
                                                <p className="price-per-night">
                                                    {(item.room.price)}원 / 박
                                                </p>
                                                <p className="total-price">
                                                    <strong>총 금액: {((item.room?.price || 0) * calculateNights(item.checkInDate, item.checkOutDate)).toLocaleString()}원</strong>
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                    
                                    <div className="item-actions">
                                        <button 
                                            className={`confirm-btn ${!item.isAvailable ? 'disabled' : ''}`}
                                            onClick={() => confirmReservation(item)}
                                           
                                        >
                                            {!item.isAvailable ? '예약 불가' : 
                                             '예약 확정'}
                                        </button>
                                        <button 
                                            className="confirm-btn-delete"
                                            onClick={() => removeFromBasket(item.id)}
                                        >
                                            삭제
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                        
                        <div className="reservation-summary" style={{
                            margin: '20px auto',
                            padding: '20px',
                            backgroundColor: 'white',
                            boxShadow: 'none',
                            maxWidth: '100%',
                            border: '1px solid #e2e8f0',
                            borderRadius: '8px'
                        }}>
                            <div style={{
                                display: 'flex',
                                flexDirection: 'column',
                                gap: '10px'
                            }}>
                                <div style={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                    padding: '8px 0',
                                    borderBottom: '1px solid #e2e8f0'
                                }}>
                                    <span>총 예약 수</span>
                                    <span>{basketItems.length}개</span>
                                </div>
                                <div style={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                    padding: '8px 0',
                                    borderBottom: '1px solid #e2e8f0'
                                }}>
                                    <span>예약 가능</span>
                                    <span>{basketItems.filter(item => item.isAvailable).length}개</span>
                                </div>
                                <div style={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                    padding: '8px 0',
                                    borderBottom: '1px solid #e2e8f0'
                                }}>
                                    <span>예약 불가능</span>
                                    <span>{basketItems.filter(item => !item.isAvailable).length}개</span>
                                </div>
                                <div style={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                    padding: '12px 0',
                                    marginTop: '8px',
                                    borderTop: '2px solid #2b6cb0',
                                    fontWeight: 'bold'
                                }}>
                                    <span>총 결제 예상 금액</span>
                                    <span style={{ color: '#2b6cb0' }}>
                                        {basketItems
                                            .filter(item => item.isAvailable)
                                            .reduce((total, item) => 
                                                total + ((item.room?.price || 0) * calculateNights(item.checkInDate, item.checkOutDate)), 0
                                            ).toLocaleString()}원
                                    </span>
                                </div>
                            </div>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default HotelReservationPage;
    