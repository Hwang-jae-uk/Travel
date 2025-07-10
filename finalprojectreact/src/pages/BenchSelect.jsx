import TrainHeader from "./TrainHeader";
import Button from "../ui/Button";
import { useNavigate, useLocation } from "react-router-dom";
import { useState, useContext } from "react";
import "./BenchSelect.css";
import { BookingContext } from "../contexts/BookingContext";
<<<<<<< HEAD
=======
import { TbTrain } from "react-icons/tb";
import { BsCart4 } from "react-icons/bs";
import { BsArrowRightShort, BsArrowUpShort } from "react-icons/bs";

>>>>>>> 902477c (initial commit)

const BenchSelect = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const locationState = location.state || {};
    const { initialOneTicket: locBooking, selectedTrain: locTrain, direction: locDirection,
            initialOneTicketDepartSc: locDepartSc, initialOneTicketTrainSc: locReturnSc } = locationState;
    const { booking, selectedTrain: ctxTrain, selectedSeat: ctxSeats, setSelectedSeat: saveSelectedSeats,
            departSelection, setDepartSelection, returnSelection, setReturnSelection } = useContext(BookingContext);

    const initialOneTicket = locBooking || booking;
    const selTrain = locTrain || ctxTrain;

    const direction = locDirection || 'depart';

    // 초기 데이터 콘솔 확인
    console.log('BenchSelect props:', initialOneTicket, selTrain, saveSelectedSeats);

    // 좌석 데이터 생성 (예: 6~15행, A-D)
    const rows = Array.from({ length: 10 }, (_, i) => 15 - i); // 15,14,...,6
    const seatLetters = ["A", "B", "C", "D"];
    // 임시로 짝수행 C 좌석만 예약불가 예시
    const isDisabledSeat = (row, letter) => {
        return row % 2 === 0 && letter === "C"; // 예시
    };

    const [selectedSeats, setSelectedSeats] = useState(ctxSeats || []);

    const handleSeatClick = (row, letter) => {
        if (isDisabledSeat(row, letter)) return;
        const seatCode = `${row}${letter}`;

        // 이미 선택된 좌석이면 해제
        if (selectedSeats.includes(seatCode)) {
            setSelectedSeats(selectedSeats.filter(code => code !== seatCode));
            return;
        }

        // 인원 수 초과 선택 방지
        if (selectedSeats.length >= totalPassengers) {
            alert(`최대 ${totalPassengers}석까지 선택할 수 있습니다.`);
            return;
        }

        // 좌석 추가
        setSelectedSeats([...selectedSeats, seatCode]);
    };

    const handleConfirm = () => {
        if (selectedSeats.length !== totalPassengers) {
            alert("선택한 좌석 수가 인원과 일치하지 않습니다.");
            return;
        }
        // context 저장
        setSelectedSeats(selectedSeats); 
        saveSelectedSeats(selectedSeats);

        if (direction === 'depart' && initialOneTicket.returnDate) {
            // going leg 완료, 저장 후 오는날 승차권 조회로 이동
            setDepartSelection({ train: selTrain, seats: selectedSeats });

            navigate('/CheckTicketOne', {
                state: {
                    initialOneTicket,
                    initialOneTicketDepartSc: locDepartSc,
                    initialOneTicketTrainSc: locReturnSc,
                    direction: 'return'
                }
            });
            return;
        }

        if (direction === 'return') {
            setReturnSelection({ train: selTrain, seats: selectedSeats });
            // 왕복 완료 → 요약 페이지
            navigate('/SelectTicketRound');
            return;
        }

        // 편도 기본 흐름
        navigate('/SelectTicketOne', {
            state: {
                initialOneTicket,
                selectedTrain: selTrain,
                selectedSeats
            }
        });
    };

    const totalPassengers = initialOneTicket.adults + initialOneTicket.children;

    return (
        <div>
            <div className="bench-select">
            {/* 상단 헤더 */}
<<<<<<< HEAD
            <TrainHeader title={<Button text={"🚄여행 "} onClick={() => navigate('/TrainHome')}/>}
                leftChild={<Button text={"◀"} onClick={() => navigate(-1)} />} 
                rightChild={<Button text={"📦"} onClick={() => navigate('/TrainBasket')}/>} 
=======
            <TrainHeader 
                title={<Button text={<div className="train-header-title"><TbTrain size={50} /> <span>여행</span></div>} onClick={() => navigate('/TrainHome')}/>}
                leftChild={<Button text={"◀"} onClick={() => navigate(-1)} />} 
                rightChild={<Button text={<BsCart4 size={30} />} onClick={() => navigate('/TrainBasket')}/>} 
>>>>>>> 902477c (initial commit)
            /> 
                <h2>좌석 선택</h2>
                {initialOneTicket && (
                    <>
                        <div className="route-info">
<<<<<<< HEAD
                        {direction === 'return' ? initialOneTicket.arrival + ' ➡ ' + initialOneTicket.departure : initialOneTicket.departure + ' ➡ ' + initialOneTicket.arrival}
=======
                        {direction === 'return' ? 
                            <>{initialOneTicket.arrival} <BsArrowRightShort size={24} /> {initialOneTicket.departure}</> : 
                            <>{initialOneTicket.departure} <BsArrowRightShort size={24} /> {initialOneTicket.arrival}</>}
>>>>>>> 902477c (initial commit)
                        </div>
                        <div className="train-info-top">{selTrain ? ` train-no : ${selTrain.trainNo} (${selTrain.trainType})` : ''}</div>
                        <div className="train-info-top">{selTrain ? ` 성인 : ${initialOneTicket.adults}명  아동 : ${initialOneTicket.children}명` : ''}</div>
                    </>
                )}
                {/* 선택 */}
                <div className="legend">
                    <span className="legend-box selected"/> 선택불가
                    <span className="legend-box picked"/> 선택좌석
                    <span className="legend-box available"/> 선택가능
                </div>

                {/* 좌석 그리드 */}
                <div className="seat-grid">
                    {/* 컬럼 헤더 */}
                    <div className="column-labels">
                        <div className="col-label">창측</div>
                        <div className="col-label">내측</div>
                        <div className="col-gap"/>
                        <div className="col-label">내측</div>
                        <div className="col-label">창측</div>
                    </div>
                    {rows.map(row => (
                        <div key={row} className="seat-row">
                            {/* 왼쪽 2좌석 */}
                            {["A", "B"].map(letter => {
                                const seatCode = `${row}${letter}`;
                                const disabled = isDisabledSeat(row, letter);
                                const isSelected = selectedSeats.includes(seatCode);
                                const classNames = ["seat-box"];
                                if (disabled) classNames.push("disabled");
                                else if (isSelected) classNames.push("picked");
                                else classNames.push("available");
                                return (
                                    <div
                                        key={letter}
                                        className={classNames.join(" ")}
                                        onClick={() => handleSeatClick(row, letter)}
                                    >
                                        <span className="seat-text">{seatCode}</span>
                                    </div>
                                );
                            })}

                            {/* 통로 화살표 */}
<<<<<<< HEAD
                            <div className="row-arrow">▲</div>
=======
                            <div className="row-arrow">
                                <BsArrowUpShort size={20} />
                            </div>
>>>>>>> 902477c (initial commit)

                            {/* 오른쪽 2좌석 */}
                            {["C", "D"].map(letter => {
                                const seatCode = `${row}${letter}`;
                                const disabled = isDisabledSeat(row, letter);
                                const isSelected = selectedSeats.includes(seatCode);
                                const classNames = ["seat-box"];
                                if (disabled) classNames.push("disabled");
                                else if (isSelected) classNames.push("picked");
                                else classNames.push("available");
                                return (
                                    <div
                                        key={letter}
                                        className={classNames.join(" ")}
                                        onClick={() => handleSeatClick(row, letter)}
                                    >
                                        <span className="seat-text">{seatCode}</span>
                                    </div>
                                );
                            })}
                        </div>
                    ))}
                </div>

                {/* 선택 정보 */}
                <div className="selection-info">
                    {selectedSeats.length > 0 ? `${selectedSeats.length}명 좌석 선택 | 총 ${totalPassengers}명  선택좌석: ${selectedSeats.join(', ')}` : "좌석을 선택해주세요"}
                </div>

                <button className="confirm-btn" disabled={selectedSeats.length !== totalPassengers} onClick={handleConfirm}>선택하기</button>
            </div>
        </div>
    )
}

export default BenchSelect;

