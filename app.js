//start the game button element
const startButton = document.querySelector('.start__btn');
//reset button
const resetButton = document.querySelector('.reset__btn')
//time element handled by start button
const time = document.querySelector('.timeframe');
//array of squares
const squares = Array.from(document.querySelectorAll('.square__button'));
//points element
const pointsSpan = document.querySelector('.points__amount');
//lives element
const livesSpan = document.querySelector('.life__amount')
//handle points

// game utils
const GAME_DURATION = 60; //in seconds
const TIME_TO_COLOR_THE_SQUARE = 3; //in seconds
const TIME_THE_SQUARE_IS_COLORED = 2; //in seconds
let lives = 3;
let points = 0;
let timer = GAME_DURATION;
let gameActive = false;

//intervals
let startGameInterval;
let colorRandomSquareInterval;
let removeColorFromSquareTimeout;

const handleSquares = (event) => {
    //check if square is colored
    if (event.target.classList.contains('active')) {
        points++
        pointsSpan.innerText = points
        //prevent multiple points gathering on one colored square
        event.target.removeEventListener('click', handleSquares)
    } else {
        //subtract life when clicked square was not colored
        lives--
        livesSpan.innerText = lives
    }
}

const randomSquareColored = () => {
    const randomSquare = Math.floor(Math.random() * (squares.length));
    squares[randomSquare].classList.add('active');

    //timeout to remove the color from square
    removeColorFromSquareTimeout = setTimeout(() => {
        squares.forEach(square => square.classList.remove('active'));

        if (lives === 0 || timer <= 0 || gameActive === false) {
            clearTimeout(removeColorFromSquareTimeout)
        }

    }, TIME_THE_SQUARE_IS_COLORED * 1000);
    squares.forEach(square => square.addEventListener('click', handleSquares));
}

//handle start the game
const handleStart = () => {
    gameActive = true
    startButton.setAttribute('disabled', true);
    randomSquareColored()
    
    //add event to squares
    squares.forEach(square => square.addEventListener('click', handleSquares))

    //interval to start the game
    startGameInterval = setInterval(() => {      
        //handle the time
        timer--;
        time.innerText = timer;

        if (lives === 0 || timer <= 0 || gameActive === false) {
            clearInterval(startGameInterval)
            clearInterval(colorRandomSquareInterval)
        }

    }, 1000);

    //interval to light random square every TIME_TO_LIGHT_THE_SQUARE second(s)
    colorRandomSquareInterval = setInterval(() => {
        randomSquareColored()
    }, TIME_TO_COLOR_THE_SQUARE * 1000); 
}

//reset the game
const resetGame = () => {
    //set game status to false
    gameActive = false;
    //reset lives
    lives = 3;
    livesSpan.innerText = lives;
    //reset points 
    points = 0;
    pointsSpan.innerText = 0;
    //reset time
    timer = GAME_DURATION;
    time.innerText = timer;
    squares.forEach(square => square.classList.remove('active'));
    startButton.removeAttribute('disabled');
    clearInterval(startGameInterval)
    clearInterval(colorRandomSquareInterval)
    clearTimeout(removeColorFromSquareTimeout)
}

// add start event to the button
startButton.addEventListener('click', handleStart);
//add reset event to the button
resetButton.addEventListener('click', resetGame)
