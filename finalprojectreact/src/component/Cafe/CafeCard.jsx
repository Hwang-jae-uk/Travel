import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Cafe.css';
import { IoLocationSharp, IoWifi, IoTime } from "react-icons/io5";
import { MdLocalParking } from "react-icons/md";
import { BiSolidCoffee } from "react-icons/bi";
import { FaPhoneAlt } from "react-icons/fa";
import axios from 'axios';

const CafeCard = ({ cafe }) => {
    const navigate = useNavigate();
    const [ratingInfo, setRatingInfo] = useState({ averageRating: 0, reviewCount: 0 });

    useEffect(() => {
        fetchRatingInfo();
    }, [cafe.id]);

    const fetchRatingInfo = async () => {
        try {
            const response = await axios.get(`/api/cafe/${cafe.id}/reviews/rating`);
            const ratingData = response.data || { averageRating: 0, reviewCount: 0 };
            setRatingInfo(ratingData);
        } catch (error) {
            console.error('평점 정보 조회 실패:', error);
            setRatingInfo({ averageRating: 0, reviewCount: 0 });
        }
    };

    const handleClick = () => {
        navigate(`/cafe/${cafe.id}`);
    };

    const renderStars = (rating) => {
        return '⭐'.repeat(Math.round(rating));
    };

    return (
        <div className="cafe-card" onClick={handleClick}>
            <div className="cafe-card-image-container">
                {cafe.images && cafe.images.length > 0 && cafe.images[0]?.imageUrl ? (
                    <img 
                        src={cafe.images[0].imageUrl} 
                        alt={cafe.name}
                        className="cafe-card-image"
                        onError={(e) => {
                            e.target.style.display = 'none';
                            e.target.nextSibling.style.display = 'flex';
                        }}
                    />
                ) : (
                    <div className="no-image"><BiSolidCoffee size={24} /> 이미지 없음</div>
                )}
            </div>
            
            <div className="cafe-card-content">
                <h3 className="cafe-card-title">{cafe.name}</h3>

                {/* 별점 정보 표시 */}
                {ratingInfo.reviewCount > 0 && (
                    <div className="cafe-card-rating">
                        <span className="stars">{renderStars(ratingInfo.averageRating)}</span>
                        <span className="rating-text">
                            {ratingInfo.averageRating.toFixed(1)} ({ratingInfo.reviewCount}개의 리뷰)
                        </span>
                    </div>
                )}
                
                <div className="cafe-address">
                    <IoLocationSharp size={18} className="location-icon" /> {cafe.address}
                </div>
                
                <div className="cafe-features">
                    <span className={`feature ${cafe.wifi ? 'active' : ''}`}>
                        <IoWifi size={18} /> Wi-Fi {cafe.wifi ? '가능' : '불가'}
                    </span>
                    <span className={`feature ${cafe.parking ? 'active' : ''}`}>
                        <MdLocalParking size={18} /> 주차 {cafe.parking ? '가능' : '불가'}
                    </span>
                </div>
                
                {cafe.openTime && cafe.closeTime && (
                    <p className="cafe-hours">
                        <IoTime size={18} /> {cafe.openTime} - {cafe.closeTime}
                    </p>
                )}
                
                {cafe.phone && (
                    <p className="cafe-card-phone">
                        <FaPhoneAlt size={18} /> {cafe.phone}
                    </p>
                )}
            </div>
        </div>
    );
};

export default CafeCard;