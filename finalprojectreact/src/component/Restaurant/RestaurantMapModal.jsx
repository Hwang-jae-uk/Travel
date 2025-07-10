import React, { useEffect, useRef, useState } from 'react';
import './RestaurantMapModal.css';

// 지오코딩 캐시
const geocodeCache = new Map();

// 네이버 지도 스크립트 로딩
async function loadNaverMapsScript() {
    if (window.naver && window.naver.maps) {
        return Promise.resolve();
    }

    return new Promise((resolve, reject) => {
        const naverApiKey = '8qlcy6vvqt'; // 네이버 지도 API 키
        const script = document.createElement('script');
        script.src = `https://oapi.map.naver.com/openapi/v3/maps.js?ncpKeyId=${naverApiKey}`;
        
        script.onload = () => {
            console.log('네이버 지도 API 로드 완료');
            resolve();
        };
        
        script.onerror = (error) => {
            console.error('네이버 지도 API 로딩 실패:', error);
            reject(new Error('네이버 지도 API 로딩 실패'));
        };
        
        // 타임아웃 추가 (15초)
        setTimeout(() => {
            reject(new Error('네이버 지도 API 로딩 타임아웃'));
        }, 15000);
        
        document.head.appendChild(script);
    });
}

// 🟡 카카오 지오코딩 API 전용 (한국 주소 특화)
async function geocodeAddress(address) {
    console.log('🚀 레스토랑 지오코딩 시작:', address);
    
    // 캐시 확인
    if (geocodeCache.has(address)) {
        const cachedCoords = geocodeCache.get(address);
        // 서울시청 좌표인 경우 캐시 삭제하고 재검색
        if (cachedCoords.lat === 37.5666805 && cachedCoords.lng === 126.9784147) {
            console.log('🧹 기본값 캐시 삭제 후 재검색:', address);
            geocodeCache.delete(address);
        } else {
            console.log('📦 캐시에서 좌표 반환:', address, cachedCoords);
            return cachedCoords;
        }
    }

    // 🟡 카카오 지오코딩 API (주소 검색)
    try {
        console.log('🟡 카카오 주소 검색 API 시도:', address);
        
        // 테스트용 API 키 (실제 사용 시 본인의 카카오 REST API 키로 교체 필요)
        const kakaoApiKey = 'b8ad04db0a9b3be32e8b96c4e6e1e849'; // 테스트용
        const addressUrl = `https://dapi.kakao.com/v2/local/search/address.json?query=${encodeURIComponent(address)}`;
        
        const response = await fetch(addressUrl, {
            headers: {
                'Authorization': `KakaoAK ${kakaoApiKey}`
            }
        });

        if (response.ok) {
            const data = await response.json();
            console.log('📍 카카오 주소 검색 응답:', data);
            
            if (data.documents && data.documents.length > 0) {
                const doc = data.documents[0];
                const result = {
                    lat: parseFloat(doc.y),
                    lng: parseFloat(doc.x)
                };
                
                if (!isNaN(result.lat) && !isNaN(result.lng)) {
                    console.log('🎯 카카오 주소 검색 성공:', result, '주소:', doc.address_name);
                    geocodeCache.set(address, result);
                    return result;
                }
            }
        } else {
            console.warn('❌ 카카오 주소 검색 응답 오류:', response.status, await response.text());
        }
    } catch (error) {
        console.warn('❌ 카카오 주소 검색 오류:', error);
    }

    // 🔍 카카오 키워드 검색 (주소 검색 실패 시)
    try {
        console.log('🔍 카카오 키워드 검색 시도:', address);
        
        const kakaoApiKey = 'b08890665fa978d03623c9c0a9995f83'; // 테스트용
        const keywordUrl = `https://dapi.kakao.com/v2/local/search/keyword.json?query=${encodeURIComponent(address)}`;
        
        const response = await fetch(keywordUrl, {
            headers: {
                'Authorization': `KakaoAK ${kakaoApiKey}`
            }
        });

        if (response.ok) {
            const data = await response.json();
            console.log('🔍 카카오 키워드 검색 응답:', data);
            
            if (data.documents && data.documents.length > 0) {
                const doc = data.documents[0];
                const result = {
                    lat: parseFloat(doc.y),
                    lng: parseFloat(doc.x)
                };
                
                if (!isNaN(result.lat) && !isNaN(result.lng)) {
                    console.log('🎯 카카오 키워드 검색 성공:', result, '장소:', doc.place_name);
                    geocodeCache.set(address, result);
                    return result;
                }
            }
        } else {
            console.warn('❌ 카카오 키워드 검색 응답 오류:', response.status, await response.text());
        }
    } catch (error) {
        console.warn('❌ 카카오 키워드 검색 오류:', error);
    }

    // 🎯 한국 주요 지역 스마트 매핑 (카카오 API 실패 시)
    const koreanLocationDB = {
        // 부산 세부 지역 - 더 많은 지역 추가
        '부산광역시 중구 국제시장길': { lat: 35.0988, lng: 129.0306 },
        '부산광역시 중구': { lat: 35.1032, lng: 129.0319 },
        '국제시장길': { lat: 35.0988, lng: 129.0306 },
        '부산진구': { lat: 35.1637, lng: 129.0537 },
        '중앙대로691번가길': { lat: 35.1540, lng: 129.0593 },
        '부전동': { lat: 35.1565, lng: 129.0593 },
        '서면': { lat: 35.1580, lng: 129.0593 },
        '해운대구': { lat: 35.1588, lng: 129.1603 },
        '해운대해변로': { lat: 35.1588, lng: 129.1603 },
        '광안리': { lat: 35.1533, lng: 129.1186 },
        '남구': { lat: 35.1362, lng: 129.0844 },
        '동래구': { lat: 35.2041, lng: 129.0783 },
        '사하구': { lat: 35.1042, lng: 128.9740 },
        '북구': { lat: 35.1951, lng: 128.9897 },
        '강서구': { lat: 35.2123, lng: 128.9819 },
        '연제구': { lat: 35.1764, lng: 129.0825 },
        '수영구': { lat: 35.1455, lng: 129.1134 },
        '금정구': { lat: 35.2425, lng: 129.0920 },
        '기장군': { lat: 35.2440, lng: 129.2204 },
        '사상구': { lat: 35.1520, lng: 128.9910 },
        '영도구': { lat: 35.0913, lng: 129.0679 },
        
        // 서울 세부 지역 - 더 많은 지역 추가
        '강남구': { lat: 37.5172, lng: 127.0473 },
        '테헤란로': { lat: 37.5009, lng: 127.0374 },
        '역삼동': { lat: 37.5000, lng: 127.0374 },
        '삼성동': { lat: 37.5145, lng: 127.0559 },
        '명동': { lat: 37.5636, lng: 126.9834 },
        '홍대': { lat: 37.5563, lng: 126.9234 },
        '이태원': { lat: 37.5346, lng: 126.9946 },
        '종로구': { lat: 37.5735, lng: 126.9788 },
        '중구': { lat: 37.5640, lng: 126.9978 },
        '용산구': { lat: 37.5386, lng: 126.9650 },
        '성동구': { lat: 37.5507, lng: 127.0408 },
        '광진구': { lat: 37.5481, lng: 127.0857 },
        '동대문구': { lat: 37.5838, lng: 127.0507 },
        '중랑구': { lat: 37.6063, lng: 127.0925 },
        '성북구': { lat: 37.6066, lng: 127.0186 },
        '강북구': { lat: 37.6469, lng: 127.0147 },
        '도봉구': { lat: 37.6690, lng: 127.0318 },
        '노원구': { lat: 37.6550, lng: 127.0763 },
        '은평구': { lat: 37.6176, lng: 126.9227 },
        '서대문구': { lat: 37.5791, lng: 126.9368 },
        '마포구': { lat: 37.5637, lng: 126.9084 },
        '양천구': { lat: 37.5170, lng: 126.8664 },
        '강서구': { lat: 37.5509, lng: 126.8495 },
        '구로구': { lat: 37.4954, lng: 126.8876 },
        '금천구': { lat: 37.4606, lng: 126.9006 },
        '영등포구': { lat: 37.5264, lng: 126.8962 },
        '동작구': { lat: 37.5124, lng: 126.9393 },
        '관악구': { lat: 37.4784, lng: 126.9516 },
        '서초구': { lat: 37.4837, lng: 127.0324 },
        '송파구': { lat: 37.5145, lng: 127.1061 },
        '강동구': { lat: 37.5301, lng: 127.1238 },
        
        // 광역시/도
        '부산광역시': { lat: 35.1796, lng: 129.0756 },
        '부산': { lat: 35.1796, lng: 129.0756 },
        '서울특별시': { lat: 37.5666805, lng: 126.9784147 },
        '서울': { lat: 37.5666805, lng: 126.9784147 },
        '대구광역시': { lat: 35.8714, lng: 128.6014 },
        '대구': { lat: 35.8714, lng: 128.6014 },
        '인천광역시': { lat: 37.4563, lng: 126.7052 },
        '인천': { lat: 37.4563, lng: 126.7052 },
        '광주광역시': { lat: 35.1595, lng: 126.8526 },
        '광주': { lat: 35.1595, lng: 126.8526 },
        '대전광역시': { lat: 36.3504, lng: 127.3845 },
        '대전': { lat: 36.3504, lng: 127.3845 },
        '울산광역시': { lat: 35.5384, lng: 129.3114 },
        '울산': { lat: 35.5384, lng: 129.3114 },
        '제주특별자치도': { lat: 33.4996, lng: 126.5312 },
        '제주': { lat: 33.4996, lng: 126.5312 },
        '경기도': { lat: 37.4138, lng: 127.5183 },
        '강원도': { lat: 37.8228, lng: 128.1555 },
        '충청북도': { lat: 36.6357, lng: 127.4917 },
        '충청남도': { lat: 36.5184, lng: 126.8000 },
        '전라북도': { lat: 35.7175, lng: 127.1530 },
        '전라남도': { lat: 34.8679, lng: 126.9910 },
        '경상북도': { lat: 36.4919, lng: 128.8889 },
        '경상남도': { lat: 35.4606, lng: 128.2132 }
    };

    // 가장 긴 키워드 매칭 (더 정확한 위치 우선)
    let bestMatch = null;
    let bestScore = 0;

    console.log('🔍 레스토랑 지역 매칭 시작:', address);
    
    for (const [keyword, coords] of Object.entries(koreanLocationDB)) {
        if (address.includes(keyword)) {
            const score = keyword.length;
            console.log(`📍 매칭 후보: "${keyword}" (점수: ${score})`);
            if (score > bestScore) {
                bestMatch = coords;
                bestScore = score;
                console.log(`🎯 최고 매칭 업데이트: "${keyword}" → ${coords.lat}, ${coords.lng}`);
            }
        }
    }

    if (bestMatch) {
        console.log('✅ 레스토랑 지역 매핑 성공:', bestMatch, '점수:', bestScore);
        geocodeCache.set(address, bestMatch);
        return bestMatch;
    } else {
        console.log('❌ 지역 매칭 실패. 사용 가능한 키워드:', Object.keys(koreanLocationDB));
    }

    // 최후 기본값
    console.log('❌ 모든 지오코딩 실패, 서울시청 사용');
    const defaultCoords = { lat: 37.5666805, lng: 126.9784147 };
    geocodeCache.set(address, defaultCoords);
    return defaultCoords;
}

const RestaurantMapModal = ({ isOpen, onClose, address, restaurantName }) => {
    const mapRef = useRef(null);
    const [map, setMap] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!isOpen || !address) return;

        let isMounted = true;

        const initMap = async () => {
            try {
                setIsLoading(true);
                setError(null);

                // 네이버 지도 스크립트 로딩과 지오코딩을 병렬 처리
                const [_, coordinates] = await Promise.all([
                    loadNaverMapsScript(),
                    geocodeAddress(address)
                ]);

                if (!isMounted) return;

                if (coordinates && 
                    coordinates.lat && 
                    coordinates.lng && 
                    !isNaN(coordinates.lat) && 
                    !isNaN(coordinates.lng) &&
                    window.naver && 
                    window.naver.maps && 
                    mapRef.current) {
                    
                    // 지도 컨테이너 초기화
                    mapRef.current.innerHTML = '';

                    // 네이버 지도 생성
                    const mapOptions = {
                        center: new window.naver.maps.LatLng(coordinates.lat, coordinates.lng),
                        zoom: 17,
                        mapTypeControl: false,
                        scaleControl: false,
                        logoControl: false,
                        mapDataControl: false,
                        zoomControl: true,
                        zoomControlOptions: {
                            position: window.naver.maps.Position.TOP_RIGHT,
                            style: window.naver.maps.ZoomControlStyle.SMALL
                        }
                    };

                    const naverMap = new window.naver.maps.Map(mapRef.current, mapOptions);

                    // 마커 생성 (레스토랑 테마 - 간단한 핀)
                    const marker = new window.naver.maps.Marker({
                        position: new window.naver.maps.LatLng(coordinates.lat, coordinates.lng),
                        map: naverMap,
                        title: restaurantName || '레스토랑',
                        icon: {
                            content: `<div style="
                                width: 24px;
                                height: 24px;
                                background: #FF4500;
                                border: 3px solid white;
                                border-radius: 50%;
                                box-shadow: 0 2px 8px rgba(255, 69, 0, 0.4);
                                position: relative;
                                cursor: pointer;
                            ">
                                <div style="
                                    position: absolute;
                                    bottom: -8px;
                                    left: 50%;
                                    transform: translateX(-50%);
                                    width: 0;
                                    height: 0;
                                    border-left: 8px solid transparent;
                                    border-right: 8px solid transparent;
                                    border-top: 8px solid #FF4500;
                                "></div>
                            </div>`
                        }
                    });

                    // 정보창 생성
                    const infoWindow = new window.naver.maps.InfoWindow({
                        content: `
                            <div style="
                                padding: 10px;
                                background: white;
                                border-radius: 8px;
                                box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
                                font-family: 'Noto Sans KR', sans-serif;
                                max-width: 250px;
                            ">
                                <h3 style="
                                    margin: 0 0 5px 0;
                                    font-size: 16px;
                                    color: #333;
                                ">${restaurantName || '레스토랑'}</h3>
                                <p style="
                                    margin: 0;
                                    font-size: 14px;
                                    color: #666;
                                ">${address}</p>
                            </div>
                        `,
                        borderWidth: 0,
                        disableAnchor: true,
                        backgroundColor: 'transparent'
                    });

                    // 마커 클릭 이벤트
                    window.naver.maps.Event.addListener(marker, 'click', () => {
                        if (infoWindow.getMap()) {
                            infoWindow.close();
                        } else {
                            infoWindow.open(naverMap, marker);
                        }
                    });

                    setMap(naverMap);
                    setIsLoading(false);
                }
            } catch (error) {
                console.error('지도 초기화 오류:', error);
                if (isMounted) {
                    setError(error.message);
                    setIsLoading(false);
                }
            }
        };

        initMap();

        return () => {
            isMounted = false;
            if (map) {
                map.destroy();
                setMap(null);
            }
        };
    }, [isOpen, address, restaurantName]);

    if (!isOpen) return null;

    return (
        <div className="restaurant-map-modal-overlay" onClick={onClose}>
            <div className="restaurant-map-modal-content" onClick={e => e.stopPropagation()}>
                <div className="restaurant-map-modal-header">
                    <h3>{restaurantName} 위치</h3>
                    <button className="restaurant-map-close-btn" onClick={onClose}>×</button>
                </div>
                <div className="restaurant-map-modal-body">
                    <div className="address-info">
                        <p>
                            <strong>주소</strong>
                            <span className="address-text">{address}</span>
                        </p>
                    </div>
                    <div className="map-container">
                        {isLoading && (
                            <div className="map-loading">
                                <div className="loading-spinner"></div>
                                <p>지도 로딩 중...</p>
                            </div>
                        )}
                        {error && (
                            <div className="map-error">
                                <p>❌ {error}</p>
                            </div>
                        )}
                        <div 
                            ref={mapRef} 
                            className="restaurant-map" 
                            style={{ 
                                width: '100%', 
                                height: '400px',
                                display: isLoading || error ? 'none' : 'block'
                            }}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RestaurantMapModal; 