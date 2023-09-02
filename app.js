// game utils
const GAME_DURATION = 60; //in seconds
const TIME_TO_COLOR_THE_SQUARE = 3; //in seconds
const TIME_THE_SQUARE_IS_COLORED = 2; //in seconds
let lives = 3;
let points = 0;
let counter = GAME_DURATION;

//start the game button element
const startButton = document.querySelector('.start__btn');
//time element handled by start button
const time = document.querySelector('.timeframe');
//array of squares
const squares = Array.from(document.querySelectorAll('.square__button'));
//points element
const pointsSpan = document.querySelector('.points__amount');
//lives element
const livesSpan = document.querySelector('.life__amount')

//color random square 
const randomSquareGenerator = () => {
    const randomSquare = Math.floor(Math.random() * (squares.length));
    squares[randomSquare].classList.add('active');

    //timeout to remove the color from square
    const removeColorFromSquare = setTimeout(() => {
        squares.forEach(square => square.classList.remove('active'));
    }, TIME_THE_SQUARE_IS_COLORED * 1000);
}

//handle points

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

//handle start the game
const handleStart = () => {
    startButton.setAttribute('disabled', true);

    //add event to squares
    squares.forEach(square => square.addEventListener('click', handleSquares))
    
    randomSquareGenerator();

    //interval to start the game
    const startGame = setInterval(() => {
        //handle the time
        counter--;
        time.innerText = counter;

        if (counter === 0) {
            clearInterval(startGame)
        };

    }, 1000);

    //interval to light random square every TIME_TO_LIGHT_THE_SQUARE second(s)
    const colorRandomSquare = setInterval(() => {
        randomSquareGenerator(); 
        squares.forEach(square => square.addEventListener('click', handleSquares))

        if (counter <= 0) {
            clearInterval(colorRandomSquare)
        }

    }, TIME_TO_COLOR_THE_SQUARE * 1000);

}

// add event to the button
startButton.addEventListener('click', handleStart);
