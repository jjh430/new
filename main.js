const foodResult = document.getElementById('food-result');
const recommendBtn = document.getElementById('recommend-btn');
const themeBtn = document.getElementById('theme-btn');
const foodImage = document.getElementById('food-image');
const body = document.body;

// ⬇️ 제공해주신 Unsplash Access Key
const UNSPLASH_KEY = 'Imd6jUF7BVD5SpvycUfK8xfsbHnZUQrOnEJWKzKZru8';

// 테마 초기화 (CSS 클래스명인 'dark-mode'에 맞춰 수정)
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

// Unsplash 검색 정확도를 높이기 위한 정밀 영어 매핑
const foodMapping = {
    // 한식
    '김치찌개': 'Kimchi stew Jjigae', '된장찌개': 'Korean soybean paste stew Doenjang-jjigae',
    '순두부찌개': 'Soft tofu stew Soon-du-bu', '부대찌개': 'Budae Jjigae Army stew',
    '청국장': 'Cheonggukjang fermented soybean paste stew', '비빔밥': 'Bibimbap Korean rice bowl',
    '돌솥비빔밥': 'Dolsot Bibimbap sizzling stone bowl', '제육볶음': 'Jeyuk Bokkeum spicy pork stir-fry',
    '불고기': 'Bulgogi Korean beef BBQ', '갈비찜': 'Galbi-jjim braised short ribs',
    '삼겹살': 'Samgyeopsal grilled pork belly BBQ', '목살구이': 'Grilled pork neck BBQ',
    '족발': 'Jokbal braised pig trotters', '보쌈': 'Bossam boiled pork belly',
    '수육': 'Suyuk boiled meat slices', '떡볶이': 'Tteokbokki spicy rice cakes',
    '김밥': 'Gimbap Korean seaweed rice rolls', '라볶이': 'Rabokki tteokbokki with ramen',
    '순대': 'Soondae Korean blood sausage', '어묵탕': 'Eomuk-tang fish cake soup',
    '칼국수': 'Kalguksu Korean knife-cut noodle soup', '수제비': 'Sujebi Korean hand-pulled dough soup',
    '설렁탕': 'Seolleongtang ox bone soup', '곰탕': 'Gomtang beef bone soup',
    '삼계탕': 'Samgyetang ginseng chicken soup', '냉면': 'Naengmyeon cold buckwheat noodles',
    '비빔냉면': 'Bibim-naengmyeon spicy cold noodles', '콩국수': 'Kong-guksu cold soy milk noodles',
    '잔치국수': 'Janchi-guksu banquet noodles', '육개장': 'Yukgaejang spicy beef soup',
    '해물파전': 'Haemul Pajeon seafood pancake', '빈대떡': 'Bindaetteok mung bean pancake',
    '두부김치': 'Dubu Kimchi tofu with stir-fried kimchi', '낙지볶음': 'Nakji-bokkeum spicy stir-fried octopus',
    '오징어볶음': 'Ojing-eo-bokkeum spicy stir-fried squid', '아구찜': 'Agujjim spicy braised monkfish',
    '갈치조림': 'Galchi-jorim braised cutlassfish', '고등어조림': 'Godeungeo-jorim braised mackerel',
    '제육덮밥': 'Spicy pork over rice bowl', '닭갈비': 'Dak-galbi spicy stir-fried chicken',
    '닭볶음탕': 'Dak-bokkeum-tang spicy braised chicken', '치킨': 'Korean fried chicken',
    '양념치킨': 'Yangnyeom-chicken spicy Korean fried chicken', '간장치킨': 'Soy garlic Korean fried chicken',
    '회': 'Sashimi raw fish platter', '물회': 'Mulhoe spicy raw fish soup',
    '광어회': 'Flounder sashimi', '연어회': 'Salmon sashimi', '참치회': 'Tuna sashimi',

    // 중식
    '짜장면': 'Jajangmyeon black bean noodles', '짬뽕': 'Jjamppong spicy seafood noodle soup',
    '탕수육': 'Tangsuyuk sweet and sour pork', '마파두부': 'Mapo tofu',
    '깐풍기': 'Kkanpunggi spicy garlic chicken', '볶음밥': 'Fried rice',
    '마라탕': 'Malatang spicy hot pot', '마라샹궈': 'Mala Xiang Guo spicy stir-fry',
    '훠궈': 'Chinese hot pot', '양꼬치': 'Lamb skewers BBQ',
    '딤섬': 'Dim sum', '꿔바로우': 'Guobaorou crispy sweet and sour pork',
    '유린기': 'Yuringi fried chicken with soy sauce',

    // 일식
    '초밥': 'Sushi set platter', '사시미': 'Sashimi raw fish platter',
    '라멘': 'Japanese Ramen soup', '우동': 'Japanese Udon noodles',
    '소바': 'Buckwheat Soba noodles', '돈카츠': 'Tonkatsu pork cutlet',
    '가라아게': 'Japanese fried chicken Karaage', '타코야키': 'Takoyaki octopus balls',
    '오코노미야끼': 'Okonomiyaki Japanese pancake', '규동': 'Gyudon beef bowl',
    '나베': 'Nabemono Japanese hot pot', '샤브샤브': 'Shabu-shabu hot pot',
    '텐동': 'Tendon tempura rice bowl', '카레라이스': 'Japanese curry rice',
    '오니기리': 'Onigiri rice ball',

    // 양식
    '파스타': 'Italian pasta spaghetti', '스테이크': 'Beef steak grilled',
    '리조또': 'Risotto', '피자': 'Pizza', '햄버거': 'Gourmet Burger',
    '샌드위치': 'Sandwich', '클럽샌드위치': 'Club sandwich',
    '시저샐러드': 'Caesar salad', '오믈렛': 'Omelette', '스프': 'Cream soup',
    '그라탱': 'Gratin', '뇨끼': 'Gnocchi', '라자냐': 'Lasagna',

    // 동남아/기타
    '쌀국수': 'Vietnamese Pho noodle soup', '팟타이': 'Pad Thai noodles',
    '분짜': 'Bun cha', '반미': 'Banh mi sandwich', '나시고렝': 'Nasi goreng fried rice',
    '팟카파오': 'Pad Krapow Moo Saap', '카오만가이': 'Khao man gai chicken rice',
    '똠얌꿍': 'Tom Yum Goong soup', '커리': 'Curry dish',
    '케밥': 'Kebab', '타코': 'Mexican Taco', '부리토': 'Burrito', '샤와르마': 'Shawarma',

    // 분식/간식
    '토스트': 'Toast sandwich', '와플': 'Waffle dessert',
    '팬케이크': 'Pancake syrup', '핫도그': 'Hot dog sausage',
    '튀김': 'Fried food tempura', '붕어빵': 'Bungeoppang fish-shaped bread',
    '호떡': 'Hotteok Korean sweet pancake', '계란빵': 'Gyeran-ppang egg bread'
};

const foodList = Object.keys(foodMapping);
const imageCache = {};

async function showFoodImage(foodName) {
    foodImage.style.opacity = '0';
    foodImage.style.display = 'block';

    const searchQuery = foodMapping[foodName] || (foodName + ' food');

    if (imageCache[foodName]) {
        foodImage.src = imageCache[foodName];
        foodImage.onload = () => {
            foodImage.style.transition = 'opacity 0.4s ease';
            foodImage.style.opacity = '1';
        };
        return;
    }

    try {
        const res = await fetch(
            `https://api.unsplash.com/search/photos?query=${encodeURIComponent(searchQuery)}&per_page=10&orientation=landscape&content_filter=high&client_id=${UNSPLASH_KEY}`
        );
        const data = await res.json();

        if (data.results && data.results.length > 0) {
            const topResults = data.results.slice(0, 5);
            const random = topResults[Math.floor(Math.random() * topResults.length)];
            const imgUrl = random.urls.regular;

            imageCache[foodName] = imgUrl; 
            foodImage.src = imgUrl;
            foodImage.onload = () => {
                foodImage.style.transition = 'opacity 0.4s ease';
                foodImage.style.opacity = '1';
            };
        } else {
            foodImage.style.display = 'none';
        }
    } catch (e) {
        console.error('Image fetch error:', e);
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

// 초기 실행
recommendFood();
