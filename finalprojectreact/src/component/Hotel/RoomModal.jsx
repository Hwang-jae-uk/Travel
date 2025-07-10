import React, { useState, useEffect, useRef } from 'react';
import './Hotel.css';

const RoomModal = ({ onClose, onSave, initialData }) => {
  const fileInputRef = useRef(null);
  const [roomInfo, setRoomInfo] = useState({
    roomName: '',
    price: '',
    roomCount: '',
    bedCount: '',
    bathroomCount: '',
    maxOccupancy: '',
    images: [],
    existingImages: []
  });
  const [previewImages, setPreviewImages] = useState([]);
  const [existingImages, setExistingImages] = useState([]);
  const [draggedIdx, setDraggedIdx] = useState(null);
  const [draggedType, setDraggedType] = useState(null); // 'existing' or 'new'

  useEffect(() => {
    if (initialData) {
      setRoomInfo(initialData);
      setPreviewImages(initialData.images || []);
      setExistingImages(initialData.existingImages || []);
    }
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setRoomInfo(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAddImageClick = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    setRoomInfo(prev => ({
      ...prev,
      images: [...prev.images, ...files]
    }));
    setPreviewImages(prev => [...prev, ...files]);
  };

  const handleRemoveImage = (index) => {
    setRoomInfo(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
    setPreviewImages(prev => prev.filter((_, i) => i !== index));
  };

  const handleRemoveExistingImage = (index) => {
    setExistingImages(prev => prev.filter((_, i) => i !== index));
    setRoomInfo(prev => ({
      ...prev,
      existingImages: prev.existingImages.filter((_, i) => i !== index)
    }));
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
      setExistingImages(prev => {
        const newArr = [...prev];
        const [moved] = newArr.splice(draggedIdx, 1);
        newArr.splice(idx, 0, moved);
        return newArr;
      });
      setRoomInfo(prev => ({
        ...prev,
        existingImages: prev.existingImages ? (() => {
          const newArr = [...prev.existingImages];
          const [moved] = newArr.splice(draggedIdx, 1);
          newArr.splice(idx, 0, moved);
          return newArr;
        })() : []
      }));
    } else if (draggedType === 'new' && type === 'new') {
      // 새 이미지 간 순서 변경
      setPreviewImages(prev => {
        const newArr = [...prev];
        const [moved] = newArr.splice(draggedIdx, 1);
        newArr.splice(idx, 0, moved);
        return newArr;
      });
      setRoomInfo(prev => ({
        ...prev,
        images: (() => {
          const newArr = [...prev.images];
          const [moved] = newArr.splice(draggedIdx, 1);
          newArr.splice(idx, 0, moved);
          return newArr;
        })()
      }));
    }
    
    setDraggedIdx(null);
    setDraggedType(null);
  };

  // 이미지 클릭으로 맨 앞으로 이동
  const handleImageClick = (idx, type) => {
    if (idx === 0) return;
    
    if (type === 'existing') {
      setExistingImages(prev => {
        const newArr = [...prev];
        const [selected] = newArr.splice(idx, 1);
        return [selected, ...newArr];
      });
      setRoomInfo(prev => ({
        ...prev,
        existingImages: prev.existingImages ? (() => {
          const newArr = [...prev.existingImages];
          const [selected] = newArr.splice(idx, 1);
          return [selected, ...newArr];
        })() : []
      }));
    } else if (type === 'new') {
      setPreviewImages(prev => {
        const newArr = [...prev];
        const [selected] = newArr.splice(idx, 1);
        return [selected, ...newArr];
      });
      setRoomInfo(prev => ({
        ...prev,
        images: (() => {
          const newArr = [...prev.images];
          const [selected] = newArr.splice(idx, 1);
          return [selected, ...newArr];
        })()
      }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!roomInfo.roomName || !roomInfo.price || !roomInfo.roomCount || 
        !roomInfo.bedCount || !roomInfo.bathroomCount || !roomInfo.maxOccupancy) {
      alert('모든 필드를 입력해주세요.');
      return;
    }
    
    // 현재 남아있는 기존 이미지 정보도 함께 전달
    const updatedRoomInfo = {
      ...roomInfo,
      existingImages: existingImages
    };
    
    onSave(updatedRoomInfo);
    onClose();
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <label>객실명</label>
            <input
              type="text"
              name="roomName"
              value={roomInfo.roomName}
              onChange={handleChange}
              required
            />
          </div>
          <div className="input-group">
            <label>가격</label>
            <input
              type="number"
              name="price"
              value={roomInfo.price}
              onChange={handleChange}
              required
            />
          </div>
          <div className="input-group">
            <label>객실 수</label>
            <input
              type="number"
              name="roomCount"
              value={roomInfo.roomCount}
              onChange={handleChange}
              required
            />
          </div>
          <div className="input-group">
            <label>침대 수</label>
            <input
              type="number"
              name="bedCount"
              value={roomInfo.bedCount}
              onChange={handleChange}
              required
            />
          </div>
          <div className="input-group">
            <label>욕실 수</label>
            <input
              type="number"
              name="bathroomCount"
              value={roomInfo.bathroomCount}
              onChange={handleChange}
              required
            />
          </div>
          <div className="input-group">
            <label>최대 수용 인원</label>
            <input
              type="number"
              name="maxOccupancy"
              value={roomInfo.maxOccupancy}
              onChange={handleChange}
              required
            />
          </div>
          <div className="input-group">
            <label>객실 이미지</label>
            <button type="button" className="add-room-button" onClick={handleAddImageClick}>
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
          </div>
          <div className="room-grid">
            {/* 기존 이미지 표시 */}
            {existingImages.map((imageUrl, idx) => (
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
                  src={(imageUrl)} 
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
            {previewImages.map((image, idx) => (
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
          <div className="modal-buttons">
            <button type="button" onClick={onClose} className="btn-secondary">
              취소
            </button>
            <button type="submit" className="btn-primary">
              {initialData ? '수정' : '추가'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RoomModal; 