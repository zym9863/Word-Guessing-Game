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
    // 重置虚拟键盘状态
    resetVirtualKeyboard();
}

// 重置虚拟键盘
function resetVirtualKeyboard() {
    const keys = document.querySelectorAll('.key');
    keys.forEach(key => {
        key.classList.remove('correct', 'wrong-position', 'incorrect');
    });
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

    // 用于跟踪每个字母的状态，以便更新虚拟键盘
    const letterStatus = {};

    // 首先检查所有正确位置的字母
    for (let i = 0; i < guess.length; i++) {
        const letter = guess[i];
        if (guess[i] === targetWord[i]) {
            letterStatus[letter] = 'correct';
        }
    }

    // 然后检查所有不正确位置但存在于目标单词中的字母
    // 需要注意避免重复计算
    const targetWordRemaining = targetWord.split('').filter((char, index) => {
        return guess[index] !== char;
    });

    const guessRemaining = guess.split('').filter((char, index) => {
        return guess[index] !== targetWord[index];
    });

    for (let letter of guessRemaining) {
        if (!letterStatus[letter]) { // 只处理尚未标记为correct的字母
            const index = targetWordRemaining.indexOf(letter);
            if (index > -1) {
                letterStatus[letter] = 'wrong-position';
                targetWordRemaining.splice(index, 1); // 避免重复计算
            } else {
                letterStatus[letter] = 'incorrect';
            }
        }
    }

    // 更新猜测行显示
    for (let i = 0; i < guess.length; i++) {
        const letter = document.createElement('div');
        letter.className = 'letter';
        letter.textContent = guess[i];

        const status = letterStatus[guess[i]];
        if (status) {
            letter.classList.add(status);
        }

        guessRow.appendChild(letter);
    }

    document.getElementById('guesses').appendChild(guessRow);
    input.value = '';

    // 更新虚拟键盘
    updateVirtualKeyboard(letterStatus);

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

// 更新虚拟键盘上字母的颜色
function updateVirtualKeyboard(letterStatus) {
    for (let [letter, status] of Object.entries(letterStatus)) {
        const keyElement = document.querySelector(`.key[data-key="${letter}"]`);
        if (keyElement) {
            // 只有当当前状态不是correct时，才允许更新（防止绿色被降级）
            const currentStatus = keyElement.classList.contains('correct') ? 'correct' : null;
            if (!currentStatus || currentStatus === 'correct') {
                // 移除所有状态类
                keyElement.classList.remove('correct', 'wrong-position', 'incorrect');
                // 添加新状态类
                keyElement.classList.add(status);
            }
        }
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
