import React, { useState, useEffect } from 'react';
import './Calendar.css';
import dayjs from 'dayjs';
import styled from 'styled-components';
import axios from 'axios';
<<<<<<< HEAD
=======
import { TbTrain } from "react-icons/tb";
>>>>>>> 902477c (initial commit)

const DateCell = styled.div.attrs(props => ({
  // DOM에 전달될 속성들만 여기서 정의
  onClick: props.onClick,
  className: props.className
}))`
  position: relative;
  width: 100%;
  height: 40px;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: ${props => props.$disabled ? 'not-allowed' : 'pointer'};
  opacity: ${props => props.$disabled ? 0.5 : 1};
  background: ${props => {
    if (props.$isDepartDate && props.$isReturnDate) {
      return `linear-gradient(to right bottom, #007bff 50%, #28a745 50%)`;
    }
    if (props.$isDepartDate) return '#007bff';
    if (props.$isReturnDate) return '#28a745';
    return 'transparent';
  }};
  color: ${props => {
    if (props.$isDepartDate || props.$isReturnDate) return 'white';
    if (props.$isPast || props.$hasNoTrains || props.$disabled) return '#999';
    return 'black';
  }};
  border-radius: 50%;

  &:hover {
    background: ${props => {
      if (props.$disabled) return props.$isDepartDate ? '#007bff' : props.$isReturnDate ? '#28a745' : 'transparent';
      if (props.$isDepartDate && props.$isReturnDate) {
        return `linear-gradient(to right bottom, #0056b3 50%, #218838 50%)`;
      }
      if (props.$isDepartDate) return '#0056b3';
      if (props.$isReturnDate) return '#218838';
      return '#f0f0f0';
    }};
  }
`;

const DateText = styled.span.attrs(props => ({
  className: props.className
}))`
  position: relative;
  z-index: 1;
  ${props => (props.$isDepartDate || props.$isReturnDate) && `
    font-weight: bold;
  `}
`;

const TrainIcon = styled.span`
  margin-left: 5px;
<<<<<<< HEAD
=======
  display: inline-flex;
  align-items: center;
  vertical-align: middle;
  svg {
    margin-bottom: 1px;
  }
>>>>>>> 902477c (initial commit)
`;

const Calendar = ({ isOpen, onClose, onSelect, initialDate, selectionType, departDate, returnDate }) => {
  const [selectedDate, setSelectedDate] = useState(null);
  const [trainSchedules, setTrainSchedules] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  const today = dayjs();
  const maxDate = today.add(6, 'day'); // 오늘로부터 6일 후
  const months = [6, 7, 8]; // 6, 7, 8월

  // YYYYMMDD 형식으로 날짜를 변환하는 함수
  const formatDateToString = (year, month, day) => {
    return `${year}${String(month).padStart(2, '0')}${String(day).padStart(2, '0')}`;
  };

  // 기차 정보 API 호출 함수 (한국철도공사 API 직접 호출)
  const fetchTrainInfo = async (year, month, day) => {
    const currentDate = dayjs(new Date(year, month - 1, day));
    
    // 오늘부터 7일 이내인 경우만 API 호출
    if (currentDate.isAfter(maxDate) || currentDate.isBefore(today, 'day')) {
      return false;
    }

    try {
      const formattedDate = formatDateToString(year, month, day);
      const serviceKey = process.env.REACT_APP_TRAIN_KEY;
      console.log(serviceKey);
      if (!serviceKey) {
        console.error('기차 API 키가 설정되지 않았습니다.');
        return false;
      }

      const params = {
        serviceKey: decodeURIComponent(serviceKey),
        pageNo: '1',
        numOfRows: '100',
        _type: 'json',
        depPlaceId: 'NAT010000', // 서울역 (기본값)
        arrPlaceId: 'NAT014445', // 부산역 (기본값)
        depPlandTime: formattedDate,
        trainGradeCode: '00' // 전체
      };

      const response = await axios.get(
        'https://apis.data.go.kr/1613000/TrainInfoService/getStrtpntAlocFndTrainInfo',
        { 
          params,
          withCredentials: false,
   
          
        }
      );
      console.log(response);
      if (response.data.response.header.resultCode === '00') {
        const items = response.data.response.body.items;
        return items && items.item && items.item.length > 0;
      }
      return false;
    } catch (error) {
      console.error('기차 정보 조회 실패:', error);
      return false;
    }
  };

  // 월별 기차 운행 정보 조회
  useEffect(() => {
    const loadMonthlySchedule = async (year, month) => {
      setLoading(true);
      setError(null);
      const schedules = {};
      const lastDate = new Date(year, month, 0).getDate();
      
      try {
        // 각 날짜별로 기차 운행 정보 조회
        const promises = [];
        for (let day = 1; day <= lastDate; day++) {
          const currentDate = dayjs(new Date(year, month - 1, day));
          // 오늘부터 7일 이내인 경우만 API 호출
          if (!currentDate.isAfter(maxDate) && !currentDate.isBefore(today, 'day')) {
            promises.push(
              fetchTrainInfo(year, month, day).then(hasTrains => {
                schedules[`${year}-${month}-${day}`] = hasTrains;
              })
            );
          } else {
            schedules[`${year}-${month}-${day}`] = false;
          }
        }
        
        // 모든 날짜의 기차 운행 정보를 병렬로 조회
        await Promise.all(promises);
        setTrainSchedules(prev => ({ ...prev, ...schedules }));
      } catch (error) {
        setError('기차 운행 정보를 불러오는데 실패했습니다.');
      } finally {
        setLoading(false);
      }
    };

    // 각 월별 데이터 로드
    const loadAllMonths = async () => {
      for (const month of months) {
        await loadMonthlySchedule(2025, month);
      }
    };

    loadAllMonths();
  }, []);

  const generateDays = (year, month) => {
    const firstDay = new Date(year, month - 1, 1).getDay();
    const lastDate = new Date(year, month, 0).getDate();
    const days = [];
    const today = dayjs().startOf('day');
    const departDateObj = departDate ? dayjs(departDate).startOf('day') : null;
    const returnDateObj = returnDate ? dayjs(returnDate).startOf('day') : null;
    
    // 이전 달의 날짜들
    for (let i = 0; i < firstDay; i++) {
      days.push({ date: '', disabled: true });
    }
    
    // 현재 달의 날짜들
    for (let i = 1; i <= lastDate; i++) {
      const currentDate = dayjs(new Date(year, month - 1, i)).startOf('day');
      const dateKey = currentDate.format('YYYY-M-D');
      const isPast = currentDate.isBefore(today);
      const hasNoTrains = !trainSchedules[dateKey];
      const isDepartDate = departDateObj && currentDate.isSame(departDateObj);
      const isReturnDate = returnDateObj && currentDate.isSame(returnDateObj);
      const isBeforeDepartDate = departDateObj && currentDate.isBefore(departDateObj);
      const isAfterReturnDate = returnDateObj && currentDate.isAfter(returnDateObj);
      
      let isDisabled = isPast || hasNoTrains;

      // 오는 날 선택 시
      if (selectionType === 'return' && departDateObj) {
        // 가는 날 이전 날짜만 선택 불가
        if (isBeforeDepartDate) {
          isDisabled = true;
        }
      }

      // 가는 날 선택 시
      if (selectionType === 'depart' && returnDateObj) {
        // 오는 날 이후 날짜는 선택 불가
        if (isAfterReturnDate) {
          isDisabled = true;
        }
      }
      
      days.push({
        date: i,
        disabled: isDisabled,
        dayOfWeek: currentDate.day(),
        hasTrains: trainSchedules[dateKey],
        isPast: isPast,
        hasNoTrains: hasNoTrains,
        isDepartDate: isDepartDate,
        isReturnDate: isReturnDate,
        currentDate: currentDate
      });
    }
    
    return days;
  };

  const handleDateClick = async (year, month, day) => {
    setLoading(true);
    setError(null);
    const formattedDate = formatDateToString(year, month, day);
    setSelectedDate({ year, month, day });
    
    try {
      const serviceKey = process.env.REACT_APP_TRAIN_KEY;
      
      
      if (!serviceKey) {
        throw new Error('기차 API 키가 설정되지 않았습니다.');
      }

      const params = {
        serviceKey: decodeURIComponent(serviceKey),
        pageNo: '1',
        numOfRows: '100',
        _type: 'json',
        depPlaceId: 'NAT010000', // 서울역 (기본값)
        arrPlaceId: 'NAT014445', // 부산역 (기본값)
        depPlandTime: formattedDate,
        trainGradeCode: '00' // 전체
      };

      const response = await axios.get(
        'https://apis.data.go.kr/1613000/TrainInfoService/getStrtpntAlocFndTrainInfo',
        { params,
          withCredentials: false,
         
         }
      );

      if (response.data.response.header.resultCode !== '00') {
        throw new Error('기차 운행 정보가 없습니다.');
      }

      const items = response.data.response.body.items;
      const trainSchedules = items && items.item ? (Array.isArray(items.item) ? items.item : [items.item]) : [];

      if (trainSchedules.length === 0) {
        throw new Error('기차 운행 정보가 없습니다.');
      }

      const date = new Date(year, month - 1, day);
      const days = ['일', '월', '화', '수', '목', '금', '토'];
      const formattedDisplayDate = `${year}.${String(month).padStart(2, '0')}.${String(day).padStart(2, '0')} (${days[date.getDay()]})`;

      onSelect({ 
        date: formattedDisplayDate, 
        trainSchedules: trainSchedules.map(train => ({
          trainNo: train.trainno,
          departureTime: train.depplandtime,
          arrivalTime: train.arrplandtime,
          departureStation: train.depplacename,
          arrivalStation: train.arrplacename,
          fare: train.adultcharge,
          trainType: train.traingradename
        }))
      });
      onClose();
    } catch (error) {
      setError('기차 시간표를 불러오는데 실패했습니다: ' + error.message);
      console.error('기차 시간표 조회 실패:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setSelectedDate(null);
    onSelect({ date: null, trainSchedules: [] });
  };

  const isPastDate = (date) => {
    const today = dayjs().startOf('day');
    return date.isBefore(today);
  };

  const hasTrainOnDate = (date) => {
    const dateString = date.format('YYYYMMDD');
    return trainSchedules[dateString] && trainSchedules[dateString].length > 0;
  };

  const isSelectedDate = (date) => {
    if (!initialDate) return false;
    const selectedDate = dayjs(initialDate);
    return date.format('YYYYMMDD') === selectedDate.format('YYYYMMDD');
  };

  const getDayClass = (date) => {
    let className = 'calendar-day';
    
    if (isPastDate(date)) {
      className += ' past-date';
      return className;
    }

    if (hasTrainOnDate(date)) {
      className += ' has-train';
    }
    
    if (isSelectedDate(date)) {
      className += ' selected-date';
      if (selectionType === 'depart') {
        className += ' depart-date';
      } else if (selectionType === 'return') {
        className += ' return-date';
      }
    }

    return className;
  };

  if (!isOpen) return null;

  return (
    <div className="calendar-overlay">
      <div className={`calendar-content ${loading ? 'loading' : ''}`}>
        <div className="calendar-header">
          <button className="close-button" onClick={onClose}>×</button>
          <h2>날짜 선택</h2>
          <button className="calender-reset-button" onClick={handleReset}>초기화</button>
        </div>
        <div className="calendar-subheader">
          {loading ? '기차 운행 정보를 불러오는 중...' : 
           error ? error : 
           (departDate || returnDate) && !initialDate ? '다른 날짜를 선택하려면 초기화를 눌러주세요.' :
           '승차권은 출발 시간 전까지 구매 가능합니다.'}
        </div>
        <div className="calendar-grid">
          <div className="weekdays">
            <div className="weekday sunday">일</div>
            <div className="weekday">월</div>
            <div className="weekday">화</div>
            <div className="weekday">수</div>
            <div className="weekday">목</div>
            <div className="weekday">금</div>
            <div className="weekday saturday">토</div>
          </div>
          {months.map(month => (
            <div key={month} className="month-section">
              <h3>{month}월 2025</h3>
              <div className="days-grid">
                {generateDays(2025, month).map((day, index) => {
                  let className = 'day';
                  if (day.date) {
                    if (day.disabled) {
                      className += ' disabled';
                    }
                    if (day.isPast) {
                      className += ' past-date';
                    }
                    if (day.hasNoTrains) {
                      className += ' no-trains';
                    }
                    if (day.isDepartDate) {
                      className += ' depart-date';
                    }
                    if (day.isReturnDate) {
                      className += ' return-date';
                    }
                    if (day.dayOfWeek === 0) {
                      className += ' sunday';
                    }
                    if (day.dayOfWeek === 6) {
                      className += ' saturday';
                    }
                    if (day.hasTrains) {
                      className += ' has-trains';
                    }
                    if (initialDate) {
                      const selectedDate = dayjs(initialDate).startOf('day');
                      if (day.currentDate.isSame(selectedDate)) {
                        className += ' selected';
                        className += day.isDepartDate ? ' depart-date' : ' return-date';
                      }
                    }
                  } else {
                    className += ' empty';
                  }

                  return (
                    <DateCell
                      key={index}
                      onClick={() => !day.disabled && day.date && handleDateClick(2025, month, day.date)}
                      $disabled={day.disabled}
                      $isDepartDate={day.isDepartDate}
                      $isReturnDate={day.isReturnDate}
                      $isPast={day.isPast}
                      $hasNoTrains={day.hasNoTrains}
                    >
                      <DateText
                        $isDepartDate={day.isDepartDate}
                        $isReturnDate={day.isReturnDate}
                      >
                        {day.date}
                      </DateText>
                      {day.hasTrains && !day.isPast && !day.disabled && (
<<<<<<< HEAD
                        <TrainIcon>🚄</TrainIcon>
=======
                        <div className="calendar-train-icon">
                          <TbTrain size={18} color="#666" />
                        </div>
>>>>>>> 902477c (initial commit)
                      )}
                    </DateCell>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Calendar; 