import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Restaurant.css';
import RestaurantListAdmin from './RestaurantListAdmin';

/**
 * RestaurantPageAdmin Component - 관리자용 음식점 페이지
 */
const RestaurantPageAdmin = () => {
    const navigate = useNavigate();

    return (
        <div className="page-container">
            <div className="button-row">
                <h1 className="page-title">🍽️ 음식점 관리 (관리자)</h1>
                <button className="add-hotel-button" onClick={() => { navigate('/RestaurantRegister')}}>
                    ✨ 음식점 등록
                </button>
            </div>
            <RestaurantListAdmin />
        </div>
    );
};

export default RestaurantPageAdmin; 