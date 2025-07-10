import TrainHeader from "./TrainHeader";
import Button from "../ui/Button";
import { useNavigate } from "react-router-dom";
import { useContext, useState } from "react";
import "./SelectTicketOne.css"; // 기존 스타일 재사용
import { BookingContext } from "../contexts/BookingContext";
import axios from "axios";
import { TbTrain } from "react-icons/tb";
import { BsCart4, BsArrowRightShort, BsChevronRight } from "react-icons/bs";

const SelectTicketRound = () => {
    const navigate = useNavigate();
    const { booking, departSelection, returnSelection, basketItems, setBasketItems } = useContext(BookingContext);
    const [showSellerInfo, setShowSellerInfo] = useState(false);

    if (!booking || !departSelection || !returnSelection) {
        return <div>선택 정보가 없습니다.</div>;
    }

    const { adults, children } = booking;
    const passengerText = `성인 ${adults}${children ? ` · 아동 ${children}` : ""}`;
     
    const formatTime = (ts) => {
        const str = ts.toString();
        return `${str.slice(8, 10)}:${str.slice(10, 12)}`;
    };

    const calcFare = (sel) => {
        const passengers = adults + children;
        return sel.train.fare * passengers;
    };

    const fareTotal = calcFare(departSelection) + calcFare(returnSelection);

    const sellerInfo = [
        { label: "대표자명", value: "김동우" },
        { label: "상호명", value: "Pepperoni Brothers" },
        { label: "사업자주소", value: "부산광역시 부산진구 중앙대로 708 부산파이낸스센터 4F, 5F 부산IT교육센터" },
        { label: "연락처", value: "051-753-5600" },
        { label: "사업자등록번호", value: "111-22-33333" },
        { label: "통신판매업신고번호", value: "부산 부산진구-1234호" }
    ];


    const handleConfirm = async () => {
        const passengers = adults + children;
        const goItem = {
            initialOneTicket: booking,
            selectedTrain: departSelection.train,
            selectedSeats: departSelection.seats,
            direction: 'depart',
            roundTrip: true,
        };
        const returnItem = {
            initialOneTicket: booking,
            selectedTrain: returnSelection.train,
            selectedSeats: returnSelection.seats,
            direction: 'return',
            roundTrip: true,
        };

        try {
        // Spring Boot 백엔드로 전송
            const dtodepartSelection = {
                fare: calcFare(departSelection),
                pay: 1,
                remainingseats: 0,
                arrivestation: booking.arrival,
                departstation: booking.departure,
                passengertype: `${adults}성인 ${children}아동`,
                seatnumber: departSelection.seats.join(','),
                trainline: departSelection.train.trainType,
                trainnumber: `${departSelection.train.trainType}-${departSelection.train.trainNo}`,
                traveldate: booking.departDate,
                triptype: '왕복->가는 날',
                username: sessionStorage.getItem('userEmail'),
                departdate: formatTime(departSelection.train.departureTime),
                arrivedate: formatTime(departSelection.train.arrivalTime)
              };

            // await axios.post('/api/train', dtodepartSelection); 
            console.log(dtodepartSelection);

            const dtoreturnSelection = {
                fare: calcFare(returnSelection),
                pay: 1,
                remainingseats: 0,
                arrivestation: booking.departure,
                departstation: booking.arrival,
                passengertype: `${adults}성인 ${children}아동`,
                seatnumber: returnSelection.seats.join(','),
                trainline: returnSelection.train.trainType,
                trainnumber: `${returnSelection.train.trainType}-${returnSelection.train.trainNo}`,
                traveldate: booking.returnDate,
                triptype: '왕복->오는 날',
                username: sessionStorage.getItem('userEmail'),
                departdate: formatTime(returnSelection.train.departureTime),
                arrivedate: formatTime(returnSelection.train.arrivalTime)
              };
               
            // await axios.post('/api/train', dtoreturnSelection); 
            console.log(dtoreturnSelection);
            setBasketItems([...basketItems, goItem, returnItem]);
            navigate('/TrainBasket', {
                state: {
                    dtodepartSelection,
                    dtoreturnSelection,
                }
            });
        } catch (e) {
            alert('서버로 장바구니 저장 실패');
            console.error(e);
        }
    };

    const TicketCard = ({ title, selection }) => {
        const depStation = title === '가는 날' ? booking.departure : booking.arrival;
        const arrStation = title === '가는 날' ? booking.arrival : booking.departure;
        return (
            <div className="ticket-card">
                <h2>{title}</h2>
                <div className="ticket-top">
                    <div className="logo">KTX <TbTrain size={20} /></div>
                    <div className="time-block">
                        <div className="time">{formatTime(selection.train.departureTime)}</div>
                        <div className="station">{depStation}</div>
                    </div>
                    <div className="arrow"><BsArrowRightShort size={24} /></div>
                    <div className="time-block">
                        <div className="time">{formatTime(selection.train.arrivalTime)}</div>
                        <div className="station">{arrStation}</div>
                    </div>
                </div>
                <hr className="divider" />
                <div className="info-grid">
                    <div className="info-row"><span className="label">출발일</span>{title === '가는 날' ? booking.departDate : booking.returnDate}</div>
                    <div className="info-row"><span className="label">인원</span>{passengerText}</div>
                    <div className="info-row"><span className="label">기차번호</span>{selection.train.trainType}-{selection.train.trainNo}</div>
                    <div className="info-row"><span className="label">좌석</span>{selection.seats.join(', ')}</div>
                </div>
                <div className="price">{calcFare(selection).toLocaleString()}원</div>  
            </div> 
        );
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
                
            <TicketCard title="가는 날" selection={departSelection} />
            <TicketCard title="오는 날" selection={returnSelection} />
 
            <div className="bottom-bar">
                <div className="summary-text">왕복 ({passengerText})</div>
                <div className="summary-price">{fareTotal.toLocaleString()}원</div>
                <button className="cart-btn" onClick={handleConfirm}>장바구니 담기</button>
            </div>
        </div>
    );
};

export default SelectTicketRound; 