import { useEffect, useState } from "react";
import CafeCard from "./CafeCard";
import axios from "axios";
import { provinces, parseAddress } from '../Hotel/addressUtils';
import './Cafe.css';
<<<<<<< HEAD
=======
import { IoLocationSharp } from "react-icons/io5";
import { BiCoffee } from "react-icons/bi";
import { FaCity } from "react-icons/fa";
import { IoWifi } from "react-icons/io5";
import { MdLocalParking } from "react-icons/md";
import { GrPowerReset } from "react-icons/gr";
>>>>>>> 902477c (initial commit)

const CafeList = () => {
    const [cafes, setCafes] = useState([]);
    const [filteredCafes, setFilteredCafes] = useState([]);
    const [isDataLoaded, setIsDataLoaded] = useState(false);
    const [searchFilters, setSearchFilters] = useState({
        name: '',
        province: '',
        city: '',
        wifi: false,
        parking: false
    });

    const cafeList = async() => {
        try {
            const response = await axios.get('/api/cafe/list');
            console.log('Received cafe data:', response.data);
<<<<<<< HEAD
=======
            
>>>>>>> 902477c (initial commit)
            return response.data;
        } catch (error) {
            console.error('Error fetching cafes:', error);
            return [];
        }
    }

    // 검색 필터링 함수
    const filterCafes = () => {
        let filtered = cafes;

        // 이름으로 필터링
        if (searchFilters.name.trim()) {
            filtered = filtered.filter(cafe => 
                cafe.name.toLowerCase().includes(searchFilters.name.toLowerCase())
            );
        }

        // 도/특별시/광역시로 필터링
        if (searchFilters.province) {
            filtered = filtered.filter(cafe => {
                const { province } = parseAddress(cafe.address);
                return province.includes(searchFilters.province) || 
                       searchFilters.province.includes(province.replace(/특별시|광역시|특별자치시|특별자치도|도$/g, ''));
            });
        }

        // 시/구로 필터링
        if (searchFilters.city.trim()) {
            filtered = filtered.filter(cafe => {
                const { city } = parseAddress(cafe.address);
                return city.toLowerCase().includes(searchFilters.city.toLowerCase());
            });
        }

        // Wi-Fi 필터링
        if (searchFilters.wifi) {
            filtered = filtered.filter(cafe => cafe.wifi === true);
        }

        // 주차 필터링
        if (searchFilters.parking) {
            filtered = filtered.filter(cafe => cafe.parking === true);
        }

        setFilteredCafes(filtered);
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
            city: '',
            wifi: false,
            parking: false
        });
    };

    useEffect(() => {
        cafeList()
        .then((result) => {
            if (!result || result.length <= 0) {
                setIsDataLoaded(true);
                return;
            }

            console.log('Processed cafe data:', result);
            setCafes(result);
            setFilteredCafes(result);
            setIsDataLoaded(true);
        })
        .catch(error => {
            console.error('Error in useEffect:', error);
            setIsDataLoaded(true);
        });
    }, []);

    // 검색 필터가 변경될 때마다 필터링 실행
    useEffect(() => {
        if (cafes.length > 0) {
            filterCafes();
        }
    }, [searchFilters, cafes]);

    if (!isDataLoaded) {
        return <div className="loading">카페 목록을 불러오는 중...</div>;
    }

    if (cafes.length === 0) {
        return (
            <div className="no-cafes-message">
<<<<<<< HEAD
                <h2>☕ 등록된 카페가 없습니다</h2>
=======
                <h2><BiCoffee size={20} /> 등록된 카페가 없습니다</h2>
>>>>>>> 902477c (initial commit)
                <p>첫 번째 카페를 등록해보세요!</p>
            </div>
        );
    }

    return (
        <div className="cafe-list-container">
            {/* 검색 필터 섹션 */}
<<<<<<< HEAD
            <div className="search-filters">
                <div className="search-row">
                    <div className="search-field">
                        <label htmlFor="name-search">☕ 카페명</label>
=======
            <div className="cafe-search-filters">
                <div className="cafe-search-row">
                    <div className="cafe-search-field">
                        <label htmlFor="name-search"><BiCoffee size={18} /> 카페명</label>
>>>>>>> 902477c (initial commit)
                        <input
                            id="name-search"
                            type="text"
                            placeholder="카페명을 입력하세요"
                            value={searchFilters.name}
                            onChange={(e) => handleFilterChange('name', e.target.value)}
<<<<<<< HEAD
                            className="search-input"
                        />
                    </div>
                    
                    <div className="search-field">
                        <label htmlFor="province-search">📍 도/특별시/광역시</label>
=======
                            className="cafe-search-input"
                        />
                    </div>
                    
                    <div className="cafe-search-field">
                        <label htmlFor="province-search">
                            <IoLocationSharp size={18} /> 도/특별시/광역시
                        </label>
>>>>>>> 902477c (initial commit)
                        <select
                            id="province-search"
                            value={searchFilters.province}
                            onChange={(e) => handleFilterChange('province', e.target.value)}
<<<<<<< HEAD
                            className="search-select"
=======
                            className="cafe-search-select"
>>>>>>> 902477c (initial commit)
                        >
                            <option value="">전체</option>
                            {provinces.map(province => (
                                <option key={province} value={province}>{province}</option>
                            ))}
                        </select>
                    </div>
                    
<<<<<<< HEAD
                    <div className="search-field">
                        <label htmlFor="city-search">🏘️ 시/구</label>
=======
                    <div className="cafe-search-field">
                        <label htmlFor="city-search"><FaCity size={18} /> 시/구</label>
>>>>>>> 902477c (initial commit)
                        <input
                            id="city-search"
                            type="text"
                            placeholder="시/구를 입력하세요"
                            value={searchFilters.city}
                            onChange={(e) => handleFilterChange('city', e.target.value)}
<<<<<<< HEAD
                            className="search-input"
                        />
                    </div>
                    
                    <div className="search-field">
=======
                            className="cafe-search-input"
                        />
                    </div>
                    
                    <div className="cafe-search-field">
>>>>>>> 902477c (initial commit)
                        <label>필터 옵션</label>
                        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                            <label style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                                <input
                                    type="checkbox"
                                    checked={searchFilters.wifi}
                                    onChange={(e) => handleFilterChange('wifi', e.target.checked)}
                                />
<<<<<<< HEAD
                                📶 Wi-Fi
=======
                                <IoWifi size={18} /> Wi-Fi
>>>>>>> 902477c (initial commit)
                            </label>
                            <label style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                                <input
                                    type="checkbox"
                                    checked={searchFilters.parking}
                                    onChange={(e) => handleFilterChange('parking', e.target.checked)}
                                />
<<<<<<< HEAD
                                🅿️ 주차
=======
                                <MdLocalParking size={18} /> 주차
>>>>>>> 902477c (initial commit)
                            </label>
                        </div>
                    </div>
                    
<<<<<<< HEAD
                    <div className="search-actions">
                        <button 
                            onClick={resetFilters}
                            className="reset-button"
                            title="검색 초기화"
                        >
                            🔄 초기화
=======
                    <div className="cafe-search-actions">
                        <button 
                            onClick={resetFilters}
                            className="cafe-reset-button"
                            title="검색 초기화"
                        >
                            <GrPowerReset size={18} /> 초기화
>>>>>>> 902477c (initial commit)
                        </button>
                    </div>
                </div>
                
                {/* 검색 결과 정보 */}
                <div className="search-results-info">
                    <span className="results-count">
                        총 {filteredCafes.length}개의 카페가 검색되었습니다
                    </span>
                    {(searchFilters.name || searchFilters.province || searchFilters.city || searchFilters.wifi || searchFilters.parking) && (
                        <span className="active-filters">
                            {searchFilters.name && <span className="filter-tag">이름: {searchFilters.name}</span>}
                            {searchFilters.province && <span className="filter-tag">지역: {searchFilters.province}</span>}
                            {searchFilters.city && <span className="filter-tag">시/구: {searchFilters.city}</span>}
                            {searchFilters.wifi && <span className="filter-tag">Wi-Fi</span>}
                            {searchFilters.parking && <span className="filter-tag">주차</span>}
                        </span>
                    )}
                </div>
            </div>

            {/* 카페 목록 */}
            {filteredCafes.length === 0 ? (
                <div className="no-results-message">
                    <h3>🔍 검색 결과가 없습니다</h3>
                    <p>다른 검색 조건을 시도해보세요</p>
                    <button onClick={resetFilters} className="reset-search-button">
                        검색 조건 초기화
                    </button>
                </div>
            ) : (
                <div className="cafe-grid">
                    {filteredCafes.map((cafe) => (
                        <CafeCard key={cafe.id} cafe={cafe} />
                    ))}
                </div>
            )}
        </div>
    );
};

export default CafeList; 