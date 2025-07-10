import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Cafe.css';
<<<<<<< HEAD
=======
import { IoLocationSharp, IoWifi, IoTime } from "react-icons/io5";
import { MdLocalParking } from "react-icons/md";
import { BiSolidCoffee } from "react-icons/bi";
import { FaPhoneAlt } from "react-icons/fa";
>>>>>>> 902477c (initial commit)

const CafeCard = ({ cafe }) => {
    const navigate = useNavigate();

    const handleClick = () => {
        navigate(`/cafe/${cafe.id}`);
    };

<<<<<<< HEAD
    const getImageUrl = (imageUrl) => {
        if (!imageUrl) return null;
        return `http://10.100.105.22:8080/api/images${imageUrl.startsWith('/') ? '' : '/'}${imageUrl}`;
    };
=======
>>>>>>> 902477c (initial commit)

    return (
        <div className="cafe-card" onClick={handleClick}>
            <div className="cafe-card-image-container">
                {cafe.images && cafe.images.length > 0 && cafe.images[0]?.imageUrl ? (
                    <img 
<<<<<<< HEAD
                        src={getImageUrl(cafe.images[0].imageUrl)} 
=======
                        src={cafe.images[0].imageUrl} 
>>>>>>> 902477c (initial commit)
                        alt={cafe.name}
                        className="cafe-card-image"
                        onError={(e) => {
                            e.target.style.display = 'none';
                            e.target.nextSibling.style.display = 'flex';
                        }}
                    />
<<<<<<< HEAD
                ) : null}
                <div className="no-image" style={{ display: (cafe.images && cafe.images.length > 0 && cafe.images[0]?.imageUrl) ? 'none' : 'flex' }}>
                    🏪 이미지 없음
                </div>
=======
                ) : (
                    <div className="no-image"><BiSolidCoffee size={24} /> 이미지 없음</div>
                )}
>>>>>>> 902477c (initial commit)
            </div>
            
            <div className="cafe-card-content">
                <h3 className="cafe-card-title">{cafe.name}</h3>
<<<<<<< HEAD
                <p className="cafe-card-address">
                    📍 {cafe.address}
                </p>
                
                <div className="cafe-card-features">
                    {cafe.wifi && <span className="feature-badge">📶 Wi-Fi</span>}
                    {cafe.parking && <span className="feature-badge">🅿️ 주차</span>}
                </div>
                
                {cafe.openTime && cafe.closeTime && (
                    <p className="cafe-card-hours">
                        🕐 {cafe.openTime} - {cafe.closeTime}
=======
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
>>>>>>> 902477c (initial commit)
                    </p>
                )}
                
                {cafe.phone && (
                    <p className="cafe-card-phone">
<<<<<<< HEAD
                        📞 {cafe.phone}
=======
                        <FaPhoneAlt size={18} /> {cafe.phone}
>>>>>>> 902477c (initial commit)
                    </p>
                )}
            </div>
        </div>
    );
};

export default CafeCard; 