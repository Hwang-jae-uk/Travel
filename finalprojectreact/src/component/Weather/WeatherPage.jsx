import React, { useState, useEffect } from 'react';
import axios from 'axios';
import WeatherCard from './WeatherCard';
import Footer from '../Footer/Footer';
import './Weather.css';

const WeatherPage = () => {
    const [currentWeather, setCurrentWeather] = useState(null);
    const [forecast, setForecast] = useState(null);
    const [location, setLocation] = useState('98,76'); // Default to Busan
    const [backgroundStyle, setBackgroundStyle] = useState({});

    // 시간에 따른 배경색 생성 함수 - 헤더/푸터와 조화되는 중성적 스타일
    const getTimeBasedBackground = () => {
        const now = new Date();
        const hour = now.getHours();
        
        let backgroundColor, overlayColor, brightness;
        
        if (hour >= 0 && hour < 6) {
            // 새벽 (0-5시): 어두운 회색
            backgroundColor = '#2c3e50';
            overlayColor = 'rgba(52, 73, 94, 0.3)';
            brightness = 'dark';
        } else if (hour >= 6 && hour < 9) {
            // 아침 (6-8시): 연한 회색
            backgroundColor = '#ecf0f1';
            overlayColor = 'rgba(189, 195, 199, 0.2)';
            brightness = 'light';
        } else if (hour >= 9 && hour < 12) {
            // 오전 (9-11시): 밝은 회색
            backgroundColor = '#f8f9fa';
            overlayColor = 'rgba(206, 214, 224, 0.2)';
            brightness = 'light';
        } else if (hour >= 12 && hour < 15) {
            // 점심 (12-14시): 가장 밝은 회색
            backgroundColor = '#ffffff';
            overlayColor = 'rgba(241, 243, 244, 0.3)';
            brightness = 'light';
        } else if (hour >= 15 && hour < 18) {
            // 오후 (15-17시): 중간 회색
            backgroundColor = '#e9ecef';
            overlayColor = 'rgba(173, 181, 189, 0.2)';
            brightness = 'light';
        } else if (hour >= 18 && hour < 20) {
            // 저녁 (18-19시): 조금 어두운 회색
            backgroundColor = '#dee2e6';
            overlayColor = 'rgba(134, 142, 150, 0.3)';
            brightness = 'light';
        } else {
            // 밤 (20-23시): 어두운 회색
            backgroundColor = '#495057';
            overlayColor = 'rgba(73, 80, 87, 0.2)';
            brightness = 'dark';
        }
        
        return {
            backgroundColor,
            backgroundImage: `radial-gradient(circle at 30% 20%, ${overlayColor}, transparent 50%), 
                             radial-gradient(circle at 70% 80%, ${overlayColor}, transparent 50%)`,
            boxShadow: brightness === 'light' 
                ? 'inset 0 0 100px rgba(0, 0, 0, 0.05)' 
                : 'inset 0 0 100px rgba(255, 255, 255, 0.05)'
        };
    };

    // 배경 업데이트를 위한 useEffect
    useEffect(() => {
        const updateBackground = () => {
            setBackgroundStyle(getTimeBasedBackground());
        };

        // 초기 배경 설정
        updateBackground();

        // 매분마다 배경 업데이트 (시간이 바뀔 때마다 반영)
        const interval = setInterval(updateBackground, 60000);

        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        const fetchWeatherData = async () => {
            try {
                const now = new Date();
                const currentDate = now.getFullYear() + 
                    String(now.getMonth() + 1).padStart(2, '0') + 
                    String(now.getDate()).padStart(2, '0');
                const currentTime = String(now.getHours()-1).padStart(2, '0') + '30';

                const serviceKey = process.env.REACT_APP_WEATHER_KEY;

                // 현재 날씨 데이터 가져오기
                const currentParams = {
                    serviceKey: decodeURIComponent(serviceKey),
                    pageNo: '1',
                    numOfRows: '1000',
                    dataType: 'JSON',
                    base_date: currentDate,
                    base_time: currentTime,
                    nx: location ? location.split(",")[0] : 98,
                    ny: location ? location.split(",")[1] : 76
                };

                const currentResponse = await axios.get(
                    'http://apis.data.go.kr/1360000/VilageFcstInfoService_2.0/getUltraSrtNcst',
                    { 
                        params: currentParams,
                        withCredentials: false
                    }
                );

                const currentItems = currentResponse.data.response.body.items.item;
                setCurrentWeather(currentItems);

                // 일기 예보 데이터 가져오기
                const forecastParams = {
                    serviceKey: decodeURIComponent(serviceKey),
                    pageNo: '1',
                    numOfRows: '1000',
                    dataType: 'JSON',
                    base_date: currentDate,
                    base_time: '0500',
                    nx: location ? location.split(",")[0] : 98,
                    ny: location ? location.split(",")[1] : 76
                };

                const forecastResponse = await axios.get(
                    'http://apis.data.go.kr/1360000/VilageFcstInfoService_2.0/getVilageFcst',
                    { 
                        params: forecastParams,
                        withCredentials: false
                    }
                );

                const forecastItems = forecastResponse.data.response.body.items.item;

                // 날짜별 시간대 데이터 필터링
                const filteredForecast = forecastItems
                    .filter(item => {
                        // 카테고리 필터링
                        if (!["TMP", "PTY", "REH", "WSD"].includes(item.category)) {
                            return false;
                        }

                        const itemDate = parseInt(item.fcstDate);
                        const currentDateInt = parseInt(currentDate);
                        const daysDiff = Math.floor((itemDate - currentDateInt) / 10000); // 날짜 차이 계산

                        // 오늘/내일/모레 데이터 (1시간 간격)
                        if (daysDiff <= 2) {
                            return true; // 00시부터 23시까지 모든 데이터 포함
                        }
                        // 4일차 데이터 (3시간 간격)
                        else if (daysDiff === 3) {
                            return parseInt(item.fcstTime) % 300 === 0;
                        }
                        // 5일차 데이터 (00시 데이터만)
                        else if (daysDiff === 4) {
                            return item.fcstTime === "0000";
                        }
                        
                        return false;
                    });

                console.log('Filtered forecast data:', filteredForecast); // 데이터 확인용
                setForecast(filteredForecast);

            } catch (error) {
                console.error('API 요청 실패:', error);
            }
        };

        fetchWeatherData();
    }, [location]);

    const handleLocationChange = (e) => {
        setLocation(e.target.value);
    };

    return (
        <div>
            <div style={{
                ...backgroundStyle,
                backgroundSize: 'cover', 
                backgroundPosition: 'center', 
                backgroundRepeat: 'no-repeat', 
                width: '100%', 
                height: '100vh',
                minHeight: '100vh',
                transition: 'all 0.8s ease-in-out'
            }}>
                <WeatherCard
                    currentWeather={currentWeather}
                    forecast={forecast}
                    location={location}
                    onLocationChange={handleLocationChange}
                />
            </div>
            <Footer />
        </div>
    );
};

export default WeatherPage;