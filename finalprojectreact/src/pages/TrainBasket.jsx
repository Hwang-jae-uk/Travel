import TrainHeader from "./TrainHeader";
import Button from "../ui/Button";
import { useLocation, useNavigate } from "react-router-dom";
import { useState, useContext, useEffect } from "react"; 
import { BookingContext } from "../contexts/BookingContext";
import { requestPayment } from "@portone/browser-sdk/v2";
import axios from "axios";
import "./TrainBasket.css"; 
import { PaymentClient } from "@portone/server-sdk";
<<<<<<< HEAD
=======
import { TbTrain } from "react-icons/tb";
import { BsCart4 } from "react-icons/bs";
>>>>>>> 902477c (initial commit)

const TrainBasket = () => {
    const navigate = useNavigate();
    const { basketItems, setBasketItems, booking, selectedTrain } = useContext(BookingContext);
 
    // 선택 체크박스 상태 (항목별)
    const [checkedList, setCheckedList] = useState(basketItems.map(() => true));

    const location = useLocation();
    const locationState = location.state || {};
    const { dto: oneTrain } = locationState;
    const { dtodepartSelection: returndepartSelection, dtoreturnSelection: returnSelectrion } = locationState;
    console.log("TrainBasket location state:", oneTrain);
    console.log("TrainBasket returndepartSelection:", returndepartSelection);
    console.log("TrainBasket returnSelection:", returnSelectrion);

    // basketItems가 바뀌면 체크리스트 길이 맞추기
    useEffect(() => {
        setCheckedList(basketItems.map(() => true));
    }, [basketItems]);

    // 시간 포맷팅 함수
    const formatTime = (ts) => {
        if (!ts) return "";
        const str = ts.toString();
        return `${str.slice(8, 10)}:${str.slice(10, 12)}`;
    };

    // 전체 선택 토글
    const toggleCheckAll = () => {
        const newVal = checkedList.some(c => !c);
        setCheckedList(checkedList.map(() => newVal));
    };

    const toggleCheckItem = (idx) => {
        setCheckedList(checkedList.map((c, i) => i === idx ? !c : c));
    };

    // 선택 삭제
    const handleDelete = () => { 
        if(window.confirm("선택한 상품을 삭제하시겠습니까?")) {
            const remaining = basketItems.filter((_, idx) => !checkedList[idx]);
            setBasketItems(remaining);
        }
    }; 
 
    // 총 상품 금액 계산 (선택된 항목만)
    const calcFare = (item) => {
        const { initialOneTicket, selectedTrain } = item;
        const passengers = initialOneTicket.adults + initialOneTicket.children; 
        return selectedTrain.fare * passengers;
    };

    // 아동 할인 금액 계산(전체 50% 할인)
    const totalChildrenFare = basketItems.reduce((sum, item) => {
        const { initialOneTicket, selectedTrain } = item;
        const childrenCount = initialOneTicket.children;
        return sum + (childrenCount > 0 ? childrenCount * (selectedTrain.fare * 0.5) : 0);
    }, 0);

    // 아동 할인 금액 건당(50% 할인)
<<<<<<< HEAD
    const calChilerenFare = (item) => {
        const { initialOneTicket, selectedTrain } = item;
        const passengers = selectedTrain.fare / 2; 
        return passengers * initialOneTicket.children;
=======
    const calChildren = (item) => {
        const { initialOneTicket, selectedTrain } = item;
        const childrenFare = selectedTrain.fare / 2; 
        return childrenFare * initialOneTicket.children;
>>>>>>> 902477c (initial commit)
    }; 
    
    const totalFare = basketItems.reduce((sum, itm, idx) => sum + (checkedList[idx] ? calcFare(itm) : 0), 0);
    const selectedItems = basketItems.filter((_, idx) => checkedList[idx]);
    const selectedCount = selectedItems.length;

    /* 결제 요청 */
    const handlePurchase = async () => {
        if (selectedItems.length === 0) {
            alert("선택된 상품이 없습니다.");
            return;
        }

        const orderName = selectedItems.length === 1
            ? `${selectedItems[0].initialOneTicket.departure}→${selectedItems[0].initialOneTicket.arrival} 승차권`
            : `기차 승차권 외 ${selectedItems.length - 1}건`;

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
                orderName,
                totalAmount: 1000,
                currency: "KRW",
                pgProvider: "PG_PROVIDER_HTML5_INICIS",
                payMethod: "CARD",
                isTestChannel: true,
                customer: {
                    fullName: "홍길동",
                    email: "kdw5126@nate.com",
                    phoneNumber: "01012345678"
                },
                channelType: "WEB"
            });

            if (rsp && rsp.code === undefined) {
                alert("결제가 완료되었습니다!");
                // 선택된 항목에 결제 정보와 상태 저장
                const updated = basketItems.map((itm, idx) => { 
                    if (!checkedList[idx]) return itm;
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

                // 편도 결제 정보 서버에 전송
                if (oneTrain) {
                const dto = {
                    fare: oneTrain.fare,
                    pay: 1,
                    remainingseats: oneTrain.remainingSeats ?? 0,
                    arrivestation: oneTrain.arrivestation,
                    departstation: oneTrain.departstation,
                    passengertype: `${booking.adults}성인 ${booking.children}아동`,
                    seatnumber: oneTrain.seatnumber,
                    trainline: oneTrain.trainline,
                    trainnumber: `${oneTrain.trainline}-${selectedTrain.trainNo}`,
                    traveldate: oneTrain.traveldate,
                    triptype: '편도',
                    username: sessionStorage.getItem('userEmail'),
                    departdate: oneTrain.departdate,
                    arrivedate: oneTrain.arrivedate,
                    paymentid: basketItems.paymentInfo?.paymentId || paymentId, // 결제 ID 추가
                  };
                await axios.post('/api/train', dto); // 서버에 결제 정보 전송(편도)
                console.log("편도 값",dto);
                } else {
                // 왕복 결제 정보 서버에 전송
                const departDto = {
                    fare: returndepartSelection.fare,
                    pay: 1,
                    remainingseats: returndepartSelection.remainingSeats ?? 0,
                    arrivestation: returndepartSelection.arrivestation,
                    departstation: returndepartSelection.departstation,
                    passengertype: `${booking.adults}성인 ${booking.children}아동`,
                    seatnumber: returndepartSelection.seatnumber,
                    trainline: returndepartSelection.trainline,
                    trainnumber: `${returndepartSelection.trainline}-${selectedTrain.trainNo}`,
                    traveldate: returndepartSelection.traveldate,
                    triptype: '왕복->가는 날',
                    username: sessionStorage.getItem('userEmail'),
                    departdate: returndepartSelection.departdate,
                    arrivedate: returndepartSelection.arrivedate,
                    paymentid: basketItems.paymentInfo?.paymentId || paymentId, // 결제 ID 추가
                }
                await axios.post('/api/train', departDto); // 서버에 결제 정보 전송(왕복->가는 날)
                console.log("왕복->가는 날", departDto);
                const returnDto = {
                    fare: returnSelectrion.fare,
                    pay: 1,
                    remainingseats: returnSelectrion.remainingSeats ?? 0,
                    arrivestation: returnSelectrion.arrivestation,
                    departstation: returnSelectrion.departstation,
                    passengertype: `${booking.adults}성인 ${booking.children}아동`,
                    seatnumber: returnSelectrion.seatnumber,
                    trainline: returnSelectrion.trainline,
                    trainnumber: `${returnSelectrion.trainline}-${selectedTrain.trainNo}`,
                    traveldate: returnSelectrion.traveldate,
                    triptype: '왕복->오는 날',
                    username: sessionStorage.getItem('userEmail'),
                    departdate: returnSelectrion.departdate,
                    arrivedate: returnSelectrion.arrivedate,
                    paymentid: basketItems.paymentInfo?.paymentId || paymentId, // 결제 ID 추가
                }
                await axios.post('/api/train', returnDto); // 서버에 결제 정보 전송(왕복->오는 날)
                console.log("왕복->오는 날", returnDto);
            }
            } else {
                alert(`결제가 실패되었습니다.: ${rsp?.message || rsp?.code || 'Unknown error'}`);
            }
        } catch (err) {
            console.error(err);
            alert("결제 처리 중 오류가 발생했습니다.");
        }
    };

    /* 결제 취소 */
    const handleCancel = async (itemIdx) => {
        const paymentClient = PaymentClient({
            secret: "92oOoI6pdpDDAhxjhOQOy0evayERJhSaEo7egz0tQU1pvdk8Q9RMxcqcqy09X983jZYRvoJLKrYqHQdB",
        });
        const item = basketItems[itemIdx];
        if (!item?.paid || !item.paymentInfo) return;
        if (!window.confirm('결제를 취소하시겠습니까?')) return;
        try { 
            const response = await paymentClient.cancelPayment({
            paymentId: item.paymentInfo.paymentId,
            reason: "테스트",
            });
            console.log(response);
            alert('결제 취소가 완료되었습니다.');
            // 결제취소 항목 DB 삭제 
            await axios.delete(`/api/train/${item.paymentInfo.paymentId}`);
            console.log("결제취소 항목 DB 삭제 완료하였습니다.");
            // 선택된 항목 장바구니에서 제거
            const remaining = basketItems.filter((_, idx) => !checkedList[idx]);
            setBasketItems(remaining);
        } catch (e) {
            alert('결제 취소가 실패되었습니다. 다시 시도해주세요.');
        }
    };

    return (
        <div className="train-basket">
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
            <h2 className="basket-title">장바구니</h2>
            {/* 전체 선택 & 액션 */}
            <div className="basket-header">
                <label className="check-all">
                    <input type="checkbox" checked={checkedList.every(Boolean)} onChange={toggleCheckAll} /> 전체 선택 ({selectedCount}/{basketItems.length})
                </label>
                <button className="delete-btn" onClick={handleDelete}>선택 삭제</button>
            </div> 

            {/* 장바구니 아이템 */}
            {basketItems.map((item, idx) => {
                const tagText = item.roundTrip
                    ? (item.direction === 'depart' ? `왕복(가는날) ${item.initialOneTicket.departure} ➡ ${item.initialOneTicket.arrival}` : `왕복(오는날) ${item.initialOneTicket.arrival} ➡ ${item.initialOneTicket.departure}`)
                    : `편도 ${item.initialOneTicket.departure} ➡ ${item.initialOneTicket.arrival}`;
                const dateinfodirection = item.roundTrip ? (item.direction === 'depart' ? item.initialOneTicket.departDate : item.initialOneTicket.returnDate ) : item.initialOneTicket.departDate;
<<<<<<< HEAD
                const totalItemFare = (calcFare(item)- calChilerenFare(item)).toLocaleString();
                const totaladultsFare = item.selectedTrain.fare * item.initialOneTicket.adults;
                return (
                <div key={idx} className={`basket-item ${checkedList[idx] ? 'active' : ''}`}>
=======
                const totalItemFare = (calcFare(item)- calChildren(item)).toLocaleString();
                const totaladultsFare = item.selectedTrain.fare * item.initialOneTicket.adults;
                return (
                <div key={idx} className={`train-basket-item ${checkedList[idx] ? 'active' : ''}`}>
>>>>>>> 902477c (initial commit)
                    <div className="item-left">
                        <input type="checkbox" checked={checkedList[idx]} onChange={() => toggleCheckItem(idx)} />
                    </div>
                    <div className="item-body">
                        <div className="item-main">
                            <div className="train-icon">KTX 🚄</div>
                            <span className="trip-tag">{tagText}</span>
                            <div className="time-block">
                                <span className="time">{formatTime(item.selectedTrain.departureTime)}</span>
                                <span className="arrow">→</span>
                                <span className="time">{formatTime(item.selectedTrain.arrivalTime)}</span>
                            </div>
                            <div className="date-info">{dateinfodirection}</div> 
                            <div className="train-info">{item.selectedTrain.trainType}-{item.selectedTrain.trainNo} | {item.selectedSeats.join(', ')}</div>
                            <div className="fare-info">성인 {item.initialOneTicket.adults}명 : {totaladultsFare.toLocaleString()}원 </div>
<<<<<<< HEAD
                            <div className="fare-info">아동 {item.initialOneTicket.children}명 할인(50%) : {calChilerenFare(item).toLocaleString()}원</div>
=======
                            <div className="fare-info">아동 {item.initialOneTicket.children}명 할인(50%) : -{calChildren(item).toLocaleString()}원</div>
>>>>>>> 902477c (initial commit)
                        </div>
                        <div className="item-price">
                            
                            {totalItemFare}원
                            {item.paid && (  
                                <button className="train-cancel-btn" onClick={() => handleCancel(idx)}>취소</button> 
                            )}
                        </div>
                    </div> 
                </div>
                )})}

            {/* 상품 요약 */}
            <div className="reserve-summary">
                <h3>결제 요약</h3>
                <div className="summary-row"><span>상품 금액</span><span>{totalFare.toLocaleString()}원</span></div>
<<<<<<< HEAD
                <div className="summary-row"><span>할인 금액</span><span>{totalChildrenFare.toLocaleString()}원</span></div>
=======
                <div className="summary-row"><span>할인 금액</span><span>-{totalChildrenFare.toLocaleString()}원</span></div>
>>>>>>> 902477c (initial commit)
                <hr />
                <div className="summary-row total"><span>결제 예상 금액</span><span>{(totalFare-totalChildrenFare).toLocaleString()}원</span></div>
            </div>

            {/* 하단 고정 바 */}
            <div className="bottom-bar">
                <div className="bar-info">총 {basketItems.length}건</div>
                <div className="bar-price">결제 예상 금액 {(totalFare-totalChildrenFare).toLocaleString()}원</div>
                <button className="purchase-btn" onClick={handlePurchase}>구매하기</button>
            </div>
        </div>
    );
}

export default TrainBasket;