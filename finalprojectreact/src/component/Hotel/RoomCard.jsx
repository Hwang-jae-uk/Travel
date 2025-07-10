import React from 'react';
import PropTypes from 'prop-types';
import './Hotel.css';

const RoomCard = ({ room }) => {
  const getImageUrl = () => {
    if (!room.images || room.images.length === 0) return null;
    
    const firstImage = room.images[0];
    
    // File 객체인 경우 (새로 추가된 이미지)
    if (firstImage instanceof File) {
      return URL.createObjectURL(firstImage);
    }
    
    // 문자열인 경우 (기존 서버 이미지)
    if (typeof firstImage === 'string') {
      return 'http://10.100.105.22:8080/api/images' + encodeURI(firstImage);
    }
    
    return null;
  };
  
  const thumbnail = getImageUrl();
  console.log('RoomCard thumbnail:', thumbnail);
  
  const handleImageError = (e) => {
    console.error('이미지 로딩 실패:', e.target.src);
    e.target.style.display = 'none';
  };
  
  return (
    <div className="room-card">
      {thumbnail && (
        <img 
          className="room-image" 
          src={thumbnail} 
          alt={room.roomName}
          onError={handleImageError}
        />
      )}
      <div className="room-content">
        <h4 className="room-name">{room.roomName}</h4>
        <p className="room-text">객실 개수: {room.roomCount}개</p>
        {room.price && <p className="room-text">가격: {Number(room.price).toLocaleString()}원</p>}
        <p className="room-text">침대 {room.bedCount ?? 0}개 · 욕실 {room.bathroomCount ?? 0}개 · 최대 {room.maxOccupancy ?? 0}명</p>
      </div>
    </div>
  );
};

RoomCard.propTypes = {
  room: PropTypes.shape({
    roomName: PropTypes.string.isRequired,
    images: PropTypes.arrayOf(PropTypes.any),
    roomCount: PropTypes.number.isRequired,
    price: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    bedCount: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    bathroomCount: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    maxOccupancy: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  }).isRequired,
};

export default RoomCard; 