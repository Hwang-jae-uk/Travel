import React, { useState, useEffect } from 'react';
import axios from 'axios';
import CafeCardAdmin from './CafeCardAdmin';
import './Cafe.css';
import { provinces, parseAddress } from '../Hotel/addressUtils';
import { IoLocationSharp } from "react-icons/io5";

const CafeListAdmin = () => {
    const [cafes, setCafes] = useState([]);
    const [filteredCafes, setFilteredCafes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchFilters, setSearchFilters] = useState({
        name: '',
        province: '',
        city: '',
        wifi: false,
        parking: false
    });

    useEffect(() => {
        fetchCafes();
    }, []);

    useEffect(() => {
        if (cafes.length > 0) {
            filterCafes();
        }
    }, [searchFilters, cafes]);

    const fetchCafes = async () => {
        try {
            setLoading(true);
            const response = await axios.get('/api/cafe/list');
            setCafes(response.data);
            setFilteredCafes(response.data);
        } catch (error) {
            console.error('카페 목록을 불러오는데 실패했습니다:', error);
        } finally {
            setLoading(false);
        }
    };

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

    const handleDelete = (deletedCafeId) => {
        setCafes(prev => prev.filter(cafe => cafe.id !== deletedCafeId));
    };

    if (loading) {
        return <div className="loading">카페 목록을 불러오는 중...</div>;
    }

    return (
        <div className="cafe-list-admin">
            {/* 검색 필터 섹션 */}
            <div className="search-filters">
                <div className="search-row">
                    <div className="search-field">
                        <label htmlFor="name-search">☕ 카페명</label>
                        <input
                            id="name-search"
                            type="text"
                            placeholder="카페명을 입력하세요"
                            value={searchFilters.name}
                            onChange={(e) => handleFilterChange('name', e.target.value)}
                            className="search-input"
                        />
                    </div>
                    
                    <div className="search-group">
                        <label htmlFor="province-search">
                            <IoLocationSharp size={18} /> 도/특별시/광역시
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
                    
                    <div className="search-field">
                        <label>필터 옵션</label>
                        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                            <label style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                                <input
                                    type="checkbox"
                                    checked={searchFilters.wifi}
                                    onChange={(e) => handleFilterChange('wifi', e.target.checked)}
                                />
                                📶 Wi-Fi
                            </label>
                            <label style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                                <input
                                    type="checkbox"
                                    checked={searchFilters.parking}
                                    onChange={(e) => handleFilterChange('parking', e.target.checked)}
                                />
                                🅿️ 주차
                            </label>
                        </div>
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
            </div>

            {/* 검색 결과 정보 */}
            <div className="search-results-info">
                <p>총 {filteredCafes.length}개의 카페가 있습니다.</p>
            </div>

            {/* 카페 목록 */}
            <div className="cafe-grid-admin">
                {filteredCafes.length === 0 ? (
                    <div className="no-results">
                        <p>검색 조건에 맞는 카페가 없습니다.</p>
                    </div>
                ) : (
                    filteredCafes.map(cafe => (
                        <CafeCardAdmin 
                            key={cafe.id} 
                            cafe={cafe} 
                            onDelete={handleDelete}
                        />
                    ))
                )}
            </div>
        </div>
    );
};

export default CafeListAdmin; 