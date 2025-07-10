import TrainHeader from "./TrainHeader";
import Button from "../ui/Button";
import { useNavigate, useLocation } from "react-router-dom";
import { useContext, useState } from "react";
import "./SelectTicketOne.css";
import { BookingContext } from "../contexts/BookingContext";
import axios from "axios";
import { TbTrain } from "react-icons/tb";
import { BsCart4, BsArrowRightShort, BsChevronRight } from "react-icons/bs";

const SelectTicketOne = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { booking, selectedTrain: ctxTrain, selectedSeat: ctxSeat, basketItems, setBasketItems } = useContext(BookingContext);

    const { initialOneTicket: locBooking, selectedTrain: locTrain, selectedSeats: locSeats } = location.state || {};

    const initialOneTicket = locBooking || booking;
    const selTrain = locTrain || ctxTrain;
    const selectedSeats = locSeats || ctxSeat || [];

    const [showSellerInfo, setShowSellerInfo] = useState(false);

    if (!initialOneTicket || !selTrain) {
        return <div>선택한 승차권을 불러오는 중...</div>;
    }

    const { adults, children, departDate } = initialOneTicket;
    const passengerText = `성인 ${adults}${children ? ` · 아동 ${children}` : ""}`;

    const formatTime = (ts) => {
        const str = ts.toString();
        return `${str.slice(8, 10)}:${str.slice(10, 12)}`;
    };

    const depTime = formatTime(selTrain.departureTime);
    const arrTime = formatTime(selTrain.arrivalTime);

    const fare = selTrain.fare * (adults + children);

    const sellerInfo = [
        { label: "대표자명", value: "김동우" },
        { label: "상호명", value: "Pepperoni Brothers" },
        { label: "사업자주소", value: "부산광역시 부산진구 중앙대로 708 부산파이낸스센터 4F, 5F 부산IT교육센터" },
        { label: "연락처", value: "051-753-5600" },
        { label: "사업자등록번호", value: "111-22-33333" },
        { label: "통신판매업신고번호", value: "부산 부산진구-1234호" }
    ];

    const handleConfirm = async () => {
        // 장바구니 아이템 객체 생성
        const newItem = {
            initialOneTicket,
            selectedTrain: selTrain,
            selectedSeats
        };

        try {
            // Spring Boot 백엔드로 전송
            const dto = {
                fare: selTrain.fare,
                pay: 1,
                remainingseats: selTrain.remainingSeats ?? 0,
                arrivestation: initialOneTicket.arrival,
                departstation: initialOneTicket.departure,
                passengertype: `${adults}성인 ${children}아동`,
                seatnumber: selectedSeats.join(','),
                trainline: selTrain.trainType,
                trainnumber: `${selTrain.trainType}-${selTrain.trainNo}`,
                traveldate: initialOneTicket.departDate,
                triptype: '편도',
                username: sessionStorage.getItem('userEmail'),
                departdate: depTime,
                arrivedate: arrTime,
              };
            
            // await axios.post('/api/train', dto); 
            console.log(dto);
            // 성공적으로 저장되면 클라이언트 상태에도 추가
            setBasketItems([...basketItems, newItem]); 
            navigate('/TrainBasket', {
                state: {
                    dto
                }
            });
        } catch (e) {
            alert('서버로 장바구니 저장 실패');
            console.error(e);
        }
    };

    return (
        <div className="select-ticket-one">
            {/* 상단 헤더 */}
            <TrainHeader 
                title={<Button text={<div className="train-header-title"><TbTrain size={50} /> <span>여행</span></div>} onClick={() => navigate('/TrainHome')}/>}
                leftChild={<Button text={"◀"} onClick={() => navigate(-1)} />} 
                rightChild={<Button text={<BsCart4 size={30} />} onClick={() => navigate('/TrainBasket')}/>} 
            /> 
            
            <div className="seller-info-row" onClick={() => setShowSellerInfo(!showSellerInfo)}>
                판매자 정보 안내 <span className={`seller-arrow ${showSellerInfo ? 'open' : ''}`}><BsChevronRight size={16} /></span>
            </div>

            {showSellerInfo && (
                <div className="seller-detail">
                    {sellerInfo.map((item) => (
                        <div key={item.label} className="seller-row">
                            <div className="seller-label">{item.label}</div>
                            <div className="seller-value">{item.value}</div>
                        </div>
                    ))}
                </div>
            )}

            <div className="ticket-card">
            <h2>선택한 승차권</h2>
                <div className="ticket-top">
                    <div className="logo">KTX <TbTrain size={20} /></div>
                    <div className="time-block">
                        <div className="time">{depTime}</div>
                        <div className="station">{booking.departure}</div>
                    </div>
                    <div className="arrow"><BsArrowRightShort size={24} /></div>
                    <div className="time-block">
                        <div className="time">{arrTime}</div>
                        <div className="station">{booking.arrival}</div>
                    </div>
                </div>

                <hr className="divider" />

                <div className="info-grid">
                    <div className="info-row"><span className="label">출발일</span>{departDate}</div>
                    <div className="info-row"><span className="label">인원</span>{passengerText}</div>
                    <div className="info-row"><span className="label">기차번호</span>{selTrain.trainType}-{selTrain.trainNo}</div>
                    <div className="info-row"><span className="label">좌석</span>{selectedSeats.join(", ")}</div>
                </div>

                <div className="price">{fare.toLocaleString()}원</div>
            </div>

            <div className="bottom-bar">
                <div className="summary-text">편도 ({passengerText})</div>
                <div className="summary-price">{fare.toLocaleString()}원</div>
                <button className="cart-btn" onClick={handleConfirm}>장바구니 담기</button>
            </div>
        </div>
    );
};

export default SelectTicketOne;