import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Restaurant.css';
import { IoLocationSharp, IoTime } from "react-icons/io5";
import { MdOutlineRestaurant, MdPhone } from "react-icons/md";
import { FaMoneyBillWave } from "react-icons/fa";
import { BiSolidFoodMenu } from "react-icons/bi";

const RestaurantCard = ({ restaurant }) => {
    const navigate = useNavigate();


    return (
        <div className="restaurant-card" onClick={() => navigate(`/restaurant/${restaurant.id}`)}>
            <div className="restaurant-card-image">
                {restaurant.images && restaurant.images.length > 0 && restaurant.images[0]?.imagePath ? (
                    <img 
                        src={(restaurant.images[0].imagePath)} 
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