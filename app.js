document.addEventListener("DOMContentLoaded", () => {
  const grid = document.querySelector(".grid");
  const width = 8; // width === height, so we don't need to init h
  const squares = [];
  let score = 0;

  const candyColors = ["red", "yellow", "orange", "purple", "green", "blue"];

  // Create Board
  const createBoard = () => {
    for (let i = 0; i < width * width; i++) {
      const square = document.createElement("div");
      square.setAttribute("draggable", true);
      square.setAttribute("id", i);
      let randomColor = Math.floor(Math.random() * candyColors.length);
      square.style.backgroundColor = candyColors[randomColor];
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
    isDraggingColor = this.style.backgroundColor;
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
    replacedColor = this.style.backgroundColor;
    replacedSquareId = parseInt(this.id);
    this.style.backgroundColor = isDraggingColor;
    squares[isDraggingSquareId].style.backgroundColor = replacedColor;
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
      squares[isDraggingSquareId].style.backgroundColor = isDraggingColor;
      squares[replacedSquareId].style.backgroundColor = replacedColor;
    } else {
      squares[isDraggingSquareId].style.backgroundColor = isDraggingColor;
    }
  }

  //Checking for matches
  function checkTreeRow() {
    for (let i = 0; i < 61; i++) {
      const row = [squares[i], squares[i + 1], squares[i + 2]];
      const desiredColor = squares[i].style.backgroundColor;

      //Check if the i is an index of the invalid square
      const doNotCheckIndexes = [
        6, 7, 14, 15, 22, 23, 30, 31, 38, 39, 46, 47, 54, 55,
      ];
      if (doNotCheckIndexes.includes(i)) continue;

      if (
        row.every((square) => square.style.backgroundColor === desiredColor)
      ) {
        row.forEach((square) => (square.style.backgroundColor = ""));
      }
    }
  }
  function checkFourRow() {
    for (let i = 0; i < 60; i++) {
      const row = [squares[i], squares[i + 1], squares[i + 2], squares[i + 3]];
      const desiredColor = squares[i].style.backgroundColor;

      //Check if the i is an index of the invalid square
      const doNotCheckIndexes = [
        6, 7, 14, 15, 22, 23, 30, 31, 38, 39, 46, 47, 54, 55,
      ];
      if (doNotCheckIndexes.includes(i)) continue;

      if (
        row.every((square) => square.style.backgroundColor === desiredColor)
      ) {
        row.forEach((square) => (square.style.backgroundColor = ""));
      }
    }
  }
  function checkRows(i) {
    const rows = [];
    if (i < squares.length) {
      //Write a recursive function to check all rows
    }
  }

  function checkTreeColumn() {
    for (let i = 0; i < 47; i++) {
      const column = [squares[i], squares[i + width], squares[i + width * 2]];
      const desiredColor = squares[i].style.backgroundColor;
      if (
        column.every((square) => square.style.backgroundColor === desiredColor)
      ) {
        column.forEach((square) => (square.style.backgroundColor = ""));
      }
    }
  }
  window.setInterval(() => {
    checkFourRow();
    checkTreeRow();
    checkTreeColumn();
  }, 100);
});
