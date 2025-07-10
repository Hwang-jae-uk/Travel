import { useEffect, useState } from "react";
import "./HomePage.css";
import { Navigate, useNavigate } from "react-router-dom";
import StationModal from "./StationModal";
import Calendar from "./Calendar";
import PassengerModal from "./PassengerModal";
import CheckTicketOne from "./CheckTicketOne"; 
import { BookingContext } from "../contexts/BookingContext";
import { useContext } from "react";
<<<<<<< HEAD
=======
import { RiArrowLeftRightFill } from "react-icons/ri";
>>>>>>> 902477c (initial commit)

const HomePage = () => {
  const { booking, setBooking, departSchedules: ctxDepart, setDepartSchedules, returnSchedules: ctxReturn, setReturnSchedules } = useContext(BookingContext);

  const [departure, setDeparture] = useState(booking?.departure || "선택");
  const [arrival, setArrival] = useState(booking?.arrival || "선택");
  const [departDate, setDepartDate] = useState(booking?.departDate || null);
  const [returnDate, setReturnDate] = useState(booking?.returnDate || null);
  const [departTrainSchedules, setDepartTrainSchedules] = useState(ctxDepart || []);
  const [returnTrainSchedules, setReturnTrainSchedules] = useState(ctxReturn || []);
  const [adults, setAdults] = useState(booking?.adults || 1);
  const [children, setChildren] = useState(booking?.children || 0);
  const [activeTab, setActiveTab] = useState("편도");
  const [showCalendar, setShowCalendar] = useState(false);
  const [showStationModal, setShowStationModal] = useState(false);
  const [showPassengerModal, setShowPassengerModal] = useState(false);
  const [modalType, setModalType] = useState(null);
  const [calendarType, setCalendarType] = useState(null); // 'depart' 또는 'return'
  const [recentSearches, setRecentSearches] = useState([]);
  const navigate = useNavigate(); // ✅ useNavigate 훅 사용   
  const [showCheckTicketOne, setShowCheckTicketOne] = useState(false);
  // 출발 시간 필터 상태 (디폴트 00:00)
  const [timeFilter, setTimeFilter] = useState(booking?.timeFilter || "00:00");

  const timeFilterOptions = [
    { label: "00:00 이후 출발", value: "00:00" },
    { label: "06:00 이후 출발", value: "06:00" },
    { label: "09:00 이후 출발", value: "09:00" },
    { label: "12:00 이후 출발", value: "12:00" },
    { label: "15:00 이후 출발", value: "15:00" },
    { label: "18:00 이후 출발", value: "18:00" },
    { label: "21:00 이후 출발", value: "21:00" }
  ];

  // 컴포넌트 마운트 시 localStorage에서 최근 검색 기록 불러오기
  useEffect(() => {
    const savedSearches = localStorage.getItem('recentStationSearches');
    if (savedSearches) {
      setRecentSearches(JSON.parse(savedSearches));
    }
    handleTabChange("편도");
  }, []);

  // 최근 검색 구간 저장 함수
  const saveRecentSearch = (departure, arrival) => {
    const newSearch = { stations: [departure, arrival], type: 'recent' };
    const updatedSearches = [newSearch, ...recentSearches.filter(
      search => !(search.stations[0] === departure && search.stations[1] === arrival)
    )].slice(0, 3); // 최대 3개까지만 저장

    setRecentSearches(updatedSearches);
    localStorage.setItem('recentStationSearches', JSON.stringify(updatedSearches));
  };

  // 최근 검색 기록 삭제 함수
  const handleDeleteRecent = (index) => {
    const updatedSearches = recentSearches.filter((_, i) => i !== index);
    setRecentSearches(updatedSearches);
    localStorage.setItem('recentStationSearches', JSON.stringify(updatedSearches));
  };

  // 전체 삭제 함수
  const handleDeleteAll = () => {
    setRecentSearches([]);
    localStorage.removeItem('recentStationSearches');
  };

  const handleSubmit = () => { 
    if (departure === "선택") {
      alert("출발역을 선택해 주세요.");
      return;
    }
    if (arrival === "선택") {
      alert("도착역을 선택해 주세요.");
      return;
    }
    if (!departDate) {
      alert("가는 날을 선택해 주세요.");
      return;
    }
    if (activeTab === "왕복" && !returnDate) {
      alert("오는 날을 선택해 주세요.");
      return;
    }
    console.log("🚆 출발:", departure);
    console.log("🏁 도착:", arrival);
    console.log("📅 가는 날:", departDate);
    if (activeTab === "왕복") {
      console.log("📅 오는 날:", returnDate);
      console.log("🚄 오는 기차 시간표:", returnTrainSchedules);
    }
    console.log("🚄 가는 기차 시간표:", departTrainSchedules);
    console.log("⏱️ 출발 시간 필터:", timeFilter);
    console.log("🧍 성인:", adults, "명");
    console.log("👶 아동:", children, "명");
    setShowCheckTicketOne(true);

    // Context 저장
    setBooking({ departure, arrival, departDate, returnDate, adults, children, timeFilter });
    setDepartSchedules(departTrainSchedules);
    setReturnSchedules(returnTrainSchedules);

    navigate('/CheckTicketOne', {
      state: {
        initialOneTicket: { departure, arrival, departDate, returnDate, adults, children, timeFilter },
        initialOneTicketDepartSc: departTrainSchedules,
        initialOneTicketTrainSc: returnTrainSchedules
      }
    });
  };

  const handleDateClick = (type) => {
    setCalendarType(type);
    setShowCalendar(true);
  };

  const handleDateSelect = ({ date, trainSchedules }) => {
    if (calendarType === 'depart') {
      setDepartDate(date);
      setDepartTrainSchedules(trainSchedules);
      setDepartSchedules(trainSchedules);
    } else {
      setReturnDate(date);
      setReturnTrainSchedules(trainSchedules);
      setReturnSchedules(trainSchedules);
    }
    if (date !== null) {  // 초기화가 아닐 때만 달력을 닫음
      setShowCalendar(false);
    }
  };

  const handleStationSelect = (station) => {
    if (modalType === 'departure') {
      setDeparture(station);
      if (arrival !== "선택") {
        saveRecentSearch(station, arrival);
      }
    } else {
      setArrival(station);
      if (departure !== "선택") {
        saveRecentSearch(departure, station);
      }
    }
    setShowStationModal(false);
  };

  const openStationModal = (type) => {
    setModalType(type);
    setShowStationModal(true);
  };

  const handleSwapStations = () => {
    const temp = departure;
    setDeparture(arrival);
    setArrival(temp);
    if (departure !== "선택" && arrival !== "선택") {
      saveRecentSearch(arrival, departure);
    }
  };

  const handlePassengerSelect = ({ adults: newAdults, children: newChildren }) => {
    setAdults(newAdults);
    setChildren(newChildren);
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    if (tab === "편도") {
      setReturnDate(null);
      setReturnTrainSchedules([]);
    }
  };

  const handleRecentSearchSelect = (stations) => {
    setDeparture(stations[0]);
    setArrival(stations[1]);
    setShowStationModal(false);
  };

  return (
    <div className="container">
      <h1 className="title">기차</h1>
      
      <div className="tab-container">
        <div className="tabs">
          <button 
            className={`tab ${activeTab === "편도" ? "active" : ""}`}
            onClick={() => handleTabChange("편도")}
          >
            편도
          </button>
          <button 
            className={`tab ${activeTab === "왕복" ? "active" : ""}`}
            onClick={() => handleTabChange("왕복")}
          >
            왕복
          </button>
        </div>
      </div>

      <div className="stations-container">
        <div className="location-container">
          <div className="location-box" onClick={() => openStationModal('departure')}>
            <div className="location-label">출발역</div>
            <div className="location"> {departure}</div>
          </div>
        </div>

        <button className="swap-button" onClick={handleSwapStations}>
<<<<<<< HEAD
          <span>🔄</span>
=======
          <RiArrowLeftRightFill />
>>>>>>> 902477c (initial commit)
        </button>

        <div className="location-container">
          <div className="location-box" onClick={() => openStationModal('arrival')}>
            <div className="location-label">도착역</div>
            <div className="location">{arrival}</div>
          </div>
        </div>
      </div>

      <div className="date-section" onClick={() => handleDateClick('depart')}>
        <div className="date-label">가는 날</div>
        <div className="date-value">
          {departDate || "날짜를 선택해 주세요."}
        </div>
      </div>

      {activeTab === "왕복" && (
        <div className="date-section" onClick={() => handleDateClick('return')}>
          <div className="date-label">오는 날</div>
          <div className="date-value">
            {returnDate || "날짜를 선택해 주세요."}
          </div>
        </div>
      )}

      <div className="passenger-section" onClick={() => setShowPassengerModal(true)}>
        <div className="passenger-label">인원</div>
        <div className="passenger-value">
          성인 {adults}명{children > 0 ? ` · 아동 ${children}명` : ''}
        </div>
      </div>

      {/* 출발 시간 필터 선택 */}
      <div className="time-filter-section">
        <label className="time-filter-label">출발 시간</label>
        <select
          className="time-filter-select"
          value={timeFilter}
          onChange={(e) => setTimeFilter(e.target.value)}
        >
          {timeFilterOptions.map(opt => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
      </div>

      <button className="search-button" onClick={handleSubmit}>
        승차권 조회
      </button>

      <StationModal 
        isOpen={showStationModal}
        onClose={() => setShowStationModal(false)}
        onSelect={handleStationSelect}
        title={modalType === 'departure' ? "출발역 선택" : "도착역 선택"}
        saveRecentSearch={saveRecentSearch}
        recentSearches={recentSearches}
        onDeleteRecent={handleDeleteRecent}
        onDeleteAll={handleDeleteAll}
        onRecentSearchSelect={handleRecentSearchSelect}
      />

      <Calendar
        isOpen={showCalendar}
        onClose={() => setShowCalendar(false)}
        onSelect={handleDateSelect}
        initialDate={calendarType === 'depart' ? departDate : returnDate}
        selectionType={calendarType}
        departDate={departDate}
        returnDate={returnDate}
      />

      <PassengerModal
        isOpen={showPassengerModal}
        onClose={() => setShowPassengerModal(false)}
        onSelect={handlePassengerSelect}
        initialAdults={adults}
        initialChildren={children}
      />

      {showCheckTicketOne && (
        <CheckTicketOne
          initialOneTicket={{ departure, arrival, departDate, returnDate, adults, children, timeFilter }}
          initialOneTicketDepartSc={departTrainSchedules} // 가는 기차 시간표
          initialOneTicketTrainSc={returnTrainSchedules} // 오는 기차 시간표
        />
      )}
    </div>
  );
};

export default HomePage;