import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';

const LoginSuccess = () => {
    const navigate = useNavigate();
    

    useEffect(() => {
        axios.get('/api/user/me', { withCredentials: true })
            .then(res => {
        
            sessionStorage.setItem('userEmail', res.data.email);
            sessionStorage.setItem('isLoggedIn', 'true');

            window.dispatchEvent(new Event('login-success'));
            
            navigate('/');
            
            })
            .catch(() => {
            navigate('/login');
            });
    }, [ , ]);

    return (
        <div style={{ 
            display: 'flex', 
            flexDirection: 'column', 
            alignItems: 'center', 
            justifyContent: 'center', 
            height: '100vh',
            backgroundColor: '#f8f9fa'
        }}>
            <div style={{
                backgroundColor: 'white',
                padding: '50px',
                borderRadius: '20px',
                boxShadow: '0 8px 24px rgba(0, 0, 0, 0.1)',
                textAlign: 'center',
                maxWidth: '400px'
            }}>
                <div style={{
                    fontSize: '48px',
                    marginBottom: '20px'
                }}>
                    ✓
                </div>
                
                <h2 style={{ 
                    color: '#28a745', 
                    marginBottom: '15px',
                    fontSize: '24px',
                    fontWeight: '600'
                }}>
                    로그인 완료
                </h2>
                
                <p style={{ 
                    fontSize: '16px', 
                    color: '#6c757d',
                    marginBottom: '30px',
                    lineHeight: '1.5'
                }}>
                    환영합니다!<br/>
                    메인 페이지로 이동 중...
                </p>
                
                {/* 원형 로딩바 */}
                <div style={{
                    position: 'relative',
                    width: '60px',
                    height: '60px',
                    margin: '0 auto'
                }}>
                    <svg width="60" height="60" style={{ transform: 'rotate(-90deg)' }}>
                        <circle
                            cx="30"
                            cy="30"
                            r="25"
                            stroke="#e9ecef"
                            strokeWidth="4"
                            fill="transparent"
                        />
                        <circle
                            cx="30"
                            cy="30"
                            r="25"
                            stroke="#28a745"
                            strokeWidth="4"
                            fill="transparent"
                            strokeDasharray="157"
                            strokeDashoffset="157"
                            style={{
                                animation: 'circleProgress 1.5s ease-out forwards'
                            }}
                        />
                    </svg>
                </div>
            </div>
            
            <style jsx>{`
                @keyframes circleProgress {
                    from { 
                        stroke-dashoffset: 157; 
                    }
                    to { 
                        stroke-dashoffset: 0; 
                    }
                }
            `}</style>
        </div>
    );
};

export default LoginSuccess; 