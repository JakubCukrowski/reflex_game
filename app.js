// game utils
const GAME_DURATION = 60 //in seconds
const TIME_TO_COLOR_THE_SQUARE = 3 //in seconds
const TIME_THE_SQUARE_IS_COLORED = 2 //in seconds

//start the game button element
const startButton = document.querySelector('.start__btn')
//time element handled by start button
const time = document.querySelector('.timeframe')
//array of squares
const squares = Array.from(document.querySelectorAll('.square__button'))


//handle start the game

const handleStart = () => {
    startButton.setAttribute('disabled', true)
    let counter = GAME_DURATION

    //interval to start the game
    const startGame = setInterval(() => {
        //handle the time
        counter--
        time.innerText = counter

    }, 1000)

    //interval to light random square every TIME_TO_LIGHT_THE_SQUARE second(s)
    const colorRandomSquare = setInterval(() => {
        const randomSquare = Math.floor(Math.random() * (squares.length - 0 + 1) - 0)
        squares[randomSquare].classList.add('active')

        //timeout to remove the color from square
        const removeColorFromSquare = setTimeout(() => {
            squares.forEach(square => square.classList.remove('active'))
        }, TIME_THE_SQUARE_IS_COLORED * 1000);

    }, TIME_TO_COLOR_THE_SQUARE * 1000);

}

// add event to the button
startButton.addEventListener('click', handleStart)