import './App.css';
import {Routes, Route} from 'react-router-dom';
import React, { useEffect, useReducer, useRef, useState } from 'react';
import TrainHome from './pages/TrainHome'; 
import HomePage from './pages/HomePage';
import Calendar from './pages/Calendar';
import StationModal from './pages/StationModal';
import Header from '../src/component/Header/Header';
import Sidebar from '../src/component/Sidebar/Sidebar';
import CheckTicketOne from './pages/CheckTicketOne';
import Main from './component/Main/Main';
import WeatherPage from './component/Weather/WeatherPage';
import BenchSelect from './pages/BenchSelect';
import { BookingProvider } from './contexts/BookingContext';
import SelectTicketOne from './pages/SelectTicketOne';
import SelectTicketRound from './pages/SelectTicketRound';
import TrainBasket from './pages/TrainBasket';
import Login from '../src/component/Auth/Login';
import LoginSuccess from '../src/component/Auth/LoginSuccess';
import LoginError from '../src/component/Auth/LoginError';
import HotelPage from './component/Hotel/HotelPage';
import HotelDetail from './component/Hotel/HotelDetail';
import HotelPageAdmin from './component/Hotel/HotelPageAdmin';
import HotelRegisterPage from './component/Hotel/HotelRegisterPage';
import HotelEditPage from './component/Hotel/HotelEditPage';
import HotelReservationPage from './component/Hotel/HotelReservationPage';
// Cafe 관련 import
import CafePage from './component/Cafe/CafePage';
import CafeDetail from './component/Cafe/CafeDetail';
import CafePageAdmin from './component/Cafe/CafePageAdmin';
import CafeRegisterPage from './component/Cafe/CafeRegisterPage';
import CafeEditPage from './component/Cafe/CafeEditPage';
// Restaurant 관련 import
import RestaurantPage from './component/Restaurant/RestaurantPage';
import RestaurantDetail from './component/Restaurant/RestaurantDetail';
import RestaurantPageAdmin from './component/Restaurant/RestaurantPageAdmin';
import RestaurantRegisterPage from './component/Restaurant/RestaurantRegisterPage';
import RestaurantEditPage from './component/Restaurant/RestaurantEditPage';
// MyPage import
import MyPage from './component/MyPage/MyPage';
import axios from 'axios';

// axios 기본 설정
axios.defaults.withCredentials = true;  // 모든 요청에 credentials 포함
axios.defaults.baseURL = 'http://localhost:8080';  // 백엔드 서버 주소

function App() {
        return (
    //   <DiaryStateContext.Provider value={data}>
    //     <DiaryDispatchContext.Provider value= {{onCreate, onUpdate,onDelete}}>
        <BookingProvider>
        <div className="App">
          <Header />
          <Sidebar />
          <Routes>
              <Route path="/" element={<Main />} />
              <Route path="/login" element={<Login />} />
              <Route path="/login/success" element={<LoginSuccess />} />
              <Route path="/login/error" element={<LoginError />} />
              <Route path="/TrainHome" element={<TrainHome />} />
              <Route path="/CheckTicketOne" element={<CheckTicketOne />} />
              <Route path="/BenchSelect" element={<BenchSelect />} />
              <Route path="/WeatherPage" element={<WeatherPage />} />
              <Route path="/SelectTicketOne" element={<SelectTicketOne />} />
              <Route path="/SelectTicketRound" element={<SelectTicketRound />} />
              <Route path="/TrainBasket" element={<TrainBasket />} />
              {/* Hotel 관련 Routes */}
              <Route path="/HotelPage" element={<HotelPage />} />
              <Route path="/HotelPageAdmin" element={<HotelPageAdmin />} />
              <Route path="/HotelRegister" element={<HotelRegisterPage />} />
              <Route path="/HotelEdit/:id" element={<HotelEditPage />} />
              <Route path="/HotelDetail/:id" element={<HotelDetail />} />
              <Route path="/HotelReservationPage" element={<HotelReservationPage />} />
              
              {/* Cafe 관련 Routes */}
              <Route path="/CafePage" element={<CafePage />} />
              <Route path="/CafePageAdmin" element={<CafePageAdmin />} />
              <Route path="/cafe/:id" element={<CafeDetail />} />
              <Route path="/CafeRegisterPage" element={<CafeRegisterPage />} />
              <Route path="/CafeEdit/:id" element={<CafeEditPage />} />
              {/* Restaurant 관련 Routes */}
              <Route path="/RestaurantPage" element={<RestaurantPage />} />
              <Route path="/RestaurantPageAdmin" element={<RestaurantPageAdmin />} />
              <Route path="/RestaurantRegister" element={<RestaurantRegisterPage />} />
              <Route path="/restaurant/:id" element={<RestaurantDetail />} />
              <Route path="/RestaurantEdit/:id" element={<RestaurantEditPage />} />
              
              {/* MyPage Route */}
              <Route path="/MyPage" element={<MyPage />} />
              {/* <Route path="/diary/:id" element={<Diary />} />
              <Route path="/edit/:id" element={<Edit />} />
              <Route path="/practice2" element={<Practice2 />} />
              <Route path="/gamehistory" element={<Gamehitory />} />  */}
          </Routes>
        </div>
        </BookingProvider>
    //     </DiaryDispatchContext.Provider>
    //   </DiaryStateContext.Provider>
    );
}

export default App;