import React, { useState, useEffect } from 'react';
import styled from 'styled-components';

const CardSectionContainer = styled.div`
  position: relative;
  width: 100%;
  padding: 2rem 0;
  overflow: hidden;
`;

const CardSlider = styled.div`
  display: flex;
  gap: 1rem;
  transition: ${props => props.isJumping ? 'none' : 'transform 0.3s ease-in-out'};
  transform: ${props => props.transform};
  padding: 0 2rem;
`;

const Card = styled.div`
  flex: 0 0 280px;
  height: 320px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  cursor: pointer;
  transition: transform 0.2s ease-in-out;

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  }
`;

const CardImage = styled.img`
  width: 100%;
  height: 180px;
  object-fit: cover;
`;

const CardContent = styled.div`
  padding: 1rem;
`;

const CardTitle = styled.h3`
  margin: 0;
  font-size: 1.1rem;
  color: #333;
`;

const CardDescription = styled.p`
  margin: 0.5rem 0;
  font-size: 0.9rem;
  color: #666;
`;

const CardPrice = styled.div`
  font-size: 1.2rem;
  font-weight: bold;
  color: #0047AB;
`;

const SlideButton = styled.button`
  position: absolute;
  top: 50%;
  ${props => props.direction}: 0;
  transform: translateY(-50%);
  width: 40px;
  height: 40px;
  border: none;
  border-radius: 50%;
  background-color: white;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1;
  transition: all 0.2s ease-in-out;

  &:hover {
    background-color: #f5f5f5;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
  }

  &::before {
    content: '';
    width: 10px;
    height: 10px;
    border-top: 2px solid #333;
    border-right: 2px solid #333;
    transform: rotate(${props => props.direction === 'left' ? '225deg' : '45deg'});
  }
`;

const CardSection = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isJumping, setIsJumping] = useState(false);

  const cards = [
    {
      id: 1,
      image: 'https://picsum.photos/280/180?random=1',
      title: '서울 시티투어',
      description: '서울의 주요 관광지를 한번에!',
      price: '29,900원'
    },
    {
      id: 2,
      image: 'https://picsum.photos/280/180?random=2',
      title: '제주 올레길 트래킹',
      description: '제주의 아름다운 자연을 느껴보세요',
      price: '49,900원'
    },
    {
      id: 3,
      image: 'https://picsum.photos/280/180?random=3',
      title: '부산 해운대 요트투어',
      description: '특별한 추억을 만들어보세요',
      price: '89,900원'
    },
    {
      id: 4,
      image: 'https://picsum.photos/280/180?random=4',
      title: '강원도 스키 패키지',
      description: '겨울 스포츠의 즐거움',
      price: '159,900원'
    },
    {
      id: 5,
      image: 'https://picsum.photos/280/180?random=5',
      title: '경주 역사 투어',
      description: '천년 고도의 이야기',
      price: '39,900원'
    }
  ];

  // 순환 구조를 위해 앞뒤로 카드 추가
  const circularCards = [...cards.slice(-2), ...cards, ...cards.slice(0, 2)];

  useEffect(() => {
    if (currentIndex <= 0) {
      setIsJumping(true);
      setCurrentIndex(cards.length);
      setTimeout(() => setIsJumping(false), 0);
    } else if (currentIndex > cards.length) {
      setIsJumping(true);
      setCurrentIndex(1);
      setTimeout(() => setIsJumping(false), 0);
    }
  }, [currentIndex, cards.length]);

  const handlePrev = () => {
    setCurrentIndex(prev => prev - 1);
  };

  const handleNext = () => {
    setCurrentIndex(prev => prev + 1);
  };

  const getTransformValue = () => {
    const baseOffset = 2; // 앞에 추가된 카드 개수
    const cardWidth = 296; // 카드 너비 + gap
    return `translateX(-${(currentIndex + baseOffset) * cardWidth}px)`;
  };

  return (
    <CardSectionContainer>
      <SlideButton direction="left" onClick={handlePrev} />
      <CardSlider transform={getTransformValue()} isJumping={isJumping}>
        {circularCards.map((card, index) => (
          <Card key={`${card.id}-${index}`}>
            <CardImage src={card.image} alt={card.title} />
            <CardContent>
              <CardTitle>{card.title}</CardTitle>
              <CardDescription>{card.description}</CardDescription>
              <CardPrice>{card.price}</CardPrice>
            </CardContent>
          </Card>
        ))}
      </CardSlider>
      <SlideButton direction="right" onClick={handleNext} />
    </CardSectionContainer>
  );
};

export default CardSection;