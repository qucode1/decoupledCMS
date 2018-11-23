import React, { Component, Fragment } from "react";
import Button from "@material-ui/core/Button";

import Tooltip from "../Tooltip/Tooltip";

class CopyBtn extends Component {
  state = {
    tooltipTimeout: null,
    timeoutTimer: 300,
    showTooltip: false,
    tooltipPosition: [0, 0]
  };

  handleCopyClick = () => {
    navigator.permissions.query({ name: "clipboard-write" }).then(result => {
      if (result.state == "granted" || result.state == "prompt") {
        navigator.clipboard.writeText(this.props.copyInput).then(
          function() {
            /* clipboard successfully set */
          },
          function() {
            /* clipboard write failed */
            console.log("copy failure");
          }
        );
      }
    });
  };

  handleMouseEnter = e => {
    this.setState({
      showTooltip: true,
      tooltipPosition: [e.clientX, e.clientY]
    });
    clearTimeout(this.state.tooltipTimeout);
  };

  handleMouseLeave = () => {
    const tooltipTimeout = setTimeout(() => {
      this.setState({ showTooltip: false });
    }, this.state.timeoutTimer);
    this.setState({
      tooltipTimeout
    });
  };
  render() {
    const { copyInput, text } = this.props;
    const { showTooltip, tooltipPosition } = this.state;
    return (
      <Fragment>
        <Button
          size="small"
          color="primary"
          // className={classes.tooltipElement}
          onClick={this.handleCopyClick}
          onMouseEnter={this.handleMouseEnter}
          onMouseLeave={this.handleMouseLeave}
        >
          {text}
        </Button>

        {showTooltip && (
          <Tooltip position={tooltipPosition} message={copyInput} />
        )}
      </Fragment>
    );
  }
}

export default CopyBtn;
