import { useState, useEffect } from "react";

import ScoreBoard from "./Components/ScoreBoard";

import BlueCandy from './images/blue-candy.png'
import GreenCandy from './images/green-candy.png'
import RedCandy from './images/red-candy.png'
import OrangeCandy from './images/orange-candy.png'
import PurpleCandy from './images/purple-candy.png'
import YellowCandy from './images/yellow-candy.png'
import Blank from './images/blank.png'

const size = 8;
const candyColors = [BlueCandy, GreenCandy, RedCandy, OrangeCandy, PurpleCandy, YellowCandy];

function App() {
  const [currentColorArray, setCurrentColorArray] = useState([]);
  const [squareBeingDragged, setsquareBeingDragged] = useState(null);
  const [squareBeingReplaced, setsquareBeingReplaced] = useState(null);
  const [scoreDisplay, setScoreDisplay] = useState(0)

  // * VERTICAL
  const checkForColumnOfFour = () => {
    for (let i = 0; i <= 39; i++) {
      const columnOfFour = [i, i + size, i + size * 2, i + size * 3];
      const decidedColor = currentColorArray[i];
      const isBlank = currentColorArray[i] === Blank

      if (
        columnOfFour.every(
          (square) => currentColorArray[square] === decidedColor && !isBlank
        )
      ) {
        setScoreDisplay((score) => score + 400)
        columnOfFour.forEach((square) => (currentColorArray[square] = Blank));
        return true
      }
    }
  };

  const checkForColumnOfThree = () => {
    for (let i = 0; i <= 47; i++) {
      const columnOfThree = [i, i + size, i + size * 2];
      const decidedColor = currentColorArray[i];
      const isBlank = currentColorArray[i] === Blank

      if (
        columnOfThree.every(
          (square) => currentColorArray[square] === decidedColor && !isBlank
        )
      ) {
        setScoreDisplay((score) => score + 300)
        columnOfThree.forEach((square) => (currentColorArray[square] = Blank));
        return true
      }
    }
  };

  // * HORIZONTAL
  const checkForRowOfFour = () => {
    for (let i = 0; i < 64; i++) {
      const rowOfFour = [i, i + 1, i + 2, i + 3];
      const decidedColor = currentColorArray[i];
      const notValid = [
        5, 6, 7, 13, 14, 15, 21, 22, 23, 29, 30, 31, 37, 38, 39, 45, 46, 47, 53,
        54, 55, 62, 63, 64,
      ];
      const isBlank = currentColorArray[i] === Blank

      if (notValid.includes(i)) continue;

      if (
        rowOfFour.every((square) => currentColorArray[square] === decidedColor && !isBlank)
      ) {
        setScoreDisplay((score) => score + 400)
        rowOfFour.forEach((square) => (currentColorArray[square] = Blank));
        return true
      }
    }
  };

  const checkForRowOfThree = () => {
    for (let i = 0; i < 64; i++) {
      const rowOfThree = [i, i + 1, i + 2];
      const decidedColor = currentColorArray[i];
      const notValid = [
        6, 7, 14, 15, 22, 23, 30, 31, 38, 39, 46, 47, 54, 55, 63, 64,
      ];
      const isBlank = currentColorArray[i] === Blank

      if (notValid.includes(i)) continue;

      if (
        rowOfThree.every((square) => currentColorArray[square] === decidedColor && !isBlank)
      ) {
        setScoreDisplay((score) => score + 300)
        rowOfThree.forEach((square) => (currentColorArray[square] = Blank));
        return true
      }
    }
  };

  // * MOVEMENT
  const moveIntoSquareBelow = () => {
    for (let i = 0; i <= 55; i++) {
      const firstRow = [0,1,2,3,4,5,6,7]
      const isFirstRow = firstRow.includes(i)

      if ( isFirstRow && currentColorArray[i] === Blank) {
        let randomNumber = Math.floor(Math.random() * candyColors.length)
        currentColorArray[i] = candyColors[randomNumber]
      }

      if (currentColorArray[i + size] === Blank) {
        currentColorArray[i + size] = currentColorArray[i];
        currentColorArray[i] = Blank;
      }
    }
  };

  // * DRAG & DROP
  const dragStart = (e) => {
    console.log(e.target)
    console.log('drag started')
    setsquareBeingDragged(e.target)
  }

  const dragDrop = (e) => {
    console.log(e.target)
    console.log('drag drop')
    setsquareBeingReplaced(e.target)
    
  }

  const dragEnd = (e) => {
    console.log('drag end')

    const squareBeingDraggedId = parseInt(squareBeingDragged.getAttribute('data-id'))
    const squareBeingReplacedId = parseInt(squareBeingReplaced.getAttribute('data-id'))

    currentColorArray[squareBeingReplacedId] = squareBeingDragged.getAttribute('src')
    currentColorArray[squareBeingDraggedId] = squareBeingReplaced.getAttribute('src')

    const validMoves = [
      squareBeingDraggedId - 1,
      squareBeingDraggedId - size,
      squareBeingDraggedId + 1,
      squareBeingDraggedId + size,
    ]

    const validMove = validMoves.includes(parseInt(squareBeingReplacedId))

    const isAColumnOfFour = checkForColumnOfFour()
    const isARowOfFour = checkForRowOfFour()
    const isAColumnOfThree = checkForColumnOfThree()
    const isARowOfThree = checkForRowOfThree()

    if (squareBeingReplacedId && validMove && (isAColumnOfFour || isARowOfFour || isAColumnOfThree || isARowOfThree)) {
      setsquareBeingDragged(null)
      setsquareBeingReplaced(null)
    } else {
      currentColorArray[squareBeingReplacedId] = squareBeingReplaced.getAttribute('src')
      currentColorArray[squareBeingDraggedId] = squareBeingDragged.getAttribute('src')
      setCurrentColorArray([...currentColorArray])
    }

    
  }

  const createBoard = () => {
    const randomColorArray = [];
    for (let i = 0; i < size * size; i++) {
      const randomColor =
        candyColors[Math.floor(Math.random() * candyColors.length)];
      randomColorArray.push(randomColor);
    }

    setCurrentColorArray(randomColorArray);
  };

  useEffect(() => {
    createBoard();
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      checkForColumnOfFour();
      checkForColumnOfThree();
      checkForRowOfFour();
      checkForRowOfThree();
      moveIntoSquareBelow();
      setCurrentColorArray([...currentColorArray]);
    }, 100);
    return () => clearInterval(timer);
  }, [
    checkForColumnOfFour,
    checkForColumnOfThree,
    checkForRowOfFour,
    checkForRowOfThree,
    moveIntoSquareBelow,
    currentColorArray,
  ]);

  console.log(currentColorArray);

  return (
    <div className="app">
      <div className="game">
        {currentColorArray.map((candyColor, index) => {
          return (
            <img
              key={index}
              src={candyColor}
              alt={candyColor}
              data-id={index}
              draggable={true}
              onDragStart={dragStart}
              onDragOver={(e) => e.preventDefault()}
              onDragEnter={(e) => e.preventDefault()}
              onDragLeave={(e) => e.preventDefault()}
              onDrop={dragDrop}
              onDragEnd={dragEnd}
            />
          );
        })}
      </div>
      <ScoreBoard score={scoreDisplay} />
    </div>
  );
}

export default App;
