import { useEffect, useState } from "react"
import HotelCardAdmin from "./HotelCardAdmin";
import axios from "axios";
import { provinces, parseAddress } from './addressUtils';

const HotelListAdmin = () => {
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
            console.log('Received data:', response.data);
            return response.data;
        } catch (error) {
            console.error('Error fetching hotels:', error);
            return [];
        }
    }

    // 검색 필터링 함수
    const filterHotels = () => {
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

    // 호텔 삭제 후 목록 업데이트
    const handleHotelDeleted = (deletedHotelId) => {
        setHotels(prevHotels => prevHotels.filter(hotel => hotel.id !== deletedHotelId));
        setFilteredHotels(prevFiltered => prevFiltered.filter(hotel => hotel.id !== deletedHotelId));
    };

    useEffect(() => {
        hotelList()
        .then((result) => {
            if (!result || result.length <= 0) {
                setIsDataLoaded(true);
                return;
            }

            console.log('Processed data:', result);
            setHotels(result);
            setFilteredHotels(result);
            setIsDataLoaded(true);
        })
        .catch(error => {
            console.error('Error in useEffect:', error);
            setIsDataLoaded(true);
        });
    }, []);

    // 검색 필터가 변경될 때마다 필터링 실행
    useEffect(() => {
        if (hotels.length > 0) {
            filterHotels();
        }
    }, [searchFilters, hotels]);

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
                        <label htmlFor="name-search">🏨 호텔명</label>
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
                        <label htmlFor="province-search">📍 도/특별시/광역시</label>
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
                        <label htmlFor="city-search">🏘️ 시/구</label>
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
                            onClick={resetFilters}
                            className="reset-button"
                            title="검색 초기화"
                        >
                            🔄 초기화
                        </button>
                    </div>
                </div>
                
                {/* 검색 결과 정보 */}
                <div className="search-results-info">
                    <span className="results-count">
                        총 {filteredHotels.length}개의 호텔이 검색되었습니다
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
            {filteredHotels.length === 0 ? (
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
                        <HotelCardAdmin 
                            key={hotel.id} 
                            hotel={hotel} 
                            onHotelDeleted={handleHotelDeleted}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}

export default HotelListAdmin; 