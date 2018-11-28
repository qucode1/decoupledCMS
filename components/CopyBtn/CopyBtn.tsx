import React, { Component, Fragment } from "react";
import Button from "@material-ui/core/Button";

import Tooltip from "../Tooltip/Tooltip";

interface Props {
  copyInput?: string;
  text: string;
}

interface State {
  tooltipTimeout?: number | null;
  timeoutTimer: number;
  showTooltip: boolean;
  tooltipPosition: number[];
}

interface INavigator extends Navigator {
  permissions: any;
  clipboard: any;
}

class CopyBtn extends Component<Props, State> {
  state = {
    tooltipTimeout: 0,
    timeoutTimer: 300,
    showTooltip: false,
    tooltipPosition: [0, 0]
  };
  myNavigator = navigator as INavigator;
  handleCopyClick = () => {
    this.myNavigator.permissions
      .query({ name: "clipboard-write" })
      .then((result: any) => {
        if (result.state == "granted" || result.state == "prompt") {
          this.myNavigator.clipboard.writeText(this.props.copyInput).then(
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

  handleMouseEnter = (e: React.MouseEvent<Element>) => {
    this.setState({
      showTooltip: true,
      tooltipPosition: [e.clientX, e.clientY]
    });
    clearTimeout(this.state.tooltipTimeout);
  };

  handleMouseLeave = () => {
    const tooltipTimeout = window.setTimeout(() => {
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
