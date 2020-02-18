import React, { Component } from "react";
import Cell from "./Cell";

// allow the user to change the size of the board

// add history beneath
// add footer

// give it a max width so it never gets too wide
// button to show answer

class Game extends Component {
  constructor(props) {
    super(props);
    this.state = {
      gameState: [],
      highlighted: [],
      marked: [],
      incorrectCells: [],
      width: 5,
      height: 5,
      won: false,
      everythingConnected: true,
      allNumbersMatched: false
    };

    this.highlightCell = this.highlightCell.bind(this);
    this.markCell = this.markCell.bind(this);

    this.visited = [];
  }

  componentDidMount() {
    this.resetGameState();
  }

  random(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
  }

  resetGameState() {
    let newGameState = [];
    let newHighlightState = [];
    let newMarkedState = [];
    let newIncorrectState = [];
    for (let y = 0; y < this.state.height; y++) {
      newGameState[y] = [];
      newHighlightState[y] = [];
      newMarkedState[y] = [];
      newIncorrectState[y] = [];
      for (let x = 0; x < this.state.width; x++) {
        newGameState[y][x] = " ";
        newHighlightState[y][x] = false;
        newIncorrectState[y][x] = false;
        newMarkedState[y][x] = false;
      }
    }

    // doesn't matter that set state directly because
    // Don't want the display to update
    this.state.highlighted = newHighlightState;
    this.state.gameState = newGameState;

    // generate a random start coordinate
    let startX = this.random(0, this.state.width);
    let startY = this.random(0, this.state.height);
    newHighlightState[startY][startX] = true;

    let totalColored = this.random(0, this.state.width * this.state.height - 1); // minus one for the base one

    // Do this until a randomly generated number is reached
    for (let i = 0; i < totalColored; i++) {
      // pick a random coordinate until I pick one that borders another already colored cell
      let currentX = this.random(0, this.state.width);
      let currentY = this.random(0, this.state.height);
      // also shouldn't be already highlighted
      while (
        !this.adjacentHighlighted(currentX, currentY) ||
        this.checkHighlighted(currentX, currentY)
      ) {
        currentX = this.random(0, this.state.width);
        currentY = this.random(0, this.state.height);
      }

      // highlight the new cell
      newHighlightState[currentY][currentX] = true;
    }

    // Do this until a random number is reached
    const totalGivenNumbers = this.random(3, totalColored);
    for (let i = 0; i < totalGivenNumbers; i++) {
      // pick a random coordinate
      let currentX = this.random(0, this.state.width);
      let currentY = this.random(0, this.state.height);
      // make sure it's highlighted and not already numbered
      while (
        !this.checkHighlighted(currentX, currentY) ||
        this.state.gameState[currentY][currentX] !== " "
      ) {
        currentX = this.random(0, this.state.width);
        currentY = this.random(0, this.state.height);
      }

      // count how many highlighted cells it can see
      const visible = this.countVisibleCells(currentX, currentY);
      // set the cell value to that number

      newGameState[currentY][currentX] = visible;
    }

    for (let y = 0; y < this.state.height; y++) {
      newHighlightState[y] = [];
      for (let x = 0; x < this.state.width; x++) {
        newHighlightState[y][x] = false;
      }
    }

    this.resetVisited();
    this.setState(
      {
        gameState: newGameState,
        highlighted: newHighlightState,
        marked: newMarkedState,
        won: false,
        allNumbersMatched: false,
        everythingConnected: true,
        incorrectCells: newIncorrectState
      },
      () => this.checkCorrect()
    );
  }

  resetVisited() {
    const emptyMatrix = [];
    for (let y = 0; y < this.state.height; y++) {
      emptyMatrix[y] = [];
      for (let x = 0; x < this.state.width; x++) {
        emptyMatrix[y][x] = false;
      }
    }
    this.visited = emptyMatrix;
  }

  checkExists(x, y) {
    return x >= 0 && x < this.state.width && y >= 0 && y < this.state.height;
  }

  checkHighlighted(x, y) {
    if (this.checkExists(x, y)) {
      return this.state.highlighted[y][x];
    }

    return false;
  }

  adjacentHighlighted(x, y) {
    let adjacentHighlighted = false;
    if (
      this.checkHighlighted(x - 1, y) ||
      this.checkHighlighted(x + 1, y) ||
      this.checkHighlighted(x, y - 1) ||
      this.checkHighlighted(x, y + 1)
    ) {
      adjacentHighlighted = true;
    }

    return adjacentHighlighted;
  }

  countVisibleCells(i, j) {
    let currentNum = 1;

    for (let x = i + 1; x < this.state.width; x++) {
      if (this.checkHighlighted(x, j)) {
        currentNum++;
      } else {
        break;
      }
    }

    for (let x = i - 1; x >= 0; x--) {
      if (this.checkHighlighted(x, j)) {
        currentNum++;
      } else {
        break;
      }
    }

    for (let y = j + 1; y < this.state.height; y++) {
      if (this.checkHighlighted(i, y)) {
        currentNum++;
      } else {
        break;
      }
    }

    for (let y = j - 1; y >= 0; y--) {
      if (this.checkHighlighted(i, y)) {
        currentNum++;
      } else {
        break;
      }
    }

    return currentNum;
  }

  checkCorrect() {
    console.log("checking correct");
    let currentX = -1;
    let currentY = -1;
    // loop through all of the cells
    for (let x = 0; x < this.state.width; x++) {
      for (let y = 0; y < this.state.height; y++) {
        // until you find one that is highlighted
        if (this.checkHighlighted(x, y)) {
          currentX = x;
          currentY = y;
        }
      }
    }
    console.log("made it to the end");

    if (currentX !== -1 && currentY !== -1) {
      const offsets = [[-1, 0], [1, 0], [0, -1], [0, 1]];

      this.resetVisited();
      let newVisitedState = this.visited;

      // set that cell as visited in another state matrix
      newVisitedState[currentY][currentX] = true;

      let currentlyChecking = [[currentX, currentY]];

      // do this until that list is empty
      while (currentlyChecking.length !== 0) {
        // add all of the neighbors to a currently checking array
        let neighbors = [];
        for (let i = 0; i < currentlyChecking.length; i++) {
          for (let j = 0; j < offsets.length; j++) {
            const newX = currentlyChecking[i][0] + offsets[j][0];
            const newY = currentlyChecking[i][1] + offsets[j][1];
            // only if they are highlighted
            if (this.checkHighlighted(newX, newY)) {
              // but they haven't already been visited
              if (!newVisitedState[newY][newX]) {
                neighbors.push([newX, newY]);
                newVisitedState[newY][newX] = true;
              }
            }
          }
        }

        currentlyChecking = neighbors;
      }

      // check if the visited array matches the highlighted array
      for (let i = 0; i < this.state.highlighted.length; i++) {
        for (let j = 0; j < this.state.highlighted[i].length; j++) {
          if (this.state.highlighted[i][j] !== newVisitedState[i][j]) {
            this.setState({
              everythingConnected: false
            });
            return false;
          }
        }
      }

      this.setState({
        everythingConnected: true
      });
    } else {
      this.state.everythingConnected = false;
      this.setState({
        everythingConnected: false
      });
    }

    let everythingCorrect = true;
    // check each number has the correct sum orthogonally
    for (let i = 0; i < this.state.width; i++) {
      for (let j = 0; j < this.state.height; j++) {
        // if the cell is a number
        // count the number of cells with the same x
        // add the number with the y axis
        if (this.state.gameState[j][i] !== " ") {
          const targetNum = parseInt(this.state.gameState[j][i]);
          let currentNum = 0;
          if (this.checkHighlighted(i, j)) {
            currentNum = this.countVisibleCells(i, j);
          }

          if (currentNum !== targetNum) {
            this.setState(prevState => {
              let newIncorrectState = prevState.incorrectCells;
              newIncorrectState[j][i] = true;
              return {
                allNumbersMatched: false,
                incorrectCells: newIncorrectState
              };
            });
            everythingCorrect = false;
          } else {
            this.setState(prevState => {
              let newIncorrectState = prevState.incorrectCells;
              newIncorrectState[j][i] = false;
              return {
                incorrectCells: newIncorrectState
              };
            });
          }
        }
      }
    }

    if (!everythingCorrect) {
      return false;
    }
    this.setState({
      allNumbersMatched: true
    });
    if (this.state.everythingConnected) {
      return true;
    }

    return false;
  }

  highlightCell(x, y) {
    this.setState(
      prevState => {
        let newHighlights = prevState.highlighted;
        newHighlights[y][x] = !newHighlights[y][x];
        let newMarks = prevState.marked;
        newMarks[y][x] = false;
        return {
          marked: newMarks,
          highlighted: newHighlights
        };
      },
      () => {
        this.setState({
          won: this.checkCorrect()
        });
      }
    );
  }

  markCell(x, y) {
    this.setState(
      prevState => {
        let newMarks = prevState.marked;
        newMarks[y][x] = !newMarks[y][x];
        let newHighlights = prevState.highlighted;
        newHighlights[y][x] = false;
        return {
          marked: newMarks,
          highlighted: newHighlights
        };
      },
      () => {
        this.setState({
          won: this.checkCorrect()
        });
      }
    );
  }

  getRowDisplay(row, yIndex) {
    return (
      <div className="row">
        {row.map((item, index) => (
          <Cell
            highlightFunction={this.highlightCell}
            markFunction={this.markCell}
            highlighted={this.state.highlighted[yIndex][index]}
            marked={this.state.marked[yIndex][index]}
            incorrect={this.state.incorrectCells[yIndex][index]}
            x={index}
            y={yIndex}
            value={item}
          />
        ))}
      </div>
    );
  }

  getGameDisplay() {
    return (
      <div className="container-fluid border border-dark">
        {this.state.gameState.map((item, index) =>
          this.getRowDisplay(item, index)
        )}
      </div>
    );
  }

  getInfoDisplay() {
    return (
      <div>
        {!this.state.allNumbersMatched && (
          <p>not all of the numbers can see the correct number of cells</p>
        )}
        {!this.state.everythingConnected && (
          <p>all of the cells must be connected</p>
        )}
      </div>
    );
  }

  getWinDisplay() {
    if (this.state.won) {
      return (
        <div className="text-center">
          <div>Congratulations! You won.</div>
          <button
            onClick={() => this.resetGameState()}
            className="btn btn-primary"
          >
            Play Again
          </button>
        </div>
      );
    }

    return (
      <div className="row">
        <div className="col-8">{this.getInfoDisplay()}</div>
        <div className="col-4">
          {
            <button
              onClick={() => this.resetGameState()}
              className="btn btn-secondary"
            >
              Restart
            </button>
          }
        </div>
      </div>
    );
  }

  render() {
    return (
      <div id="game" name="game">
        {this.getGameDisplay()}
        <div className="container-fluid mt-3">{this.getWinDisplay()}</div>
      </div>
    );
  }
}

export default Game;
