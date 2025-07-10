import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import RoomModal from './RoomModal';
import axios from 'axios';
import './Hotel.css';

const HotelEditPage = ({ isAdmin = false }) => {
  const navigate = useNavigate();
  const { id } = useParams();
  const fileInputRef = useRef(null);
  const [loading, setLoading] = useState(true);
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
  const [existingImages, setExistingImages] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [draggedIdx, setDraggedIdx] = useState(null);
  const [draggedType, setDraggedType] = useState(null); // 'existing' or 'new'

  // 기존 호텔 정보 불러오기
  useEffect(() => {
    const fetchHotelData = async () => {
      try {
        const response = await axios.get(`/api/hotel/${id}`);
        const hotel = response.data;
        
        setHotelInfo({
          name: hotel.name || '',
          address: hotel.address || '',
          phone: hotel.phone || '',
          breakfastIncluded: hotel.breakfast || false,
          breakfastPrice: hotel.breakfastPrice || '',
          email: hotel.email || '',
          description: hotel.description || '',
        });

        // 기존 이미지 설정
        if (hotel.images && hotel.images.length > 0) {
          setExistingImages(hotel.images);
        }

        // 기존 객실 정보 설정
        if (hotel.rooms && hotel.rooms.length > 0) {
          const roomsData = hotel.rooms.map(room => ({
            roomName: room.name || '',
            price: room.price || 0,
            roomCount: room.capacity || 0,
            bedCount: room.beds || 0,
            bathroomCount: room.bathrooms || 0,
            maxOccupancy: room.people || 0,
            images: [], // 기존 이미지는 별도로 표시하지 않고 빈 배열로 설정
            existingImages: room.roomImages ? room.roomImages.map(img => img.imageUrl) : [],
            id: room.id
          }));
          setRooms(roomsData);
        }

        setLoading(false);
      } catch (error) {
        console.error('호텔 정보 불러오기 실패:', error);
        alert('호텔 정보를 불러오는데 실패했습니다.');
        navigate('/HotelPageAdmin');
      }
    };

    if (id) {
      fetchHotelData();
    }
  }, [id, navigate]);
    
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

  const handleSubmit = async () => {
    if(hotelInfo.name === '' || hotelInfo.address === '' || hotelInfo.email === '' || hotelInfo.phone === '' || hotelInfo.description === '' || (existingImages.length === 0 && images.length === 0) || rooms.length === 0){
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
    formData.append('breakfastPrice', hotelInfo.breakfastPrice || 0);
    formData.append('description', hotelInfo.description);

    // 남아있는 기존 이미지 정보 추가
    existingImages.forEach((image, index) => {
      formData.append(`existingImages[${index}].id`, image.id);
      formData.append(`existingImages[${index}].imageUrl`, image.imageUrl);
    });

    // 새로운 호텔 이미지 추가
    images.forEach((image, index) => {
      formData.append(`imagesFiles`, image);
    });

    // 객실 정보 추가 (남아있는 객실만)
    rooms.forEach((room, roomIndex) => {
      console.log('Room data:', room); // 디버깅용
      
      // 필수 필드 체크와 기본값 설정
      const roomName = room.roomName || `객실 ${roomIndex + 1}`;
      const price = room.price || 0;
      const capacity = room.roomCount || 1;
      const beds = room.bedCount || 1;
      const bathrooms = room.bathroomCount || 1;
      const people = room.maxOccupancy || 1;
      
      formData.append(`rooms[${roomIndex}].name`, roomName);
      formData.append(`rooms[${roomIndex}].price`, price);
      formData.append(`rooms[${roomIndex}].capacity`, capacity);
      formData.append(`rooms[${roomIndex}].beds`, beds);
      formData.append(`rooms[${roomIndex}].bathrooms`, bathrooms);
      formData.append(`rooms[${roomIndex}].people`, people);
      
      // 기존 룸의 ID가 있으면 추가 (업데이트용)
      if (room.id) {
        formData.append(`rooms[${roomIndex}].id`, room.id);
      }

      // 남아있는 기존 룸 이미지 정보 추가
      if (room.existingImages && room.existingImages.length > 0) {
        room.existingImages.forEach((imageUrl, imageIndex) => {
          formData.append(`rooms[${roomIndex}].existingRoomImages[${imageIndex}]`, imageUrl);
        });
      }

      // 객실 이미지 추가 (새로 추가된 파일들만)
      if (room.images && room.images.length > 0) {
        room.images.forEach((image, imageIndex) => {
          // File 객체인 경우에만 formData에 추가 (새로 추가된 이미지)
          if (image instanceof File) {
            formData.append(`rooms[${roomIndex}].roomImagesFiles`, image);
          }
        });
      }
    });

    // FormData 내용 확인 (디버깅용)
    console.log('FormData entries:');
    for (let [key, value] of formData.entries()) {
      console.log(key, value);
    }

    try {
      // 수정 API 호출 (PUT 방식)
      const response = await axios.put(`/api/hotel/${id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      
      alert('호텔이 성공적으로 수정되었습니다.');
      navigate('/HotelPageAdmin');
    } catch (error) {
      console.error('호텔 수정 실패:', error);
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

  // 이미지 클릭으로 맨 앞으로 이동 (기존 이미지와 새 이미지 모두 처리)
  const handleImageClick = (idx, type) => {
    if (idx === 0) return;
    
    if (type === 'existing') {
      setExistingImages((prev) => {
        const newArr = [...prev];
        const [selected] = newArr.splice(idx, 1);
        return [selected, ...newArr];
      });
    } else if (type === 'new') {
      setImages((prev) => {
        const newArr = [...prev];
        const [selected] = newArr.splice(idx, 1);
        return [selected, ...newArr];
      });
    }
  };

  // 드래그앤드롭 핸들러들
  const handleDragStart = (idx, type) => () => {
    setDraggedIdx(idx);
    setDraggedType(type);
  };

  const handleDrop = (idx, type) => () => {
    if (draggedIdx === null || draggedType === null || (draggedIdx === idx && draggedType === type)) {
      setDraggedIdx(null);
      setDraggedType(null);
      return;
    }

    if (draggedType === 'existing' && type === 'existing') {
      // 기존 이미지 간 순서 변경
      setExistingImages((prev) => {
        const newArr = [...prev];
        const [moved] = newArr.splice(draggedIdx, 1);
        newArr.splice(idx, 0, moved);
        return newArr;
      });
    } else if (draggedType === 'new' && type === 'new') {
      // 새 이미지 간 순서 변경
      setImages((prev) => {
        const newArr = [...prev];
        const [moved] = newArr.splice(draggedIdx, 1);
        newArr.splice(idx, 0, moved);
        return newArr;
      });
    } else if (draggedType === 'existing' && type === 'new') {
      // 기존 이미지를 새 이미지 위치로 이동
      const movedImage = existingImages[draggedIdx];
      setExistingImages((prev) => prev.filter((_, i) => i !== draggedIdx));
      setImages((prev) => {
        const newArr = [...prev];
        newArr.splice(idx, 0, movedImage);
        return newArr;
      });
    } else if (draggedType === 'new' && type === 'existing') {
      // 새 이미지를 기존 이미지 위치로 이동
      const movedImage = images[draggedIdx];
      setImages((prev) => prev.filter((_, i) => i !== draggedIdx));
      setExistingImages((prev) => {
        const newArr = [...prev];
        newArr.splice(idx, 0, movedImage);
        return newArr;
      });
    }
    
    setDraggedIdx(null);
    setDraggedType(null);
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

  if (loading) {
    return <div className="loading">호텔 정보를 불러오는 중...</div>;
  }

  return (
    <div className="register-container">
      <div className="register-wrapper">
        <h2 className="section-title1">호텔 수정</h2>
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
          {/* 기존 이미지 표시 */}
          {existingImages.map((image, idx) => (
            <div 
              key={`existing-${idx}`} 
              className="room-card rep-card image-wrapper"
              onClick={() => handleImageClick(idx, 'existing')}
              draggable
              onDragStart={handleDragStart(idx, 'existing')}
              onDragOver={(e) => e.preventDefault()}
              onDrop={handleDrop(idx, 'existing')}
              style={{ cursor: 'move' }}
            >
              <img 
<<<<<<< HEAD
                src={`http://10.100.105.22:8080/api/images${encodeURI(image.imageUrl)}`} 
=======
                src={`${(image.imageUrl)}`} 
>>>>>>> 902477c (initial commit)
                alt={`existing-img-${idx}`} 
                className="room-image" 
              />
              <button
                className="remove-btn"
                onClick={(e) => {
                  e.stopPropagation();
                  handleRemoveExistingImage(idx);
                }}
              >
                &times;
              </button>
              {idx === 0 && <div className="first-image-badge">대표</div>}
            </div>
          ))}
          
          {/* 새로 추가된 이미지 표시 */}
          {images.map((image, idx) => (
            <div
              key={`new-${idx}`}
              className="room-card rep-card image-wrapper"
              onClick={() => handleImageClick(idx, 'new')}
              draggable
              onDragStart={handleDragStart(idx, 'new')}
              onDragOver={(e) => e.preventDefault()}
              onDrop={handleDrop(idx, 'new')}
              style={{ cursor: 'move' }}
            >
              <img src={URL.createObjectURL(image)} alt={`new-img-${idx}`} className="room-image" />
              <button
                className="remove-btn"
                onClick={(e) => {
                  e.stopPropagation();
                  handleRemoveImage(idx);
                }}
              >
                &times;
              </button>
              {existingImages.length === 0 && idx === 0 && <div className="first-image-badge">대표</div>}
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
                {/* 룸 이미지 표시 (기존 이미지 우선) */}
                {room.existingImages && room.existingImages.length > 0 ? (
                  <img 
<<<<<<< HEAD
                    src={`http://10.100.105.22:8080/api/images${encodeURI(room.existingImages[0])}`} 
=======
                    src={(room.existingImages[0])} 
>>>>>>> 902477c (initial commit)
                    alt={`room-${idx}`} 
                    className="room-image" 
                  />
                ) : room.images && room.images.length > 0 && room.images[0] instanceof File ? (
                  <img 
                    src={URL.createObjectURL(room.images[0])} 
                    alt={`room-${idx}`} 
                    className="room-image" 
                  />
                ) : null}
                
                <div className="room-content">
                  <h4 className="room-name">{room.roomName}</h4>
                  <p className="room-text">객실 개수: {room.roomCount}개</p>
                  {room.price && <p className="room-text">가격: {Number(room.price).toLocaleString()}원</p>}
                  <p className="room-text">침대 {room.bedCount ?? 0}개 · 욕실 {room.bathroomCount ?? 0}개 · 최대 {room.maxOccupancy ?? 0}명</p>
                  {room.existingImages && room.existingImages.length > 0 && (
                    <p className="room-text">기존 이미지: {room.existingImages.length}개</p> 
                  )}
                  {room.images && room.images.length > 0 && (
                    <p className="room-text">새 이미지: {room.images.length}개</p>
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
<<<<<<< HEAD
                className="edit-btn"
=======
                className="hotel-edit-btn"
>>>>>>> 902477c (initial commit)
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
            수정 완료
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

export default HotelEditPage; 