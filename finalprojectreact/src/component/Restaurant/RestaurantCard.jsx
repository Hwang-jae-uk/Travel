import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Restaurant.css';
import { IoLocationSharp, IoTime } from "react-icons/io5";
import { MdOutlineRestaurant, MdPhone } from "react-icons/md";
import { FaMoneyBillWave } from "react-icons/fa";
import { BiSolidFoodMenu } from "react-icons/bi";
import axios from 'axios';

const RestaurantCard = ({ restaurant }) => {
    const navigate = useNavigate();
    const [ratingInfo, setRatingInfo] = useState({ averageRating: 0, reviewCount: 0 });

    useEffect(() => {
        fetchRatingInfo();
    }, [restaurant.id]);

    const fetchRatingInfo = async () => {
        try {
            const response = await axios.get(`/api/restaurant/${restaurant.id}/reviews/rating`);
            const ratingData = response.data || { averageRating: 0, reviewCount: 0 };
            setRatingInfo(ratingData);
        } catch (error) {
            console.error('평점 정보 조회 실패:', error);
            setRatingInfo({ averageRating: 0, reviewCount: 0 });
        }
    };

    const renderStars = (rating) => {
        return '⭐'.repeat(Math.round(rating));
    };

    return (
        <div className="restaurant-card" onClick={() => navigate(`/restaurant/${restaurant.id}`)}>
            <div className="restaurant-card-image">
                {restaurant.images && restaurant.images.length > 0 && restaurant.images[0]?.imagePath ? (
                    <img 
                        src={restaurant.images[0].imagePath} 
                        alt={restaurant.name}
                        className="restaurant-card-img"
                        onError={(e) => {
                            e.target.style.display = 'none';
                        }}
                    />
                ) : (
                    <div className="restaurant-no-image">
                        <MdOutlineRestaurant size={24} /> 이미지 없음
                    </div>
                )}
            </div>
            
            <div className="restaurant-card-content">
                <h3 className="restaurant-card-title">{restaurant.name}</h3>
                
                {/* 별점 정보 표시 */}
                {ratingInfo.reviewCount > 0 && (
                    <div className="restaurant-card-rating">
                        <span className="stars">{renderStars(ratingInfo.averageRating)}</span>
                        <span className="rating-text">
                            {ratingInfo.averageRating.toFixed(1)} ({ratingInfo.reviewCount}개의 리뷰)
                        </span>
                    </div>
                )}
                
                {restaurant.cuisine && (
                    <div className="restaurant-card-cuisine">
                        <BiSolidFoodMenu size={16} /> {restaurant.cuisine}
                    </div>
                )}
                
                <div className="restaurant-card-address">
                    <IoLocationSharp size={18} /> {restaurant.address}
                </div>
                
                {restaurant.phone && (
                    <p className="restaurant-card-phone">
                        <MdPhone size={18} /> {restaurant.phone}
                    </p>
                )}
                
                {restaurant.priceRange && (
                    <p className="restaurant-card-price">
                        <FaMoneyBillWave size={18} /> {restaurant.priceRange}
                    </p>
                )}
                
                {restaurant.openTime && restaurant.closeTime && (
                    <p className="restaurant-card-hours">
                        <IoTime size={18} /> {restaurant.openTime} - {restaurant.closeTime}
                    </p>
                )}
            </div>
        </div>
    );
};

export default RestaurantCard;