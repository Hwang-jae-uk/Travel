import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import RestaurantReviews from './RestaurantReviews';
import RestaurantMapModal from './RestaurantMapModal';
import './Restaurant.css';
import { IoLocationSharp, IoTime } from "react-icons/io5";
import { MdOutlineRestaurant, MdLocalParking, MdDeliveryDining, MdPhone } from "react-icons/md";
import { FaMoneyBillWave, FaRegCalendarAlt } from "react-icons/fa";
import { BiSolidFoodMenu } from "react-icons/bi";

const RestaurantDetail = () => {
    const { id } = useParams();
    const [restaurant, setRestaurant] = useState(null);
    const [showAllImages, setShowAllImages] = useState(false);
    const [selectedImageIndex, setSelectedImageIndex] = useState(0);
    const [loading, setLoading] = useState(true);
    const [imageLoadError, setImageLoadError] = useState(false);
    const [showMapModal, setShowMapModal] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchRestaurant();
    }, [id]);

    const fetchRestaurant = async () => {
        try {
            const response = await axios.get(`http://10.100.105.22:8080/api/restaurants/${id}`);
            console.log('Restaurant detail data:', response.data);
            console.log(response.data.images);
            setRestaurant(response.data);
            setLoading(false);
        } catch (err) {
            setError('레스토랑 정보를 불러오는데 실패했습니다.');
            setLoading(false);
        }
    };

    useEffect(() => {
        console.log('Selected image index changed to:', selectedImageIndex);
        setImageLoadError(false);
        if (restaurant && restaurant.images) {
            console.log('Current image data:', restaurant.images[selectedImageIndex]);
            console.log('Total images:', restaurant.images.length);
        }
    }, [selectedImageIndex, restaurant]);

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

    const getImageUrl = (imagePath) => {
        if (!imagePath) return null;
        return `http://10.100.105.22:8080/api/images${imagePath.startsWith('/') ? '' : '/'}${imagePath}`;
    };

    const handleImageError = (e, imageIndex) => {
        console.error('Image load failed for index:', imageIndex);
        console.error('Failed URL:', e.target.src);
        
        const imageUrl = restaurant.images[imageIndex].imagePath;

        
    };

    if (loading) return <div>로딩 중...</div>;
    if (error) return <div>{error}</div>;
    if (!restaurant) return <div>레스토랑을 찾을 수 없습니다.</div>;

    return (
        <div className="restaurant-detail-container">
            {showMapModal && (
                <RestaurantMapModal
                    isOpen={showMapModal}
                    address={restaurant.address}
                    restaurantName={restaurant.name}
                    onClose={() => setShowMapModal(false)}
                />
            )}

            <div className="restaurant-detail-content">
                <div className="restaurant-images-section">
                    {restaurant.images && restaurant.images.length > 0 ? (
                        <>
                            <div className="main-image-container" onClick={() => handleImageClick(0)}>
                                <img
                                    src={restaurant.images[0].imagePath}
                                    alt={restaurant.name}
                                    className="main-image"
                                />
                                <div className="image-overlay">
                                    <span className="view-images-text">📷 이미지 보기</span>
                                </div>
                            </div>
                            <div className="thumbnail-container">
                                {restaurant.images.slice(1, 5).map((image, index) => (
                                    <div 
                                        key={index}
                                        className="thumbnail-item"
                                        onClick={() => handleImageClick(index + 1)}
                                    >
                                        <img 
                                            src={(image.imagePath)}
                                            alt={`${restaurant.name} - ${index + 2}`}
                                            className="thumbnail"
                                        />
                                        {index === 3 && restaurant.images.length > 5 && (
                                            <div className="more-images-overlay" onClick={(e) => {
                                                e.stopPropagation();
                                                setShowAllImages(true);
                                            }}>
                                                <span className="more-images-text">+{restaurant.images.length - 5}</span>
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </>
                    ) : (
                        <div className="restaurant-detail-no-images">
                            <MdOutlineRestaurant size={48} />
                            <p>등록된 이미지가 없습니다</p>
                        </div>
                    )}
                </div>

                <div className="restaurant-info-section">
                    <h1 className="restaurant-name">{restaurant.name}</h1>
                    
                    <div className="restaurant-details">
                        <p>
                            <strong>주소:</strong> {restaurant.address}
                            <button 
                                onClick={() => setShowMapModal(true)}
                                className="map-view-button"
                            >
                                <IoLocationSharp size={18} /> 지도보기
                            </button>
                        </p>
                        
                        <p>
                            <MdPhone size={18} /> <strong>전화번호:</strong> {restaurant.phone}
                        </p>
                        
                        {restaurant.cuisine && (
                            <p>
                                <BiSolidFoodMenu size={18} /> <strong>음식 종류:</strong> {restaurant.cuisine}
                            </p>
                        )}
                        
                        {restaurant.priceRange && (
                            <p>
                                <FaMoneyBillWave size={18} /> <strong>가격대:</strong> {restaurant.priceRange}
                            </p>
                        )}
                        
                        {restaurant.operatingHours && (
                            <p>
                                <IoTime size={18} /> <strong>영업시간:</strong> {restaurant.operatingHours}
                            </p>
                        )}
                    </div>

                    <div className="restaurant-features">
                        <div className={`feature-icon ${restaurant.hasParking ? 'active' : ''}`}>
                            <MdLocalParking size={18} /> 주차 {restaurant.hasParking ? '가능' : '불가'}
                        </div>
                        <div className={`feature-icon ${restaurant.hasReservation ? 'active' : ''}`}>
                            <FaRegCalendarAlt size={18} /> 예약 {restaurant.hasReservation ? '가능' : '불가'}
                        </div>
                        <div className={`feature-icon ${restaurant.hasDelivery ? 'active' : ''}`}>
                            <MdDeliveryDining size={18} /> 배달 {restaurant.hasDelivery ? '가능' : '불가'}
                        </div>
                    </div>

                    <div className="restaurant-description">
                        <h2>레스토랑 소개</h2>
                        <p>{restaurant.description || '레스토랑 소개가 준비 중입니다.'}</p>
                    </div>
                </div>

                <div className="restaurant-reviews-section">
                    <RestaurantReviews restaurantId={id} />
                </div>
            </div>

            {/* 전체 이미지 모달 */}
            {showAllImages && (
                <div className="modal-overlay" onClick={handleModalClose}>
                    <div className="modal-content image-gallery-modal" onClick={e => e.stopPropagation()}>
                        <button className="close-btn" onClick={handleModalClose}>×</button>
                        <div className="image-gallery-container">
                            <div className="hotel-main-image-display">
                                {restaurant.images && restaurant.images[selectedImageIndex] ? (
                                    <>
                                        <img 
                                            key={`main-${selectedImageIndex}`}
                                            src={`${(restaurant.images[selectedImageIndex].imagePath)}`}
                                            alt={`${restaurant.name} ${selectedImageIndex + 1}`}
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
                                        <p>Total images: {restaurant.images ? restaurant.images.length : 0}</p>
                                    </div>
                                )}
                                <div className="image-counter">
                                    {selectedImageIndex + 1} / {restaurant.images?.length || 0}
                                </div>
                            </div>
                            <div className="image-thumbnails-list">
                                {restaurant.images.filter(image => image && image).map((image, index) => (
                                    <div 
                                        key={`thumb-${index}`}
                                        className={`thumbnail-wrapper ${index === selectedImageIndex ? 'active' : ''}`}
                                        onClick={(e) => handleThumbnailClick(index, e)}
                                        data-index={index}
                                    >
                                        <img 
                                            src={`${(image.imagePath)}`}
                                            alt={`${restaurant.name} ${index + 1}`}
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
        </div>
    );
};

export default RestaurantDetail; 