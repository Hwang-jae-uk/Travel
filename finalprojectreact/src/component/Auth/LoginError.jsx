import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';

const LoginError = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const [countdown, setCountdown] = useState(5);
    
    const errorMessage = searchParams.get('message') || '알 수 없는 오류가 발생했습니다.';

    useEffect(() => {
        const timer = setInterval(() => {
            setCountdown(prev => {
                if (prev <= 1) {
                    navigate('/login');
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(timer);
    }, [navigate]);

    const handleRetry = () => {
        navigate('/login');
    };

    return (
        <div style={{ 
            display: 'flex', 
            flexDirection: 'column', 
            alignItems: 'center', 
            justifyContent: 'center', 
            height: '100vh',
            backgroundColor: '#f5f5f5'
        }}>
            <div style={{
                backgroundColor: 'white',
                padding: '40px',
                borderRadius: '10px',
                boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                textAlign: 'center',
                maxWidth: '500px'
            }}>
                <h2 style={{ color: '#f44336', marginBottom: '20px' }}>
                    ❌ 로그인 실패
                </h2>
                <p style={{ fontSize: '16px', marginBottom: '20px', color: '#666' }}>
                    로그인 중 오류가 발생했습니다:
                </p>
                <div style={{
                    backgroundColor: '#ffebee',
                    border: '1px solid #f44336',
                    borderRadius: '5px',
                    padding: '15px',
                    marginBottom: '20px'
                }}>
                    <code style={{ color: '#d32f2f', fontSize: '14px' }}>
                        {errorMessage}
                    </code>
                </div>
                <p style={{ marginBottom: '20px', color: '#666' }}>
                    {countdown}초 후 로그인 페이지로 자동 이동합니다.
                </p>
                <button 
                    onClick={handleRetry}
                    style={{
                        backgroundColor: '#2196F3',
                        color: 'white',
                        border: 'none',
                        padding: '12px 24px',
                        borderRadius: '5px',
                        fontSize: '16px',
                        cursor: 'pointer',
                        transition: 'background-color 0.3s'
                    }}
                    onMouseOver={(e) => e.target.style.backgroundColor = '#1976D2'}
                    onMouseOut={(e) => e.target.style.backgroundColor = '#2196F3'}
                >
                    다시 시도하기
                </button>
            </div>
        </div>
    );
};

export default LoginError; 