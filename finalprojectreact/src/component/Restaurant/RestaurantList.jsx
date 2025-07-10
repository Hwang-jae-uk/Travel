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
    const [searchFilters, setSearchFilters] = useState({
        name: '',
        province: '',
        city: '',
        cuisine: '',
        hasParking: false,
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

    const resetFilters = () => {
        setSearchFilters({
            name: '',
            province: '',
            city: '',
            cuisine: '',
            hasParking: false,
            hasDelivery: false
        });
    };

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

    if (restaurants.length === 0) {
        return (
            <div className="no-restaurants-message">
                <h2><MdOutlineRestaurant size={20} /> 등록된 레스토랑이 없습니다</h2>
                <p>첫 번째 레스토랑을 등록해보세요!</p>
            </div>
        );
    }

    return (
        <div className="restaurant-list-container">
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
                            className="search-input"
                        />
                    </div>
                    
                    <div className="search-field">
                        <label htmlFor="province-search">
                            <IoLocationSharp size={18} /> 도/특별시/광역시
                        </label>
                        <select
                            id="province-search"
                            value={searchFilters.province}
                            onChange={(e) => setSearchFilters({...searchFilters, province: e.target.value})}
                            className="search-select"
                        >
                            <option value="">전체</option>
                            {provinces.map(province => (
                                <option key={province} value={province}>{province}</option>
                            ))}
                        </select>
                    </div>

                    <div className="search-field">
                        <label htmlFor="city-search">
                            <FaCity size={18} /> 시/구
                        </label>
                        <input
                            id="city-search"
                            type="text"
                            placeholder="시/구를 입력하세요"
                            value={searchFilters.city}
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
        </div>
    );
};

export default RestaurantList; 