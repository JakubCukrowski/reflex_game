//start the game button element
const startButton = document.querySelector('.start__btn');
//reset button
const resetButton = document.querySelector('.reset__btn')
//time element handled by start button
const time = document.querySelector('.timeframe');
//points element
const pointsSpan = document.querySelector('.points__amount');
//lives element
const livesSpan = document.querySelector('.life__amount')
//game board
const gameBoard = document.querySelector('.game__board')
//level element
const levelSpan = document.querySelector('.current__level')

// game utils
const GAME_DURATION = 60; //in seconds
const TIME_TO_COLOR_THE_SQUARE = 3; //in seconds
const TIME_THE_SQUARE_IS_COLORED = 2; //in seconds
let GAME_LEVEL = 1;
let squaresNumber = 36 // 25 for 1st lvl
let squares = []
let lives = 3;
let points = 0;
let timer = GAME_DURATION;
let extraLifeAppeared = false

//intervals
let startGameInterval;
let colorRandomSquareInterval;
let removeColorFromSquareTimeout;

//set game board with appropriate number of squares depending on the current lvl
const prepareGameBoard = () => {
    for (let i = 0; i < squaresNumber; i++) {
        const squareDiv = document.createElement('div')
        squareDiv.classList.add('square__button')
        squares.push(squareDiv)
        gameBoard.append(squareDiv)
    }
}

//first function call, next in startGame innterval below
prepareGameBoard()

//handle squares behavior
const handleSquares = (event) => {
    //check if square is colored
    if (event.target.classList.contains('active')) {
        points++;
        pointsSpan.innerText = points;

        //add clicked to check if square was clicked during 2 seconds
        event.target.classList.add('clicked');
        //prevent multiple points gathering on one colored square
        squares.filter(square => !square.classList.contains('life'))
            .forEach(square => square.removeEventListener('click', handleSquares));

    }  else if (event.target.classList.contains('life')) {
        lives++
        livesSpan.innerText = lives
        event.target.classList.remove('life')
    } else  {
        //subtract life when clicked square was not colored
        lives--
        livesSpan.innerText = lives
        event.target.classList.add('error')
        //block multiple wrong squares click during one interval
        squares.filter(square => !square.classList.contains('life'))
            .forEach(square => square.removeEventListener('click', handleSquares));
    }
}

const randomSquareColored = () => {
    const randomSquare = Math.floor(Math.random() * (squares.length));
    squares[randomSquare].classList.add('active');

    //timeout to remove the color from square
    removeColorFromSquareTimeout = setTimeout(() => {
        squares.forEach(square => square.classList.remove('active'));

        //filter squares which were clicked correctly and wrong to avoid double points subtracting
        const filterClickedSquare = squares.filter(square => square.classList.contains('clicked'))
        const filterErrors = squares.filter(square => square.classList.contains('error'))
        
        //remove point if square was not clicked and if wrong square was not clicked
        if (filterClickedSquare.length === 0 && filterErrors.length === 0) {
            lives--
            livesSpan.innerText = lives
        } else {
            squares.forEach(square => square.classList.remove('clicked'));
            squares.forEach(square => square.classList.remove('error'));
        }

    }, TIME_THE_SQUARE_IS_COLORED * 1000);
    squares.forEach(square => square.addEventListener('click', handleSquares));
}

//extra life square 
const utilitySquares = () => {
    //random number to check the condition below and spawn extra life square
    const randomNumber = Math.floor(Math.random() * (20 - 1 + 1) + 1)

    const filterActiveSquares = squares.filter(square => !square.classList.contains('active'))
    //random square without class 'active'
    const randomSquare = Math.floor(Math.random() * filterActiveSquares.length)
    
    //extra life square, appears only once per 60 seconds (if any)
    if (randomNumber === 12 && !extraLifeAppeared) {
        extraLifeAppeared = true
        //mark the square, and as soon as it appears, add event to it
        const lifeSquare = filterActiveSquares[randomSquare]
        lifeSquare.classList.add('life')
        lifeSquare.addEventListener('click', handleSquares)

        const clearLife = setTimeout(() => {
            //life square is active only for 0.9 second
            filterActiveSquares.forEach(square => square.classList.remove('life'))
            clearTimeout(clearLife)
        }, 900);

    } else if (randomNumber === 87) {
        
    }
}

//handle 0 seconds left, AKA next lvl
const gameOver = () => {
    //squares appended to game board element
    const gameBoardSquares = gameBoard.querySelectorAll('.square__button')
    
    for (let i = 0; i < gameBoardSquares.length; i++) {
        gameBoard.removeChild(gameBoard.lastElementChild)
    }

    squares.length = 0
    GAME_LEVEL++;
    levelSpan.innerText = GAME_LEVEL
    squaresNumber += 5;
}

//handle start the game
const handleStart = () => {
    gameActive = true
    startButton.setAttribute('disabled', true);
    randomSquareColored()
    utilitySquares()
    
    //add event to squares
    squares.forEach(square => square.addEventListener('click', handleSquares))

    //interval to start the game
    startGameInterval = setInterval(() => {      
        //handle the time
        timer--;
        time.innerText = timer;
        utilitySquares()

        if (lives > 0 && timer <= 0) {
            //60 seconds passed, we reset the gameactive state
            gameActive = false
            //clear both intervals
            clearInterval(startGameInterval)
            clearInterval(colorRandomSquareInterval)
            clearTimeout(removeColorFromSquareTimeout)
            //game ends
            gameOver()
            //new game board
            prepareGameBoard()
            startButton.removeAttribute('disabled')
            timer = GAME_DURATION
            time.innerText = timer

        } else if (lives === 0 || timer <= 0) {
            clearInterval(startGameInterval)
            clearInterval(colorRandomSquareInterval)
            clearTimeout(removeColorFromSquareTimeout)
            resetGame()
            GAME_LEVEL = 1
            squaresNumber = 25

        }

    }, 1000);

    //interval to light random square every TIME_TO_LIGHT_THE_SQUARE second(s)
    colorRandomSquareInterval = setInterval(() => {
        randomSquareColored()
    }, TIME_TO_COLOR_THE_SQUARE * 1000); 
}

//reset the game
const resetGame = () => {
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
    squares.forEach(square => square.classList.remove('error'));
    squares.forEach(square => square.classList.remove('clicked'));
    startButton.removeAttribute('disabled');
    clearInterval(startGameInterval)
    clearInterval(colorRandomSquareInterval)
    clearTimeout(removeColorFromSquareTimeout)
    squares.forEach(square => square.removeEventListener('click', handleSquares))
}

// add start event to the button
startButton.addEventListener('click', handleStart);
//add reset event to the button
resetButton.addEventListener('click', resetGame)
