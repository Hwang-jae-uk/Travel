import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Hotel.css';

const HotelReviews = ({ hotelId }) => {
    const [reviews, setReviews] = useState([]);
    const [ratingInfo, setRatingInfo] = useState({ averageRating: 0, reviewCount: 0 });
    const [showReviewForm, setShowReviewForm] = useState(false);
    const [loading, setLoading] = useState(true);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    
    // 리뷰 작성 폼 상태
    const [reviewForm, setReviewForm] = useState({
        rating: 5,
        content: '',
        images: []
    });

    const [showImageModal, setShowImageModal] = useState(false);
    const [selectedImages, setSelectedImages] = useState([]);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    useEffect(() => {
        fetchReviews();
        fetchRatingInfo();
        checkLoginStatus();
    }, [hotelId]);

    const checkLoginStatus = () => {
        const loggedIn = sessionStorage.getItem('isLoggedIn') === 'true';
        setIsLoggedIn(loggedIn);
    };

    const fetchReviews = async () => {
        try {
            const response = await axios.get(`/api/hotel/${hotelId}/reviews`);
            setReviews(response.data);
<<<<<<< HEAD
=======
            console.log(response.data);
>>>>>>> 902477c (initial commit)
            setLoading(false);
        } catch (error) {
            console.error('리뷰 조회 실패:', error);
            setLoading(false);
        }
    };

    const fetchRatingInfo = async () => {
        try {
            const response = await axios.get(`/api/hotel/${hotelId}/reviews/rating`);
            setRatingInfo(response.data);
        } catch (error) {
            console.error('평점 정보 조회 실패:', error);
        }
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

        try {
            const formData = new FormData();
            formData.append('rating', reviewForm.rating);
            formData.append('content', reviewForm.content);
            
            if (reviewForm.images && reviewForm.images.length > 0) {
                reviewForm.images.forEach(image => {
                    formData.append('images', image);
                });
            }

            await axios.post(`/api/hotel/${hotelId}/reviews`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                },
                withCredentials: true
            });

            // 성공 시 폼 초기화 및 리뷰 목록 새로고침
            setReviewForm({ rating: 5, content: '', images: [] });
            setShowReviewForm(false);
            fetchReviews();
            fetchRatingInfo();
            alert('리뷰가 등록되었습니다.');

        } catch (error) {
            console.error('리뷰 등록 실패:', error);
            alert(error.response?.data?.error || '리뷰 등록에 실패했습니다.');
        }
    };

    const handleImageChange = (e) => {
        const files = Array.from(e.target.files);
        setReviewForm(prev => ({
            ...prev,
            images: [...prev.images, ...files]
        }));
    };

    const removeImage = (index) => {
        setReviewForm(prev => ({
            ...prev,
            images: prev.images.filter((_, i) => i !== index)
        }));
    };

    const handleDeleteReview = async (reviewId) => {
        if (!window.confirm('정말 삭제하시겠습니까?')) return;

        try {
            await axios.delete(`/api/hotel/${hotelId}/reviews/${reviewId}`, {
                withCredentials: true
            });
            
            fetchReviews();
            fetchRatingInfo();
            alert('리뷰가 삭제되었습니다.');

        } catch (error) {
            console.error('리뷰 삭제 실패:', error);
            alert(error.response?.data?.error || '리뷰 삭제에 실패했습니다.');
        }
    };

    const renderStars = (rating) => {
<<<<<<< HEAD
        return '★'.repeat(rating) + '☆'.repeat(5 - rating);
=======
        return '⭐'.repeat(rating);
>>>>>>> 902477c (initial commit)
    };

    const getCurrentUserEmail = () => {
        return sessionStorage.getItem('userEmail');
    };

    // 이미지 모달 열기
    const handleImageClick = (images, startIndex) => {
        // 이미지 URL 배열 생성
<<<<<<< HEAD
        const imageUrls = images.map(url => `http://10.100.105.22:8080/api/images${url}`);
=======
        const imageUrls = images.map(url => url);
>>>>>>> 902477c (initial commit)
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
        <div className="hotel-reviews-section">
            <div className="reviews-header">
                <h2>리뷰</h2>
                <div className="rating-summary">
                    <span className="average-rating">
                        {renderStars(Math.round(ratingInfo.averageRating))} 
                        {ratingInfo.averageRating.toFixed(1)}
                    </span>
                    <span className="review-count">({ratingInfo.reviewCount}개 리뷰)</span>
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
                                    placeholder="리뷰를 작성해주세요..."
                                    value={reviewForm.content}
                                    onChange={(e) => setReviewForm(prev => ({
                                        ...prev,
                                        content: e.target.value
                                    }))}
                                    rows="4"
                                    required
                                />
                            </div>
                            
                            <div className="image-input">
                                <input
                                    type="file"
                                    multiple
                                    accept="image/*"
                                    onChange={handleImageChange}
                                    id="review-images"
                                />
                                <label htmlFor="review-images" className="image-upload-btn">
                                    📷 사진 추가
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
                                                >
                                                    ×
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                            
                            <div className="form-buttons">
                                <button type="submit" className="submit-btn">등록</button>
                                <button 
                                    type="button" 
                                    className="cancel-btn1"
                                    onClick={() => {
                                        setShowReviewForm(false);
                                        setReviewForm({ rating: 5, content: '', images: [] });
                                    }}
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
                                <span className="reviewer-name">{review.displayName}</span>
                                <span className="review-rating">{renderStars(review.rating)}</span>
                                <span className="review-date">
                                    {new Date(review.createDay).toLocaleDateString()}
                                </span>
                                {review.userEmail === getCurrentUserEmail() && (
                                    <button
                                        className="delete-review-btn"
                                        onClick={() => handleDeleteReview(review.id)}
                                    >
                                        삭제
                                    </button>
                                )}
                            </div>
                            <div className="review-content">{review.content}</div>
                            {/* 리뷰 이미지 표시 */}
                            {review.imageUrls && review.imageUrls.length > 0 && (
                                <div className="review-images">
                                    {review.imageUrls.map((imageUrl, index) => (
                                        <div key={index} className="review-image-item">
                                            <img 
<<<<<<< HEAD
                                                src={`http://10.100.105.22:8080/api/images${imageUrl}`}
=======
                                                src={`${imageUrl}`}
>>>>>>> 902477c (initial commit)
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

export default HotelReviews; 