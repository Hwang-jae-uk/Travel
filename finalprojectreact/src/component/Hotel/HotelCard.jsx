import React from 'react';
import PropTypes from 'prop-types';
import './Hotel.css';
import { useNavigate } from 'react-router-dom';
import { parseAddress } from './addressUtils';
import { IoLocationSharp } from 'react-icons/io5';

const HotelCard = ({ hotel }) => {
  const navigate = useNavigate();
  const imageURL = hotel.images && hotel.images.length > 0 ?(hotel.images[0].imageUrl): null;

  const handleClick = () => {
    navigate(`/HotelDetail/${hotel.id}`);
  };

  // 객실들 중에서 가장 낮은 가격 찾기
  const getLowestPrice = () => {
    if (!hotel.rooms || hotel.rooms.length === 0) {
      return null;
    }
    
    const prices = hotel.rooms.map(room => Number(room.price));
    const lowestPrice = Math.min(...prices);
    return lowestPrice;
  };

  const lowestPrice = getLowestPrice();
  const { province, city, fullAddress } = parseAddress(hotel.address);

  return (
    <div className="hotel-card" onClick={handleClick}>
      {imageURL && <img className="hotel-image" src={imageURL} alt={hotel.name} />}
      <div className="hotel-content">
        <h3 className="hotel-name">{hotel.name}</h3>
        <div className="hotel-location">
          {province ? (
            <div className="address-parsed">
              <span className="province">{province}</span>
              <div className="city">
                <IoLocationSharp size={18} className="city-icon" />
                <span>{fullAddress}</span>
              </div>
            </div>
          ) : (
            <span className="address-full">{fullAddress}</span>
          )}
        </div>
        {lowestPrice && (
          <p className="hotel-price">
            {lowestPrice.toLocaleString()}원부터
          </p>
        )}
      </div>
    </div>
  );
};

HotelCard.propTypes = {
  hotel: PropTypes.shape({
    id: PropTypes.number.isRequired,
    name: PropTypes.string.isRequired,
    address: PropTypes.string.isRequired,
    images: PropTypes.arrayOf(
      PropTypes.shape({
        imageUrl: PropTypes.string.isRequired
      })
    ),
    rooms: PropTypes.arrayOf(
      PropTypes.shape({
        price: PropTypes.number.isRequired
      })
    )
  }).isRequired,
};

export default HotelCard; 