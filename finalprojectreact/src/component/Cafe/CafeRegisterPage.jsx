import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Cafe.css';

const CafeRegisterPage = ({ isAdmin = false }) => {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const [cafeInfo, setCafeInfo] = useState({
    name: '',
    address: '',
    phone: '',
    email: '',
    description: '',
    openTime: '',
    closeTime: '',
    wifi: false,
    parking: false
  });

  const [images, setImages] = useState([]);
  const [draggedIdx, setDraggedIdx] = useState(null);
    
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setCafeInfo({
      ...cafeInfo,
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
    if(cafeInfo.name === '' || cafeInfo.address === '' || cafeInfo.phone === '' || cafeInfo.description === '' || images.length === 0){
      alert('필수 항목을 모두 입력해주세요. (이름, 주소, 전화번호, 설명, 이미지)');
      return;
    }

    const formData = new FormData();

    // 카페 기본 정보 추가
    formData.append('name', cafeInfo.name);
    formData.append('address', cafeInfo.address);
    formData.append('phone', cafeInfo.phone);
    formData.append('email', cafeInfo.email);
    formData.append('description', cafeInfo.description);
    formData.append('openTime', cafeInfo.openTime);
    formData.append('closeTime', cafeInfo.closeTime);
    formData.append('wifi', cafeInfo.wifi);
    formData.append('parking', cafeInfo.parking);

    // 카페 이미지 추가
    images.forEach((image) => {
      formData.append('imagesFiles', image);
    });

    // API 호출
    axios.post('/api/cafe', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
    .then(() => {
      alert('카페가 성공적으로 등록되었습니다.');
      navigate('/CafePageAdmin');
    })
    .catch((err) => {
      console.error('카페 등록 실패:', err);
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
        <h2 className="section-title1">카페 기본 정보</h2>
        <div className="input-group">
          <label>카페명</label>
          <input name="name" type="text" value={cafeInfo.name} onChange={handleChange} />
        </div>
        <div className="input-group">
          <label>주소</label>
          <input name="address" type="text" value={cafeInfo.address} onChange={handleChange} />
        </div>
        <div className="input-group">
          <label>전화번호</label>
          <input name="phone" type="text" value={cafeInfo.phone} onChange={handleChange} />
        </div>
        <div className="input-group">
          <label>이메일</label>
          <input name="email" type="email" value={cafeInfo.email} onChange={handleChange} />
        </div>

        <div className="input-group">
          <label>영업 시간</label>
          <div className="time-row">
            <input
              type="time"
              name="openTime"
              value={cafeInfo.openTime}
              onChange={handleChange}
            />
            <span>~</span>
            <input
              type="time"
              name="closeTime"
              value={cafeInfo.closeTime}
              onChange={handleChange}
            />
          </div>
        </div>

        <div className="input-group">
          <label>편의시설</label>
          <div className="facilities-row">
            <label>
              <input
                type="checkbox"
                name="wifi"
                checked={cafeInfo.wifi}
                onChange={handleChange}
              />
              <span>Wi-Fi</span>
            </label>
            <label>
              <input
                type="checkbox"
                name="parking"
                checked={cafeInfo.parking}
                onChange={handleChange}
              />
              <span>주차</span>
            </label>
          </div>
        </div>

        <div className="input-group">
          <label>카페 소개</label>
          <textarea
            name="description"
            value={cafeInfo.description}
            onChange={handleChange}
            rows="3"
            style={{ flex: 1, padding: '0.6rem 0.9rem', borderRadius: '8px', border: '1px solid #ddd', minHeight: '200px', maxHeight: '200px' }}
          />
        </div>

        <h2 className="section-title">카페 이미지</h2>
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

export default CafeRegisterPage; 