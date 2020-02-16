import React, { Component } from "react";
import classNames from "classnames";

class Cell extends Component {
  render() {
    return (
      <div
        onClick={() => this.props.highlightFunction(this.props.x, this.props.y)}
        onContextMenu={e => {e.preventDefault(); this.props.markFunction(this.props.x, this.props.y);}}
        className={classNames("col", { "bg-primary": this.props.highlighted , "bg-danger": this.props.marked})}
      >
        {this.props.value}
      </div>
    );
  }
}

export default Cell;
