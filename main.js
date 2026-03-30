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
    '짜장면': 'Jajangmyeon', '짬뽕': 'Jjamppong', '탕수육': 'Tangsuyuk',
    '치킨': 'Fried Chicken', '피자': 'Pizza', '햄버거': 'Burger', '초밥': 'Sushi',
    '라멘': 'Ramen', '돈카츠': 'Tonkatsu', '삼겹살': 'Samgyeopsal', '김치찌개': 'Kimchi Jjigae',
    '된장찌개': 'Doenjang Jjigae', '비빔밥': 'Bibimbap', '제육볶음': 'Jeyuk Bokkeum',
    '떡볶이': 'Tteokbokki', '김밥': 'Gimbap', '파스타': 'Pasta', '스테이크': 'Steak',
    '샌드위치': 'Sandwich', '쌀국수': 'Pho', '마라탕': 'Malatang', '훠궈': 'Hotpot',
    '양꼬치': 'Lamb Skewers', '족발': 'Jokbal', '보쌈': 'Bossam',
    '아구찜': 'Agujjim', '회': 'Sashimi', '산낙지': 'Sannakji',
    '우동': 'Udon', '소바': 'Soba', '칼국수': 'Kalguksu', '수제비': 'Sujebi'
};

const foodList = Object.keys(foodMapping);

// Unsplash API Access Key
const UNSPLASH_ACCESS_KEY = 'Imd6jUF7BVD5SpvycUfK8xfsbHnZUQrOnEJWKzKZru8';

async function showFoodImage(foodName) {
    const englishName = foodMapping[foodName] || foodName;
    try {
        // Unsplash API를 사용하여 고화질 음식 사진 검색
        const res = await fetch(
            `https://api.unsplash.com/search/photos?query=${encodeURIComponent(englishName + ' food')}&client_id=${UNSPLASH_ACCESS_KEY}&per_page=1&orientation=squarish`
        );
        const data = await res.json();
        
        if (data.results && data.results.length > 0) {
            const photo = data.results[0];
            foodImage.src = photo.urls.regular;
            foodImage.style.display = "block";
            foodImage.alt = `${foodName} 이미지 (Photo by ${photo.user.name} on Unsplash)`;
        } else {
            foodImage.style.display = "none";
        }
    } catch (error) {
        console.error('이미지를 불러오는데 실패했습니다:', error);
        foodImage.style.display = "none";
    }
}

function recommendFood() {
    recommendBtn.disabled = true;
    foodResult.innerHTML = '';
    foodImage.style.display = "none"; 
    
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
        
        // 고화질 이미지 표시
        await showFoodImage(selectedFood);
        
        recommendBtn.disabled = false;
    }, 500);
}

recommendBtn.addEventListener('click', recommendFood);

// 초기 로딩 시 메뉴 추천
recommendFood();
