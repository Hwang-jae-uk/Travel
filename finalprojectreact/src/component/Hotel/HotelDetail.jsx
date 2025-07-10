import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import HotelReviews from './HotelReviews';
import HotelMapModal from './HotelMapModal';
import './Hotel.css';
import HotelHeader from './HotelHeader';
import Button from '../../ui/Button';
import { BsCart4, BsCalendar3 } from 'react-icons/bs';
import { IoLocationSharp, IoArrowBack, IoCamera } from 'react-icons/io5';
import { HiUsers } from 'react-icons/hi';
import { MdClose } from 'react-icons/md';

const HotelDetail = () => {
    const { id } = useParams();
    const [hotel, setHotel] = useState(null);
    const [showAllImages, setShowAllImages] = useState(false);
    const [selectedRoom, setSelectedRoom] = useState(null);
    const [selectedImageIndex, setSelectedImageIndex] = useState(0);
    const [loading, setLoading] = useState(true);
    const [imageLoadError, setImageLoadError] = useState(false);
    const [showMapModal, setShowMapModal] = useState(false);
    const [showImageModal, setShowImageModal] = useState(false);
    const [selectedModalImage, setSelectedModalImage] = useState(null);

    
    // 오늘 날짜 설정 (체크인 날짜 최소값)
    const today = new Date().toISOString().split('T')[0];
    
    // 내일 날짜 설정 (체크아웃 기본값)
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const tomorrowString = tomorrow.toISOString().split('T')[0];
    
    // 날짜 선택 상태 - 기본값을 오늘과 내일로 설정
    const [checkInDate, setCheckInDate] = useState(today);
    console.log(checkInDate);
    const [checkOutDate, setCheckOutDate] = useState(tomorrowString);
    const [guestCount, setGuestCount] = useState(1);
    const [reservationLoading, setReservationLoading] = useState(false);
    
    const navigate = useNavigate();

    const [roomInventory, setRoomInventory] = useState([
        {
            roomId: null,
            date: null,
            availableCount: null
        }
    ]);
    
    
    
    
    
    useEffect(() => {
        const fetchHotel = async () => {


            
            try {
                const response = await axios.get(`/api/hotel/${id}`);
                console.log(response.data);
                setHotel(response.data);
                setLoading(false);

                const roomIds = response.data.rooms.map(room => room.id);
                console.log(roomIds);
                
                // 체크인부터 체크아웃까지의 모든 날짜에 대한 RoomInventory 조회
                const roomInventories = await fetchRoomInventoriesForDateRange(roomIds, checkInDate, checkOutDate);
                setRoomInventory(roomInventories);
                console.log('초기 로딩된 roomInventories:', roomInventories);
                
                
                
            } catch (error) {
                console.error('호텔 정보를 불러오는데 실패했습니다:', error);
                setLoading(false);
            }
        };
        fetchHotel();
    }, [id]);

    // 체크인 날짜의 다음 날 계산 함수
    const getMinCheckOutDate = (checkInDate) => {
        if (!checkInDate) return today;
        const nextDay = new Date(checkInDate);
        nextDay.setDate(nextDay.getDate() + 1);
        return nextDay.toISOString().split('T')[0];
    };

    // 체크인 날짜 변경 시 체크아웃 날짜 자동 조정 및 roomInventory 업데이트
    const handleCheckInChange = async (e) => {
        const newCheckIn = e.target.value;
        console.log(newCheckIn);
        setCheckInDate(newCheckIn);
        
        // 체크아웃 날짜가 체크인 날짜보다 이전이면 자동으로 다음 날로 설정
        const minCheckOut = getMinCheckOutDate(newCheckIn);
        if (checkOutDate && checkOutDate < minCheckOut) {
            setCheckOutDate(minCheckOut);
        }

        // 새로운 날짜 범위에 따른 roomInventory 정보 업데이트
        if (hotel && hotel.rooms) {
            const roomIds = hotel.rooms.map(room => room.id);
            const newCheckOut = checkOutDate && checkOutDate >= getMinCheckOutDate(newCheckIn) ? checkOutDate : getMinCheckOutDate(newCheckIn);
            
            const roomInventories = await fetchRoomInventoriesForDateRange(roomIds, newCheckIn, newCheckOut);
            setRoomInventory(roomInventories);
            console.log('Updated room inventories:', roomInventories);
        }
    };

    // 날짜 범위 생성 함수 (체크인부터 체크아웃 전날까지)
    const getStayDates = (checkIn, checkOut) => {
        if (!checkIn || !checkOut) return [];
        
        const dates = [];
        const currentDate = new Date(checkIn);
        const endDate = new Date(checkOut);
        
        while (currentDate < endDate) {
            dates.push(currentDate.toISOString().split('T')[0]);
            currentDate.setDate(currentDate.getDate() + 1);
        }
        
        return dates;
    };

    // 모든 숙박 날짜의 RoomInventory 조회
    const fetchRoomInventoriesForDateRange = async (roomIds, checkIn, checkOut) => {
        const stayDates = getStayDates(checkIn, checkOut);
        console.log('숙박 날짜들:', stayDates);
        
        try {
            const allInventories = [];
            
            // 각 방별로, 각 날짜별로 조회
            for (const roomId of roomIds) {
                for (const date of stayDates) {
                    try {
                        const response = await axios.get(`/api/room/inventory/${roomId}/${date}`);
                        allInventories.push(response.data);
                        console.log(`✅ Room ${roomId}, Date ${date} 조회 성공:`, response.data);
                    } catch (error) {
                        console.error(`❌ Room ${roomId}, Date ${date} 조회 실패:`, error);
                        
                        // API 호출 실패 시 기본값 생성 (해당 방의 capacity 사용)
                        const room = hotel?.rooms?.find(r => r.id === roomId);
                        const defaultInventory = {
                            roomId: roomId,
                            date: date,
                            availableCount: room?.capacity || 0,
                            totalCount: room?.capacity || 0,
                            reservedCount: 0
                        };
                        allInventories.push(defaultInventory);
                        console.log(`🔄 Room ${roomId}, Date ${date} 기본값 생성:`, defaultInventory);
                    }
                }
            }
            
            console.log('🎯 전체 allInventories:', allInventories);
            return allInventories;
        } catch (error) {
            console.error('객실 재고 정보를 불러오는데 실패했습니다:', error);
            return [];
        }
    };

    // 특정 방의 최소 예약 가능 수 계산 (모든 숙박 날짜 중 가장 적은 수)
    const getMinAvailableCount = (roomId, checkIn, checkOut) => {
        const stayDates = getStayDates(checkIn, checkOut);
        console.log(`🔍 Room ${roomId} - 숙박 날짜:`, stayDates);
        
        if (stayDates.length === 0) return 0;
        
        let minAvailable = Infinity;
        
        for (const date of stayDates) {
            const inventory = roomInventory.find(item => 
                item.roomId === roomId && 
                new Date(item.date).toISOString().split('T')[0] === date
            );
            
            console.log(`🔍 Room ${roomId}, Date ${date} - inventory 찾기:`, inventory);
            
            // availableCount가 null이나 undefined일 때만 기본값 사용, 0일 때는 0 그대로 사용
            const availableCount = inventory?.availableCount !== null && inventory?.availableCount !== undefined 
                ? inventory.availableCount 
                : (hotel.rooms.find(room => room.id === roomId)?.capacity || 0);
            
            console.log(`🔍 Room ${roomId}, Date ${date} - availableCount:`, availableCount);
            
            minAvailable = Math.min(minAvailable, availableCount);
        }
        
        const result = minAvailable === Infinity ? 0 : minAvailable;
        console.log(`🎯 Room ${roomId} - 최종 minAvailable:`, result);
        return result;
    };

    // 특정 방의 예약 불가능한 날짜들 찾기
    const getUnavailableDates = (roomId, checkIn, checkOut) => {
        const stayDates = getStayDates(checkIn, checkOut);
        const unavailableDates = [];
        
        for (const date of stayDates) {
            const inventory = roomInventory.find(item => 
                item.roomId === roomId && 
                new Date(item.date).toISOString().split('T')[0] === date
            );
            
            // availableCount가 null이나 undefined일 때만 기본값 사용, 0일 때는 0 그대로 사용
            const availableCount = inventory?.availableCount !== null && inventory?.availableCount !== undefined 
                ? inventory.availableCount 
                : (hotel.rooms.find(room => room.id === roomId)?.capacity || 0);
            
            if (availableCount === 0) {
                unavailableDates.push(date);
            }
        }
        
        return unavailableDates;
    };

    // 특정 방이 예약 가능한지 확인
    const isRoomAvailable = (roomId, checkIn, checkOut) => {
        return getMinAvailableCount(roomId, checkIn, checkOut) > 0;
    };

    // 날짜를 한국어 형식으로 포맷팅
    const formatDateKorean = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('ko-KR', {
            month: 'long',
            day: 'numeric',
            weekday: 'short'
        });
    };

    // 바구니에 추가
    const addToBasket = async (roomId) => {

        const userEmail = sessionStorage.getItem('userEmail');
        
        // 예약 가능 여부 확인
        const minAvailable = getMinAvailableCount(roomId, checkInDate, checkOutDate);
        const unavailableDates = getUnavailableDates(roomId, checkInDate, checkOutDate);
        
        if (minAvailable === 0 || unavailableDates.length > 0) {
            if (unavailableDates.length > 0) {
                alert(`죄송합니다. 다음 날짜에 예약 가능한 객실이 없습니다:\n${unavailableDates.map(date => formatDateKorean(date)).join(', ')}`);
            } else {
                alert('죄송합니다. 해당 날짜에 예약 가능한 객실이 없습니다.');
            }
            return;
        }
        
        setReservationLoading(true);
        

        try {
            // 바구니에 추가
            const response = await axios.post('/api/room/roomReservation', {
                userEmail,
                hotelId: hotel.id,
                roomId: roomId,
                checkInDate: checkInDate,
                checkOutDate: checkOutDate
            });

            alert('바구니에 추가되었습니다!');
            console.log('바구니 추가 성공:', response.data);
            
        } catch (error) {
            console.error('바구니 추가 실패:', error);
            if (error.response?.status === 401) {
                alert('로그인이 필요합니다.');
            } else {
                alert(error.response?.data?.error || '바구니 추가에 실패했습니다.');
            }
        } finally {
            setReservationLoading(false);
        }
    };

    // selectedImageIndex가 변경될 때마다 로그 출력
    useEffect(() => {
        console.log('Selected image index changed to:', selectedImageIndex);
        setImageLoadError(false); // 새 이미지 선택 시 에러 상태 초기화
        if (hotel && hotel.images) {
            console.log('Current image data:', hotel.images[selectedImageIndex]);
            console.log('Total images:', hotel.images.length);
            console.log('All image URLs:', hotel.images.map(img => img.imageUrl));
        }
    }, [selectedImageIndex, hotel]);

    const handleImageClick = (index) => {
        console.log('=== handleImageClick ===');
        console.log('Clicked index:', index);
        console.log('Current selectedImageIndex before update:', selectedImageIndex);
        setSelectedImageIndex(index);
        setShowAllImages(true);
    };

    const handleThumbnailClick = (index, e) => {
        e.stopPropagation();
        console.log('=== handleThumbnailClick ===');
        console.log('Clicked thumbnail index:', index);
        console.log('Current selectedImageIndex before update:', selectedImageIndex);
        console.log('Event target:', e.target);
        console.log('Event currentTarget:', e.currentTarget);
        
        // 상태 업데이트를 함수형 업데이트로 변경
        setSelectedImageIndex(prevIndex => {
            console.log('Previous index:', prevIndex, '-> New index:', index);
            return index;
        });
    };

    const handleModalClose = () => {
        console.log('=== handleModalClose ===');
        setShowAllImages(false);
        setSelectedImageIndex(0);
        setImageLoadError(false);
    };

    const handleImageError = (e, imageIndex) => {
        console.error('Image load failed for index:', imageIndex);
        console.error('Failed URL:', e.target.src);
        
        // 여러 대체 URL 시도
        const imageUrl = hotel.images[imageIndex]?.imageUrl;
        
    };

    // 이미지 모달 열기
    const handleRoomImageClick = (imageUrl) => {
        setSelectedModalImage(`${imageUrl}`);
        setShowImageModal(true);
    };

    // 이미지 모달 닫기
    const handleCloseImageModal = () => {
        setSelectedModalImage(null);
        setShowImageModal(false);
    };

    if (loading) {
        return <div className="loading">호텔 정보를 불러오는 중...</div>;
    }

    if (!hotel) {
        return <div className="error">호텔 정보를 찾을 수 없습니다.</div>;
    }

    return (
        <div className="hotel-detail-container">
            <HotelHeader
                rightChild={<Button text={<BsCart4 size={30} />} onClick={() => navigate('/HotelReservationPage')}/>}
                leftChild={<Button text={<IoArrowBack size={30} />} onClick={() => navigate('/HotelPage')}/>}
            />
            {/* 호텔 이미지 섹션 */}
            {hotel.images && hotel.images.length > 0 && (
            <div className="hotel-images-section">
                <div className="hotel-main-image-container" onClick={() => handleImageClick(0)}>
                    <img 
                        src={`${hotel.images[0].imageUrl}`}
                        alt={hotel.name} 
                        className="hotel-main-image"
                    />
                    <div className="image-overlay">
                        <span className="view-images-text"><IoCamera size={20} /> 이미지 보기</span>
                    </div>
                </div>
                <div className="thumbnail-container">
                        {hotel.images.slice(1, 5).filter(image => image && image.imageUrl).map((image, index) => (
                        <div 
                            key={index}
                            className="thumbnail-item"
                            onClick={() => handleImageClick(index + 1)}
                        >
                            <img 
                                src={`${image.imageUrl}`}
                                alt={`${hotel.name} ${index + 2}`}
                                className="thumbnail"
                            />
                            {index === 3 && hotel.images.length > 5 && (
                                <div className="more-images-overlay" onClick={(e) => {
                                    e.stopPropagation();
                                    setShowAllImages(true);
                                }}>
                                    <span className="more-images-text">+{hotel.images.length - 5}</span>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>
            )}

            {/* 호텔 기본 정보 */}
            <div className="hotel-info-section">
                
                 
                <h1 className="hotel-name">{hotel.name}</h1>
                <div className="hotel-details">
                    <p className="address-with-map-btn">
                        <strong>주소:</strong> {hotel.address}
                        <button 
                            className="map-toggle-btn" 
                            onClick={() => setShowMapModal(true)}
                            title="지도에서 보기"
                        >
                            <IoLocationSharp size={18} /> 지도보기
                        </button>
                    </p>
                    <p><strong>전화번호:</strong> {hotel.phone}</p>
                    <p><strong>이메일:</strong> {hotel.email}</p>
                    <p><strong>조식:</strong> {hotel.breakfast ? '있음' : '없음'}  {hotel.breakfastPrice ? `(추가 요금 인당 ${hotel.breakfastPrice}원)` : ''}</p>
                  
                </div>
                <div className="hotel-description">
                    <h2>호텔 소개</h2>
                    <p>{hotel.description}</p>
                </div>
            </div>

            {/* 예약 날짜 선택 섹션 */}
            <div className="reservation-section">
                <h2>예약 정보</h2>
                <div className="reservation-form">
                    <div className="date-inputs">
                        <div className="date-input-group">
                            <label htmlFor="checkIn">📅 체크인</label>
                            <div className="date-input-wrapper">
                                <input
                                    type="date"
                                    id="checkIn"
                                    value={checkInDate}
                                    min={today}
                                    onChange={handleCheckInChange}
                                    className="date-input enhanced-date-input"
                                    onClick={(e) => e.target.showPicker && e.target.showPicker()}
                                />
                                <span className="date-display-text">
                                    {checkInDate ? new Date(checkInDate).toLocaleDateString('ko-KR', {
                                        year: 'numeric',
                                        month: 'long',
                                        day: 'numeric',
                                        weekday: 'short'
                                    }) : '날짜를 선택하세요'}
                                </span>
                            </div>
                        </div>
                        <div className="date-input-group">
                            <label htmlFor="checkOut">📅 체크아웃</label>
                            <div className="date-input-wrapper">
                                <input
                                    type="date"
                                    id="checkOut"
                                    value={checkOutDate}
                                    min={getMinCheckOutDate(checkInDate)}
                                    onChange={async (e) => {
                                        const newCheckOut = e.target.value;
                                        const minCheckOut = getMinCheckOutDate(checkInDate);
                                        
                                        // 체크아웃 날짜가 최소 날짜보다 이전이면 최소 날짜로 설정
                                        if (newCheckOut < minCheckOut) {
                                            setCheckOutDate(minCheckOut);
                                            alert('체크아웃 날짜는 체크인 날짜보다 최소 1일 후여야 합니다.');
                                        } else {
                                            setCheckOutDate(newCheckOut);
                                            
                                            // 새로운 날짜 범위에 따른 roomInventory 정보 업데이트
                                            if (hotel && hotel.rooms) {
                                                const roomIds = hotel.rooms.map(room => room.id);
                                                const roomInventories = await fetchRoomInventoriesForDateRange(roomIds, checkInDate, newCheckOut);
                                                setRoomInventory(roomInventories);
                                                console.log('Updated room inventories (checkout change):', roomInventories);
                                            }
                                        }
                                    }}
                                    className="date-input enhanced-date-input"
                                    onClick={(e) => e.target.showPicker && e.target.showPicker()}
                                />
                                <span className="date-display-text">
                                    {checkOutDate ? new Date(checkOutDate).toLocaleDateString('ko-KR', {
                                        year: 'numeric',
                                        month: 'long',
                                        day: 'numeric',
                                        weekday: 'short'
                                    }) : '날짜를 선택하세요'}
                                </span>
                            </div>
                        </div>
                        <div className="guest-input-group">
                            <label htmlFor="guests"><HiUsers size={20} /> 인원</label>
                            <select
                                id="guests"
                                value={guestCount}
                                onChange={(e) => setGuestCount(parseInt(e.target.value))}
                                className="guest-select enhanced-select"
                            >
                                {[1, 2, 3, 4, 5, 6].map(num => (
                                    <option key={num} value={num}>{num}명</option>
                                ))}
                            </select>
                        </div>
                    </div>
                    {checkInDate && checkOutDate && (
                        <div className="date-summary">
                            <p>📅 {checkInDate} ~ {checkOutDate} ({Math.ceil((new Date(checkOutDate) - new Date(checkInDate)) / (1000 * 60 * 60 * 24))}박)</p>
                            <p><HiUsers size={18} /> {guestCount}명</p>
                        </div>
                    )}
                </div>
            </div>

            {/* 객실 정보 섹션 */}
            <div className="rooms-section">
                <h2>객실 정보</h2>
                <div className="rooms-grid">
                    {hotel.rooms && hotel.rooms.filter(room => room).map((room, index) => {
                        const isAvailable = isRoomAvailable(room.id, checkInDate, checkOutDate);
                        return (
                        <div key={index} className={`room-card ${isAvailable ? '' : 'unavailable'}`}>
                            <div className="room-image" onClick={() => setSelectedRoom(room)}>
                                {room.roomImages && room.roomImages.length > 0 && room.roomImages[0]?.imageUrl ? (
                                    <img src={`${room.roomImages[0].imageUrl}`} alt={room.name} />
                                ) : (
                                    <div className="no-image">이미지 없음</div>
                                )}
                            </div>
                            <div className="room-info">
                                <h3>{room.name}</h3>
                                <p><strong>가격:</strong> {room.price?.toLocaleString() || 0}원/박</p>
                                <p><strong>최대 인원:</strong> {room.people || 0}명</p>
                                <p><strong>침대:</strong> {room.beds || 0}개</p>
                                <p><strong>욕실:</strong> {room.bathrooms || 0}개</p>
                                {(() => {
                                    const minAvailable = getMinAvailableCount(room.id, checkInDate, checkOutDate);
                                    const unavailableDates = getUnavailableDates(room.id, checkInDate, checkOutDate);
                                    const isAvailable = isRoomAvailable(room.id, checkInDate, checkOutDate);
                                    const stayDates = getStayDates(checkInDate, checkOutDate);
                                    
                                    console.log(`📋 전체 roomInventory 배열:`, roomInventory);
                                    console.log(`🏠 Room ${room.id} - 숙박 날짜: ${stayDates.join(', ')}, 최소 가능 수: ${minAvailable}, 불가능 날짜: ${unavailableDates.join(', ')}`);
                                    
                                    return (
                                        <>
                                            <p><strong>예약 가능 객실 수:</strong> 
                                                {isAvailable ? (
                                                    <span> {minAvailable}개</span>
                                                ) : (
                                                    <span className="unavailable-count"> 예약 불가능</span>
                                                )}
                                            </p>
                                            
                                            {/* 예약하기 버튼 또는 예약 불가능 메시지 */}
                                            <div className="room-reservation">
                                                {isAvailable ? (
                                                    <>
                                                        {checkInDate && checkOutDate && (
                                                            <div className="total-price">
                                                                <strong>총 금액: {((room.price || 0) * Math.ceil((new Date(checkOutDate) - new Date(checkInDate)) / (1000 * 60 * 60 * 24))).toLocaleString()}원</strong>
                                                            </div>
                                                        )}
                                                        <button
                                                            className="reserve-btn"
                                                            onClick={() => addToBasket(room.id)}
                                                        >
                                                            <BsCart4 size={20} /> 바구니 담기
                                                        </button>
                                                    </>
                                                ) : (
                                                    <div className="unavailable-info">
                                                        <div className="unavailable-message">
                                                            <span>
                                                                <MdClose size={20} /> 예약 불가능
                                                            </span>
                                                        </div>
                                                        {unavailableDates.length > 0 && (
                                                            <div className="unavailable-dates">
                                                                <small>
                                                                    예약 불가능한 날짜: {unavailableDates.map(date => formatDateKorean(date)).join(', ')}
                                                                </small>
                                                            </div>
                                                        )}
                                                    </div>
                                                )}
                                            </div>
                                                                                 </>
                                     );
                                 })()}
                            </div>
                        </div>
                        );
                    })}
                </div>
            </div>

            {/* 전체 이미지 모달 */}
            {showAllImages && (
                <div className="modal-overlay" onClick={handleModalClose}>
                    <div className="modal-content image-gallery-modal" onClick={e => e.stopPropagation()}>
                        <button className="close-btn" onClick={handleModalClose}>×</button>
                        <div className="image-gallery-container">
                            <div className="hotel-main-image-display">
                                {hotel.images && hotel.images[selectedImageIndex] ? (
                                    <>
                                        <img 
                                            key={`main-${selectedImageIndex}`}
                                            src={`${(hotel.images[selectedImageIndex].imageUrl)}`}
                                            alt={`${hotel.name} ${selectedImageIndex + 1}`}
                                            onLoad={() => {
                                                console.log('Main image loaded successfully for index:', selectedImageIndex);
                                                setImageLoadError(false);
                                            }}
                                            onError={(e) => handleImageError(e, selectedImageIndex)}
                                            style={{ 
                                                width: '100%',
                                                height: '100%',
                                                objectFit: 'contain',
                                                display: imageLoadError ? 'none' : 'block',
                                                backgroundColor: '#f0f0f0'
                                            }}
                                        />
                                    </>
                                ) : (
                                    <div className="image-error">
                                        <p>이미지를 불러올 수 없습니다</p>
                                        <p>Index: {selectedImageIndex}</p>
                                        <p>Total images: {hotel.images ? hotel.images.length : 0}</p>
                                    </div>
                                )}
                                <div className="image-counter">
                                    {selectedImageIndex + 1} / {hotel.images?.length || 0}
                                </div>
                            </div>
                            <div className="image-thumbnails-list">
                                {hotel.images.filter(image => image && image.imageUrl).map((image, index) => (
                                    <div 
                                        key={`thumb-${index}`}
                                        className={`thumbnail-wrapper ${index === selectedImageIndex ? 'active' : ''}`}
                                        onClick={(e) => handleThumbnailClick(index, e)}
                                        data-index={index}
                                    >
                                        <img 
                                            src={`${(image.imageUrl)}`}
                                            alt={`${hotel.name} ${index + 1}`}
                                            className="gallery-thumbnail"
                                            data-index={index}
                                        />
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* 객실 이미지 모달 */}
            {selectedRoom && (
                <div className="modal-overlay" onClick={() => setSelectedRoom(null)}>
                    <div className="modal-content" onClick={e => e.stopPropagation()}>
                        <button className="close-btn" onClick={() => setSelectedRoom(null)}>×</button>
                
                        <div className="modal-images-grid">
                            {selectedRoom.roomImages && selectedRoom.roomImages.filter(image => image && image.imageUrl).map((image, index) => (
                                <img 
                                    key={index}
                                    src={`${image.imageUrl}`}
                                    alt={`${selectedRoom.name} ${index + 1}`}
                                    className="modal-image"
                                    onClick={() => handleRoomImageClick(`${image.imageUrl}`)}
                                />
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {/* 리뷰 섹션 */}
            <div className="hotel-detail-section">
                <HotelReviews hotelId={id} />
            </div>

                          {/* 호텔 위치 지도 모달 */}
            <HotelMapModal 
                isOpen={showMapModal}
                onClose={() => setShowMapModal(false)}
                address={hotel.address}
                hotelName={hotel.name}
            />

            {/* 이미지 확대 모달 */}
            {showImageModal && selectedModalImage && (
                <div className="image-modal-overlay" onClick={handleCloseImageModal}>
                    <div className="image-modal-content">
                        <img
                            src={selectedModalImage}
                            alt="Expanded room"
                            onClick={(e) => e.stopPropagation()}
                        />
                    </div>
                </div>
            )}
        </div>
    );
};

export default HotelDetail;