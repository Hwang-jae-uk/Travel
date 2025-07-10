import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import CafeReviews from './CafeReviews';
import CafeMapModal from './CafeMapModal';
import './Cafe.css';
import { IoCamera, IoLocationSharp, IoWifi } from "react-icons/io5";
import { MdLocalParking } from "react-icons/md";

const CafeDetail = () => {
    const { id } = useParams();
    const [cafe, setCafe] = useState(null);
    const [showAllImages, setShowAllImages] = useState(false);
    const [selectedImageIndex, setSelectedImageIndex] = useState(0);
    const [loading, setLoading] = useState(true);
    const [imageLoadError, setImageLoadError] = useState(false);
    const [showMapModal, setShowMapModal] = useState(false);

    useEffect(() => {
        const fetchCafe = async () => {
            try {
                const response = await axios.get(`/api/cafe/${id}`);
                console.log('Cafe detail data:', response.data);
                setCafe(response.data);
                setLoading(false);
            } catch (error) {
                console.error('카페 정보를 불러오는데 실패했습니다:', error);
                setLoading(false);
            }
        };
        fetchCafe();
    }, [id]);

    useEffect(() => {
        console.log('Selected image index changed to:', selectedImageIndex);
        setImageLoadError(false);
        if (cafe && cafe.images) {
            console.log('Current image data:', cafe.images[selectedImageIndex]);
            console.log('Total images:', cafe.images.length);
        }
    }, [selectedImageIndex, cafe]);

    const handleImageClick = (index) => {
        console.log('Clicked image index:', index);
        setSelectedImageIndex(index);
        setShowAllImages(true);
    };

    const handleThumbnailClick = (index, e) => {
        e.stopPropagation();
        console.log('Clicked thumbnail index:', index);
        setSelectedImageIndex(index);
    };

    const handleModalClose = () => {
        setShowAllImages(false);
        setSelectedImageIndex(0);
        setImageLoadError(false);
    };

    const handleImageError = (e, imageIndex) => {
        console.error('Image load failed for index:', imageIndex);
        console.error('Failed URL:', e.target.src);
        
    };

    if (loading) {
        return <div className="loading">로딩 중...</div>;
    }

    if (!cafe) {
        return <div className="error">카페 정보를 찾을 수 없습니다.</div>;
    }

    return (
        <div className="cafe-detail-container">
            {/* 카페 이미지 섹션 */}
            {cafe.images && cafe.images.length > 0 && (
                <div className="cafe-images-section">
                    <div className="main-image-container" onClick={() => handleImageClick(0)}>
                        <img 
                            src={(cafe.images[0].imageUrl)}
                            alt={cafe.name} 
                            className="main-image"
                        />
                        <div className="image-overlay">
                            <span className="view-images-text">
                                <IoCamera size={20} /> 이미지 보기
                            </span>
                        </div>
                    </div>
                    <div className="thumbnail-container">
                        {cafe.images.slice(1, 5).filter(image => image && image.imageUrl).map((image, index) => (
                            <div 
                                key={index}
                                className="thumbnail-item"
                                onClick={() => handleImageClick(index + 1)}
                            >
                                <img 
                                    src={image.imageUrl}
                                    alt={`${cafe.name} ${index + 2}`}
                                    className="thumbnail"
                                />
                                {index === 3 && cafe.images.length > 5 && (
                                    <div className="more-images-overlay" onClick={(e) => {
                                        e.stopPropagation();
                                        setShowAllImages(true);
                                    }}>
                                        <span className="more-images-text">+{cafe.images.length - 5}</span>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* 카페 기본 정보 */}
            <div className="cafe-info-section">
                <h1 className="cafe-name">{cafe.name}</h1>
                <div className="cafe-details">
                    <p>
                        <strong>주소:</strong> {cafe.address}
                        <button 
                            className="map-view-button"
                            onClick={() => setShowMapModal(true)}
                            title="지도에서 위치 보기"
                        >
                            <IoLocationSharp size={18} /> 지도보기
                        </button>
                    </p>
                    <p><strong>전화번호:</strong> {cafe.phone}</p>
                    <p><strong>이메일:</strong> {cafe.email}</p>
                    {cafe.openTime && cafe.closeTime && (
                        <p><strong>영업시간:</strong> {cafe.openTime} - {cafe.closeTime}</p>
                    )}
                </div>
                
                {/* 카페 특징 */}
                <div className="cafe-features">
                    <div className={`feature-icon ${cafe.wifi ? 'active' : ''}`}>
                        <IoWifi size={18} /> Wi-Fi {cafe.wifi ? '가능' : '불가'}
                    </div>
                    <div className={`feature-icon ${cafe.parking ? 'active' : ''}`}>
                        <MdLocalParking size={18} /> 주차 {cafe.parking ? '가능' : '불가'}
                    </div>
                </div>

                <div className="cafe-description">
                    <h2>카페 소개</h2>
                    <p>{cafe.description || '카페 소개가 준비 중입니다.'}</p>
                </div>
            </div>


            {/* 리뷰 섹션 */}
            <div className="cafe-detail-section">
                <CafeReviews cafeId={id} />
            </div>

            {/* 전체 이미지 모달 */}
            {/* {showAllImages && (
                <div className="modal-overlay" onClick={handleModalClose}>
                    <div className="modal-content image-gallery-modal" onClick={e => e.stopPropagation()}>
                        <button className="modal-close" onClick={handleModalClose}>×</button>
                        
                        <div className="modal-main-image">
                            {cafe.images[selectedImageIndex] && (
                                <img 
                                    src={getImageUrl(cafe.images[selectedImageIndex].imageUrl)}
                                    alt={`${cafe.name} ${selectedImageIndex + 1}`}
                                    onError={(e) => handleImageError(e, selectedImageIndex)}
                                />
                            )}
                        </div>
                        
                        <div className="modal-thumbnails">
                            {cafe.images.map((image, index) => (
                                <img
                                    key={index}
                                    src={getImageUrl(image.imageUrl)}
                                    alt={`${cafe.name} thumbnail ${index + 1}`}
                                    className={`modal-thumbnail ${selectedImageIndex === index ? 'active' : ''}`}
                                    onClick={(e) => handleThumbnailClick(index, e)}
                                />
                            ))}
                        </div>
                    </div>
                </div>
            )} */}
            {showAllImages && (
                <div className="modal-overlay" onClick={handleModalClose}>
                    <div className="modal-content image-gallery-modal" onClick={e => e.stopPropagation()}>
                        <button className="close-btn" onClick={handleModalClose}>×</button>
                        <div className="image-gallery-container">
                            <div className="hotel-main-image-display">
                                {cafe.images && cafe.images[selectedImageIndex] ? (
                                    <>
                                        <img 
                                            key={`main-${selectedImageIndex}`}
                                            src={`${(cafe.images[selectedImageIndex]?.imageUrl)}`}
                                            alt={`${cafe.name} ${selectedImageIndex + 1}`}
                                            onLoad={() => {
                                                console.log('Main image loaded successfully for index:', selectedImageIndex);
                                                setImageLoadError(false);
                                            }}
                                            onError={(e) => handleImageError(e, selectedImageIndex)}
                                            style={{ 
                                                width: '100%',
                                                height: '100%',
                                                objectFit: 'contain',
                                                display: imageLoadError ? 'none' : 'block',
                                                backgroundColor: '#f0f0f0'
                                            }}
                                        />
                                    </>
                                ) : (
                                    <div className="image-error">
                                        <p>이미지를 불러올 수 없습니다</p>
                                        <p>Index: {selectedImageIndex}</p>
                                        <p>Total images: {cafe.images ? cafe.images.length : 0}</p>
                                    </div>
                                )}
                                <div className="image-counter">
                                    {selectedImageIndex + 1} / {cafe.images?.length || 0}
                                </div>
                            </div>
                            <div className="image-thumbnails-list">
                                {cafe.images.filter(image => image && image.imageUrl).map((image, index) => (
                                    <div 
                                        key={`thumb-${index}`}
                                        className={`thumbnail-wrapper ${index === selectedImageIndex ? 'active' : ''}`}
                                        onClick={(e) => handleThumbnailClick(index, e)}
                                        data-index={index}
                                    >
                                        <img 
                                            src={`${(image.imageUrl)}`}
                                            alt={`${cafe.name} ${index + 1}`}
                                            className="gallery-thumbnail"
                                            data-index={index}
                                        />
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            )}
            {/* 지도 모달 */}
            <CafeMapModal 
                isOpen={showMapModal}
                onClose={() => setShowMapModal(false)}
                address={cafe.address}
                cafeName={cafe.name}
            />
        </div>
    );
};

export default CafeDetail; 