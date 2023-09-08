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
let TIME_TO_COLOR_THE_SQUARE = 3000; //in miliseconds
let TIME_THE_SQUARE_IS_COLORED = 2000; //in miliseconds

const gameUtils = {
    GAME_LEVEL: 1,
    squaresNumber: 25, // 25 for 1st lvl
    squares: [],
    lives: 3,
    points: 0,
    timer: GAME_DURATION,
    extraLifeAppeared: false,
    gameBoardWidth: 460,
    squareSize: 80
}

//intervals
let startGameInterval;
let colorRandomSquareInterval;
let removeColorFromSquareTimeout;

//set game board with appropriate number of squares depending on the current lvl
const prepareGameBoard = () => {
    for (let i = 0; i < gameUtils.squaresNumber; i++) {
        const squareDiv = document.createElement('div')
        squareDiv.classList.add('square__button')
        squareDiv.style.height = gameUtils.squareSize + 'px'
        squareDiv.style.width = gameUtils.squareSize + 'px'
        gameUtils.squares.push(squareDiv)
        gameBoard.append(squareDiv)
    }

    gameBoard.style.width = gameUtils.gameBoardWidth + 'px'
}

//first function call, next in startGame innterval below
prepareGameBoard()

//handle squares behavior
const handleSquares = (event) => {
    //check if square is colored
    if (event.target.classList.contains('active')) {
        gameUtils.points++;
        pointsSpan.innerText = gameUtils.points;

        //add clicked to check if square was clicked during 2 seconds
        event.target.classList.add('clicked');
        //prevent multiple points gathering on one colored square
        gameUtils.squares.filter(square => !square.classList.contains('life'))
            .forEach(square => square.removeEventListener('click', handleSquares));

    }  else if (event.target.classList.contains('life')) {
        gameUtils.lives++
        livesSpan.innerText = gameUtils.lives
        event.target.classList.remove('life')
    } else  {
        //subtract life when clicked square was not colored
        gameUtils.lives--
        livesSpan.innerText = gameUtils.lives
        event.target.classList.add('error')
        //block multiple wrong squares click during one interval
        gameUtils.squares.filter(square => !square.classList.contains('life'))
            .forEach(square => square.removeEventListener('click', handleSquares));
    }
}

const randomSquareColored = () => {
    const randomSquare = Math.floor(Math.random() * (gameUtils.squares.length));
    gameUtils.squares[randomSquare].classList.add('active');

    //timeout to remove the color from square
    removeColorFromSquareTimeout = setTimeout(() => {
        gameUtils.squares.forEach(square => square.classList.remove('active'));

        //filter squares which were clicked correctly and wrong to avoid double points subtracting
        const filterClickedSquare = gameUtils.squares.filter(square => square.classList.contains('clicked'))
        const filterErrors = gameUtils.squares.filter(square => square.classList.contains('error'))
        
        //remove point if square was not clicked and if wrong square was not clicked
        if (filterClickedSquare.length === 0 && filterErrors.length === 0) {
            gameUtils.lives--
            livesSpan.innerText = gameUtils.lives
            gameUtils.squares.forEach(square => square.removeEventListener('click', handleSquares));
        } else {
            gameUtils.squares.forEach(square => square.classList.remove('clicked'));
            gameUtils.squares.forEach(square => square.classList.remove('error'));
        }

    }, TIME_THE_SQUARE_IS_COLORED);
    gameUtils.squares.forEach(square => square.addEventListener('click', handleSquares));
}

//extra life square 
const utilitySquares = () => {
    //random number to check the condition below and spawn extra life square
    const randomNumber = Math.floor(Math.random() * (20 - 1 + 1) + 1);

    //random square for adding life class
    const randomSquareIndex = Math.floor(Math.random() * gameUtils.squares.length);

    const lifeSquare = gameUtils.squares[randomSquareIndex];

    //avoid using active square as a life square 
    const indexOfActiveSquare = gameUtils.squares.findIndex(square => square.classList.contains('active'))

    if (indexOfActiveSquare !== gameUtils.squares.indexOf(lifeSquare) && randomNumber === 12 && !gameUtils.extraLifeAppeared) {
        lifeSquare.classList.add('life');
        lifeSquare.addEventListener('click', handleSquares)
    }

        const clearLife = setTimeout(() => {
            //life square is active only for 0.9 second
            gameUtils.squares.forEach(square => square.classList.remove('life'))
            clearTimeout(clearLife)
        }, 900);

}

//handle 0 seconds left, AKA next lvl
const nextLevel = () => {
    //squares appended to game board element
    const gameBoardSquares = gameBoard.querySelectorAll('.square__button')
    
    for (let i = 0; i < gameBoardSquares.length; i++) {
        gameBoard.removeChild(gameBoard.lastElementChild)
    }

    gameUtils.squares.length = 0;
    gameUtils.GAME_LEVEL++;
    levelSpan.innerText = gameUtils.GAME_LEVEL;
    
    if (gameUtils.GAME_LEVEL <= 5 && gameUtils.lives > 0) {
        gameUtils.squaresNumber += 5;
        gameUtils.gameBoardWidth += 100;
        console.log('wykonano');
    }

    //clear both intervals
    clearInterval(startGameInterval);
    clearInterval(colorRandomSquareInterval);
    clearTimeout(removeColorFromSquareTimeout);
    //new game board
    prepareGameBoard();
    startButton.removeAttribute('disabled');
    gameUtils.timer = GAME_DURATION;
    time.innerText = gameUtils.timer;
    gameUtils.extraLifeAppeared = false;
    
    if (TIME_TO_COLOR_THE_SQUARE >= 2000) {
        TIME_THE_SQUARE_IS_COLORED -= 150
        TIME_TO_COLOR_THE_SQUARE -= 150
    }

    console.log('executed');
}

//handle start the game
const handleStart = () => {
    startButton.setAttribute('disabled', true);
    randomSquareColored()
    utilitySquares()
    
    //add event to squares
    gameUtils.squares.forEach(square => square.addEventListener('click', handleSquares))

    //interval to start the game
    startGameInterval = setInterval(() => {      
        //handle the time
        gameUtils.timer--;
        time.innerText = gameUtils.timer;
        utilitySquares()

        if (gameUtils.lives > 0 && gameUtils.timer <= 0) {
            //execute next level function
            nextLevel()

        } else if (gameUtils.lives === 0 || gameUtils.timer <= 0) {
            //game ends
            resetGame()
            gameUtils.GAME_LEVEL = 1
            gameUtils.squaresNumber = 25

        }

    }, 1000);

    //interval to light random square every TIME_TO_LIGHT_THE_SQUARE second(s)
    colorRandomSquareInterval = setInterval(() => {
        randomSquareColored()
    }, TIME_TO_COLOR_THE_SQUARE); 
}

//reset the game
const resetGame = () => {
    //reset lives
    gameUtils.lives = 3;
    livesSpan.innerText = gameUtils.lives;
    //reset points 
    gameUtils.points = 0;
    pointsSpan.innerText = 0;
    //reset time
    gameUtils.timer = GAME_DURATION;
    time.innerText = gameUtils.timer;
    gameUtils.squares.forEach(square => square.classList.remove('active'));
    gameUtils.squares.forEach(square => square.classList.remove('error'));
    gameUtils.squares.forEach(square => square.classList.remove('clicked'));
    startButton.removeAttribute('disabled');
    clearInterval(startGameInterval)
    clearInterval(colorRandomSquareInterval)
    clearTimeout(removeColorFromSquareTimeout)
    gameUtils.squares.forEach(square => square.removeEventListener('click', handleSquares))
}

// add start event to the button
startButton.addEventListener('click', handleStart);
//add reset event to the button
resetButton.addEventListener('click', resetGame)
