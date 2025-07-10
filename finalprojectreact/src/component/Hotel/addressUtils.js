// 한국의 도/특별시/광역시 목록
export const provinces = [
    '서울특별시', '부산광역시', '대구광역시', '인천광역시', '광주광역시', 
    '대전광역시', '울산광역시', '세종특별자치시', '경기도', '강원도', 
    '충청북도', '충청남도', '전라북도', '전라남도', '경상북도', '경상남도', '제주특별자치도'
];

// 주소에서 도/특별시/광역시와 시/구 추출하는 함수
export const parseAddress = (address) => {
    if (!address) return { province: '', city: '', fullAddress: address };
    
    const addressParts = address.split(' ');
    let province = '';
    let city = '';
    
    // 도/특별시/광역시 찾기
    for (const part of addressParts) {
        if (provinces.some(p => p.includes(part) || part.includes(p.replace(/특별시|광역시|특별자치시|특별자치도|도$/g, '')))) {
            province = part;
            break;
        }
    }
    
    // 시/구 찾기 (도/특별시/광역시 다음 부분)
    const provinceIndex = addressParts.findIndex(part => part === province);
    if (provinceIndex !== -1 && provinceIndex + 1 < addressParts.length) {
        city = addressParts[provinceIndex + 1];
    }
    
    return { province, city, fullAddress: address };
}; 