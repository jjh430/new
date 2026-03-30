const foodResult = document.getElementById('food-result');
const recommendBtn = document.getElementById('recommend-btn');
const themeBtn = document.getElementById('theme-btn');
const body = document.body;

// 테마 초기화
const currentTheme = localStorage.getItem('theme');
if (currentTheme === 'dark') {
    body.classList.add('dark-mode');
    themeBtn.textContent = '☀️';
}

function toggleTheme() {
    body.classList.toggle('dark-mode');
    const isDark = body.classList.contains('dark-mode');
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
    themeBtn.textContent = isDark ? '☀️' : '🌙';
}

themeBtn.addEventListener('click', toggleTheme);

const foodList = [
    '짜장면', '짬뽕', '탕수육', '치킨', '피자', '햄버거', '초밥', '라멘', '돈카츠',
    '삼겹살', '김치찌개', '된장찌개', '비빔밥', '제육볶음', '떡볶이', '김밥',
    '파스타', '스테이크', '샌드위치', '쌀국수', '마라탕', '훠궈', '양꼬치',
    '족발', '보쌈', '아구찜', '회', '산낙지', '우동', '소바', '칼국수', '수제비'
];

function recommendFood() {
    recommendBtn.disabled = true;
    foodResult.innerHTML = '';
    
    // 로딩 애니메이션 효과를 위해 임시 텍스트 표시
    const loadingDiv = document.createElement('div');
    loadingDiv.classList.add('food-menu');
    loadingDiv.textContent = '...';
    foodResult.appendChild(loadingDiv);

    setTimeout(() => {
        const randomIndex = Math.floor(Math.random() * foodList.length);
        const selectedFood = foodList[randomIndex];

        foodResult.innerHTML = '';
        const foodDiv = document.createElement('div');
        foodDiv.classList.add('food-menu');
        foodDiv.textContent = selectedFood;
        foodResult.appendChild(foodDiv);
        
        recommendBtn.disabled = false;
    }, 500);
}

recommendBtn.addEventListener('click', recommendFood);

// 초기 로딩 시 메뉴 추천
recommendFood();
