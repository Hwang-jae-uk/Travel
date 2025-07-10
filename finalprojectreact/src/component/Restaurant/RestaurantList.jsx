<<<<<<< HEAD
import { useEffect, useState } from "react";
import RestaurantCard from "./RestaurantCard";
import axios from "axios";
import { provinces, parseAddress } from '../Hotel/addressUtils';
import './Restaurant.css';

const RestaurantList = () => {
    const [restaurants, setRestaurants] = useState([]);
    const [filteredRestaurants, setFilteredRestaurants] = useState([]);
    const [isDataLoaded, setIsDataLoaded] = useState(false);
=======
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import RestaurantCard from './RestaurantCard';
import { provinces } from '../Hotel/addressUtils';
import './Restaurant.css';
import { IoLocationSharp } from "react-icons/io5";
import { MdOutlineRestaurant, MdLocalParking, MdDeliveryDining } from "react-icons/md";
import { FaCity, FaMoneyBillWave } from "react-icons/fa";
import { GrPowerReset } from "react-icons/gr";
import { BiSolidFoodMenu } from "react-icons/bi";

const RestaurantList = () => {
    const [restaurants, setRestaurants] = useState([]);
>>>>>>> 902477c (initial commit)
    const [searchFilters, setSearchFilters] = useState({
        name: '',
        province: '',
        city: '',
        cuisine: '',
        hasParking: false,
<<<<<<< HEAD
        hasReservation: false,
        hasDelivery: false
    });

    const cuisineTypes = ['한식', '중식', '일식', '양식', '이탈리안', '프렌치', '멕시칸', '인도', '태국', '베트남', '기타'];
    const priceRanges = ['저렴', '보통', '비싸', '고급'];

    const restaurantList = async() => {
        try {
            const response = await axios.get('/api/restaurants');
            console.log('Received restaurant data:', response.data);
            return response.data;
        } catch (error) {
            console.error('Error fetching restaurants:', error);
            return [];
        }
    }

    // 검색 필터링 함수
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

    // 검색 필터 변경 핸들러
    const handleFilterChange = (filterType, value) => {
        setSearchFilters(prev => ({
            ...prev,
            [filterType]: value
        }));
    };

    // 검색 초기화
=======
        hasDelivery: false
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const cuisineTypes = ['한식', '중식', '일식', '양식', '이탈리안', '프렌치', '멕시칸', '인도', '태국', '베트남', '기타'];

    useEffect(() => {
        fetchRestaurants();
    }, []);

    const fetchRestaurants = async () => {
        try {
            const response = await axios.get('http://10.100.105.22:8080/api/restaurants');
            setRestaurants(response.data);
            setLoading(false);
        } catch (err) {
            setError('레스토랑 정보를 불러오는데 실패했습니다.');
            setLoading(false);
        }
    };

>>>>>>> 902477c (initial commit)
    const resetFilters = () => {
        setSearchFilters({
            name: '',
            province: '',
            city: '',
            cuisine: '',
            hasParking: false,
<<<<<<< HEAD
            hasReservation: false,
=======
>>>>>>> 902477c (initial commit)
            hasDelivery: false
        });
    };

<<<<<<< HEAD
    useEffect(() => {
        restaurantList()
        .then((result) => {
            if (!result || result.length <= 0) {
                setIsDataLoaded(true);
                return;
            }

            console.log('Processed restaurant data:', result);
            // 각 레스토랑의 ID 확인을 위한 로그
            result.forEach(restaurant => {
                console.log('Restaurant ID:', restaurant.id, 'Name:', restaurant.name);
            });
            setRestaurants(result);
            setFilteredRestaurants(result);
            setIsDataLoaded(true);
        })
        .catch(error => {
            console.error('Error in useEffect:', error);
            setIsDataLoaded(true);
        });
    }, []);

    // 검색 필터가 변경될 때마다 필터링 실행
    useEffect(() => {
        if (restaurants.length > 0) {
            filterRestaurants();
        }
    }, [searchFilters, restaurants]);

    if (!isDataLoaded) {
        return <div className="loading">음식점 목록을 불러오는 중...</div>;
    }
=======
    const filteredRestaurants = restaurants.filter(restaurant => {
        const nameMatch = !searchFilters.name || restaurant.name.toLowerCase().includes(searchFilters.name.toLowerCase());
        const provinceMatch = !searchFilters.province || restaurant.address.includes(searchFilters.province);
        const cityMatch = !searchFilters.city || restaurant.address.toLowerCase().includes(searchFilters.city.toLowerCase());
        const cuisineMatch = !searchFilters.cuisine || restaurant.cuisine === searchFilters.cuisine;
        const parkingMatch = !searchFilters.hasParking || restaurant.hasParking;
        const deliveryMatch = !searchFilters.hasDelivery || restaurant.hasDelivery;

        return nameMatch && provinceMatch && cityMatch && cuisineMatch && parkingMatch && deliveryMatch;
    });

    if (loading) return <div>로딩 중...</div>;
    if (error) return <div>{error}</div>;
>>>>>>> 902477c (initial commit)

    if (restaurants.length === 0) {
        return (
            <div className="no-restaurants-message">
<<<<<<< HEAD
                <h2>🍽️ 등록된 음식점이 없습니다</h2>
                <p>첫 번째 음식점을 등록해보세요!</p>
=======
                <h2><MdOutlineRestaurant size={20} /> 등록된 레스토랑이 없습니다</h2>
                <p>첫 번째 레스토랑을 등록해보세요!</p>
>>>>>>> 902477c (initial commit)
            </div>
        );
    }

    return (
        <div className="restaurant-list-container">
<<<<<<< HEAD
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
=======
            <div className="search-filters">
                <div className="search-row">
                    <div className="search-field">
                        <label htmlFor="name-search">
                            <MdOutlineRestaurant size={18} /> 식당명
                        </label>
                        <input
                            id="name-search"
                            type="text"
                            placeholder="식당명을 입력하세요"
                            value={searchFilters.name}
                            onChange={(e) => setSearchFilters({...searchFilters, name: e.target.value})}
>>>>>>> 902477c (initial commit)
                            className="search-input"
                        />
                    </div>
                    
                    <div className="search-field">
<<<<<<< HEAD
                        <label htmlFor="province-search">📍 도/특별시/광역시</label>
                        <select
                            id="province-search"
                            value={searchFilters.province}
                            onChange={(e) => handleFilterChange('province', e.target.value)}
=======
                        <label htmlFor="province-search">
                            <IoLocationSharp size={18} /> 도/특별시/광역시
                        </label>
                        <select
                            id="province-search"
                            value={searchFilters.province}
                            onChange={(e) => setSearchFilters({...searchFilters, province: e.target.value})}
>>>>>>> 902477c (initial commit)
                            className="search-select"
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

                    <div className="search-field">
                        <label htmlFor="city-search">
                            <FaCity size={18} /> 시/구
                        </label>
>>>>>>> 902477c (initial commit)
                        <input
                            id="city-search"
                            type="text"
                            placeholder="시/구를 입력하세요"
                            value={searchFilters.city}
<<<<<<< HEAD
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
=======
                            onChange={(e) => setSearchFilters({...searchFilters, city: e.target.value})}
                            className="search-input"
                        />
                    </div>

                    <div className="search-field">
                        <label htmlFor="cuisine-search">
                            <BiSolidFoodMenu size={18} /> 음식 종류
                        </label>
                        <select
                            id="cuisine-search"
                            value={searchFilters.cuisine}
                            onChange={(e) => setSearchFilters({...searchFilters, cuisine: e.target.value})}
>>>>>>> 902477c (initial commit)
                            className="search-select"
                        >
                            <option value="">전체</option>
                            {cuisineTypes.map(cuisine => (
                                <option key={cuisine} value={cuisine}>{cuisine}</option>
                            ))}
                        </select>
                    </div>
<<<<<<< HEAD
                    
                    <div className="search-field">
                        <label>필터 옵션</label>
                        <div style={{ display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap' }}>
                            <label style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                                <input
                                    type="checkbox"
                                    checked={searchFilters.hasParking}
                                    onChange={(e) => handleFilterChange('hasParking', e.target.checked)}
                                />
                                🅿️ 주차
                            </label>
                            <label style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                                <input
                                    type="checkbox"
                                    checked={searchFilters.hasReservation}
                                    onChange={(e) => handleFilterChange('hasReservation', e.target.checked)}
                                />
                                📞 예약
                            </label>
                            <label style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                                <input
                                    type="checkbox"
                                    checked={searchFilters.hasDelivery}
                                    onChange={(e) => handleFilterChange('hasDelivery', e.target.checked)}
                                />
                                🚚 배달
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
                
                {/* 검색 결과 정보 */}
                <div className="search-results-info">
                    <span className="results-count">
                        총 {filteredRestaurants.length}개의 음식점이 검색되었습니다
                    </span>
                    {(searchFilters.name || searchFilters.province || searchFilters.city || 
                      searchFilters.cuisine || searchFilters.hasParking || 
                      searchFilters.hasReservation || searchFilters.hasDelivery) && (
                        <span className="active-filters">
                            {searchFilters.name && <span className="filter-tag">이름: {searchFilters.name}</span>}
                            {searchFilters.province && <span className="filter-tag">지역: {searchFilters.province}</span>}
                            {searchFilters.city && <span className="filter-tag">시/구: {searchFilters.city}</span>}
                            {searchFilters.cuisine && <span className="filter-tag">음식: {searchFilters.cuisine}</span>}
                            {searchFilters.hasParking && <span className="filter-tag">주차</span>}
                            {searchFilters.hasReservation && <span className="filter-tag">예약</span>}
                            {searchFilters.hasDelivery && <span className="filter-tag">배달</span>}
                        </span>
                    )}
                </div>
            </div>

            {/* 레스토랑 목록 */}
            {filteredRestaurants.length === 0 ? (
                <div className="no-results-message">
                    <h3>🔍 검색 결과가 없습니다</h3>
                    <p>다른 검색 조건을 시도해보세요</p>
                    <button onClick={resetFilters} className="reset-search-button">
                        검색 조건 초기화
                    </button>
                </div>
            ) : (
                <div className="restaurant-grid">
                    {filteredRestaurants.map((restaurant) => (
                        <RestaurantCard key={restaurant.id} restaurant={restaurant} />
                    ))}
                </div>
            )}
=======
                </div>

                <div className="search-row">
                    <div className="checkbox-group">
                        <label>
                            <input
                                type="checkbox"
                                checked={searchFilters.hasParking}
                                onChange={(e) => setSearchFilters({...searchFilters, hasParking: e.target.checked})}
                            />
                            <MdLocalParking size={18} /> 주차 가능
                        </label>
                        <label>
                            <input
                                type="checkbox"
                                checked={searchFilters.hasDelivery}
                                onChange={(e) => setSearchFilters({...searchFilters, hasDelivery: e.target.checked})}
                            />
                            <MdDeliveryDining size={18} /> 배달 가능
                        </label>
                    </div>
                    <div className="search-actions">
                        <button 
                            className="filter-reset-button"
                            title="검색 초기화"
                            onClick={() => {
                                setSearchFilters({
                                    name: '',
                                    province: '',
                                    city: '',
                                    cuisine: '',
                                    hasParking: false,
                                    hasDelivery: false
                                });
                            }}
                        >
                            <GrPowerReset size={18} /> 초기화
                        </button>
                    </div>
                </div>
            </div>

            <div className="restaurant-grid">
                {filteredRestaurants.map(restaurant => (
                    <RestaurantCard key={restaurant.id} restaurant={restaurant} />
                ))}
            </div>
>>>>>>> 902477c (initial commit)
        </div>
    );
};

export default RestaurantList; 