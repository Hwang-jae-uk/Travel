import React from 'react';
import PropTypes from 'prop-types';
import './Hotel.css';
import { useNavigate } from 'react-router-dom';
import { parseAddress } from './addressUtils';
import axios from 'axios';

const HotelCardAdmin = ({ hotel, onHotelDeleted }) => {
  const navigate = useNavigate();
  const imageURL = hotel.images && hotel.images.length > 0 ? (hotel.images[0].imageUrl) : null;

  const handleClick = (e) => {
    // 수정/삭제 버튼 클릭 시에는 상세 페이지로 이동하지 않음
    if (e.target.classList.contains('edit-btn') || 
        e.target.classList.contains('remove-btn') ||
        e.target.closest('.edit-btn') || 
        e.target.closest('.remove-btn')) {
      return;
    }
    navigate(`/HotelDetail/${hotel.id}`);
  };

  const handleEdit = (e) => {
    e.stopPropagation();
    e.preventDefault();
    navigate(`/HotelEdit/${hotel.id}`);
  };

  const handleDelete = async (e) => {
    e.stopPropagation();
    e.preventDefault();
    
    if (window.confirm(`"${hotel.name}" 호텔을 정말 삭제하시겠습니까?`)) {
      try {
        await axios.delete(`/api/hotel/${hotel.id}`);
        alert('호텔이 성공적으로 삭제되었습니다.');
        // 부모 컴포넌트에 삭제 완료를 알림
        if (onHotelDeleted) {
          onHotelDeleted(hotel.id);
        }
      } catch (error) {
        console.error('호텔 삭제 실패:', error);
        alert('호텔 삭제에 실패했습니다.');
      }
    }
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
    <div className="hotel-card  image-wrapper" onClick={handleClick}>
      {imageURL && <img className="hotel-image" src={imageURL} alt={hotel.name} />}
      <div className="hotel-content">
        <h3 className="hotel-name">{hotel.name}</h3>
        <div className="hotel-location">
          {province && city ? (
            <div className="address-parsed">
              <span className="province">{province}</span>
              <span className="city">{fullAddress}</span>
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
      
      {/* 관리자 액션 버튼들 */}
      <button 
        className="hotel-edit-btn" 
        onClick={handleEdit}
        title="호텔 수정"
      >
        &#9998;
      </button>
      <button 
        className="remove-btn" 
        onClick={handleDelete}
        title="호텔 삭제"
      >
        &times;
      </button>
    </div>
  );
};

HotelCardAdmin.propTypes = {
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
  onHotelDeleted: PropTypes.func
};

export default HotelCardAdmin; 