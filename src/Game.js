import React, { Component } from "react";
import Cell from "./Cell";

class Game extends Component {
  constructor(props) {
    super(props);
    this.state = {
      gameState: [],
      highlighted: [],
      marked: [],
      width: 5,
      height: 5,
      won: false
    };

    this.highlightCell = this.highlightCell.bind(this);
    this.markCell = this.markCell.bind(this);
  }

  componentDidMount() {
    this.resetGameState();
  }

  random(min, max) {
    return Math.floor(Math.random() * (max - min)) + min
  }

  resetGameState() {
    let newGameState = [];
    let newHighlightState = [];
    let newMarkedState = [];
    for (let y = 0; y < this.state.height; y++) {
      newGameState[y] = [];
      newHighlightState[y] = [];
      newMarkedState[y] = [];
      for (let x = 0; x < this.state.width; x++) {
        newGameState[y][x] = ".";
        newHighlightState[y][x] = false;
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
    newHighlightState[startY][startX] = true

    let totalColored = this.random(0, this.state.width * this.state.height - 1); // minus one for the base one

    // Do this until a randomly generated number is reached
    for (let i = 0; i < totalColored; i++) {
      // pick a random coordinate until I pick one that borders another already colored cell
      let currentX = this.random(0, this.state.width);
      let currentY = this.random(0, this.state.height);
      // also shouldn't be already highlighted
      while (!this.adjacentHighlighted(currentX, currentY) || this.checkHighlighted(currentX, currentY)) {
        currentX = this.random(0, this.state.width);
        currentY = this.random(0, this.state.height);
      }

      // highlight the new cell
      newHighlightState[currentY][currentX] = true;
    }

    
    // Do this until a random number is reached
    const totalGivenNumbers = this.random(1, totalColored)
    console.log("total given", totalGivenNumbers)
    for (let i = 0; i < totalGivenNumbers; i++) {
      // pick a random coordinate
      let currentX = this.random(0, this.state.width);
      let currentY = this.random(0, this.state.height);
      // make sure it's highlighted and not already numbered
      while (!this.checkHighlighted(currentX, currentY) || this.state.gameState[currentY][currentX] !== ".") {
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

    this.setState({
      gameState: newGameState,
      highlighted: newHighlightState,
      marked: newMarkedState,
      won: false
    });
  }

  checkHighlighted(x, y) {
    if (x >= 0 && x < this.state.width && y >= 0 && y < this.state.height) {
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
    let currentNum = 1

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
    // not currently working because if it's connected to something
    // but not to the rest of it.
    // check highlights are all connected

    // for new algorithm:
    // pick a random highlighted cell as the starting point
    // set that cell as visited in another state matrix
    // add all of the neighbors to a currently checking array
    // but only if they haven't already been visited
    // do this until that list is empty
    // check if the visited array matches the highlighted array
    for (let i = 0; i < this.state.width; i++) {
      for (let j = 0; j < this.state.height; j++) {
        // if the cell is highlighted
        if (this.checkHighlighted(i, j)) {
          // check if any of the adjacent cells are highlighted
          const adjacentHighlighted = this.adjacentHighlighted(i, j)
          
          // if none are, it is incorrect
          if (!adjacentHighlighted) {
            return false;
          }
        }
      }
    }

    // check each number has the correct sum orthogonally

    for (let i = 0; i < this.state.width; i++) {
      for (let j = 0; j < this.state.height; j++) {
        // if the cell is a number
        // count the number of cells with the same x
        // add the number with the y axis
        if (this.state.gameState[j][i] !== ".") {
          const targetNum = parseInt(this.state.gameState[j][i]);
          let currentNum = 0;
          if (this.checkHighlighted(i, j)) {
            currentNum = this.countVisibleCells(i, j)
          
          }
          if (currentNum !== targetNum) {
            return false;
          }
        }
      }
    }
    return true;
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
        })
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
        })
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
      <div className="container-fluid">
        {this.state.gameState.map((item, index) =>
          this.getRowDisplay(item, index)
        )}
      </div>
    );
  }

  getWinDisplay() {
    if (this.state.won) {
      return (
        <div>
          <div>
          Congratulations! You won.
          </div>
          <button onClick={() => this.resetGameState()} className="btn btn-primary">Play Again</button>

        </div>
      )
    }

    return (
      <div>
        <button onClick={() => this.resetGameState()} className="btn btn-secondary">Restart</button>
      </div>
    )
  }

  render() {
    return (
      <div>
        {this.getGameDisplay()}
        {this.getWinDisplay()}
      </div>
    );
  }
}

export default Game;