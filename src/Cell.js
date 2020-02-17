import React, { Component } from "react";
import classNames from "classnames";

class Cell extends Component {
  render() {
    return (
      <div
        onClick={() => this.props.highlightFunction(this.props.x, this.props.y)}
        onContextMenu={e => {
          e.preventDefault();
          this.props.markFunction(this.props.x, this.props.y);
        }}
        className={classNames(
          "col",
          "border",
          "border-dark",
          "cell",
          "text-center",
          "p-1",
          "hover-pointer",
          {
            "bg-primary": this.props.highlighted,
            "bg-danger": this.props.marked,
            "font-weight-bold": this.props.incorrect
          }
        )}
      >
        {this.props.value}
      </div>
    );
  }
}

export default Cell;
