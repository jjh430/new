const foodResult = document.getElementById('food-result');
const recommendBtn = document.getElementById('recommend-btn');
const themeBtn = document.getElementById('theme-btn');
const foodImage = document.getElementById('food-image');
const body = document.body;

// 테마 초기화
if (localStorage.getItem('theme') === 'dark') {
    body.classList.add('dark-mode');
    themeBtn.textContent = '☀️';
}
function toggleTheme() {
    body.classList.toggle('dark-mode');
    themeBtn.textContent = body.classList.contains('dark-mode') ? '☀️' : '🌙';
    localStorage.setItem('theme', body.classList.contains('dark-mode') ? 'dark' : 'light');
}
themeBtn.addEventListener('click', toggleTheme);

// 음식명 → 위키백과(Wikipedia) 최적화 매핑 (사진 퀄리티 및 정확도 중심)
const foodMapping = {
    // 한식 (대표 사진이 잘 등록된 명칭으로 통일)
    '김치찌개': '김치찌개', '된장찌개': '된장찌개', '순두부찌개': '순두부찌개',
    '부대찌개': '부대찌개', '청국장': '청국장', '비빔밥': '비빔밥',
    '돌솥비빔밥': '비빔밥', '제육볶음': '제육볶음', '불고기': '불고기',
    '갈비찜': '갈비찜', '삼겹살': '삼겹살', '족발': '족발', '보쌈': '보쌈',
    '떡볶이': '떡볶이', '김밥': '김밥', '라볶이': '라볶이', '순대': '순대',
    '어묵탕': '어묵', '칼국수': '칼국수', '수제비': '수제비',
    '설렁탕': '설렁탕', '삼계탕': '삼계탕', '냉면': '냉면',
    '비빔냉면': '냉면', '잔치국수': '잔치국수', '육개장': '육개장',
    '해물파전': '파전', '낙지볶음': '낙지볶음', '오징어볶음': '오징어볶음',
    '아구찜': '아귀찜', '닭갈비': '닭갈비', '닭볶음탕': '닭볶음탕',
    '치킨': '프라이드치킨', '양념치킨': '양념치킨', '회': '생선회',
    '물회': '물회', '연어회': '연어', '감자탕': '감자탕',
    '순대국': '순대', '콩나물국밥': '콩나물국밥', '추어탕': '추어탕',
    '고등어조림': '고등어조림', '갈치조림': '갈치조림', '매운탕': '매운탕',

    // 중식
    '짜장면': '자장면', '짬뽕': '짬뽕', '탕수육': '탕수육',
    '마파두부': '마파두부', '볶음밥': '볶음밥', '마라탕': '마라탕',
    '훠궈': '훠궈', '양꼬치': '양꼬치', '딤섬': '딤섬',
    '깐풍기': '깐풍기', '유린기': '유린기', '꿔바로우': '탕수육',

    // 일식 (소바 등 특정 메뉴 정밀 수정)
    '초밥': '초밥', '라멘': '라멘', '우동': '우동', 
    '소바': '자루소바', // '메밀국수'보다 '자루소바'가 정갈한 음식 사진이 많음
    '돈카츠': '돈가스', '타코야키': '타코야키', '오코노미야끼': '오코노미야키',
    '규동': '규동', '샤브샤브': '샤부샤부', '카레라이스': '카레라이스',
    '가라아게': '가라아게', '텐동': '텐동',

    // 양식
    '파스타': '파스타', '스테이크': '스테이크', '리조또': '리조토',
    '피자': '피자', '햄버거': '햄버거', '샌드위치': '샌드위치',
    '시저샐러드': '시저 샐러드', '라자냐': '라자냐',
    '감바스': '감바스 알 아히요', '에그 베네딕트': '에그 베네딕트',

    // 동남아/기타
    '쌀국수': '쌀국수', '팟타이': '팟타이', '반미': '반미',
    '나시고렝': '나시고렝', '똠얌꿍': '똠얌', '커리': '카레',
    '케밥': '케밥', '타코': '타코', '부리토': '부리토',

    // 분식/간식
    '와플': '와플', '팬케이크': '팬케이크', '핫도그': '핫도그',
    '붕어빵': '붕어빵', '호떡': '호떡', '튀김': '튀김'
};

const foodList = Object.keys(foodMapping);
const imageCache = {};

async function showFoodImage(foodName) {
    foodImage.style.opacity = '0';
    foodImage.style.display = 'block';

    if (imageCache[foodName]) {
        foodImage.src = imageCache[foodName];
        foodImage.onload = () => {
            foodImage.style.transition = 'opacity 0.4s ease';
            foodImage.style.opacity = '1';
        };
        return;
    }

    try {
        const searchTerm = foodMapping[foodName] || foodName;
        const res = await fetch(
            `https://ko.wikipedia.org/w/api.php?action=query&titles=${encodeURIComponent(searchTerm)}&prop=pageimages&format=json&pithumbsize=800&origin=*`
        );
        const data = await res.json();
        const pages = data.query.pages;
        const page = Object.values(pages)[0];

        if (page.thumbnail && page.thumbnail.source) {
            const imgUrl = page.thumbnail.source;
            imageCache[foodName] = imgUrl;
            foodImage.src = imgUrl;
            foodImage.onload = () => {
                foodImage.style.transition = 'opacity 0.4s ease';
                foodImage.style.opacity = '1';
            };
        } else {
            // 위키백과에 사진이 없는 경우 대비 (숨김 처리)
            foodImage.style.display = 'none';
        }
    } catch (e) {
        console.error('Image Error:', e);
        foodImage.style.display = 'none';
    }
}

function recommendFood() {
    recommendBtn.disabled = true;
    foodResult.innerHTML = '';
    foodImage.style.display = 'none';

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

        await showFoodImage(selectedFood);
        recommendBtn.disabled = false;
    }, 500);
}

recommendBtn.addEventListener('click', recommendFood);
recommendFood();
