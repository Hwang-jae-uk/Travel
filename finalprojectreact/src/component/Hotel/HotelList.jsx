import { useEffect, useState } from "react"
import HotelCard from "./HotelCard";
import axios from "axios";
import { provinces, parseAddress } from './addressUtils';
import { MdLocalHotel } from "react-icons/md";
import { FaMapMarkerAlt, FaCity } from "react-icons/fa";
import { GrPowerReset } from "react-icons/gr";

const HotelList = () => {
    const [hotels, setHotels] = useState([]);
    const [filteredHotels, setFilteredHotels] = useState([]);
    const [isDataLoaded, setIsDataLoaded] = useState(false);
    const [searchFilters, setSearchFilters] = useState({
        name: '',
        province: '',
        city: ''
    });

    const hotelList = async() => {
        try {
            const response = await axios.get('/api/hotel/list');
            
            console.log('API Response:', response.data);
            
            // 응답 데이터가 배열인지 확인
            if (Array.isArray(response.data)) {
                return response.data;
            } else {
                console.error('API response is not an array:', response.data);
                return [];
            }
        } catch (error) {
            console.error('Error fetching hotels:', error);
            return [];
        }
    }

    // 검색 필터링 함수
    const filterHotels = () => {
        // hotels가 배열인지 확인
        if (!Array.isArray(hotels)) {
            setFilteredHotels([]);
            return;
        }
        
        let filtered = hotels;

        // 이름으로 필터링
        if (searchFilters.name.trim()) {
            filtered = filtered.filter(hotel => 
                hotel.name.toLowerCase().includes(searchFilters.name.toLowerCase())
            );
        }

        // 도/특별시/광역시로 필터링
        if (searchFilters.province) {
            filtered = filtered.filter(hotel => {
                const { province } = parseAddress(hotel.address);
                return province.includes(searchFilters.province) || 
                       searchFilters.province.includes(province.replace(/특별시|광역시|특별자치시|특별자치도|도$/g, ''));
            });
        }

        // 시/구로 필터링
        if (searchFilters.city.trim()) {
            filtered = filtered.filter(hotel => {
                const { city } = parseAddress(hotel.address);
                return city.toLowerCase().includes(searchFilters.city.toLowerCase());
            });
        }

        setFilteredHotels(filtered);
    };

    // 검색 필터 변경 핸들러
    const handleFilterChange = (filterType, value) => {
        setSearchFilters(prev => ({
            ...prev,
            [filterType]: value
        }));
    };

    // 검색 초기화
    const resetFilters = () => {
        setSearchFilters({
            name: '',
            province: '',
            city: ''
        });
    };

    useEffect(() => {
        console.log('HotelList useEffect: 호텔 데이터 가져오기 시작');
        hotelList()
        .then((result) => {
            console.log('hotelList API 호출 성공, result:', result);
            // 결과가 배열인지 확인하고, 배열이 아니면 빈 배열로 설정
            const safeResult = Array.isArray(result) ? result : [];
            
            if (!safeResult || safeResult.length <= 0) {
                console.log('호텔 데이터가 없습니다. 빈 배열로 설정');
                setHotels([]);
                setFilteredHotels([]);
                setIsDataLoaded(true);
                return;
            }

            console.log('처리된 호텔 데이터:', safeResult);
            console.log('호텔 개수:', safeResult.length);
            setHotels(safeResult);
            setFilteredHotels(safeResult);
            setIsDataLoaded(true);
        })
        .catch(error => {
            console.error('호텔 데이터 가져오기 실패:', error);
            // 에러가 발생했을 때도 빈 배열로 설정
            setHotels([]);
            setFilteredHotels([]);
            setIsDataLoaded(true);
        });
    }, []);

    // 검색 필터가 변경될 때마다 필터링 실행
    useEffect(() => {
        if (hotels.length > 0) {
            filterHotels();
        }
    }, [searchFilters, hotels]);

    console.log('HotelList render - isDataLoaded:', isDataLoaded, 'hotels:', hotels, 'filteredHotels:', filteredHotels);

    if (!isDataLoaded) {
        return <div className="loading">호텔 목록을 불러오는 중...</div>;
    }

    if (hotels.length === 0) {
        return (
            <div className="no-hotels-message">
                <h2>🏨 등록된 호텔이 없습니다</h2>
                <p>첫 번째 호텔을 등록해보세요!</p>
            </div>
        );
    }

    return (
        <div className="hotel-list-container">
            {/* 검색 필터 섹션 */}
            <div className="search-filters">
                <div className="search-row">
                    <div className="search-field">
                        <label htmlFor="name-search" className="search-label">
                            <MdLocalHotel size={20} />
                            <span>호텔명</span>
                        </label>
                        <input
                            id="name-search"
                            type="text"
                            placeholder="호텔명을 입력하세요"
                            value={searchFilters.name}
                            onChange={(e) => handleFilterChange('name', e.target.value)}
                            className="search-input"
                        />
                    </div>
                    
                    <div className="search-field">
                        <label htmlFor="province-search" className="search-label">
                            <FaMapMarkerAlt size={18} />
                            <span>도/특별시/광역시</span>
                        </label>
                        <select
                            id="province-search"
                            value={searchFilters.province}
                            onChange={(e) => handleFilterChange('province', e.target.value)}
                            className="search-select"
                        >
                            <option value="">전체</option>
                            {provinces.map(province => (
                                <option key={province} value={province}>{province}</option>
                            ))}
                        </select>
                    </div>
                    
                    <div className="search-field">
                        <label htmlFor="city-search" className="search-label">
                            <FaCity size={18} />
                            <span>시/구</span>
                        </label>
                        <input
                            id="city-search"
                            type="text"
                            placeholder="시/구를 입력하세요"
                            value={searchFilters.city}
                            onChange={(e) => handleFilterChange('city', e.target.value)}
                            className="search-input"
                        />
                    </div>
                    
                    <div className="search-actions">
                        <button 
                            className="filter-reset-button"
                            title="검색 초기화"
                            onClick={() => {
                                setSearchFilters({
                                    name: '',
                                    province: '',
                                    city: ''
                                });
                            }}
                        >
                            <GrPowerReset size={18} /> 초기화
                        </button>
                    </div>
                </div>
                
                {/* 검색 결과 정보 */}
                <div className="search-results-info">
                    <span className="results-count">
                        총 {Array.isArray(filteredHotels) ? filteredHotels.length : 0}개의 호텔이 검색되었습니다
                    </span>
                    {(searchFilters.name || searchFilters.province || searchFilters.city) && (
                        <span className="active-filters">
                            {searchFilters.name && <span className="filter-tag">이름: {searchFilters.name}</span>}
                            {searchFilters.province && <span className="filter-tag">지역: {searchFilters.province}</span>}
                            {searchFilters.city && <span className="filter-tag">시/구: {searchFilters.city}</span>}
                        </span>
                    )}
                </div>
            </div>

            {/* 호텔 목록 */}
            {!Array.isArray(filteredHotels) || filteredHotels.length === 0 ? (
                <div className="no-results-message">
                    <h3>🔍 검색 결과가 없습니다</h3>
                    <p>다른 검색 조건을 시도해보세요</p>
                    <button onClick={resetFilters} className="reset-search-button">
                        검색 조건 초기화
                    </button>
                </div>
            ) : (
                <div className="hotel-grid">
                    {filteredHotels.map((hotel) => (
                        <HotelCard key={hotel.id} hotel={hotel} />
                    ))}
                </div>
            )}
        </div>
    );
}

export default HotelList;