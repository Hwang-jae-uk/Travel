import React, { useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import Footer from '../Footer/Footer';
import './Main.css';
import { TbTrain } from "react-icons/tb";
import { MdLocalHotel, MdOutlineRestaurant } from "react-icons/md";
import { TiWeatherPartlySunny } from "react-icons/ti";
import { BiSolidCoffee } from "react-icons/bi";
import { FaUser } from "react-icons/fa";

const Main = React.memo(() => {
  const navigate = useNavigate();

  const handleCardClick = useCallback((path) => {
    navigate(path);
  }, [navigate]);

  const cards = useMemo(() => [
    { id: 1, title: '기차', icon: <TbTrain size={50} color="white" />, background: 'linear-gradient(135deg, #6366f1 0%, #0ea5e9 100%)', path: '/TrainHome' },
    { id: 2, title: '호텔', icon: <MdLocalHotel size={50} color="white" />, background: 'linear-gradient(135deg, #6366f1 0%, #0ea5e9 100%)', path: '/HotelPage' },
    { id: 3, title: '날씨', icon: <TiWeatherPartlySunny size={50} color="white" />, background: 'linear-gradient(135deg, #06b6d4 0%, #0ea5e9 100%)', path: '/WeatherPage' },
    { id: 4, title: '카페', icon: <BiSolidCoffee size={50} color="white" />, background: 'linear-gradient(135deg, #3b82f6 0%, #0ea5e9 100%)', path: '/CafePage' },
    { id: 5, title: '음식점', icon: <MdOutlineRestaurant size={50} color="white" />, background: 'linear-gradient(135deg, #e879f9 0%, #d946ef 100%)', path: '/RestaurantPage' },
    { id: 6, title: '마이페이지', icon: <FaUser size={50} color="white" />, background: 'linear-gradient(135deg, #2dd4bf 0%, #0ea5e9 100%)', path: '/MyPage' }
  ], []);

  return (
    <div className="main-page-wrapper">
      <div className="main-container">
        <div className="hero-image" />
        <div className="cards-container">
          <div className="cards-grid">
            {cards.map((card, index) => (
              <div key={card.id} className="card-wrapper">
                <div 
                  className={`gradient-card card-${card.id} delay-${index + 1}`}
                  onClick={() => handleCardClick(card.path)}
                >
                  {card.id === 1 && <img src={process.env.PUBLIC_URL + '/train.gif'} alt="기차 이미지" className="train-main-image" />}
                  {card.id === 2 && <img src={`${process.env.PUBLIC_URL}/hotel.gif`} alt="호텔 이미지" className="hotel-main-image" />}
                  {card.id === 3 && <img src={`${process.env.PUBLIC_URL}/weather.gif`} alt="하늘 이미지" className="sky-main-image" />}
                  {card.id === 4 && <img src={`${process.env.PUBLIC_URL}/coffee.gif`} alt="카페 이미지" className="cafe-main-image" />}
                  {card.id === 5 && <img src={`${process.env.PUBLIC_URL}/restaurant.gif`} alt="음식점 이미지" className="restaurant-main-image" />}
                  {card.id === 6 && <img src={`${process.env.PUBLIC_URL}/sexy.gif`} alt="갤러리 이미지" className="gallery-main-image" />}
                  <div className="card-icon">{card.icon}</div>
                  <h2 className="card-title" 
                  style={{ position: 'absolute', left: 16, bottom: 16, margin: 0, zIndex: 4 }}>{card.title}</h2>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
});

Main.displayName = 'Main';

export default Main; 
