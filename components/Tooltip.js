import React, { Component } from "react";

class Tooltip extends Component {
  render() {
    const {
      message = "",
      position: [x, y]
    } = this.props;
    return (
      <p
        style={{
          position: "absolute",
          top: y + 15,
          left: x - 150,
          backgroundColor: "rgba(0,0,0,0.6)",
          color: "rgba(255, 255, 255, 0.9)",
          borderRadius: "5px",
          padding: "5px",
          zIndex: 500
        }}
      >
        {message}
      </p>
    );
  }
}

export default Tooltip;
