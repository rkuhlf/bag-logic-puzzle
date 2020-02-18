import React from "react";
import Game from "./Game";
import "./styles.css";
import { Link } from "react-scroll";

function footer() {
  return (
    <footer className="page-footer font-small bg-dark text-light pt-4 mt-n3">
      <div className="container-fluid text-center text-sm-left">
        <div className="row">
          <div className="col-sm-6 mt-sm-0 mt-3">
            <h5 className="text-uppercase">Bag</h5>
            <p>
              Check out some other websites information about the bag logic
              puzzle
            </p>
          </div>

          <hr className="clearfix w-100 d-sm-none border-light pb-3" />

          <div className="col-sm-3 mb-sm-0 mb-3">
            <h5 className="text-uppercase">Scroll To</h5>

            <ul className="list-unstyled">
              <li>
                <Link
                  className="text-light hover-pointer hover-underline"
                  smooth={true}
                  to="top"
                >
                  Top
                </Link>
              </li>
              <li>
                <Link
                  smooth={true}
                  className="text-light hover-pointer hover-underline"
                  to="game"
                >
                  Game
                </Link>
              </li>
              <li>
                <Link
                  smooth={true}
                  className="text-light hover-pointer hover-underline"
                  to="how-to-play"
                >
                  How to Play
                </Link>
              </li>
              <li>
                <Link
                  smooth={true}
                  className="text-light hover-pointer hover-underline"
                  to="history"
                >
                  History
                </Link>
              </li>
            </ul>
          </div>

          <div className="col-sm-3 mb-sm-0 mb-3">
            <h5 className="text-uppercase">Further Reading</h5>

            <ul className="list-unstyled">
              <li>
                <a
                  className="text-light"
                  href="http://www.nikoli.co.jp/en/puzzles/shikaku.html"
                >
                  Nikoli
                </a>
              </li>
              <li>
                <a
                  className="text-light"
                  href="https://logic-puzzle.fandom.com/wiki/Corral"
                >
                  Fandom
                </a>
              </li>
              <li>
                <a
                  className="text-light"
                  href="https://en.wikipedia.org/wiki/Bag_(puzzle)"
                >
                  Wikipedia
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div className="footer-copyright text-center py-3">
        © 2020 Copyright: {}
        <a
          className="text-light"
          href="https://github.com/rkuhlf/bag-logic-puzzle"
        >
          Riley Kuhlman
        </a>
      </div>
    </footer>
  );
}

export default function App() {
  return (
    <div id="top">
      <div className="p-5">
        <h1 className="mb-3">Bag</h1>
        <div className="container-fluid mb-3">
          <Game />
        </div>
        <h3 id="how-to-play" name="how-to-play">
          How to Play
        </h3>
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

        <h3 id="history" name="history">
          History
        </h3>
        <p>
          <a href="https://en.wikipedia.org/wiki/Bag_(puzzle)">Bag</a>, also
          called Corral or Cave, was first created and published by Nikoli. It
          attracted interest in the US along with games like sudoku and
          crossword puzzles.
        </p>
      </div>
      {footer()}
    </div>
  );
}
