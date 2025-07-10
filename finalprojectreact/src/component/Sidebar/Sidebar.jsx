import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import './Sidebar.css';
import { TbTrain } from "react-icons/tb";
import { MdLocalHotel, MdOutlineRestaurant } from "react-icons/md";
import { TiWeatherPartlySunny } from "react-icons/ti";
import { BiSolidCoffee } from "react-icons/bi";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";

const Sidebar = () => {
  const location = useLocation();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  
  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
      setIsCollapsed(window.innerWidth <= 1536);
    };

    window.addEventListener('resize', handleResize);
    handleResize(); // 초기 실행

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // 메인 페이지와 로그인 관련 페이지에서는 사이드바를 표시하지 않음
  if (location.pathname === '/' || 
      location.pathname === '/login' || 
      location.pathname === '/login/success' || 
      location.pathname === '/login/error') {
    return null;
  }

  return (
    <div className={`sidebar ${isCollapsed ? 'collapsed' : ''}`}>
      <button 
        className="toggle-button"
        onClick={() => setIsCollapsed(!isCollapsed)}
        aria-label={isCollapsed ? "펼치기" : "접기"}
      >
        {isCollapsed ? <IoIosArrowForward /> : <IoIosArrowBack />}
      </button>
      <div className="sidebar-content">
        <Link to="/TrainHome" className="sidebar-item">
          <TbTrain className="sidebar-icon" />
          <span>기차</span>
        </Link>
        <Link to="/HotelPage" className="sidebar-item">
          <MdLocalHotel className="sidebar-icon" />
          <span>호텔</span>
        </Link>
        <Link to="/WeatherPage" className="sidebar-item">
          <TiWeatherPartlySunny className="sidebar-icon" />
          <span>날씨</span>
        </Link>
        <Link to="/CafePage" className="sidebar-item">
          <BiSolidCoffee className="sidebar-icon" />
          <span>카페</span>
        </Link>
        <Link to="/RestaurantPage" className="sidebar-item">
          <MdOutlineRestaurant className="sidebar-icon" />
          <span>음식점</span>
        </Link>
      </div>
    </div>
  );
};

export default Sidebar;