import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import RoomModal from './RoomModal';
import axios from 'axios';
import './Hotel.css';

const HotelRegisterPage = ({ isAdmin = false }) => {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const [hotelInfo, setHotelInfo] = useState({
    name: '',
    address: '',
    phone: '',
    breakfastIncluded: false,
    breakfastPrice: '',
    postalCode: '',
    email: '',
    description: '',
  });

  const [rooms, setRooms] = useState([]);
  const [editingRoomIdx, setEditingRoomIdx] = useState(null);
  const [images, setImages] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [draggedIdx, setDraggedIdx] = useState(null);
    
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setHotelInfo({
      ...hotelInfo,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  const handleAddRoom = (room) => setRooms([...rooms, room]);

  const handleAddImage = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    setImages(prev => [...prev, ...files]);
  };

  const handleSubmit = () => {
    if(hotelInfo.name === '' || hotelInfo.address === '' || hotelInfo.email === '' || hotelInfo.phone === '' || hotelInfo.description === '' || images.length === 0 || rooms.length === 0){
      alert('모든 항목을 필수로 입력해주세요.');
      return;
    }
    if(hotelInfo.breakfastIncluded && hotelInfo.breakfastPrice === ''){
      alert('조식 가격을 입력해주세요.');
      return;
    }

    const formData = new FormData();

    // 호텔 기본 정보 추가
    formData.append('name', hotelInfo.name);
    formData.append('address', hotelInfo.address);
    formData.append('email', hotelInfo.email);
    formData.append('phone', hotelInfo.phone);
    formData.append('breakfast', hotelInfo.breakfastIncluded);
    formData.append('breakfastPrice', hotelInfo.breakfastPrice);
    formData.append('description', hotelInfo.description);

    // 호텔 이미지 추가
    images.forEach((image, index) => {
      formData.append(`imagesFiles`, image);
    });

    // 객실 정보 추가
    rooms.forEach((room, roomIndex) => {
      formData.append(`rooms[${roomIndex}].name`, room.roomName);
      formData.append(`rooms[${roomIndex}].price`, room.price);
      formData.append(`rooms[${roomIndex}].capacity`, room.roomCount);
      formData.append(`rooms[${roomIndex}].beds`, room.bedCount);
      formData.append(`rooms[${roomIndex}].bathrooms`, room.bathroomCount);
      formData.append(`rooms[${roomIndex}].people`, room.maxOccupancy);

      // 객실 이미지 추가
      if (room.images && room.images.length > 0) {
        room.images.forEach((image, imageIndex) => {
          formData.append(`rooms[${roomIndex}].roomImagesFiles`, image);
        });
      }
    });

    // API 호출
    axios.post('/api/hotel/', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
    .then(() => {
      alert('호텔이 성공적으로 등록되었습니다.');
      navigate('/HotelPageAdmin');
    })
    .catch((err) => {
      console.error('호텔 등록 실패:', err);
      alert('등록 중 오류가 발생했습니다.');
    });
  };

  // 이미지 클릭 시 맨 앞으로 이동
  const handleImageClick = (idx) => {
    if (idx === 0) return; // 이미 맨 앞이면 그대로
    setImages((prev) => {
      const newArr = [...prev];
      const [selected] = newArr.splice(idx, 1);
      return [selected, ...newArr];
    });
  };

  // 이미지 제거
  const handleRemoveImage = (idx) => {
    setImages((prev) => prev.filter((_, i) => i !== idx));
  };

  const handleDragStart = (idx) => () => {
    setDraggedIdx(idx);
  };

  const handleDrop = (idx) => () => {
    if (draggedIdx === null || draggedIdx === idx) return;
    setImages((prev) => {
      const newArr = [...prev];
      const [moved] = newArr.splice(draggedIdx, 1);
      newArr.splice(idx, 0, moved);
      return newArr;
    });
    setDraggedIdx(null);
  };

  // 객실 제거
  const handleRemoveRoom = (idx) => {
    setRooms((prev) => prev.filter((_, i) => i !== idx));
  };

  // 객실 수정 모드 열기
  const handleEditRoom = (idx) => {
    setEditingRoomIdx(idx);
    setIsModalOpen(true);
  };

  return (
    <div className="register-container">
      <div className="register-wrapper">
        <h2 className="section-title1">호텔 기본 정보</h2>
        <div className="input-group">
          <label>호텔명</label>
          <input name="name" type="text" value={hotelInfo.name} onChange={handleChange} />
        </div>
        <div className="input-group">
          <label>주소</label>
          <input name="address" type="text" value={hotelInfo.address} onChange={handleChange} />
        </div>
        <div className="input-group">
          <label>이메일</label>
          <input name="email" type="email" value={hotelInfo.email} onChange={handleChange} />
        </div>
        <div className="input-group">
          <label>전화번호</label>
          <input name="phone" type="text" value={hotelInfo.phone} onChange={handleChange} />
        </div>

        <div className="input-group">
          <label>조식 여부</label>
          <div className="breakfast-row">
            <input
              type="checkbox"
              name="breakfastIncluded"
              checked={hotelInfo.breakfastIncluded}
              onChange={handleChange}
            />
            <span>{hotelInfo.breakfastIncluded ? '제공' : '미제공'}</span>
            {hotelInfo.breakfastIncluded && (
              <input
                type="number"
                name="breakfastPrice"
                placeholder="조식 가격"
                value={hotelInfo.breakfastPrice}
                onChange={handleChange}
                style={{ flex: '1' }}
              />
            )}
          </div>
        </div>

        <div className="input-group">
          <label>호텔 소개</label>
          <textarea
            name="description"
            value={hotelInfo.description}
            onChange={handleChange}
            rows="3"
            style={{ flex: 1, padding: '0.6rem 0.9rem', borderRadius: '8px', border: '1px solid #ddd',minHeight: '200px' , maxHeight: '200px' }}
          />
        </div>

        <h2 className="section-title">대표 이미지</h2>
        <button className="add-room-button" onClick={handleAddImage}>
          이미지 추가
        </button>
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          accept="image/*"
          multiple
          style={{ display: 'none' }}
        />
        <div className="room-grid">
          {images.map((image, idx) => (
            <div
              key={idx}
              className="room-card rep-card image-wrapper"
              onClick={() => handleImageClick(idx)}
              draggable
              onDragStart={handleDragStart(idx)}
              onDragOver={(e) => e.preventDefault()}
              onDrop={handleDrop(idx)}
              style={{ cursor: 'move' }}
            >
              <img src={URL.createObjectURL(image)} alt={`img-${idx}`} className="room-image" />
              <button
                className="remove-btn"
                onClick={(e) => {
                  e.stopPropagation();
                  handleRemoveImage(idx);
                }}
              >
                &times;
              </button>
              {idx === 0 && <div className="first-image-badge">대표</div>}
            </div>
          ))}
        </div>

        <h2 className="section-title">객실 정보</h2>
        <button className="add-room-button" onClick={() => setIsModalOpen(true)}>
          객실 추가
        </button>

        <div className="room-grid">
          {rooms.map((room, idx) => (
            <div key={idx} className="room-card image-wrapper">
              <div className="room-card">
                {room.images && room.images.length > 0 && room.images[0] instanceof File && (
                  <img 
                    className="room-image" 
                    src={URL.createObjectURL(room.images[0])} 
                    alt={room.roomName}
                  />
                )}
                <div className="room-content">
                  <h4 className="room-name">{room.roomName}</h4>
                  <p className="room-text">객실 개수: {room.roomCount}개</p>
                  {room.price && <p className="room-text">가격: {Number(room.price).toLocaleString()}원</p>}
                  <p className="room-text">침대 {room.bedCount ?? 0}개 · 욕실 {room.bathroomCount ?? 0}개 · 최대 {room.maxOccupancy ?? 0}명</p>
                  {room.images && room.images.length > 0 && (
                    <p className="room-text">이미지: {room.images.length}개</p>
                  )}
                </div>
              </div>
              <button
                className="remove-btn"
                onClick={() => handleRemoveRoom(idx)}
              >
                &times;
              </button>
              <button
                className="hotel-edit-btn"
                onClick={() => handleEditRoom(idx)}
              >
                &#9998;
              </button>
            </div>
          ))}
        </div>

        <div className="action-buttons">
          <button className="btn-secondary" onClick={() => navigate(-1)}>
            취소
          </button>
          <button className="btn-primary" onClick={handleSubmit}>
            등록
          </button>
        </div>
      </div>

      {isModalOpen && (
        <RoomModal
          initialData={editingRoomIdx !== null ? rooms[editingRoomIdx] : null}
          onClose={() => {
            setIsModalOpen(false);
            setEditingRoomIdx(null);
          }}
          onSave={(room) => {
            if (editingRoomIdx !== null) {
              setRooms((prev) => prev.map((r, i) => (i === editingRoomIdx ? room : r)));
            } else {
              setRooms((prev) => [...prev, room]);
            }
          }}
        />
      )}
    </div>
  );
};

export default HotelRegisterPage; 