// 单词库
const wordList = [
    'apple', 'beach', 'chair', 'dance', 'eagle',
    'field', 'ghost', 'heart', 'input', 'jolly',
    'knife', 'lemon', 'mouse', 'night', 'ocean',
    'paint', 'queen', 'radio', 'snake', 'table',
    'unity', 'voice', 'water', 'young', 'zebra'
];

let targetWord = '';
let remainingAttempts = 6;
let gameOver = false;

// 初始化游戏
function initGame() {
    targetWord = wordList[Math.floor(Math.random() * wordList.length)];
    remainingAttempts = 6;
    gameOver = false;
    document.getElementById('attempts').textContent = remainingAttempts;
    document.getElementById('message').textContent = '';
    document.getElementById('guesses').innerHTML = '';
    document.getElementById('guessInput').value = '';
}

// 检查猜测
function makeGuess() {
    if (gameOver) {
        return;
    }

    const input = document.getElementById('guessInput');
    const guess = input.value.toLowerCase();

    // 验证输入
    if (guess.length !== 5 || !/^[a-z]+$/.test(guess)) {
        document.getElementById('message').textContent = '请输入5个英文字母';
        return;
    }

    // 创建新的猜测行
    const guessRow = document.createElement('div');
    guessRow.className = 'guess-row';

    // 检查每个字母
    for (let i = 0; i < guess.length; i++) {
        const letter = document.createElement('div');
        letter.className = 'letter';
        letter.textContent = guess[i];

        if (guess[i] === targetWord[i]) {
            letter.classList.add('correct');
        } else if (targetWord.includes(guess[i])) {
            letter.classList.add('wrong-position');
        } else {
            letter.classList.add('incorrect');
        }

        guessRow.appendChild(letter);
    }

    document.getElementById('guesses').appendChild(guessRow);
    input.value = '';

    // 检查是否胜利
    if (guess === targetWord) {
        document.getElementById('message').textContent = '恭喜你猜对了！';
        gameOver = true;
        return;
    }

    // 更新剩余次数
    remainingAttempts--;
    document.getElementById('attempts').textContent = remainingAttempts;

    // 检查是否失败
    if (remainingAttempts === 0) {
        document.getElementById('message').textContent = `游戏结束！正确单词是 ${targetWord}`;
        gameOver = true;
    }
}

// 重新开始游戏
function newGame() {
    initGame();
}

// 初始化游戏
initGame();

// 添加回车键支持
document.getElementById('guessInput').addEventListener('keypress', function(event) {
    if (event.key === 'Enter') {
        makeGuess();
    }
});
