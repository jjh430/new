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

// Unsplash 검색에 최적화된 상세 영어 키워드 매핑
const foodMapping = {
    '짜장면': 'Korean black bean noodles Jajangmyeon',
    '짬뽕': 'Korean spicy seafood noodle soup Jjamppong',
    '탕수육': 'Sweet and sour pork',
    '치킨': 'Korean fried chicken',
    '피자': 'Pizza',
    '햄버거': 'Gourmet Burger',
    '초밥': 'Sushi set',
    '라멘': 'Japanese Ramen soup',
    '돈카츠': 'Tonkatsu Japanese pork cutlet',
    '삼겹살': 'Korean pork belly BBQ Samgyeopsal',
    '김치찌개': 'Kimchi stew Jjigae',
    '된장찌개': 'Korean soybean paste stew Doenjang-jjigae',
    '비빔밥': 'Bibimbap Korean rice bowl',
    '제육볶음': 'Korean spicy pork stir-fry',
    '떡볶이': 'Tteokbokki Korean spicy rice cakes',
    '김밥': 'Gimbap Korean seaweed rice rolls',
    '파스타': 'Italian Pasta',
    '스테이크': 'Grilled Beef Steak',
    '샌드위치': 'Fresh Sandwich',
    '쌀국수': 'Vietnamese Pho noodle soup',
    '마라탕': 'Malatang spicy hot pot',
    '훠궈': 'Chinese Hot Pot',
    '양꼬치': 'Lamb skewers BBQ',
    '족발': 'Jokbal Korean braised pig trotters',
    '보쌈': 'Bossam Korean boiled pork',
    '아구찜': 'Spicy braised monkfish',
    '회': 'Sashimi fresh raw fish',
    '산낙지': 'Sannakji raw octopus',
    '우동': 'Japanese Udon noodle soup',
    '소바': 'Buckwheat Soba noodles',
    '칼국수': 'Kalguksu Korean knife-cut noodles',
    '수제비': 'Sujebi Korean hand-pulled dough soup'
};

const foodList = Object.keys(foodMapping);

// Unsplash API Access Key
const UNSPLASH_ACCESS_KEY = 'Imd6jUF7BVD5SpvycUfK8xfsbHnZUQrOnEJWKzKZru8';

async function showFoodImage(foodName) {
    const searchQuery = foodMapping[foodName] || foodName;
    try {
        // 검색 정확도를 높이기 위해 query를 최적화하고 관련성 높은 이미지를 가져옴
        const res = await fetch(
            `https://api.unsplash.com/search/photos?query=${encodeURIComponent(searchQuery)}&client_id=${UNSPLASH_ACCESS_KEY}&per_page=5&orientation=landscape&content_filter=high`
        );
        const data = await res.json();
        
        if (data.results && data.results.length > 0) {
            // 상위 결과 중 무작위로 하나를 선택하여 다양성 확보
            const randomIndex = Math.floor(Math.random() * Math.min(data.results.length, 3));
            const photo = data.results[randomIndex];
            
            foodImage.src = photo.urls.regular;
            foodImage.style.display = "block";
            foodImage.alt = foodName;
            
            // 이미지 로드 시 애니메이션 효과 (CSS transition 활용 가능)
            foodImage.style.opacity = 0;
            foodImage.onload = () => {
                foodImage.style.transition = "opacity 0.5s ease";
                foodImage.style.opacity = 1;
            };
        } else {
            // 결과가 없는 경우 일반적인 'Korean food' 이미지 시도
            if (!searchQuery.includes('food')) {
                const retryRes = await fetch(
                    `https://api.unsplash.com/search/photos?query=${encodeURIComponent('Korean food ' + foodName)}&client_id=${UNSPLASH_ACCESS_KEY}&per_page=1`
                );
                const retryData = await retryRes.json();
                if (retryData.results && retryData.results.length > 0) {
                    foodImage.src = retryData.results[0].urls.regular;
                    foodImage.style.display = "block";
                    return;
                }
            }
            foodImage.style.display = "none";
        }
    } catch (error) {
        console.error('이미지 로딩 에러:', error);
        foodImage.style.display = "none";
    }
}

function recommendFood() {
    recommendBtn.disabled = true;
    foodResult.innerHTML = '';
    
    // 로딩 중 표시
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
        
        // 정확도 높은 이미지 검색 및 표시
        await showFoodImage(selectedFood);
        
        recommendBtn.disabled = false;
    }, 500);
}

recommendBtn.addEventListener('click', recommendFood);

// 초기 실행
recommendFood();
