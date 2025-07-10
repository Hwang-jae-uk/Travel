import React from 'react';
import './Footer.css';

const Footer = () => {
    return (
        <footer className="footer">
            <div className="footer-content">
                <div className="footer-logo">
                    <img 
                        src={`${process.env.PUBLIC_URL}/Brothers.png`} 
                        alt="Pepperoni Brothers Logo" 
                        className="logo-image"
                    />
                    <span className="logo-text">Pepperoni Brothers</span>
                </div>
                <div className="footer-ad">
                    <h5> 광고 문의 환영합니다!</h5>
                    <div className="contact-info">
                        <span>📧 contact@pepperonibrothers.com</span>
                        <span>📞 010-1234-5678</span>
                    </div>
                </div>
            </div>
            <div className="footer-bottom">
                <p>&copy; 2025 Pepperoni Brothers. All rights reserved.</p>
            </div>
        </footer>
    );
};

export default Footer; 