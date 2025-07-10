import React, { useState, useEffect } from 'react';
import './StationModal.css';
import { useNavigate } from "react-router-dom";
import { FaMagnifyingGlass } from "react-icons/fa6";
import { TbTrain } from "react-icons/tb";

const StationModal = ({ isOpen, onClose, onSelect, title = "출발역 선택", saveRecentSearch, recentSearches, onDeleteRecent, onDeleteAll, onRecentSearchSelect }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilter, setActiveFilter] = useState('전체');  

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleFilterClick = (filter) => {
    setActiveFilter(filter);
  };

  const handleSelect = (station) => {
    onSelect(station);
    onClose();
  };

   const handleRecentSelects = (stations) => {
    if (onRecentSearchSelect) {
      onRecentSearchSelect(stations);
    } else {
      // 대체 방법: 첫 번째 역을 선택
      onSelect(stations[0]);
      onClose();
    }
  };

  const mainStations = [
    { name: '서울', category: '주요역', isKTX: true },
    { name: '용산', category: '주요역', isKTX: true },
    { name: '대전', category: '주요역', isKTX: true },
    { name: '동대구', category: '주요역', isKTX: true },
    { name: '부산', category: '주요역', isKTX: true },
    { name: '광주송정', category: '주요역', isKTX: true },
    { name: '여수EXPO', category: '주요역', isKTX: true },
    { name: '강릉', category: '주요역', isKTX: true },
  ];

  const allStations = [
    // ㄱ
    { name: '가평', category: 'ㄱ', isKTX: false },
    { name: '강경', category: 'ㄱ', isKTX: false },
    { name: '강릉', category: 'ㄱ', isKTX: true },
    { name: '강촌', category: 'ㄱ', isKTX: false },
    { name: '개포', category: 'ㄱ', isKTX: false },
    { name: '경산', category: 'ㄱ', isKTX: false },
    { name: '경주', category: 'ㄱ', isKTX: false },
    { name: '계룡', category: 'ㄱ', isKTX: false },
    { name: '공주', category: 'ㄱ', isKTX: true },
    { name: '곡성', category: 'ㄱ', isKTX: false },
    { name: '광명', category: 'ㄱ', isKTX: true },
    { name: '광양', category: 'ㄱ', isKTX: false },
    { name: '광주', category: 'ㄱ', isKTX: false },
    { name: '광주송정', category: 'ㄱ', isKTX: true },
    { name: '구례구', category: 'ㄱ', isKTX: false },
    { name: '구미', category: 'ㄱ', isKTX: true },
    { name: '군산', category: 'ㄱ', isKTX: false },
    { name: '극락강', category: 'ㄱ', isKTX: false },
    { name: '기장', category: 'ㄱ', isKTX: false },
    { name: '김제', category: 'ㄱ', isKTX: false },
    { name: '김천', category: 'ㄱ', isKTX: false },
    { name: '김천구미', category: 'ㄱ', isKTX: true },
    // ㄴ
    { name: '나주', category: 'ㄴ', isKTX: true },
    { name: '남성현', category: 'ㄴ', isKTX: false },
    { name: '남원', category: 'ㄴ', isKTX: false },
    { name: '남창', category: 'ㄴ', isKTX: false },
    { name: '논산', category: 'ㄴ', isKTX: false },
    // ㄷ
    { name: '대구', category: 'ㄷ', isKTX: false },
    { name: '대전', category: 'ㄷ', isKTX: true },
    { name: '대천', category: 'ㄷ', isKTX: false },
    { name: '덕하', category: 'ㄷ', isKTX: false },
    { name: '동대구', category: 'ㄷ', isKTX: true },
    { name: '동해', category: 'ㄷ', isKTX: false },
    { name: '동백산', category: 'ㄷ', isKTX: false },
    { name: '둔내', category: 'ㄷ', isKTX: false },
    // ㅁ
    { name: '마산', category: 'ㅁ', isKTX: false },
    { name: '마석', category: 'ㅁ', isKTX: false },
    { name: '만종', category: 'ㅁ', isKTX: false },
    { name: '매곡', category: 'ㅁ', isKTX: false },
    { name: '명봉', category: 'ㅁ', isKTX: false },
    { name: '목포', category: 'ㅁ', isKTX: true },
    { name: '몽탄', category: 'ㅁ', isKTX: false },
    { name: '무안', category: 'ㅁ', isKTX: false },
    { name: '묵호', category: 'ㅁ', isKTX: false },
    { name: '문산', category: 'ㅁ', isKTX: false },
    { name: '물금', category: 'ㅁ', isKTX: false },
    { name: '밀양', category: 'ㅁ', isKTX: false },
    // ㅂ
    { name: '반성', category: 'ㅂ', isKTX: false },
    { name: '백양사', category: 'ㅂ', isKTX: false },
    { name: '벌교', category: 'ㅂ', isKTX: false },
    { name: '보성', category: 'ㅂ', isKTX: false },
    { name: '봉화', category: 'ㅂ', isKTX: false },
    { name: '부강', category: 'ㅂ', isKTX: false },
    { name: '부산', category: 'ㅂ', isKTX: true },
    { name: '부전', category: 'ㅂ', isKTX: false },
    { name: '북영천', category: 'ㅂ', isKTX: false },
    { name: '북천', category: 'ㅂ', isKTX: false },
    { name: '분천', category: 'ㅂ', isKTX: false },
    // ㅅ
    { name: '사상', category: 'ㅅ', isKTX: false },
    { name: '삼랑진', category: 'ㅅ', isKTX: false },
    { name: '삼례', category: 'ㅅ', isKTX: false },
    { name: '삼산', category: 'ㅅ', isKTX: false },
    { name: '삼탄', category: 'ㅅ', isKTX: false },
    { name: '상동', category: 'ㅅ', isKTX: false },
    { name: '상봉', category: 'ㅅ', isKTX: false },
    { name: '서대구', category: 'ㅅ', isKTX: true },
    { name: '서울', category: 'ㅅ', isKTX: true },
    { name: '서정리', category: 'ㅅ', isKTX: false },
    { name: '서천', category: 'ㅅ', isKTX: false },
    { name: '석불', category: 'ㅅ', isKTX: false },
    { name: '성환', category: 'ㅅ', isKTX: false },
    { name: '센텀', category: 'ㅅ', isKTX: false },
    { name: '수서', category: 'ㅅ', isKTX: true },
    { name: '순천', category: 'ㅅ', isKTX: true },
    { name: '신경주', category: 'ㅅ', isKTX: true },
    { name: '신기', category: 'ㅅ', isKTX: false },
    { name: '신녕', category: 'ㅅ', isKTX: false },
    { name: '신동', category: 'ㅅ', isKTX: false },
    { name: '신례원', category: 'ㅅ', isKTX: false },
    { name: '신탄진', category: 'ㅅ', isKTX: false },
    { name: '신태인', category: 'ㅅ', isKTX: false },
    { name: '신해운대', category: 'ㅅ', isKTX: false },
    { name: '심천', category: 'ㅅ', isKTX: false },
    // ㅇ
    { name: '아산', category: 'ㅇ', isKTX: false },
    { name: '안동', category: 'ㅇ', isKTX: false },
    { name: '안양', category: 'ㅇ', isKTX: false },
    { name: '약목', category: 'ㅇ', isKTX: false },
    { name: '양평', category: 'ㅇ', isKTX: false },
    { name: '여수EXPO', category: 'ㅇ', isKTX: true },
    { name: '여천', category: 'ㅇ', isKTX: false },
    { name: '연산', category: 'ㅇ', isKTX: false },
    { name: '영동', category: 'ㅇ', isKTX: false },
    { name: '영등포', category: 'ㅇ', isKTX: false },
    { name: '영월', category: 'ㅇ', isKTX: false },
    { name: '영주', category: 'ㅇ', isKTX: false },
    { name: '영천', category: 'ㅇ', isKTX: false },
    { name: '예당', category: 'ㅇ', isKTX: false },
    { name: '예미', category: 'ㅇ', isKTX: false },
    { name: '예산', category: 'ㅇ', isKTX: false },
    { name: '예천', category: 'ㅇ', isKTX: false },
    { name: '오근장', category: 'ㅇ', isKTX: false },
    { name: '오산', category: 'ㅇ', isKTX: false },
    { name: '오송', category: 'ㅇ', isKTX: true },
    { name: '옥산', category: 'ㅇ', isKTX: false },
    { name: '옥천', category: 'ㅇ', isKTX: false },
    { name: '온양온천', category: 'ㅇ', isKTX: false },
    { name: '완사', category: 'ㅇ', isKTX: false },
    { name: '왜관', category: 'ㅇ', isKTX: false },
    { name: '용궁', category: 'ㅇ', isKTX: false },
    { name: '용동', category: 'ㅇ', isKTX: false },
    { name: '용문', category: 'ㅇ', isKTX: false },
    { name: '용산', category: 'ㅇ', isKTX: true },
    { name: '울산', category: 'ㅇ', isKTX: true },
    { name: '원동', category: 'ㅇ', isKTX: false },
    { name: '원주', category: 'ㅇ', isKTX: false },
    { name: '음성', category: 'ㅇ', isKTX: false },
    { name: '의성', category: 'ㅇ', isKTX: false },
    { name: '이양', category: 'ㅇ', isKTX: false },
    { name: '이원', category: 'ㅇ', isKTX: false },
    { name: '익산', category: 'ㅇ', isKTX: true },
    { name: '일로', category: 'ㅇ', isKTX: false },
    { name: '임기', category: 'ㅇ', isKTX: false },
    { name: '임성리', category: 'ㅇ', isKTX: false },
    // ㅈ
    { name: '장성', category: 'ㅈ', isKTX: false },
    { name: '장항', category: 'ㅈ', isKTX: false },
    { name: '전의', category: 'ㅈ', isKTX: false },
    { name: '전주', category: 'ㅈ', isKTX: true },
    { name: '정동진', category: 'ㅈ', isKTX: false },
    { name: '정읍', category: 'ㅈ', isKTX: true },
    { name: '제천', category: 'ㅈ', isKTX: false },
    { name: '조성', category: 'ㅈ', isKTX: false },
    { name: '조치원', category: 'ㅈ', isKTX: false },
    { name: '좌천', category: 'ㅈ', isKTX: false },
    { name: '주덕', category: 'ㅈ', isKTX: false },
    { name: '중리', category: 'ㅈ', isKTX: false },
    { name: '증평', category: 'ㅈ', isKTX: false },
    { name: '지탄', category: 'ㅈ', isKTX: false },
    { name: '지평', category: 'ㅈ', isKTX: false },
    { name: '진례', category: 'ㅈ', isKTX: false },
    { name: '진부', category: 'ㅈ', isKTX: false },
    { name: '진상', category: 'ㅈ', isKTX: false },
    { name: '진영', category: 'ㅈ', isKTX: false },
    { name: '진주', category: 'ㅈ', isKTX: false },
    // ㅊ
    { name: '창원', category: 'ㅊ', isKTX: false },
    { name: '창원중앙', category: 'ㅊ', isKTX: false },
    { name: '천안', category: 'ㅊ', isKTX: false },
    { name: '천안아산', category: 'ㅊ', isKTX: true },
    { name: '철암', category: 'ㅊ', isKTX: false },
    { name: '청도', category: 'ㅊ', isKTX: false },
    { name: '청량리', category: 'ㅊ', isKTX: false },
    { name: '청리', category: 'ㅊ', isKTX: false },
    { name: '청소', category: 'ㅊ', isKTX: false },
    { name: '청주', category: 'ㅊ', isKTX: false },
    { name: '추전', category: 'ㅊ', isKTX: false },
    { name: '추풍령', category: 'ㅊ', isKTX: false },
    { name: '춘양', category: 'ㅊ', isKTX: false },
    { name: '춘천', category: 'ㅊ', isKTX: false },
    // ㅌ
    { name: '태백', category: 'ㅌ', isKTX: false },
    { name: '태화강', category: 'ㅌ', isKTX: false },
    // ㅍ
    { name: '판교', category: 'ㅍ', isKTX: false },
    { name: '평창', category: 'ㅍ', isKTX: false },
    { name: '평택', category: 'ㅍ', isKTX: false },
    { name: '포항', category: 'ㅍ', isKTX: true },
    // ㅎ
    { name: '하동', category: 'ㅎ', isKTX: false },
    { name: '한림정', category: 'ㅎ', isKTX: false },
    { name: '함안', category: 'ㅎ', isKTX: false },
    { name: '함창', category: 'ㅎ', isKTX: false },
    { name: '함평', category: 'ㅎ', isKTX: false },
    { name: '행신', category: 'ㅎ', isKTX: false },
    { name: '현동', category: 'ㅎ', isKTX: false },
    { name: '호계', category: 'ㅎ', isKTX: false },
    { name: '홍성', category: 'ㅎ', isKTX: false },
    { name: '화명', category: 'ㅎ', isKTX: false },
    { name: '화본', category: 'ㅎ', isKTX: false },
    { name: '화순', category: 'ㅎ', isKTX: false },
    { name: '황간', category: 'ㅎ', isKTX: false },
    { name: '횡성', category: 'ㅎ', isKTX: false },
    { name: '횡천', category: 'ㅎ', isKTX: false },
    { name: '희방사', category: 'ㅎ', isKTX: false },
  ];

  const filteredStations = allStations.filter(station => {
    const matchesSearch = station.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = activeFilter === '전체' || 
      (activeFilter === 'KTX' ? station.isKTX : station.category === activeFilter);
    return matchesSearch && matchesFilter;
  });

  if (!isOpen) return null;

  return (
    <div className="station-modal-overlay">
      <div className="station-modal-content">
        <div className="modal-header">
          <button className="close-button" onClick={onClose}>×</button>
          <h2>{title}</h2>
        </div>

        <div className="search-container">
          <input
            type="text"
            placeholder="초성 또는 전체를 입력해 주세요."
            value={searchTerm}
            onChange={handleSearch}
          />
          <button className="search-button">
            <FaMagnifyingGlass size={18} color="#666" />
          </button>
        </div>

        <div className="station-sections">
          {searchTerm ? (
            <section className="search-results">
              <h3>검색 결과</h3>
              <div className="stations-list">
                {filteredStations.map((station) => (
                  <button
                    key={station.name}
                    className="station-list-item"
                    onClick={() => handleSelect(station.name)}
                  >
                    {station.name} <TbTrain size={18} color="#666" />
                  </button>
                ))}
              </div>
            </section>
          ) : (
            <>
              <section className="main-stations">
                <h3>주요역</h3>
                <div className="station-grid">
                  {mainStations.map((station) => (
                    <button
                      key={station.name}
                      className="station-button"
                      onClick={() => handleSelect(station.name)}
                    >
                      {station.name}
                    </button>
                  ))}
                </div>
              </section>

              {recentSearches.length > 0 && (
                <section className="recent-searches">
                  <div className="section-header">
                    <h3>최근 검색 구간</h3>
                    <button className="view-all" onClick={onDeleteAll}>전체 삭제</button>
                  </div>
                  <div className="recent-list">
                    {recentSearches.map((item, index) => (
                      <div key={index} className="recent-item">
                        <span className="route-icon"><TbTrain size={18} color="#666" /></span>
                        <div className="location-box">
                          <span onClick={() => handleRecentSelects(item.stations)}>{item.stations[0]} - {item.stations[1]} </span>
                        </div>
                        <button 
                          className="delete-button"
                          onClick={(e) => {
                            e.stopPropagation();
                            onDeleteRecent(index); 
                          }}
                        > 
                          ×
                        </button>   
                      </div>
                    ))}
                  </div>
                </section>
              )}

              <section className="all-stations">
                <h3>모든 정차역</h3>
                <div className="alphabet-filter">
                  <button 
                    className={`filter-button ${activeFilter === '전체' ? 'active' : ''}`}
                    onClick={() => handleFilterClick('전체')}
                  >
                    전체
                  </button>
                  <button 
                    className={`filter-button ${activeFilter === 'KTX' ? 'active' : ''}`}
                    onClick={() => handleFilterClick('KTX')}
                  >
                    KTX
                  </button>
                  {['ㄱ','ㄴ','ㄷ','ㄹ','ㅁ','ㅂ','ㅅ','ㅇ','ㅈ','ㅊ','ㅋ','ㅌ','ㅍ'].map(char => (
                    <button 
                      key={char} 
                      className={`filter-button ${activeFilter === char ? 'active' : ''}`}
                      onClick={() => handleFilterClick(char)}
                    >
                      {char}
                    </button>
                  ))}
                </div>
                <div className="stations-list">
                  {filteredStations.map((station) => (
                    <button
                      key={station.name}
                      className="station-list-item"
                      onClick={() => handleSelect(station.name)}
                    >
                      {station.name}
                    </button>
                  ))}
                </div>
              </section>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default StationModal; 