import React from 'react';
import './Login.css';

const Login = () => {
  const handleGoogleLogin = () => {
    window.location.href = 'http://localhost:8080/oauth2/authorization/google';
  };

  const handleNaverLogin = () => {
    window.location.href = 'http://localhost:8080/oauth2/authorization/naver';
  };

  return (
    <div className="login-container">
      <div className="login-form">
        <h2>로그인</h2>
        <p className="login-description">소셜 계정으로 간편하게 로그인하세요</p>
        
        <div className="oauth-buttons">
          <button onClick={handleGoogleLogin} className="oauth-btn google-btn">
            <img src="https://developers.google.com/identity/images/g-logo.png" alt="Google" />
            Google로 로그인
          </button>
          
          <button onClick={handleNaverLogin} className="oauth-btn naver-btn">
            <img src="https://static.nid.naver.com/oauth/small_g_in.PNG" alt="Naver" />
            네이버로 로그인
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login; 