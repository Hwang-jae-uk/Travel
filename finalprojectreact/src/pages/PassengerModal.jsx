import React, { useState } from 'react';
import './PassengerModal.css';

const PassengerModal = ({ isOpen, onClose, onSelect, initialAdults = 1, initialChildren = 0 }) => {
  const [adults, setAdults] = useState(initialAdults);
  const [children, setChildren] = useState(initialChildren);

  if (!isOpen) return null;

  const handleDecrease = (type) => {
    if (type === 'adult' && adults > 0) {
      setAdults(adults - 1);
    } else if (type === 'child' && children > 0) {
      setChildren(children - 1);
    }
  };

  const handleIncrease = (type) => {
    if (type === 'adult') {
      setAdults(adults + 1);
    } else if (type === 'child') {
      setChildren(children + 1);
    }
  };

  const handleApply = () => {
    onSelect({ adults, children }); 
    if(adults + children === 0) {
      alert('탑승 인원은 최소 성인 1명 이상 선택해주세요.');
      return;
    } else if(adults === 0) {
      alert('아동 인원은 성인 1명 이상 선택해주세요.');
      return;
    } else {
      onClose();
    }
  };

  return (
    <div className="modal-overlay">
      <div className="passenger-modal">
        <div className="modal-header"> 
          <div className="passenger-desc">탑승 인원은 한번에 최대 9명까지 예약할 수 있어요.</div>
          <h2>인원 선택</h2>
          <button className="close-button" onClick={onClose}>×</button>
        </div>
        <div className="passenger-modal-content">
          <div className="passenger-row">
            <div className="passenger-info">
              <div className="passenger-type">성인</div>
              <div className="passenger-desc">만 13세 이상</div>
            </div>
            <div className="passenger-controls">
              <button 
                className="control-button" 
                onClick={() => handleDecrease('adult')}
                disabled={adults <= 0} 
              >
                -
              </button>
              <span className="passenger-count">{adults}</span>
              <button 
                className="control-button"
                onClick={() => handleIncrease('adult')}
                disabled={adults + children >= 9}
              >
                +
              </button>
            </div>
          </div>    
          <div className="passenger-row">
            <div className="passenger-info">
              <div className="passenger-type">아동</div>
              <div className="passenger-desc">만 6~12세 미만</div>
            </div>
            <div className="passenger-controls">
              <button 
                className="control-button"
                onClick={() => handleDecrease('child')}
                disabled={children <= 0}
              >
                -
              </button>
              <span className="passenger-count">{children}</span>
              <button 
                className="control-button"
                onClick={() => handleIncrease('child')}
                disabled={adults + children >= 9}
              >
                +
              </button>
            </div>
          </div>
        </div>
        <button className="apply-button" onClick={handleApply}>
          성인 {adults} 아동 {children} 적용하기
        </button>
      </div>
    </div>
  );
};

export default PassengerModal; 