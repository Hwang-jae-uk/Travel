import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import HotelCard from './HotelCard';
import './Hotel.css';
import axios from 'axios';
import HotelList from './HotelList';
import HotelHeader from './HotelHeader';
import Button from '../../ui/Button';
<<<<<<< HEAD
=======
import { BsCart4 } from "react-icons/bs";
import { FaMapLocationDot } from "react-icons/fa6";
import { MdLocalHotel } from "react-icons/md";
>>>>>>> 902477c (initial commit)




/**
 * HotelPage Component
 */
const HotelPage = () => {
  const navigate = useNavigate();

  return (
    
    <div className="page-container">
      <HotelHeader 
<<<<<<< HEAD
        rightChild={<Button text={"📦"} onClick={() => navigate('/HotelReservationPage')}/>}
      />
      <div className="button-row">
        <h1 className="page-title">🏨 호텔 목록</h1>
      </div>
=======
        rightChild={<Button text={<BsCart4 size={30} />} onClick={() => navigate('/HotelReservationPage')}/>}
      />
      
>>>>>>> 902477c (initial commit)
      <HotelList />
    </div>
  );
};

export default HotelPage; 