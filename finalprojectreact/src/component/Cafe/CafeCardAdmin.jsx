import React from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Cafe.css';
import { IoWifi, IoTime } from "react-icons/io5";
import { MdLocalParking, MdCoffee } from "react-icons/md";

const CafeCardAdmin = ({ cafe, onDelete }) => {
    const navigate = useNavigate();

    

    const handleCardClick = (e) => {
        // 수정/삭제 버튼 클릭 시에는 상세 페이지로 이동하지 않음
        if (e.target.classList.contains('cafe-edit-btn') || 
            e.target.classList.contains('cafe-remove-btn') ||
            e.target.closest('.cafe-edit-btn') || 
            e.target.closest('.cafe-remove-btn')) {
            return;
        }
        navigate(`/cafe/${cafe.id}`);
    };

    const handleEdit = (e) => {
        navigate(`/CafeEdit/${cafe.id}`);
    };

    const handleDelete = async (e) => {
        e.stopPropagation();
        e.preventDefault();
        
        if (!window.confirm(`정말로 "${cafe.name}" 카페를 삭제하시겠습니까?`)) {
            return;
        }

        try {
            await axios.delete(`/api/cafe/${cafe.id}`);
            
            alert('카페가 성공적으로 삭제되었습니다.');
            onDelete(cafe.id);
            
        } catch (error) {
            console.error('카페 삭제 실패:', error);
            alert(error.response?.data?.error || '카페 삭제에 실패했습니다.');
        }
    };

    return (
        <div className="cafe-card-admin" onClick={handleCardClick}>
            <div className="cafe-image-container">
                {cafe.images && cafe.images.length > 0 && cafe.images[0]?.imageUrl ? (
                    <img 
                        src={(cafe.images[0].imageUrl)} 
                        alt={cafe.name}
                        className="cafe-image"
                        onError={(e) => {
                            e.target.style.display = 'none';
                        }}
                    />
                ) : (
                    <div className="no-image"><MdCoffee size={24} /> 이미지 없음</div>
                )}
            </div>
            
            <div className="cafe-info">
                <h3 className="cafe-name">{cafe.name}</h3>
                <p className="cafe-address">{cafe.address}</p>
                <p className="cafe-phone">{cafe.phone}</p>
                {cafe.email && <p className="cafe-email">{cafe.email}</p>}
                
                <div className="cafe-features">
                    <span className={`feature ${cafe.wifi ? 'active' : ''}`}>
                        <IoWifi size={18} /> Wi-Fi {cafe.wifi ? '가능' : '불가'}
                    </span>
                    <span className={`feature ${cafe.parking ? 'active' : ''}`}>
                        <MdLocalParking size={18} /> 주차 {cafe.parking ? '가능' : '불가'}
                    </span>
                </div>
                
                {cafe.openTime && cafe.closeTime && (
                    <p className="cafe-hours">
                        <IoTime size={18} /> {cafe.openTime} - {cafe.closeTime}
                    </p>
                )}
            </div>
            
            {/* 관리자 액션 버튼들 */}
           
            <button 
                className="cafe-edit-btn" 
                onClick={handleEdit}
                title="카페 수정"
            >
                &#9998;
            </button>
            
            
            <button 
                className="cafe-remove-btn" 
                onClick={handleDelete}
                title="카페 삭제"
            >
                &times;
            </button>
          
        </div>
    );
};

export default CafeCardAdmin; 