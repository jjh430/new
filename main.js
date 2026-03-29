const numbersContainer = document.getElementById('numbers');
const generateBtn = document.getElementById('generate-btn');

function generateLottoNumbers() {
    numbersContainer.innerHTML = '';
    const numbers = new Set();
    while(numbers.size < 6) {
        const randomNumber = Math.floor(Math.random() * 45) + 1;
        numbers.add(randomNumber);
    }

    const sortedNumbers = Array.from(numbers).sort((a, b) => a - b);

    sortedNumbers.forEach(number => {
        const numberDiv = document.createElement('div');
        numberDiv.classList.add('number');
        numberDiv.textContent = number;
        numbersContainer.appendChild(numberDiv);
    });
}

generateBtn.addEventListener('click', generateLottoNumbers);

// 초기 로딩 시 번호 생성
generateLottoNumbers();
