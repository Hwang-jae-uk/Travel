import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Restaurant.css';

const RestaurantRegisterPage = ({ isAdmin = false }) => {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const [restaurantInfo, setRestaurantInfo] = useState({
    name: '',
    address: '',
    phone: '',
    description: '',
    openTime: '',
    closeTime: '',
    cuisine: '',
    hasParking: false,
    hasReservation: false,
    hasDelivery: false
  });

  const [images, setImages] = useState([]);
  const [draggedIdx, setDraggedIdx] = useState(null);

  const cuisineTypes = ['한식', '중식', '일식', '양식', '이탈리안', '프렌치', '멕시칸', '인도', '태국', '베트남', '기타'];
    
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setRestaurantInfo({
      ...restaurantInfo,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  const handleAddImage = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    setImages(prev => [...prev, ...files]);
  };

  const handleSubmit = () => {
    if(restaurantInfo.name === '' || restaurantInfo.address === '' || restaurantInfo.phone === '' || 
       restaurantInfo.description === '' || restaurantInfo.cuisine === '' || images.length === 0){
      alert('필수 항목을 모두 입력해주세요. (이름, 주소, 전화번호, 설명, 음식 종류, 이미지)');
      return;
    }

    const formData = new FormData();

    // 레스토랑 기본 정보 추가
    formData.append('name', restaurantInfo.name);
    formData.append('address', restaurantInfo.address);
    formData.append('phone', restaurantInfo.phone);
    formData.append('cuisine', restaurantInfo.cuisine);
    formData.append('openTime', restaurantInfo.openTime);
    formData.append('closeTime', restaurantInfo.closeTime);
    formData.append('description', restaurantInfo.description);
    formData.append('hasParking', restaurantInfo.hasParking);
    formData.append('hasReservation', restaurantInfo.hasReservation);
    formData.append('hasDelivery', restaurantInfo.hasDelivery);

    // 레스토랑 이미지 추가
    images.forEach((image) => {
      formData.append('imagesFiles', image);
    });

    // API 호출
    axios.post('/api/restaurants', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
    .then(() => {
      alert('레스토랑이 성공적으로 등록되었습니다.');
      navigate('/RestaurantPageAdmin');
    })
    .catch((err) => {
      console.error('레스토랑 등록 실패:', err);
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

  return (
    <div className="register-container">
      <div className="register-wrapper">
        <h2 className="section-title1">레스토랑 기본 정보</h2>
        <div className="input-group">
          <label>레스토랑명</label>
          <input name="name" type="text" value={restaurantInfo.name} onChange={handleChange} />
        </div>
        <div className="input-group">
          <label>주소</label>
          <input name="address" type="text" value={restaurantInfo.address} onChange={handleChange} />
        </div>
        <div className="input-group">
          <label>전화번호</label>
          <input name="phone" type="text" value={restaurantInfo.phone} onChange={handleChange} />
        </div>


        <div className="input-group">
          <label>영업 시간</label>
          <div className="time-row">
            <input
              type="time"
              name="openTime"
              value={restaurantInfo.openTime}
              onChange={handleChange}
            />
            <span>~</span>
            <input
              type="time"
              name="closeTime"
              value={restaurantInfo.closeTime}
              onChange={handleChange}
            />
          </div>
        </div>

        <div className="input-group">
          <label>음식 종류</label>
          <select
            name="cuisine"
            value={restaurantInfo.cuisine}
            onChange={handleChange}
            className="search-select"
          >
            <option value="">선택해주세요</option>
            {cuisineTypes.map(cuisine => (
              <option key={cuisine} value={cuisine}>{cuisine}</option>
            ))}
          </select>
        </div>

        <div className="input-group">
          <label>편의시설</label>
          <div className="facilities-row">
            <label>
              <input
                type="checkbox"
                name="hasParking"
                checked={restaurantInfo.hasParking}
                onChange={handleChange}
              />
              <span>주차</span>
            </label>
            <label>
              <input
                type="checkbox"
                name="hasReservation"
                checked={restaurantInfo.hasReservation}
                onChange={handleChange}
              />
              <span>예약</span>
            </label>
            <label>
              <input
                type="checkbox"
                name="hasDelivery"
                checked={restaurantInfo.hasDelivery}
                onChange={handleChange}
              />
              <span>배달</span>
            </label>
          </div>
        </div>

        <div className="input-group">
          <label>레스토랑 소개</label>
          <textarea
            name="description"
            value={restaurantInfo.description}
            onChange={handleChange}
            rows="3"
            style={{ flex: 1, padding: '0.6rem 0.9rem', borderRadius: '8px', border: '1px solid #ddd', minHeight: '200px', maxHeight: '200px' }}
          />
        </div>

        <h2 className="section-title">레스토랑 이미지</h2>
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

        <div className="action-buttons">
          <button className="btn-secondary" onClick={() => navigate(-1)}>
            취소
          </button>
          <button className="btn-primary" onClick={handleSubmit}>
            등록
          </button>
        </div>
      </div>
    </div>
  );
};

export default RestaurantRegisterPage; 