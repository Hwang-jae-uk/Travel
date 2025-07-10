import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Restaurant.css';

const RestaurantReviews = ({ restaurantId }) => {
    const [reviews, setReviews] = useState([]);
    const [ratingInfo, setRatingInfo] = useState({ averageRating: 0, reviewCount: 0 });
    const [showReviewForm, setShowReviewForm] = useState(false);
    const [loading, setLoading] = useState(true);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [showImageModal, setShowImageModal] = useState(false);
    const [selectedImages, setSelectedImages] = useState([]);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    
    // 리뷰 작성 폼 상태
    const [reviewForm, setReviewForm] = useState({
        rating: 5,
        content: '',
        images: []
    });

    useEffect(() => {
        fetchReviews();
        fetchRatingInfo();
        checkLoginStatus();
    }, [restaurantId]);

    const checkLoginStatus = () => {
        const loggedIn = sessionStorage.getItem('isLoggedIn') === 'true';
        setIsLoggedIn(loggedIn);
    };

    const fetchReviews = async () => {
        try {
            const response = await axios.get(`/api/restaurant/${restaurantId}/reviews`);
            const reviewsData = Array.isArray(response.data) ? response.data : [];
            setReviews(reviewsData);
        
            setLoading(false);
        } catch (error) {
            console.error('리뷰 조회 실패:', error);
            setReviews([]);
            setLoading(false);
        }
    };

    const fetchRatingInfo = async () => {
        try {
            const response = await axios.get(`/api/restaurant/${restaurantId}/reviews/rating`);
            const ratingData = response.data || { averageRating: 0, reviewCount: 0 };
            setRatingInfo(ratingData);
        } catch (error) {
            console.error('평점 정보 조회 실패:', error);
            setRatingInfo({ averageRating: 0, reviewCount: 0 });
        }
    };

    // 이미지 압축 함수
    const compressImage = (file, maxWidth = 800, quality = 0.8) => {
        return new Promise((resolve) => {
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            const img = new Image();
            
            img.onload = () => {
                // 비율을 유지하면서 크기 조정
                const ratio = Math.min(maxWidth / img.width, maxWidth / img.height);
                canvas.width = img.width * ratio;
                canvas.height = img.height * ratio;
                
                // 이미지 그리기
                ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
                
                // Blob으로 변환
                canvas.toBlob(resolve, 'image/jpeg', quality);
            };
            
            img.src = URL.createObjectURL(file);
        });
    };

    const handleImageChange = async (e) => {
        const files = Array.from(e.target.files);
        const compressedImages = [];
        
        for (const file of files) {
            if (file.type.startsWith('image/')) {
                try {
                    const compressedBlob = await compressImage(file);
                    const compressedFile = new File([compressedBlob], file.name, {
                        type: 'image/jpeg',
                        lastModified: Date.now()
                    });
                    compressedImages.push(compressedFile);
                } catch (error) {
                    console.error('이미지 압축 실패:', error);
                    compressedImages.push(file);
                }
            } else {
                compressedImages.push(file);
            }
        }
        
        setReviewForm(prev => ({
            ...prev,
            images: [...prev.images, ...compressedImages]
        }));
    };

    const removeImage = (index) => {
        setReviewForm(prev => ({
            ...prev,
            images: prev.images.filter((_, i) => i !== index)
        }));
    };

    const handleReviewSubmit = async (e) => {
        e.preventDefault();
        
        if (!isLoggedIn) {
            alert('로그인이 필요합니다.');
            return;
        }

        if (!reviewForm.content.trim()) {
            alert('리뷰 내용을 입력해주세요.');
            return;
        }

        setSubmitting(true);

        try {
            const formData = new FormData();
            formData.append('rating', reviewForm.rating);
            formData.append('content', reviewForm.content);
            
            if (reviewForm.images && reviewForm.images.length > 0) {
                reviewForm.images.forEach(image => {
                    formData.append('images', image);
                });
            }

            const token = sessionStorage.getItem('token');
            await axios.post(`/api/restaurant/${restaurantId}/reviews`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'Authorization': `Bearer ${token}`
                }
            });

            // 성공 시 폼 초기화 및 리뷰 목록 새로고침
            setReviewForm({ rating: 5, content: '', images: [] });
            setShowReviewForm(false);
            fetchReviews();
            fetchRatingInfo();
            alert('리뷰가 등록되었습니다.');

        } catch (error) {
            console.error('리뷰 등록 실패:', error);
            if (error.response?.status === 401) {
                alert('로그인이 만료되었습니다. 다시 로그인해주세요.');
                // 로그인 페이지로 리다이렉트하거나 다시 로그인하도록 처리
                sessionStorage.removeItem('isLoggedIn');
                sessionStorage.removeItem('token');
                window.location.href = '/login';
            } else {
                alert(error.response?.data?.error || '리뷰 등록에 실패했습니다.');
            }
        } finally {
            setSubmitting(false);
        }
    };

    const handleDeleteReview = async (reviewId) => {
        if (!window.confirm('정말 삭제하시겠습니까?')) return;

        try {
            await axios.delete(`/api/restaurant/${restaurantId}/reviews/${reviewId}`, {
                withCredentials: true
            });
            
            fetchReviews();
            fetchRatingInfo();
            alert('리뷰가 삭제되었습니다.');

        } catch (error) {
            console.error('리뷰 삭제 실패:', error);
            if (error.response?.status === 401) {
                alert('로그인이 필요합니다.');
            } else if (error.response?.data?.error) {
                alert(error.response.data.error);
            } else {
                alert('리뷰 삭제에 실패했습니다.');
            }
        }
    };

    const renderStars = (rating) => {
        return '⭐'.repeat(rating);
    };

    const getCurrentUserEmail = () => {
        return sessionStorage.getItem('userEmail');
    };

    // 이미지 모달 열기
    const handleImageClick = (images, startIndex) => {
        // 이미지 URL 배열 생성
        const imageUrls = images.map(url => `${url}`);
        setSelectedImages(imageUrls);
        setCurrentImageIndex(startIndex);
        setShowImageModal(true);
    };

    // 이미지 모달 닫기
    const handleCloseModal = () => {
        setShowImageModal(false);
        setSelectedImages([]);
        setCurrentImageIndex(0);
    };

    // 다음 이미지
    const handleNextImage = (e) => {
        e.stopPropagation();
        setCurrentImageIndex((prev) => 
            prev === selectedImages.length - 1 ? 0 : prev + 1
        );
    };

    // 이전 이미지
    const handlePrevImage = (e) => {
        e.stopPropagation();
        setCurrentImageIndex((prev) => 
            prev === 0 ? selectedImages.length - 1 : prev - 1
        );
    };

    // 키보드 이벤트 처리
    useEffect(() => {
        const handleKeyPress = (e) => {
            if (!showImageModal) return;
            
            if (e.key === 'Escape') {
                handleCloseModal();
            } else if (e.key === 'ArrowRight') {
                handleNextImage(e);
            } else if (e.key === 'ArrowLeft') {
                handlePrevImage(e);
            }
        };

        window.addEventListener('keydown', handleKeyPress);
        return () => window.removeEventListener('keydown', handleKeyPress);
    }, [showImageModal]);

    if (loading) {
        return <div className="loading">리뷰를 불러오는 중...</div>;
    }

    return (
        <div className="restaurant-reviews-section">
            <div className="reviews-header">
                <h2>리뷰</h2>
                <div className="rating-summary">
                    <span className="average-rating">
                        {renderStars(Math.round(ratingInfo.averageRating || 0))} 
                        {(ratingInfo.averageRating || 0).toFixed(1)}
                    </span>
                    <span className="review-count">({ratingInfo.reviewCount || 0}개 리뷰)</span>
                </div>
            </div>

            {/* 리뷰 작성 버튼 */}
            {isLoggedIn && (
                <div className="review-write-section">
                    {!showReviewForm ? (
                        <button 
                            className="write-review-btn"
                            onClick={() => setShowReviewForm(true)}
                        >
                            리뷰 작성하기
                        </button>
                    ) : (
                        <form className="review-form" onSubmit={handleReviewSubmit}>
                            <div className="rating-input">
                                <label>평점:</label>
                                <select 
                                    value={reviewForm.rating}
                                    onChange={(e) => setReviewForm(prev => ({
                                        ...prev, 
                                        rating: parseInt(e.target.value)
                                    }))}
                                    disabled={submitting}
                                >
                                    {[5, 4, 3, 2, 1].map(num => (
                                        <option key={num} value={num}>
                                            {renderStars(num)} ({num}점)
                                        </option>
                                    ))}
                                </select>
                            </div>
                            
                            <div className="content-input">
                                <textarea
                                    placeholder="음식점 리뷰를 작성해주세요..."
                                    value={reviewForm.content}
                                    onChange={(e) => setReviewForm(prev => ({
                                        ...prev,
                                        content: e.target.value
                                    }))}
                                    rows="4"
                                    required
                                    disabled={submitting}
                                />
                            </div>
                            
                            <div className="image-input">
                                <input
                                    type="file"
                                    multiple
                                    accept="image/*"
                                    onChange={handleImageChange}
                                    id="restaurant-review-images"
                                    disabled={submitting}
                                />
                                <label htmlFor="restaurant-review-images" className="image-upload-btn">
                                    📷 사진 추가 (자동 압축됨)
                                </label>
                                
                                {reviewForm.images.length > 0 && (
                                    <div className="image-preview">
                                        {reviewForm.images.map((image, index) => (
                                            <div key={index} className="image-preview-item">
                                                <img 
                                                    src={URL.createObjectURL(image)} 
                                                    alt={`미리보기 ${index + 1}`}
                                                />
                                                <button 
                                                    type="button"
                                                    className="remove-image-btn"
                                                    onClick={() => removeImage(index)}
                                                    disabled={submitting}
                                                >
                                                    ×
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                            
                            <div className="form-buttons">
                                <button 
                                    type="submit" 
                                    className="submit-btn"
                                    disabled={submitting}
                                >
                                    {submitting ? '등록 중...' : '등록'}
                                </button>
                                <button 
                                    type="button" 
                                    className="cancel-btn"
                                    onClick={() => {
                                        setShowReviewForm(false);
                                        setReviewForm({ rating: 5, content: '', images: [] });
                                    }}
                                    disabled={submitting}
                                >
                                    취소
                                </button>
                            </div>
                        </form>
                    )}
                </div>
            )}

            {!isLoggedIn && (
                <div className="login-required">
                    <p>리뷰를 작성하려면 <a href="/login">로그인</a>이 필요합니다.</p>
                </div>
            )}

            {/* 리뷰 목록 */}
            <div className="reviews-list">
                {reviews.length === 0 ? (
                    <p className="no-reviews">아직 리뷰가 없습니다.</p>
                ) : (
                    reviews.map(review => (
                        <div key={review.id} className="review-item">
                            <div className="review-header">
                                <div className="review-info">
                                    <span className="review-rating">{renderStars(review.rating)}</span>
                                    <span className="review-author">{review.displayName || '익명'}</span>
                                    <span className="review-date">
                                        {new Date(review.createDay).toLocaleDateString()}
                                    </span>
                                </div>
                                {getCurrentUserEmail() === review.userEmail && (
                                    <button 
                                        className="delete-review-btn"
                                        onClick={() => handleDeleteReview(review.id)}
                                    >
                                        삭제
                                    </button>
                                )}
                            </div>
                            <p className="review-content">{review.content}</p>
                            {review.imageUrls && review.imageUrls.length > 0 && (
                                <div className="review-images">
                                    {review.imageUrls.map((imageUrl, index) => (
                                        <div key={index} className="review-image-item">
                                            <img 
                                                src={`${imageUrl}`}
                                                alt={`리뷰 이미지 ${index + 1}`}
                                                onClick={() => handleImageClick(review.imageUrls, index)}
                                                style={{ cursor: 'pointer' }}
                                            />
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    ))
                )}
            </div>

            {/* 이미지 모달 */}
            {showImageModal && selectedImages.length > 0 && (
                <div className="modal-overlay" onClick={handleCloseModal}>
                    <div className="modal-content" onClick={e => e.stopPropagation()}>
                        <img
                            src={selectedImages[currentImageIndex]}
                            alt={`리뷰 이미지 ${currentImageIndex + 1}`}
                        />
                        {selectedImages.length > 1 && (
                            <>
                                <button 
                                    className="modal-nav prev" 
                                    onClick={handlePrevImage}
                                    aria-label="이전 이미지"
                                >
                                    &#10094;
                                </button>
                                <button 
                                    className="modal-nav next" 
                                    onClick={handleNextImage}
                                    aria-label="다음 이미지"
                                >
                                    &#10095;
                                </button>
                                <div className="modal-counter">
                                    {currentImageIndex + 1} / {selectedImages.length}
                                </div>
                            </>
                        )}
                        <button 
                            className="modal-close" 
                            onClick={handleCloseModal}
                            aria-label="모달 닫기"
                        >
                            ✕
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default RestaurantReviews;