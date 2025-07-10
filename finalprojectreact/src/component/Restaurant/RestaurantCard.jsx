import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Restaurant.css';
<<<<<<< HEAD

const RestaurantCard = ({ restaurant }) => {
    const navigate = useNavigate();
    console.log(restaurant)
    console.log(restaurant.images[0])

    const handleClick = () => {
        navigate(`/restaurant/${restaurant.id}`);
    };

    

    return (
        <div className="restaurant-card" onClick={handleClick}>
            <div className="restaurant-card-image-container">
                    <img 
                        src={`http://10.100.105.22:8080/api/images${restaurant.images[0]}`} 
                        alt={restaurant.name}
                        className="restaurant-card-image"
                    />
=======
import { IoLocationSharp, IoTime } from "react-icons/io5";
import { MdOutlineRestaurant, MdPhone } from "react-icons/md";
import { FaMoneyBillWave } from "react-icons/fa";
import { BiSolidFoodMenu } from "react-icons/bi";

const RestaurantCard = ({ restaurant }) => {
    const navigate = useNavigate();

    const getImageUrl = (imagePath) => {
        if (!imagePath) return null;
        return `https://traintravel.s3.ap-northeast-2.amazonaws.com/restaurant${imagePath.startsWith('/') ? '' : '/'}${imagePath}`;
    };

    return (
        <div className="restaurant-card" onClick={() => navigate(`/restaurant/${restaurant.id}`)}>
            <div className="restaurant-card-image">
                {restaurant.images && restaurant.images.length > 0 && restaurant.images[0]?.imagePath ? (
                    <img 
                        src={getImageUrl(restaurant.images[0].imagePath)} 
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
>>>>>>> 902477c (initial commit)
            </div>
            
            <div className="restaurant-card-content">
                <h3 className="restaurant-card-title">{restaurant.name}</h3>
                
                {restaurant.cuisine && (
<<<<<<< HEAD
                    <span className="restaurant-card-cuisine">{restaurant.cuisine}</span>
                )}
                
                <p className="restaurant-card-address">
                    📍 {restaurant.address}
                </p>
                
                {restaurant.priceRange && (
                    <p className="restaurant-card-price">
                        💰 {restaurant.priceRange}
                    </p>
                )}
                
                <div className="restaurant-card-features">
                    {restaurant.hasParking && <span className="feature-badge active">🅿️ 주차</span>}
                    {restaurant.hasReservation && <span className="feature-badge active">📞 예약</span>}
                    {restaurant.hasDelivery && <span className="feature-badge active">🚚 배달</span>}
                </div>
                
                {restaurant.operatingHours && (
                    <p className="restaurant-card-hours">
                        🕐 {restaurant.operatingHours}
                    </p>
                )}
                
                {restaurant.phone && (
                    <p className="restaurant-card-phone">
                        📞 {restaurant.phone}
=======
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
>>>>>>> 902477c (initial commit)
                    </p>
                )}
            </div>
        </div>
    );
};

export default RestaurantCard; 