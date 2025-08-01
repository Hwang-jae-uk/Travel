import { createContext, useState, useEffect } from 'react';

export const BookingContext = createContext(null);

export const BookingProvider = ({ children }) => {
  // sessionStorage에서 불러오기 함수
  const load = (key, defaultValue = null) => {
    const saved = sessionStorage.getItem(key);
    return saved ? JSON.parse(saved) : defaultValue;
  };

  const [booking, setBooking] = useState(() => load('booking'));
  const [selectedTrain, setSelectedTrain] = useState(() => load('selectedTrain'));
  const [selectedSeat, setSelectedSeat] = useState(() => load('selectedSeat'));
  const [basketItems, setBasketItems] = useState(() => load('basketItems', []));
  const [departSchedules, setDepartSchedules] = useState(() => load('departSchedules', []));
  const [returnSchedules, setReturnSchedules] = useState(() => load('returnSchedules', []));
  const [departSelection, setDepartSelection] = useState(() => load('departSelection'));
  const [returnSelection, setReturnSelection] = useState(() => load('returnSelection'));
  const [recentlyDeletedItems, setRecentlyDeletedItems] = useState([]); // 추가

useEffect(() => {
  const interval = setInterval(() => {
    const now = Date.now();
    const filteredItems = [];
    const deletedItems = [];
    basketItems.forEach(item => {
      if (item.paid) {
        filteredItems.push(item);
      } else if ((now - item.addedAt) < 600000) { // 10분
        filteredItems.push(item);
      } else {
        deletedItems.push(item);
      }
    });

    if (deletedItems.length > 0) {
      setBasketItems(filteredItems);
      setRecentlyDeletedItems(deletedItems); // 삭제된 아이템 정보 저장
    }
  }, 600000); // 10분마다 검사

  return () => clearInterval(interval);
}, [basketItems]);

  // 각각의 상태가 변경될 때마다 sessionStorage에 저장
  useEffect(() => {
    sessionStorage.setItem('booking', JSON.stringify(booking));
  }, [booking]);
  useEffect(() => {
    sessionStorage.setItem('selectedTrain', JSON.stringify(selectedTrain));
  }, [selectedTrain]);
  useEffect(() => {
    sessionStorage.setItem('selectedSeat', JSON.stringify(selectedSeat));
  }, [selectedSeat]);
  useEffect(() => {
    sessionStorage.setItem('basketItems', JSON.stringify(basketItems));
  }, [basketItems]);
  useEffect(() => {
    sessionStorage.setItem('departSchedules', JSON.stringify(departSchedules));
  }, [departSchedules]);
  useEffect(() => {
    sessionStorage.setItem('returnSchedules', JSON.stringify(returnSchedules));
  }, [returnSchedules]);
  useEffect(() => {
    sessionStorage.setItem('departSelection', JSON.stringify(departSelection));
  }, [departSelection]);
  useEffect(() => {
    sessionStorage.setItem('returnSelection', JSON.stringify(returnSelection));
  }, [returnSelection]);

  const value = {
    booking,
    setBooking,
    selectedTrain,
    setSelectedTrain,
    selectedSeat,
    setSelectedSeat,
    basketItems,
    setBasketItems,
    departSchedules,
    setDepartSchedules,
    returnSchedules,
    setReturnSchedules,
    departSelection,
    setDepartSelection,
    returnSelection,
    setReturnSelection,
    recentlyDeletedItems,
    setRecentlyDeletedItems,
  };

  return (
    <BookingContext.Provider value={value}>{children}</BookingContext.Provider>
  );
}; 