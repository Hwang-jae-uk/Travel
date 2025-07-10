import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import './Cafe.css';

const CafeEditPage = ({ isAdmin = false }) => {
  const navigate = useNavigate();
  const { id } = useParams();
  const fileInputRef = useRef(null);
  const [loading, setLoading] = useState(true);
  const [cafeInfo, setCafeInfo] = useState({
    name: '',
    address: '',
    phone: '',
    email: '',
    description: '',
    openTime: '',
    closeTime: '',
    facilities: {
      wifi: false,
      parking: false,
      takeout: false,
      delivery: false
    }
  });

  const [images, setImages] = useState([]);
  const [existingImages, setExistingImages] = useState([]);
  const [draggedIdx, setDraggedIdx] = useState(null);
  const [draggedType, setDraggedType] = useState(null); // 'existing' or 'new'

  // 기존 카페 정보 불러오기
  useEffect(() => {
    const fetchCafeData = async () => {
      try {
        const response = await axios.get(`/api/cafe/${id}`);
        const cafe = response.data;
        
        setCafeInfo({
          name: cafe.name || '',
          address: cafe.address || '',
          phone: cafe.phone || '',
          email: cafe.email || '',
          description: cafe.description || '',
          openTime: cafe.openTime || '',
          closeTime: cafe.closeTime || '',
          facilities: {
            wifi: cafe.facilities?.wifi || false,
            parking: cafe.facilities?.parking || false,
            takeout: cafe.facilities?.takeout || false,
            delivery: cafe.facilities?.delivery || false
          }
        });

        // 기존 이미지 설정
        if (cafe.images && cafe.images.length > 0) {
          console.log(cafe.images);
          
          setExistingImages(cafe.images);
        }

        setLoading(false);
      } catch (error) {
        console.error('카페 정보 불러오기 실패:', error);
        alert('카페 정보를 불러오는데 실패했습니다.');
        navigate('/CafePageAdmin');
      }
    };

    if (id) {
      fetchCafeData();
    }
  }, [id, navigate]);
    
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (name.includes('facilities.')) {
      const facilityName = name.split('.')[1];
      setCafeInfo(prev => ({
        ...prev,
        facilities: {
          ...prev.facilities,
          [facilityName]: checked
        }
      }));
    } else {
      setCafeInfo(prev => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : value
      }));
    }
  };

  const handleAddImage = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    setImages(prev => [...prev, ...files]);
    
  };

  const handleSubmit = async () => {
    if (
      cafeInfo.name === '' || 
      cafeInfo.address === '' || 
      cafeInfo.email === '' || 
      cafeInfo.phone === '' || 
      cafeInfo.description === '' || 
      cafeInfo.openTime === '' || 
      cafeInfo.closeTime === '' || 
      (existingImages.length === 0 && images.length === 0)
    ) {
      alert('모든 항목을 필수로 입력해주세요.');
      return;
    }

    const formData = new FormData();

    // 카페 기본 정보 추가
    formData.append('name', cafeInfo.name);
    formData.append('address', cafeInfo.address);
    formData.append('email', cafeInfo.email);
    formData.append('phone', cafeInfo.phone);
    formData.append('description', cafeInfo.description);
    formData.append('openTime', cafeInfo.openTime);
    formData.append('closeTime', cafeInfo.closeTime);
    
    // 편의시설 정보 추가
    Object.entries(cafeInfo.facilities).forEach(([key, value]) => {
      formData.append(`facilities.${key}`, value);
    });

    // 남아있는 기존 이미지 정보 추가
    existingImages.forEach((image, index) => {
      formData.append(`existingImages[${index}].id`, image.id);
      formData.append(`existingImages[${index}].imageUrl`, image.imageUrl);
    });

    // 새로운 이미지 추가
    images.forEach((image, index) => {
      formData.append('imagesFiles', image);
    });

    try {
      // 수정 API 호출 (PUT 방식)
      const response = await axios.put(`/api/cafe/${id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      
      alert('카페가 성공적으로 수정되었습니다.');
      navigate('/CafePageAdmin');
    } catch (error) {
      console.error('카페 수정 실패:', error);
      alert('수정 중 오류가 발생했습니다.');
    }
  };

  // 기존 이미지 제거
  const handleRemoveExistingImage = (idx) => {
    setExistingImages((prev) => prev.filter((_, i) => i !== idx));
  };

  // 새 이미지 제거
  const handleRemoveImage = (idx) => {
    setImages((prev) => prev.filter((_, i) => i !== idx));
    
  };

  // 이미지 순서 변경을 위한 드래그 앤 드롭 핸들러
  const handleDragStart = (idx, type) => () => {
    setDraggedIdx(idx);
    setDraggedType(type);
  };

  const handleDrop = (idx, type) => () => {
    if (draggedIdx === null) return;

    if (draggedType === type) {
      // 같은 배열 내에서의 이동
      if (type === 'existing') {
        setExistingImages(prev => {
          const newImages = [...prev];
          const [draggedImage] = newImages.splice(draggedIdx, 1);
          newImages.splice(idx, 0, draggedImage);
          return newImages;
        });
      } else {
        setImages(prev => {
          const newImages = [...prev];
          const [draggedImage] = newImages.splice(draggedIdx, 1);
          newImages.splice(idx, 0, draggedImage);
          return newImages;
        });
        
      }
    } else {
      // 다른 배열 간의 이동
      if (draggedType === 'existing') {
        setExistingImages(prev => {
          const newExistingImages = [...prev];
          const [draggedImage] = newExistingImages.splice(draggedIdx, 1);
          setImages(prev => {
            const newImages = [...prev];
            newImages.splice(idx, 0, draggedImage);
            return newImages;
          });
          
          return newExistingImages;
        });
      } else {
        setImages(prev => {
          const newImages = [...prev];
          const [draggedImage] = newImages.splice(draggedIdx, 1);
          setExistingImages(prev => {
            const newExistingImages = [...prev];
            newExistingImages.splice(idx, 0, draggedImage);
            return newExistingImages;
          });
          
          return newImages;
        });
      }
    }

    setDraggedIdx(null);
    setDraggedType(null);
  };

  if (loading) {
    return <div>로딩 중...</div>;
  }

  return (
    <div className="cafe-edit-container">
      <div className="cafe-form">
        <h2 className="section-title">카페 정보 수정</h2>
        
        {/* 기본 정보 섹션 */}
        <div className="input-group">
          <label>카페 이름</label>
          <input
            type="text"
            name="name"
            value={cafeInfo.name}
            onChange={handleChange}
            placeholder="카페 이름을 입력하세요"
          />
        </div>

        <div className="input-group">
          <label>주소</label>
          <input
            type="text"
            name="address"
            value={cafeInfo.address}
            onChange={handleChange}
            placeholder="주소를 입력하세요"
          />
        </div>

        <div className="input-group">
          <label>연락처</label>
          <input
            type="text"
            name="phone"
            value={cafeInfo.phone}
            onChange={handleChange}
            placeholder="연락처를 입력하세요"
          />
        </div>

        <div className="input-group">
          <label>이메일</label>
          <input
            type="email"
            name="email"
            value={cafeInfo.email}
            onChange={handleChange}
            placeholder="이메일을 입력하세요"
          />
        </div>

        <div className="input-group">
          <label>영업 시작 시간</label>
          <input
            type="time"
            name="openTime"
            value={cafeInfo.openTime}
            onChange={handleChange}
          />
        </div>

        <div className="input-group">
          <label>영업 종료 시간</label>
          <input
            type="time"
            name="closeTime"
            value={cafeInfo.closeTime}
            onChange={handleChange}
          />
        </div>

        <div className="input-group">
          <label>설명</label>
          <textarea
            name="description"
            value={cafeInfo.description}
            onChange={handleChange}
            placeholder="카페 설명을 입력하세요"
          />
        </div>

        {/* 편의시설 섹션 */}
        <h2 className="section-title">편의시설</h2>
        <div className="checkbox-group">
          <input
            type="checkbox"
            name="facilities.wifi"
            checked={cafeInfo.facilities.wifi}
            onChange={handleChange}
            id="wifi"
          />
          <label htmlFor="wifi">와이파이</label>
        </div>

        <div className="checkbox-group">
          <input
            type="checkbox"
            name="facilities.parking"
            checked={cafeInfo.facilities.parking}
            onChange={handleChange}
            id="parking"
          />
          <label htmlFor="parking">주차</label>
        </div>

        <div className="checkbox-group">
          <input
            type="checkbox"
            name="facilities.takeout"
            checked={cafeInfo.facilities.takeout}
            onChange={handleChange}
            id="takeout"
          />
          <label htmlFor="takeout">포장</label>
        </div>

        <div className="checkbox-group">
          <input
            type="checkbox"
            name="facilities.delivery"
            checked={cafeInfo.facilities.delivery}
            onChange={handleChange}
            id="delivery"
          />
          <label htmlFor="delivery">배달</label>
        </div>

        {/* 이미지 섹션 */}
        <h2 className="section-title">이미지 관리</h2>
        <button className="add-image-button" onClick={handleAddImage}>
          이미지 추가
        </button>
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          multiple
          accept="image/*"
          style={{ display: 'none' }}
        />

        <div className="image-preview">
          {existingImages.map((image, idx) => (
            <div
              key={`existing-${idx}`}
              className="image-item"
              draggable
              onDragStart={handleDragStart(idx, 'existing')}
              onDragOver={(e) => e.preventDefault()}
              onDrop={handleDrop(idx, 'existing')}
            >
              <img src={`${image.imageUrl}`} alt={`카페 이미지 ${idx + 1}`} />
              <button
                className="remove-image"
                onClick={() => handleRemoveExistingImage(idx)}
              >
                ×
              </button>
              {idx === 0 && <span className="main-image-badge">대표 이미지</span>}
            </div>
          ))}
          {images.map((image, idx) => (
            
            <div
              key={`new-${idx}`}
              className="image-item"
              draggable
              onDragStart={handleDragStart(idx, 'new')}
              onDragOver={(e) => e.preventDefault()}
              onDrop={handleDrop(idx, 'new')}
            >
              <img src={URL.createObjectURL(image)} alt={`새 카페 이미지 ${idx + 1}`} />
              <button
                className="remove-image"
                onClick={() => handleRemoveImage(idx)}
              >
                ×
              </button>
              {existingImages.length === 0 && idx === 0 && (
                <span className="main-image-badge">대표 이미지</span>
              )}
            </div>
          ))}
        </div>

        {/* 액션 버튼 */}
        <div className="action-buttons">
          <button className="btn-secondary" onClick={() => navigate('/CafePageAdmin')}>
            취소
          </button>
          <button className="btn-primary" onClick={handleSubmit}>
            수정 완료
          </button>
        </div>
      </div>
    </div>
  );
};

export default CafeEditPage; 