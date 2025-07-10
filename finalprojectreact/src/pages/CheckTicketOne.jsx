import TrainHeader from "./TrainHeader";
import Button from "../ui/Button"; 
import { useNavigate, useLocation } from "react-router-dom";
import { useState, useContext } from "react";
import "./CheckTicketOne.css"; 
import { BookingContext } from "../contexts/BookingContext";
<<<<<<< HEAD
=======
import { TbTrain } from "react-icons/tb";
import { BsCart4 } from "react-icons/bs";
>>>>>>> 902477c (initial commit)

const CheckTicketOne = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { initialOneTicket: locTicket, initialOneTicketDepartSc: locDepartSc, initialOneTicketTrainSc: locReturnSc, direction: locDirection } = location.state || {};
    const { booking, departSchedules, returnSchedules, setSelectedTrain } = useContext(BookingContext);

    const initialOneTicket = locTicket || booking;
    const initialOneTicketDepartSc = locDepartSc || departSchedules;
    const initialOneTicketTrainSc = locReturnSc || returnSchedules;

    const direction = locDirection || 'depart'; // 'depart' or 'return'

    const [openFareIndex, setOpenFareIndex] = useState(null); // 요금 조회가 열린 행 인덱스

    // 출발 시간 필터(이후 출발)
    const timeFilterOptions = [
        { label: "00:00 이후 출발", value: "00:00" },
        { label: "06:00 이후 출발", value: "06:00" },
        { label: "09:00 이후 출발", value: "09:00" },
        { label: "12:00 이후 출발", value: "12:00" },
        { label: "15:00 이후 출발", value: "15:00" },
        { label: "18:00 이후 출발", value: "18:00" },
        { label: "21:00 이후 출발", value: "21:00" }
    ];

    const [selectedTimeFilter, setSelectedTimeFilter] = useState(initialOneTicket?.timeFilter || "00:00");

    // 시각 문자열(HH:MM)을 분으로 변환
    const timeToMinutes = (timeStr) => {
        const [h, m] = timeStr.split(":");
        return parseInt(h, 10) * 60 + parseInt(m, 10);
    };

    // 시간 포맷팅 함수
    const formatTime = (timeString) => {
        const time = timeString.toString();
        const hour = time.substring(8, 10);
        const minute = time.substring(10, 12);
        return `${hour}:${minute}`;
    };

    // 소요시간 계산 함수 (시간, 분 숫자 반환)
    const getDuration = (depTime, arrTime) => {
        const buildDate = (ts) => {
            const year = ts.slice(0, 4);
            const month = ts.slice(4, 6);
            const day = ts.slice(6, 8);
            const hour = ts.slice(8, 10);
            const minute = ts.slice(10, 12);
            const second = ts.length >= 14 ? ts.slice(12, 14) : "00";
            return new Date(`${year}-${month}-${day}T${hour}:${minute}:${second}`);
        };
        const dep = buildDate(depTime.toString());
        const arr = buildDate(arrTime.toString());
        let diff = arr.getTime() - dep.getTime();
        if (diff < 0) diff += 24 * 60 * 60 * 1000;
        const hours = Math.floor(diff / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        return { hours, minutes };
    };

    const formatDurationText = (h, m) => {
        const hh = String(h).padStart(2, '0');
        const mm = String(m).padStart(2, '0');
        return `${hh}:${mm}`;
    };

    // 사용할 스케줄 배열 결정
    const schedulesSource = direction === 'depart' ? initialOneTicketDepartSc : initialOneTicketTrainSc;

    // 필터된 스케줄 계산
    const filteredSchedules = schedulesSource.filter((train) => {
        const depTimeStr = formatTime(train.departureTime); // HH:MM
        return timeToMinutes(depTimeStr) >= timeToMinutes(selectedTimeFilter);
    });

    if (!initialOneTicket) {
        return <div>승차권을 조회중입니다...</div>;
    }

    // 좌석 선택 시 BenchSelect 페이지로 이동하면서 데이터 전달
    const handleSelectTrain = (train) => {
        setSelectedTrain(train);
        navigate('/BenchSelect', {
            state: {
                initialOneTicket,
                initialOneTicketDepartSc,
                initialOneTicketTrainSc,
                selectedTrain: train,
                direction
            }
        });
    };

    return (
        <div className="check-ticket-one">
            {/* 상단 헤더 */}
<<<<<<< HEAD
            <TrainHeader title={<Button text={"🚄여행 "} onClick={() => navigate('/TrainHome')}/>}
                leftChild={<Button text={"◀"} onClick={() => navigate(-1)} />} 
                rightChild={<Button text={"📦"} onClick={() => navigate('/TrainBasket')}/>} 
=======
            <TrainHeader title={<Button text={<div className="train-header-title"><TbTrain size={50} /> <span>여행</span></div>} onClick={() => navigate('/TrainHome')}/>}
                leftChild={<Button text={"◀"} onClick={() => navigate(-1)} />} 
                rightChild={<Button text={<BsCart4 size={30} />} onClick={() => navigate('/TrainBasket')}/>} 
>>>>>>> 902477c (initial commit)
            />

            <div className="ticket-info">
                <h2>{direction === 'depart' ? '가는 날 승차권 조회' : '오는 날 승차권 조회'}</h2>
                <div className="route-info">{direction === 'return' ? initialOneTicket.arrival + ' ➡ ' + initialOneTicket.departure : initialOneTicket.departure + ' ➡ ' + initialOneTicket.arrival}</div>
                <div className="passenger-info">성인 {initialOneTicket.adults}명 {initialOneTicket.children ? `· 아동 ${initialOneTicket.children}명` : ''}</div>
                <div className="date-info">{direction === 'depart' ? initialOneTicket.departDate : initialOneTicket.returnDate}</div>
            </div>

            {/* 출발 시간 필터 */}
            <div className="filter-container">
                <select
                    className="time-filter-select"
                    value={selectedTimeFilter}
                    onChange={(e) => setSelectedTimeFilter(e.target.value)}
                >
                    {timeFilterOptions.map((opt) => (
                        <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                </select>
            </div>

            <div className="train-schedule">
                {filteredSchedules.map((train, index) => {
                    const isOpen = true;
                    return (
                        <div key={index} className={`train-item ${isOpen ? 'open' : ''}`}>
                            <div className="train-info">
                                <div className="train-type">
<<<<<<< HEAD
                                    <span className="train-name">{train.trainType} 🚄 </span>
=======
                                    <span className="train-name">
                                        <span>{train.trainType}</span>
                                        <TbTrain size={18} />
                                    </span>
>>>>>>> 902477c (initial commit)
                                    <span className="train-number">train-no : {train.trainNo}</span>
                                </div>
                                <div className="time-info">
                                    <div className="departure">
                                        <div className="time">{formatTime(train.departureTime)}</div>
                                        <div className="station">{direction === 'return' ? initialOneTicket.arrival : initialOneTicket.departure}</div>
                                    </div>
                                    <div className="duration">
                                        {(() => {
                                            const { hours, minutes } = getDuration(train.departureTime, train.arrivalTime);
                                            return <span className="duration-text">{formatDurationText(hours, minutes)} 소요</span>;
                                        })()}
                                    </div>
                                    <div className="arrival">
                                        <div className="time">{formatTime(train.arrivalTime)}</div>
                                        <div className="station">{direction === 'return' ? initialOneTicket.departure : initialOneTicket.arrival}</div>
                                    </div>
                                </div>
                            </div>
                            {isOpen ? (
                                <div className="fare-actions">
                                    <div className="fare-text">총 {train.fare.toLocaleString()}원</div>
                                    {/* <button className="reserve-button">바로 예매</button> */}
                                    <button className="seat-button primary" onClick={() => handleSelectTrain(train)}>좌석 선택</button>
                                </div>
                            ) : (
                                <button className="reservation-button" onClick={() => setOpenFareIndex(index)}>요금조회</button>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default CheckTicketOne;