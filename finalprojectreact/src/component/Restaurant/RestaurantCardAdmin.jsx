import React from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Restaurant.css';

const RestaurantCardAdmin = ({ restaurant, onDelete }) => {
    const navigate = useNavigate();

    const handleCardClick = (e) => {
        // 수정/삭제 버튼 클릭 시에는 상세 페이지로 이동하지 않음
        if (e.target.classList.contains('restaurant-edit-btn') || 
            e.target.classList.contains('restaurant-remove-btn') ||
            e.target.closest('.restaurant-edit-btn') || 
            e.target.closest('.restaurant-remove-btn')) {
            return;
        }
        navigate(`/restaurant/${restaurant.id}`);
    };

    const handleEdit = (e) => {
        navigate(`/RestaurantEdit/${restaurant.id}`);
    };

    const handleDelete = async (e) => {
        
        if (!window.confirm(`정말로 "${restaurant.name}" 레스토랑을 삭제하시겠습니까?`)) {
            return;
        }

        try {
            await axios.delete(`/api/restaurants/${restaurant.id}`);
            
            alert('레스토랑이 성공적으로 삭제되었습니다.');
            onDelete(restaurant.id); // 부모 컴포넌트에 삭제 알림
            
        } catch (error) {
            console.error('레스토랑 삭제 실패:', error);
            alert(error.response?.data?.error || '레스토랑 삭제에 실패했습니다.');
        }
    };

    console.log(restaurant.images[0].imagePath);

    return (
        <div className="restaurant-card" onClick={handleCardClick}>
            <div className="restaurant-card-image">
                
                    <img 
                        src={`${restaurant.images[0].imagePath}`} 
                        alt={restaurant.name}
                        className="restaurant-card-img"
                        onError={(e) => {
                            e.target.style.display = 'none';
                        }}
                    />
               
            </div>
            
            <div className="restaurant-card-content">
                <h3 className="restaurant-name">{restaurant.name}</h3>
                <p className="restaurant-address">📍 {restaurant.address}</p>
                <p className="restaurant-phone">📞 {restaurant.phone}</p>
                {restaurant.email && <p className="restaurant-email">✉️ {restaurant.email}</p>}
                
                <div className="restaurant-features">
                    <span className={`feature ${restaurant.hasParking ? 'active' : ''}`}>
                        🅿️ 주차 {restaurant.hasParking ? '가능' : '불가'}
                    </span>
                    <span className={`feature ${restaurant.hasReservation ? 'active' : ''}`}>
                        📅 예약 {restaurant.hasReservation ? '가능' : '불가'}
                    </span>
                    <span className={`feature ${restaurant.hasDelivery ? 'active' : ''}`}>
                        🛵 배달 {restaurant.hasDelivery ? '가능' : '불가'}
                    </span>
                </div>
                
                {restaurant.cuisine && (
                    <p className="restaurant-cuisine">
                        🍜 {restaurant.cuisine}
                    </p>
                )}
            </div>
            
            {/* 관리자 액션 버튼들 */}
            <button 
                className="restaurant-edit-btn" 
                onClick={handleEdit}
                title="레스토랑 수정"
            >
                &#9998;
            </button>
            
            <button 
                className="restaurant-remove-btn" 
                onClick={handleDelete}
                title="레스토랑 삭제"
            >
                &times;
            </button>
        </div>
    );
};

export default RestaurantCardAdmin; 