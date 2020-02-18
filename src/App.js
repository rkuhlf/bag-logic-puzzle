import React from "react";
import Game from "./Game";
import "./styles.css";

function footer() {
  // http://www.nikoli.co.jp/en/puzzles/shikaku.html
  // https://en.wikipedia.org/wiki/Bag_(puzzle)
  return <div />;
}

export default function App() {
  return (
    <div className="p-5">
      <h1 className="mb-3">Bag</h1>
      <div className="container-fluid mb-3">
        <Game />
      </div>
      <h3>How to Play</h3>
      <p>
        The bag logic puzzle is a {}
        <a href="http://www.nikoli.co.jp/en/puzzles/">Nikoli</a> puzzle and is
        played by highlighted cells in a rectangular grid. The objective is to{" "}
        <b>connect</b> the highlights in such a way that all of the numbered
        cells can "see" the given number of highlights. You can figure out how
        many cells a number can see by counting in each direction (only top,
        right, bottom, and left) until you reach a nonhighlighted cell. Make
        sure you only count the center cell once. The cell number will also be
        bolded if the number is incorrect.
      </p>

      <h3>History</h3>
      <p>
        <a href="https://en.wikipedia.org/wiki/Bag_(puzzle)">Bag</a>, also
        called Corral or Cave, was first created and published by Nikoli. It
        attracted interest in the US along with games like sudoku and crossword
        puzzles.
      </p>
      {footer()}
    </div>
  );
}
