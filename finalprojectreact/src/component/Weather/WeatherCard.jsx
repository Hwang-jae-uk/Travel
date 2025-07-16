import React, { useState, useRef, useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';

const WeatherCard = ({ currentWeather, forecast, location, onLocationChange }) => {
    const [selectedDate, setSelectedDate] = useState('');
    const sliderRef = useRef(null);

    const handleWheel = useCallback((e) => {
        e.preventDefault();
        if (sliderRef.current) {
            // 스크롤 감도 증가 (기본값의 5배)
            const scrollAmount = e.deltaY * 7;
            
            // 카드 너비(200px)를 기준으로 스크롤 스냅
            const cardWidth = 215; // 카드 너비(200px) + gap(15px)
            const currentScroll = sliderRef.current.scrollLeft;
            
            if (Math.abs(e.deltaY) > 0) {
                // 스크롤 방향에 따라 다음/이전 카드로 스크롤
                if (e.deltaY > 0) {
                    // 아래로 스크롤: 다음 카드로
                    sliderRef.current.scrollTo({
                        left: Math.ceil((currentScroll + scrollAmount) / cardWidth) * cardWidth,
                        behavior: 'smooth'
                    });
                } else {
                    // 위로 스크롤: 이전 카드로
                    sliderRef.current.scrollTo({
                        left: Math.floor((currentScroll + scrollAmount) / cardWidth) * cardWidth,
                        behavior: 'smooth'
                    });
                }
            }
        }
    }, []);

    // 버튼 클릭 핸들러 추가
    const handleButtonClick = useCallback((direction) => {
        if (sliderRef.current) {
            const cardWidth = 215; // 카드 너비(200px) + gap(15px)
            const currentScroll = sliderRef.current.scrollLeft;

            // 한 카드씩 이동
            const newScroll = direction === 'next' 
                ? currentScroll + cardWidth 
                : currentScroll - cardWidth;

            sliderRef.current.scrollTo({
                left: newScroll,
                behavior: 'smooth'
            });

            // 스크롤 이벤트 일시적으로 비활성화
            if (sliderRef.current) {
                sliderRef.current.removeEventListener('wheel', handleWheel);
                setTimeout(() => {
                    sliderRef.current?.addEventListener('wheel', handleWheel, { passive: false });
                }, 800); // 스크롤 애니메이션이 끝나는 시간과 맞춤
            }
        }
    }, [handleWheel]);

    // 컴포넌트가 마운트될 때 이벤트 리스너 추가
    useEffect(() => {
        const sliderContainer = sliderRef.current;
        
        if (sliderContainer) {
            sliderContainer.style.overscrollBehavior = 'contain';
            sliderContainer.style.touchAction = 'none';
            sliderContainer.addEventListener('wheel', handleWheel, { passive: false });
        }

        return () => {
            if (sliderContainer) {
                sliderContainer.removeEventListener('wheel', handleWheel);
            }
        };
    }, [handleWheel]);

    const getWeatherDescription = (pty) => {
        switch (pty) {
            case '0': return '☀️';
            case '1': return '🌧️';
            case '2': return '🌨️';
            case '3': return '❄️';
            case '4': return '🌦️';
            default: return '알 수 없음';
        }
    };

    const getTemperatureLevel = (temp) => {
        const temperature = parseInt(temp);
        if (temperature >= 30) return 'very-hot';
        if (temperature >= 25) return 'hot';
        if (temperature >= 20) return 'warm';
        if (temperature >= 15) return 'mild';
        if (temperature >= 10) return 'cool';
        if (temperature >= 5) return 'cold';
        return 'very-cold';
    };

    const getWeatherClass = (pty, temp) => {
        const tempLevel = getTemperatureLevel(temp);
        const baseWeather = pty || '0';
        
        switch (baseWeather) {
            case '0': // 맑음
                return `weather-sunny weather-sunny-${tempLevel}`;
            case '1': // 비
                return `weather-rainy weather-rainy-${tempLevel}`;
            case '2': // 진눈깨비
                return `weather-sleet weather-sleet-${tempLevel}`;
            case '3': // 눈
                return `weather-snowy weather-snowy-${tempLevel}`;
            case '4': // 소나기
                return `weather-shower weather-shower-${tempLevel}`;
            default:
                return `weather-unknown weather-unknown-${tempLevel}`;
        }
    };

    const formatDate = (date) => {
        const year = parseInt(date.substring(0, 4));
        const month = parseInt(date.substring(4, 6));
        const day = parseInt(date.substring(6, 8));
        
        const dateObj = new Date(year, month - 1, day);
        const weekdays = ['일요일', '월요일', '화요일', '수요일', '목요일', '금요일', '토요일'];
        const weekday = weekdays[dateObj.getDay()];
        
        return `${month}월 ${day}일 (${weekday})`;
    };

    const formatTime = (time) => {
        const hour = parseInt(time.substring(0, 2));
        return `${hour}:00`;
    };

    const getCityName = (coords) => {
        const cityMap = {
            '60,127': '서울',
            '55,124': '인천',
            '60,121': '수원',
            '73,134': '춘천',
            '92,131': '강릉',
            '69,106': '청주',
            '67,100': '대전',
            '66,103': '세종',
            '63,89': '전주',
            '58,74': '광주',
            '89,90': '대구',
            '98,76': '부산',
            '102,84': '울산',
            '91,77': '창원',
            '52,38': '제주'
        };
        return cityMap[coords] || '알 수 없음';
    };

    // 예보 데이터를 날짜별로 그룹화
    const groupedForecast = forecast ? groupForecastByDate(forecast) : {};
    const availableDates = Object.keys(groupedForecast).sort();

    // 첫 번째 날짜를 기본 선택
    const currentSelectedDate = selectedDate || availableDates[0] || '';
    
    // 선택된 날짜의 시간별 데이터
    const selectedDateData = currentSelectedDate ? groupedForecast[currentSelectedDate] : [];
    const timeGroupedData = selectedDateData.length > 0 ? groupForecastByDateTime(selectedDateData) : {};
    const sortedTimes = Object.keys(timeGroupedData).sort();

    // 날짜가 변경될 때 초기화
    const handleDateChange = (newDate) => {
        setSelectedDate(newDate);
    };

    return (
        <div className="weather-layout">
            {/* 왼쪽 절반: 도시 선택 + 현재 날씨 */}
            <div className="weather-left-section">
                <div className="current-weather-card">
                    <select 
                        value={location} 
                        onChange={onLocationChange}
                        className="city-select"
                    >
                        <option value="60,127">서울</option>
                        <option value="55,124">인천</option>
                        <option value="60,121">수원</option>
                        <option value="73,134">춘천</option>
                        <option value="92,131">강릉</option>
                        <option value="69,106">청주</option>
                        <option value="67,100">대전</option>
                        <option value="66,103">세종</option>
                        <option value="63,89">전주</option>
                        <option value="58,74">광주</option>
                        <option value="89,90">대구</option>
                        <option value="98,76">부산</option>
                        <option value="102,84">울산</option>
                        <option value="91,77">창원</option>
                        <option value="52,38">제주</option>
                    </select>

                    {currentWeather && (
                        <div className="current-weather-content">
                            <h2 className="city-title">{getCityName(location)}</h2>
                            <div className="current-weather-main">
                                <div className="temperature">
                                    {currentWeather.find(item => item.category === 'T1H')?.obsrValue}°C
                                </div>
                                <div className="weather-icon">
                                    {getWeatherDescription(currentWeather.find(item => item.category === 'PTY')?.obsrValue)}
                                </div>
                            </div>
                            <div className="weather-details">
                                <div className="detail-item">
                                    <span className="detail-label">습도</span>
                                    <span className="detail-value">{currentWeather.find(item => item.category === 'REH')?.obsrValue}%</span>
                                </div>
                                <div className="detail-item">
                                    <span className="detail-label">풍속</span>
                                    <span className="detail-value">{currentWeather.find(item => item.category === 'WSD')?.obsrValue}m/s</span>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* 오른쪽 절반: 예보 */}
            <div className="weather-right-section">
                {forecast && availableDates.length > 0 && (
                    <div className="forecast-card">
                        <h3 className="forecast-title">시간별 예보</h3>
                        
                        {/* 날짜 선택 */}
                        <select 
                            value={currentSelectedDate} 
                            onChange={(e) => handleDateChange(e.target.value)}
                            className="date-select"
                        >
                            {availableDates.map(date => (
                                <option key={date} value={date}>
                                    {formatDate(date)}
                                </option>
                            ))}
                        </select>

                        {/* 시간별 예보 컨테이너 */}
                        <div className="forecast-section">
                            <div 
                                ref={sliderRef}
                                className="forecast-slider-container"
                            >
                                <div className="forecast-slider">
                                    {sortedTimes.map((time) => {
                                        const timeData = timeGroupedData[time];
                                        const temp = timeData.find(item => item.category === 'TMP')?.fcstValue;
                                        const pty = timeData.find(item => item.category === 'PTY')?.fcstValue;
                                        const reh = timeData.find(item => item.category === 'REH')?.fcstValue;
                                        const wsd = timeData.find(item => item.category === 'WSD')?.fcstValue;

                                        return (
                                            <div 
                                                key={time}
                                                className={`forecast-time-card ${getWeatherClass(pty, temp)}`}
                                            >
                                                <div className="forecast-time">{formatTime(time)}</div>
                                                <div className="forecast-weather-icon">
                                                    {getWeatherDescription(pty)}
                                                </div>
                                                <div className="forecast-temperature">
                                                    {temp}°C
                                                </div>
                                                <div className="forecast-details-mini">
                                                    <div className="mini-detail">
                                                        <span>💧 {reh}%</span>
                                                    </div>
                                                    <div className="mini-detail">
                                                        <span>💨 {wsd}m/s</span>
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                            <div className="forecast-nav-buttons">
                                <button 
                                    className="nav-button prev"
                                    onClick={() => handleButtonClick('prev')}
                                >
                                    ◀
                                </button>
                                <button 
                                    className="nav-button next"
                                    onClick={() => handleButtonClick('next')}
                                >
                                    ▶
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

const groupForecastByDate = (forecast) => {
    return forecast.reduce((acc, item) => {
        if (!acc[item.fcstDate]) {
            acc[item.fcstDate] = [];
        }
        acc[item.fcstDate].push(item);
        return acc;
    }, {});
};

const groupForecastByDateTime = (forecast) => {
    return forecast.reduce((acc, item) => {
        const key = item.fcstTime;
        if (!acc[key]) {
            acc[key] = [];
        }
        acc[key].push(item);
        return acc;
    }, {});
};

WeatherCard.propTypes = {
    currentWeather: PropTypes.array,
    forecast: PropTypes.array,
    location: PropTypes.string.isRequired,
    onLocationChange: PropTypes.func.isRequired
};

export default WeatherCard;












// const fetchWeatherData = async () => {
        //     try {
        //         const [currentResponse, forecastResponse] = await Promise.all([
        //             axios.get(`/api/weather/current?location=${location}`),
        //             axios.get(`/api/weather/forecast?location=${location}`)
        //         ]);

            //     setCurrentWeather(currentResponse.data);
                
            //     // Filter forecast data for future times only
            //     const now = new Date();
            //     const currentDate = now.getFullYear() + 
            //         String(now.getMonth() + 1).padStart(2, '0') + 
            //         String(now.getDate()).padStart(2, '0');
            //     const currentTime = String(now.getHours()).padStart(2, '0') + '00';

            //     const filteredForecast = forecastResponse.data.filter(item => {
            //         if (item.fcstDate > currentDate) return true;
            //         return item.fcstDate === currentDate && item.fcstTime > currentTime;
            //     });

            //     setForecast(filteredForecast);
            // } catch (error) {
            //     console.error('Error fetching weather data:', error);
            // }
        // };
        // fetchWeatherData();