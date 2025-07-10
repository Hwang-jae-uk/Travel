import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import HotelCard from './HotelCard';
import './Hotel.css';
import axios from 'axios';
import HotelListAdmin from './HotelListAdmin';

/**
 * HotelPageAdmin Component - 관리자용 호텔 페이지
 */
const HotelPageAdmin = () => {
  const navigate = useNavigate();

  return (
    <div className="page-container">
      <div className="button-row">
        <h1 className="page-title">🏨 호텔 관리 (관리자)</h1>
        <button className="add-hotel-button" onClick={() => { navigate('/HotelRegister')}}>
          ✨ 호텔 등록
        </button>
      </div>
      <HotelListAdmin />
    </div>
  );
};

export default HotelPageAdmin; 