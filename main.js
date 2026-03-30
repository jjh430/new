const foodResult = document.getElementById('food-result');
const recommendBtn = document.getElementById('recommend-btn');
const themeBtn = document.getElementById('theme-btn');
const foodImage = document.getElementById('food-image');
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

// 한글 음식명과 영어 음식명 매핑 (API 검색용)
const foodMapping = {
    '짜장면': 'Noodles', '짬뽕': 'Seafood Noodles', '탕수육': 'Sweet and Sour Pork',
    '치킨': 'Chicken', '피자': 'Pizza', '햄버거': 'Burger', '초밥': 'Sushi',
    '라멘': 'Ramen', '돈카츠': 'Cutlet', '삼겹살': 'Pork Belly', '김치찌개': 'Kimchi Stew',
    '된장찌개': 'Soybean Paste Stew', '비빔밥': 'Bibimbap', '제육볶음': 'Spicy Pork',
    '떡볶이': 'Tteokbokki', '김밥': 'Kimbap', '파스타': 'Pasta', '스테이크': 'Steak',
    '샌드위치': 'Sandwich', '쌀국수': 'Pho', '마라탕': 'Malatang', '훠궈': 'Hotpot',
    '양꼬치': 'Lamb Skewers', '족발': 'Pork Trotters', '보쌈': 'Boiled Pork',
    '아구찜': 'Braised Spicy Monkfish', '회': 'Sashimi', '산낙지': 'Sannakji',
    '우동': 'Udon', '소바': 'Soba', '칼국수': 'Noodle Soup', '수제비': 'Hand-pulled Dough Soup'
};

const foodList = Object.keys(foodMapping);

async function showFoodImage(foodName) {
    const englishName = foodMapping[foodName] || foodName;
    const res = await fetch(
        `https://www.themealdb.com/api/json/v1/1/search.php?s=${encodeURIComponent(englishName)}`
    );
    const data = await res.json();
    
    if (data.meals) {
        const meal = data.meals[0];
        foodImage.src = meal.strMealThumb;
        foodImage.style.display = "block";
    } else {
        // 검색 결과가 없는 경우 이미지 숨김
        foodImage.style.display = "none";
    }
}

function recommendFood() {
    recommendBtn.disabled = true;
    foodResult.innerHTML = '';
    foodImage.style.display = "none"; // 새로운 추천 시 기존 이미지 숨김
    
    const loadingDiv = document.createElement('div');
    loadingDiv.classList.add('food-menu');
    loadingDiv.textContent = '...';
    foodResult.appendChild(loadingDiv);

    setTimeout(async () => {
        const randomIndex = Math.floor(Math.random() * foodList.length);
        const selectedFood = foodList[randomIndex];

        foodResult.innerHTML = '';
        const foodDiv = document.createElement('div');
        foodDiv.classList.add('food-menu');
        foodDiv.textContent = selectedFood;
        foodResult.appendChild(foodDiv);
        
        // 이미지 표시 함수 호출
        await showFoodImage(selectedFood);
        
        recommendBtn.disabled = false;
    }, 500);
}

recommendBtn.addEventListener('click', recommendFood);

// 초기 로딩 시 메뉴 추천
recommendFood();
