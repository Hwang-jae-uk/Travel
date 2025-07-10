import React, { useState, useEffect } from 'react';
import axios from 'axios';
import RestaurantCardAdmin from './RestaurantCardAdmin';
import { provinces, parseAddress } from '../Hotel/addressUtils';
import './Restaurant.css';

const RestaurantListAdmin = () => {
    const [restaurants, setRestaurants] = useState([]);
    const [filteredRestaurants, setFilteredRestaurants] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchFilters, setSearchFilters] = useState({
        name: '',
        province: '',
        city: '',
        cuisine: '',
        hasParking: false,
        hasReservation: false,
        hasDelivery: false
    });

    const cuisineTypes = ['한식', '중식', '일식', '양식', '이탈리안', '프렌치', '멕시칸', '인도', '태국', '베트남', '기타'];

    useEffect(() => {
        fetchRestaurants();
    }, []);

    useEffect(() => {
        if (restaurants.length > 0) {
            filterRestaurants();
        }
    }, [searchFilters, restaurants]);

    const fetchRestaurants = async () => {
        try {
            setLoading(true);
            const response = await axios.get('/api/restaurants');
            setRestaurants(response.data);
            setFilteredRestaurants(response.data);
        } catch (error) {
            console.error('레스토랑 목록을 불러오는데 실패했습니다:', error);
        } finally {
            setLoading(false);
        }
    };

    const filterRestaurants = () => {
        let filtered = restaurants;

        // 이름으로 필터링
        if (searchFilters.name.trim()) {
            filtered = filtered.filter(restaurant => 
                restaurant.name.toLowerCase().includes(searchFilters.name.toLowerCase())
            );
        }

        // 도/특별시/광역시로 필터링
        if (searchFilters.province) {
            filtered = filtered.filter(restaurant => {
                const { province } = parseAddress(restaurant.address);
                return province.includes(searchFilters.province) || 
                       searchFilters.province.includes(province.replace(/특별시|광역시|특별자치시|특별자치도|도$/g, ''));
            });
        }

        // 시/구로 필터링
        if (searchFilters.city.trim()) {
            filtered = filtered.filter(restaurant => {
                const { city } = parseAddress(restaurant.address);
                return city.toLowerCase().includes(searchFilters.city.toLowerCase());
            });
        }

        // 음식 종류로 필터링
        if (searchFilters.cuisine) {
            filtered = filtered.filter(restaurant => 
                restaurant.cuisine && restaurant.cuisine.includes(searchFilters.cuisine)
            );
        }

        // 주차 필터링
        if (searchFilters.hasParking) {
            filtered = filtered.filter(restaurant => restaurant.hasParking === true);
        }

        // 예약 필터링
        if (searchFilters.hasReservation) {
            filtered = filtered.filter(restaurant => restaurant.hasReservation === true);
        }

        // 배달 필터링
        if (searchFilters.hasDelivery) {
            filtered = filtered.filter(restaurant => restaurant.hasDelivery === true);
        }

        setFilteredRestaurants(filtered);
    };

    const handleFilterChange = (filterType, value) => {
        setSearchFilters(prev => ({
            ...prev,
            [filterType]: value
        }));
    };

    const resetFilters = () => {
        setSearchFilters({
            name: '',
            province: '',
            city: '',
            cuisine: '',
            hasParking: false,
            hasReservation: false,
            hasDelivery: false
        });
    };

    const handleDelete = (deletedRestaurantId) => {
        setRestaurants(prev => prev.filter(restaurant => restaurant.id !== deletedRestaurantId));
    };

    if (loading) {
        return <div className="loading">레스토랑 목록을 불러오는 중...</div>;
    }

    if (restaurants.length === 0) {
        return (
            <div className="no-restaurants-message">
                <h2>🍽️ 등록된 음식점이 없습니다</h2>
                <p>첫 번째 음식점을 등록해보세요!</p>
            </div>
        );
    }

    return (
        <div className="restaurant-list-container">
            {/* 검색 필터 섹션 */}
            <div className="search-filters">
                <div className="search-row">
                    <div className="search-field">
                        <label htmlFor="name-search">🍽️ 음식점명</label>
                        <input
                            id="name-search"
                            type="text"
                            placeholder="레스토랑명을 입력하세요"
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
                    
                    <div className="search-field">
                        <label htmlFor="cuisine-search">🍜 음식 종류</label>
                        <select
                            id="cuisine-search"
                            value={searchFilters.cuisine}
                            onChange={(e) => handleFilterChange('cuisine', e.target.value)}
                            className="search-select"
                        >
                            <option value="">전체</option>
                            {cuisineTypes.map(cuisine => (
                                <option key={cuisine} value={cuisine}>{cuisine}</option>
                            ))}
                        </select>
                    </div>
                </div>

                <div className="search-row">
                    <div className="checkbox-group">
                        <label>
                            <input
                                type="checkbox"
                                checked={searchFilters.hasParking}
                                onChange={(e) => handleFilterChange('hasParking', e.target.checked)}
                            />
                            🚗 주차 가능
                        </label>
                        <label>
                            <input
                                type="checkbox"
                                checked={searchFilters.hasReservation}
                                onChange={(e) => handleFilterChange('hasReservation', e.target.checked)}
                            />
                            📅 예약 가능
                        </label>
                        <label>
                            <input
                                type="checkbox"
                                checked={searchFilters.hasDelivery}
                                onChange={(e) => handleFilterChange('hasDelivery', e.target.checked)}
                            />
                            🛵 배달 가능
                        </label>
                    </div>
                    <button onClick={resetFilters} className="reset-button1">
                        필터 초기화
                    </button>
                </div>
            </div>

            {/* 레스토랑 목록 */}
            <div className="restaurant-grid">
                {filteredRestaurants.map(restaurant => (
                    <RestaurantCardAdmin
                        key={restaurant.id}
                        restaurant={restaurant}
                        onDelete={handleDelete}
                    />
                ))}
            </div>
        </div>
    );
};

export default RestaurantListAdmin; 