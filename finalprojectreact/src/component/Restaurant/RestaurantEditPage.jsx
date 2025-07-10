import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import './Restaurant.css';

const RestaurantEditPage = ({ isAdmin = false }) => {
  const navigate = useNavigate();
  const { id } = useParams();
  const fileInputRef = useRef(null);
  const [loading, setLoading] = useState(true);
  const [restaurantInfo, setRestaurantInfo] = useState({
    name: '',
    address: '',
    phone: '',
    email: '',
    description: '',
    openTime: '',
    closeTime: '',
    cuisine: '',
    priceRange: '',
    facilities: {
      parking: false,
      reservation: false,
      delivery: false,
      takeout: false
    }
  });

  const [images, setImages] = useState([]);
  const [existingImages, setExistingImages] = useState([]);
  const [draggedIdx, setDraggedIdx] = useState(null);
  const [draggedType, setDraggedType] = useState(null); // 'existing' or 'new'

  const cuisineTypes = [
    '한식', '중식', '일식', '양식', '분식',
    '카페/디저트', '패스트푸드', '세계음식', '기타'
  ];

  const priceRanges = [
    '만원 미만', '1-2만원', '2-3만원', '3-4만원', '4-5만원', '5만원 이상'
  ];

  // 기존 레스토랑 정보 불러오기
  useEffect(() => {
    const fetchRestaurantData = async () => {
      try {
        const response = await axios.get(`/api/restaurants/${id}`);
        const restaurant = response.data;
        
        setRestaurantInfo({
          name: restaurant.name || '',
          address: restaurant.address || '',
          phone: restaurant.phone || '',
          description: restaurant.description || '',
          openTime: restaurant.openTime || '',
          closeTime: restaurant.closeTime || '',
          cuisine: restaurant.cuisine || '',
          facilities: {
            parking: restaurant.facilities?.parking || false,
            reservation: restaurant.facilities?.reservation || false,
            delivery: restaurant.facilities?.delivery || false,
            takeout: restaurant.facilities?.takeout || false
          }
        });

        // 기존 이미지 설정
        if (restaurant.images && restaurant.images.length > 0) {
          setExistingImages(restaurant.images);
          console.log(restaurant.images)
<<<<<<< HEAD
=======
          console.log(restaurant.images[0])
>>>>>>> 902477c (initial commit)
        }

        setLoading(false);
      } catch (error) {
        console.error('레스토랑 정보 불러오기 실패:', error);
        alert('레스토랑 정보를 불러오는데 실패했습니다.');
        navigate('/RestaurantPageAdmin');
      }
    };

    if (id) {
      fetchRestaurantData();
    }
  }, [id, navigate]);
    
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (name.includes('facilities.')) {
      const facilityName = name.split('.')[1];
      setRestaurantInfo(prev => ({
        ...prev,
        facilities: {
          ...prev.facilities,
          [facilityName]: checked
        }
      }));
    } else {
      setRestaurantInfo(prev => ({
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
<<<<<<< HEAD
=======
    console.log(images)
>>>>>>> 902477c (initial commit)
  };

  const handleSubmit = async () => {
    if (
      restaurantInfo.name === '' || 
      restaurantInfo.address === '' || 
      restaurantInfo.phone === '' || 
      restaurantInfo.description === '' || 
      restaurantInfo.openTime === '' || 
      restaurantInfo.closeTime === '' || 
      restaurantInfo.cuisine === '' || 
      restaurantInfo.priceRange === '' || 
      (existingImages.length === 0 && images.length === 0)
    ) {
      alert('모든 항목을 필수로 입력해주세요.');
      return;
    }

    const formData = new FormData();

    // 레스토랑 기본 정보 추가
    formData.append('name', restaurantInfo.name);
    formData.append('address', restaurantInfo.address);
    formData.append('phone', restaurantInfo.phone);
    formData.append('description', restaurantInfo.description);
    formData.append('openTime', restaurantInfo.openTime);
    formData.append('closeTime', restaurantInfo.closeTime);
    formData.append('cuisine', restaurantInfo.cuisine);
    formData.append('priceRange', restaurantInfo.priceRange);
    
    // 편의시설 정보 추가
    Object.entries(restaurantInfo.facilities).forEach(([key, value]) => {
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
      const response = await axios.put(`/api/restaurants/${id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
<<<<<<< HEAD
=======
      console.log(response.data)
>>>>>>> 902477c (initial commit)
      
      alert('레스토랑이 성공적으로 수정되었습니다.');
      navigate('/RestaurantPageAdmin');
    } catch (error) {
      console.error('레스토랑 수정 실패:', error);
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
    <div className="restaurant-edit-container">
      <div className="restaurant-form">
        <h2 className="section-title">레스토랑 정보 수정</h2>
        
        {/* 기본 정보 섹션 */}
        <div className="input-group">
          <label>레스토랑 이름</label>
          <input
            type="text"
            name="name"
            value={restaurantInfo.name}
            onChange={handleChange}
            placeholder="레스토랑 이름을 입력하세요"
          />
        </div>

        <div className="input-group">
          <label>주소</label>
          <input
            type="text"
            name="address"
            value={restaurantInfo.address}
            onChange={handleChange}
            placeholder="주소를 입력하세요"
          />
        </div>

        <div className="input-group">
          <label>연락처</label>
          <input
            type="text"
            name="phone"
            value={restaurantInfo.phone}
            onChange={handleChange}
            placeholder="연락처를 입력하세요"
          />
        </div>

        <div className="input-group">
          <label>영업 시작 시간</label>
          <input
            type="time"
            name="openTime"
            value={restaurantInfo.openTime}
            onChange={handleChange}
          />
        </div>

        <div className="input-group">
          <label>영업 종료 시간</label>
          <input
            type="time"
            name="closeTime"
            value={restaurantInfo.closeTime}
            onChange={handleChange}
          />
        </div>

        <div className="input-group">
          <label>음식 종류</label>
          <select
            name="cuisine"
            value={restaurantInfo.cuisine}
            onChange={handleChange}
          >
            <option value="">음식 종류 선택</option>
            {cuisineTypes.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </div>

        <div className="input-group">
          <label>설명</label>
          <textarea
            name="description"
            value={restaurantInfo.description}
            onChange={handleChange}
            placeholder="레스토랑 설명을 입력하세요"
          />
        </div>

        {/* 편의시설 섹션 */}
        <h2 className="section-title">편의시설</h2>
        <div className="checkbox-group">
          <input
            type="checkbox"
            name="facilities.parking"
            checked={restaurantInfo.facilities.parking}
            onChange={handleChange}
            id="parking"
          />
          <label htmlFor="parking">주차</label>
        </div>

        <div className="checkbox-group">
          <input
            type="checkbox"
            name="facilities.reservation"
            checked={restaurantInfo.facilities.reservation}
            onChange={handleChange}
            id="reservation"
          />
          <label htmlFor="reservation">예약</label>
        </div>

        <div className="checkbox-group">
          <input
            type="checkbox"
            name="facilities.delivery"
            checked={restaurantInfo.facilities.delivery}
            onChange={handleChange}
            id="delivery"
          />
          <label htmlFor="delivery">배달</label>
        </div>

        <div className="checkbox-group">
          <input
            type="checkbox"
            name="facilities.takeout"
            checked={restaurantInfo.facilities.takeout}
            onChange={handleChange}
            id="takeout"
          />
          <label htmlFor="takeout">포장</label>
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
<<<<<<< HEAD
              <img src={`http://10.100.105.22:8080/api/images${image}`} alt={`레스토랑 이미지 ${idx + 1}`} />
=======
              <img src={`${image.imagePath}`} alt={`레스토랑 이미지 ${idx + 1}`} />
>>>>>>> 902477c (initial commit)
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
              <img src={URL.createObjectURL(image)} alt={`새 레스토랑 이미지 ${idx + 1}`} />
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
          <button className="btn-secondary" onClick={() => navigate('/RestaurantPageAdmin')}>
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

export default RestaurantEditPage; 