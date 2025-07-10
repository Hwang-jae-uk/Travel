import React from 'react';
import { useNavigate } from 'react-router-dom';
import CafeListAdmin from './CafeListAdmin';
import './Cafe.css';

/**
 * CafePageAdmin Component - 관리자용 카페 페이지
 */
const CafePageAdmin = () => {
  const navigate = useNavigate();

  return (
    <div className="page-container">
      <div className="button-row">
        <h1 className="page-title">☕ 카페 관리 (관리자)</h1>
        <button className="add-cafe-button" onClick={() => { navigate('/CafeRegisterPage')}}>
          ✨ 카페 등록
        </button>
      </div>
      <CafeListAdmin />
    </div>
  );
};

export default CafePageAdmin; 