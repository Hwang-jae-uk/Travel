import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import HotelCard from './HotelCard';
import './Hotel.css';
import axios from 'axios';
import HotelList from './HotelList';
import HotelHeader from './HotelHeader';
import Button from '../../ui/Button';
import { BsCart4 } from "react-icons/bs";
import { FaMapLocationDot } from "react-icons/fa6";
import { MdLocalHotel } from "react-icons/md";




/**
 * HotelPage Component
 */
const HotelPage = () => {
  const navigate = useNavigate();

  return (
    
    <div className="page-container">
      <HotelHeader 
        rightChild={<Button text={<BsCart4 size={30} />} onClick={() => navigate('/HotelReservationPage')}/>}
      />
      
      <HotelList />
    </div>
  );
};

export default HotelPage; 