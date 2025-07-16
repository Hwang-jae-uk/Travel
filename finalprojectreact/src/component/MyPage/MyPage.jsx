import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './MyPage.css';
import Button from '../../ui/Button';
import { PaymentClient } from "@portone/server-sdk";
import { BookingContext } from '../../contexts/BookingContext';
import { BsCart4 } from "react-icons/bs";
import { IoArrowBack } from "react-icons/io5";
import { FaEdit } from "react-icons/fa";
import { TbTrain } from "react-icons/tb";

const MyPage = () => {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [reservations, setReservations] = useState([]);
    const [trainReservations, setTrainReservations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('hotel'); // 'hotel' 또는 'train'
    const { basketItems, setBasketItems } = useContext(BookingContext);
    const [userInfo, setUserInfo] = useState(null);
    const [nickname, setNickname] = useState('');
    const [isEditing, setIsEditing] = useState(false);
    const [newNickname, setNewNickname] = useState('');

    useEffect(() => {
        // 사용자 정보 가져오기
        const fetchUserInfo = async () => {
            try {
                const response = await axios.get('/api/user/info');
                console.log("서버 응답:", response.data);
                setUser(response.data);
                setUserInfo(response.data);
                const displayName = response.data.displayName || response.data.name || response.data.email.split('@')[0];
                console.log("설정할 닉네임:", displayName);
                setNickname(displayName);
                setNewNickname(displayName);
            } catch (error) {
                console.error('사용자 정보 가져오기 실패:', error);
                navigate('/login');
            }
        };

        // 호텔 예약 정보 가져오기
        const fetchReservations = async () => {
            try {
                const response = await axios.get('/api/reservations/my');
                setReservations(response.data);
                console.log("호텔 예약 정보:", response.data);
            } catch (error) {
                console.error('호텔 예약 정보 가져오기 실패:', error);
                setReservations([]);
            }
        };

        // 기차 예약 정보 가져오기
        const fetchTrainReservations = async () => {
            try {
                const response = await axios.get('/api/train-reservations/my');
                setTrainReservations(response.data);
                console.log("기차",response.data)
            } catch (error) {
                console.error('기차 예약 정보 가져오기 실패:', error);
                setTrainReservations([]);
            } finally {
                setLoading(false);
            }
        };

        fetchUserInfo();
        fetchReservations();
        fetchTrainReservations();
    }, [navigate]);

    const handleReservationCancel = async (reservation) => {
        console.log("reservation.id", reservation.id);
        if (window.confirm('정말로 호텔 예약을 취소하시겠습니까?')) {
            try {
                const paymentClient = PaymentClient({
                    secret: "92oOoI6pdpDDAhxjhOQOy0evayERJhSaEo7egz0tQU1pvdk8Q9RMxcqcqy09X983jZYRvoJLKrYqHQdB",
                }); 
                console.log("paymentId", reservation.paymentId); 
                    try { 
                        const response = await paymentClient.cancelPayment({
                        paymentId: reservation.paymentId,
                        reason: "테스트",
                        });
                        console.log(response);
                        alert('결제 취소가 완료되었습니다.');                
                    } catch (e) {
                        alert('결제 취소가 실패되었습니다. 다시 시도해주세요.');
                    }    
                await axios.delete(`/api/reservations/${reservation.id}`);
                setReservations(reservations.filter(res => res.id !== reservation.id));
                alert('호텔 예약이 취소되었습니다.');
            } catch (error) {
                console.error('호텔 예약 취소 실패:', error);
                alert('호텔 예약 취소에 실패했습니다.');
            }
        }
    };

    const handleTrainReservationCancel = async (reservationId) => {
        if (window.confirm('정말로 기차 예약을 취소하시겠습니까?')) { 
        const paymentClient = PaymentClient({
            secret: "92oOoI6pdpDDAhxjhOQOy0evayERJhSaEo7egz0tQU1pvdk8Q9RMxcqcqy09X983jZYRvoJLKrYqHQdB",
        }); 
        console.log("paymentId", trainReservations[0].paymentid); 
            try { 
                const response = await paymentClient.cancelPayment({
                paymentId: trainReservations[0].paymentid,
                reason: "테스트",
                });
                console.log(response);
                alert('결제 취소가 완료되었습니다.');
                // 결제취소 항목 DB 삭제 
                await axios.delete(`/api/train/${trainReservations[0].paymentid}`);
                console.log("결제취소 항목 DB 삭제 완료하였습니다."); 
                setTrainReservations(trainReservations.filter(res => res.paymentid !== trainReservations[0].paymentid));
                // 선택된 항목 장바구니에서 제거
                setBasketItems(basketItems.filter(item =>
                    item.paymentInfo?.paymentId !== trainReservations[0].paymentid
                ));
            } catch (e) {
                alert('결제 취소가 실패되었습니다. 다시 시도해주세요.');
            }    
        }
    };

    const handleNicknameUpdate = async () => {
        try {
            console.log("닉네임 업데이트 시도:", newNickname);
            const response = await axios.put('/api/user/nickname', { nickname: newNickname });
            setUserInfo(prev => ({ ...prev, displayName: newNickname }));
            setNickname(newNickname);
            sessionStorage.setItem('displayName', newNickname);
            setIsEditing(false);
            // 닉네임 업데이트 이벤트 발생
            window.dispatchEvent(new Event('nickname-updated'));
            alert(response.data.message || '닉네임이 성공적으로 변경되었습니다.');
        } catch (error) {
            console.error('닉네임 변경 실패:', error);
            alert('닉네임 변경에 실패했습니다.');
        }
    };

    if (loading) {
        return <div className="loading">로딩 중...</div>;
    }

    return (
        <div className="mypage-container">
            <div className="mypage-header">
                <h1>마이페이지</h1>
            </div>

            {/* 사용자 정보 섹션 */}
            <div className="user-info-section">
                <h2>👤 내 정보</h2>
                <div className="user-info">
                    <div className="info-row">
                        <strong>이메일:</strong>
                        <span>{userInfo?.email}</span>
                    </div>
                    
                    <div className="info-row">
                        <strong>닉네임:</strong>
                        <div className="nickname-container">
                            {isEditing ? (
                                <>
                                    <input
                                        type="text"
                                        value={newNickname}
                                        onChange={(e) => setNewNickname(e.target.value)}
                                        placeholder="새 닉네임 입력"
                                        className="nickname-input"
                                    />
                                    <div className="button-group">
                                        <button 
                                            onClick={handleNicknameUpdate}
                                            disabled={!newNickname.trim()}
                                            className="save-button"
                                        >
                                            저장
                                        </button>
                                        <button 
                                            onClick={() => {
                                                setIsEditing(false);
                                                setNewNickname(nickname);
                                            }}
                                            className="cancel-button"
                                        >
                                            취소
                                        </button>
                                    </div>
                                </>
                            ) : (
                                <>
                                    <div className="nickname-value">{nickname || '닉네임 없음'}</div>
                                    <button 
                                        onClick={() => {
                                            console.log("수정 버튼 클릭");
                                            setIsEditing(true);
                                            setNewNickname(nickname);
                                        }}
                                        className="edit-button"
                                    >
                                        <FaEdit /> 수정
                                    </button>
                                </>
                            )}
                        </div>
                    </div>

                    <div className="info-row">
                        <strong>가입일:</strong>
                        <span>
                            {userInfo?.joinDate ? new Date(userInfo.joinDate).toLocaleDateString() : '정보 없음'}
                        </span>
                    </div>
                </div>
            </div>

            {/* 예약 정보 섹션 */}
            <div className="reservations-section">
                <div className="reservations-header">
                    <h2>📋 내 예약 정보</h2>
                    <div className="header-actions">
                        <button 
                            className="basket-button"
                            onClick={() => navigate(activeTab === 'hotel' ? '/HotelReservationPage' : '/TrainBasket')}
                            title={activeTab === 'hotel' ? '호텔 예약 바구니' : '기차 예약 바구니'}
                        >
                            <BsCart4 className="basket-icon" />
                        </button>
                    </div>
                </div>
                
                {/* 탭 버튼 */}
                <div className="tab-buttons">
                    <button 
                        className={`tab-button ${activeTab === 'hotel' ? 'active' : ''}`}
                        onClick={() => setActiveTab('hotel')}
                    >
                        🏨 호텔 예약
                    </button>
                    <button 
                        className={`tab-button ${activeTab === 'train' ? 'active' : ''}`}
                        onClick={() => setActiveTab('train')}
                    >
                        🚂 내 기차표
                    </button>
                </div>

                {/* 호텔 예약 탭 */}
                {activeTab === 'hotel' && (
                    <>
                        {reservations.length === 0 ? (
                            <div className="no-reservations">
                                <p>호텔 예약 내역이 없습니다.</p>
                                <Button 
                                    text="호텔 둘러보기" 
                                    onClick={() => navigate('/HotelPage')}
                                    className="explore-button"
                                />
                            </div>
                        ) : (
                            <div className="reservations-list">
                                {reservations.map((reservation) => (
                                    <div key={reservation.id} className="reservation-card">
                                        <div className="reservation-header">
                                            <h3>{reservation.hotelName}</h3>
                                            <span className={`status ${reservation.status}`}>
                                                {
                                                reservation.status === 'isPast'? '사용완료':
                                                reservation.status === 'confirmed' ? '예약 확정' : 
                                                 reservation.status === 'pending' ? '대기 중' : '취소됨'}
                                            </span>
                                        </div>
                                        <div className="reservation-details">
                                            <p><strong>객실:</strong> {reservation.roomName}</p>
                                            <p><strong>체크인:</strong> {new Date(reservation.checkInDate).toLocaleDateString()}</p>
                                            <p><strong>체크아웃:</strong> {new Date(reservation.checkOutDate).toLocaleDateString()}</p>
                                            <p><strong>숙박 기간:</strong> {reservation.nights}박</p>
                                            <p><strong>총 금액:</strong> {reservation.totalPrice?.toLocaleString()}원</p>
                                        </div>
                                        <div className="reservation-actions">
                                            <Button 
                                                text="호텔 상세보기" 
                                                onClick={() => navigate(`/HotelDetail/${reservation.hotelId}`)}
                                                className="detail-button"
                                            />
                                            {reservation.status === 'confirmed' && (
                                                <Button 
                                                    text="예약 취소" 
                                                    onClick={() => handleReservationCancel(reservation)}
                                                    className="cancel-button"
                                                />
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </>
                )}

                {/* 기차 예약 탭 */}
                {activeTab === 'train' && (
                    <>
                        {trainReservations.length === 0 ? (
                            <div className="no-reservations">
                                <p>기차표 내역이 없습니다.</p>
                                <Button 
                                    text="기차 예약하기" 
                                    onClick={() => navigate('/TrainHome')}
                                    className="explore-button"
                                />
                            </div>
                        ) : (
                            <div className="reservations-list">
                                {trainReservations.map((reservation) => (
                                    <div key={reservation.id} className="reservation-card train-reservation">
                                        <div className="reservation-header">
                                            <h3><TbTrain size={20} /> {reservation.trainName}</h3>
                                            <span className={`status ${reservation.status}`}>
                                                {
                                                reservation.status === 'isPast'? '사용완료':
                                                reservation.status === 'confirmed' ? '예약 확정' : 
                                                reservation.status === 'pending' ? '대기 중' : '취소됨'}
                                            </span>
                                        </div>
                                        <div className="reservation-details">
                                            <p><strong>출발역:</strong> {reservation.departureStation}</p>
                                            <p><strong>도착역:</strong> {reservation.arrivalStation}</p>
                                            <p><strong>출발일시:</strong> {reservation.departureTime.toLocaleString()}</p>
                                            <p><strong>도착일시:</strong> {reservation.arrivalTime.toLocaleString()}</p>
                                            <p><strong>기차번호:</strong> {reservation.trainNumber}</p>
                                            <p><strong>좌석:</strong> {reservation.seatInfo}</p>
                                            <p><strong>출발일자:</strong> {reservation.travelDate}</p> 
                                            <p><strong>총 금액:</strong> {reservation.totalPrice?.toLocaleString()}원</p>
                                        </div>
                                        <div className="reservation-actions">
                                            {reservation.status === 'confirmed' && (
                                                <Button 
                                                    text="기차표 취소" 
                                                    onClick={() => handleTrainReservationCancel(reservation.id)}
                                                    className="cancel-button"
                                                />
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </>
                )}
            </div>


        </div>
    );
};

export default MyPage;