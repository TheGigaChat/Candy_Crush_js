document.addEventListener("DOMContentLoaded", () => {
  const grid = document.querySelector(".grid");
  const width = 8; // width === height, so we don't need to init h
  const squares = [];
  let score = 0;
  const scoreDiv = document.querySelector(".score");

  const candyColors = [
    "url(images/red-candy.png)",
    "url(images/yellow-candy.png)",
    "url(images/orange-candy.png)",
    "url(images/purple-candy.png)",
    "url(images/green-candy.png)",
    "url(images/blue-candy.png)",
  ];

  // Create Board
  const createBoard = () => {
    for (let i = 0; i < width * width; i++) {
      const square = document.createElement("div");
      square.setAttribute("draggable", true);
      square.setAttribute("id", i);
      let randomColor = Math.floor(Math.random() * candyColors.length);
      square.style.backgroundImage = candyColors[randomColor];
      grid.appendChild(square);
      squares.push(square);
    }
  };
  createBoard();

  //Drag the candies
  let isDraggingColor;
  let isDraggingSquareId;
  let replacedColor;
  let replacedSquareId;

  squares.forEach((square) => square.addEventListener("dragstart", dragStart));
  squares.forEach((square) => square.addEventListener("dragend", dragEnd));
  squares.forEach((square) => square.addEventListener("dragover", dragOver));
  squares.forEach((square) => square.addEventListener("dragenter", dragEnter));
  squares.forEach((square) => square.addEventListener("dragleave", dragLeave));
  squares.forEach((square) => square.addEventListener("drop", dragDrop));

  function dragStart() {
    isDraggingColor = this.style.backgroundImage;
    isDraggingSquareId = parseInt(this.id);
  }

  function dragOver(e) {
    e.preventDefault();
  }

  function dragEnter(e) {
    e.preventDefault();
  }

  function dragLeave(e) {}

  function dragDrop(e) {
    replacedColor = this.style.backgroundImage;
    replacedSquareId = parseInt(this.id);
    this.style.backgroundImage = isDraggingColor;
    squares[isDraggingSquareId].style.backgroundImage = replacedColor;
  }

  function dragEnd() {
    // Valid moves
    let validMoves = [
      isDraggingSquareId - 1,
      isDraggingSquareId + 1,
      isDraggingSquareId - width,
      isDraggingSquareId + width,
    ];
    let validMoveBool = validMoves.includes(replacedSquareId);

    if (replacedSquareId && validMoveBool) {
      //clear id's
      replacedSquareId = null;
    } else if (replacedColor && !validMoveBool) {
      //prevent the color changing
      squares[isDraggingSquareId].style.backgroundImage = isDraggingColor;
      squares[replacedSquareId].style.backgroundImage = replacedColor;
    } else {
      squares[isDraggingSquareId].style.backgroundImage = isDraggingColor;
    }
  }

  //Drop candies after a match
  function moveCandies(i = 0, indexOfSquareHigher) {
    if (i < squares.length) {
      //index exists
      if (squares[i].style.backgroundImage === "") {
        indexOfSquareHigher = i - width;
        if (indexOfSquareHigher > 0) {
          //not the first row => drop the candy down
          squares[i].style.backgroundImage =
            squares[indexOfSquareHigher].style.backgroundImage;
          squares[indexOfSquareHigher].style.backgroundImage = "";
          //moves down the next element in the column
          return moveCandies(indexOfSquareHigher);
        } else {
          //the first row => generate a new color
          let randomColor = Math.floor(Math.random() * candyColors.length);
          squares[i].style.backgroundImage = candyColors[randomColor];
          //all elements in the column have been shifted => finish &&
          //&& continue the check of the next element in the row
          return moveCandies(i + 1);
        }
      } else {
        moveCandies(i + 1);
      }
    } else {
      //index does not exist => finish
      return;
    }
  }

  //Checking for matches
  function checkTreeRow() {
    for (let i = 0; i < 62; i++) {
      const row = [squares[i], squares[i + 1], squares[i + 2]];
      const desiredColor = squares[i].style.backgroundImage;
      const isBlank = squares[i].style.backgroundImage === "";

      //Check if the i is an index of the invalid square
      const doNotCheckIndexes = [
        6, 7, 14, 15, 22, 23, 30, 31, 38, 39, 46, 47, 54, 55,
      ];
      if (doNotCheckIndexes.includes(i)) continue;

      if (
        row.every(
          (square) => square.style.backgroundImage === desiredColor && !isBlank
        )
      ) {
        row.forEach((square) => (square.style.backgroundImage = ""));
        score += 3;
      }
    }
  }
  function checkFourRow() {
    for (let i = 0; i < 61; i++) {
      const row = [squares[i], squares[i + 1], squares[i + 2], squares[i + 3]];
      const desiredColor = squares[i].style.backgroundImage;
      const isBlank = squares[i].style.backgroundImage === "";

      //Check if the i is an index of the invalid square
      const doNotCheckIndexes = [
        5, 6, 7, 13, 14, 15, 21, 22, 23, 29, 30, 31, 37, 38, 39, 45, 46, 47, 53,
        54, 55,
      ];
      if (doNotCheckIndexes.includes(i)) continue;

      if (
        row.every(
          (square) => square.style.backgroundImage === desiredColor && !isBlank
        )
      ) {
        row.forEach((square) => (square.style.backgroundImage = ""));
        score += 4;
      }
    }
  }
  function checkRows() {
    //Instruction of the fuction
    //colors2[a, a, a, a, a, a, c, c, c] => i=0, count = 1
    //if curr === prev => i++, count++
    //if curr !== prev OR element is last => if count < 3 => i++, count=1
    //if curr !== prev OR element is last => if count > 2 => for (from i to i-count)
    //{element.style.backgroundImage = ""} && i++, count=1
    for (let i = 0; i < squares.length; i += width) {
      //index exists
      const row = [];
      for (let j = i; j < i + width; j++) {
        //fill the row
        row.push(squares[j]);
      }

      //check for matches
      let count = 1;
      row.forEach((curr, index, arr) => {
        if (index === 0) return;

        //starts form the pair of curr and prev
        const isLastElement = curr === arr[arr.length - 1];
        const prev = arr[index - 1];
        if (
          curr.style.backgroundImage === prev.style.backgroundImage &&
          !isLastElement
        ) {
          count++;
        } else {
          if (isLastElement) {
            if (curr.style.backgroundImage === prev.style.backgroundImage) {
              count++;
              index++;
            }
          }

          //check the match elements amount
          if (count < 3) {
            count = 1;
          } else {
            for (
              let indexPrevElements = index - 1;
              indexPrevElements > index - 1 - count;
              indexPrevElements--
            ) {
              arr[indexPrevElements].style.backgroundImage = "";
            }
            count = 1;
          }
        }
      });
    }
  }

  function checkTreeColumn() {
    for (let i = 0; i < 48; i++) {
      const column = [squares[i], squares[i + width], squares[i + width * 2]];
      const desiredColor = squares[i].style.backgroundImage;
      const isBlank = squares[i].style.backgroundImage === "";
      if (
        column.every(
          (square) => square.style.backgroundImage === desiredColor && !isBlank
        )
      ) {
        column.forEach((square) => (square.style.backgroundImage = ""));
        score += 3;
      }
    }
  }
  function checkFourColumn() {
    for (let i = 0; i < 40; i++) {
      const column = [
        squares[i],
        squares[i + width],
        squares[i + width * 2],
        squares[i + width * 3],
      ];
      const desiredColor = squares[i].style.backgroundImage;
      const isBlank = squares[i].style.backgroundImage === "";
      if (
        column.every(
          (square) => square.style.backgroundImage === desiredColor && !isBlank
        )
      ) {
        column.forEach((square) => (square.style.backgroundImage = ""));
        score += 4;
      }
    }
  }
  function updateScore() {
    scoreDiv.textContent = score;
  }

  window.setInterval(() => {
    moveCandies();
    checkRows();
    checkFourColumn();
    checkTreeColumn();
    updateScore();
  }, 100);
});
