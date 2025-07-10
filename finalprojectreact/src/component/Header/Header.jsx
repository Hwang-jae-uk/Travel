import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Header.css';
import { BiLogIn, BiLogOut } from "react-icons/bi";
import { FaUser } from "react-icons/fa";

const Header = () => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    checkAuthStatus();
  
    const handleLoginSuccess = async () => {
      try {
        const response = await fetch('/api/user/info', {
          credentials: 'include'
        });
        if (response.ok) {
          const userData = await response.json();
          const displayName = userData.displayName || userData.name || userData.email.split('@')[0];
          sessionStorage.setItem('displayName', displayName);
          sessionStorage.setItem('userEmail', userData.email);
          sessionStorage.setItem('isLoggedIn', 'true');
        }
      } catch (error) {
        console.error('사용자 정보 가져오기 실패:', error);
      }
      checkAuthStatus();
    };

    const handleNicknameUpdate = () => {
      checkAuthStatus();
    };
    
    window.addEventListener('login-success', handleLoginSuccess);
    window.addEventListener('nickname-updated', handleNicknameUpdate);
    
    return () => {
      window.removeEventListener('login-success', handleLoginSuccess);
      window.removeEventListener('nickname-updated', handleNicknameUpdate);
    }
  }, []);

  const checkAuthStatus = () => {
    const isLoggedIn = sessionStorage.getItem('isLoggedIn');
    const userEmail = sessionStorage.getItem('userEmail');
    const displayName = sessionStorage.getItem('displayName');

    if (isLoggedIn === 'true' && userEmail) {
      setUser({
        email: userEmail,
        name: displayName || userEmail.split('@')[0]
      });
    } else {
      setUser(null);
    }
    
    setIsLoading(false);
  };

  const handleLogout = async () => {
    try {
      // Spring Boot 서버의 로그아웃 엔드포인트 호출
      await fetch('http://localhost:8080/logout', {
        method: 'POST',
        credentials: 'include', // 쿠키 포함
        headers: {
          'Content-Type': 'application/json'
        }
      });
    } catch (error) {
      console.error('로그아웃 요청 실패:', error);
    }
    
    // sessionStorage 정리
    sessionStorage.removeItem('isLoggedIn');
    sessionStorage.removeItem('userEmail');
    setUser(null);
    
    // 성공 메시지 표시
    alert('로그아웃되었습니다.');
    navigate('/');
  };

  const handleLogin = () => {
    navigate('/login');
  };

  if (isLoading) {
    return (
      <header className="header">
        <div className="header-container">
          <div className="logo" onClick={() => navigate('/')}>
            <h1>Travel</h1>
          </div>
          <div className="auth-section">
            <div className="loading">로딩 중...</div>
          </div>
        </div>
      </header>
    );
  }

  return (
    <header className="header">
      <div className="header-container">
        <div className="logo" onClick={() => navigate('/')}>
          <h1>Travel</h1>
        </div>

        <div className="auth-section">
          {user ? (
            <div className="user-info">
              <div className="welcome-text" onClick={() => navigate('/MyPage')} title="마이페이지">
                <FaUser className="user-icon" />
                <span>{user.name}</span>
              </div>
              <button onClick={handleLogout} className="auth-btn logout-btn" title="로그아웃">
                <BiLogOut className="auth-icon" />
              </button>
            </div>
          ) : (
            <button onClick={handleLogin} className="auth-btn login-btn" title="로그인">
              <BiLogIn className="auth-icon" />
            </button>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;