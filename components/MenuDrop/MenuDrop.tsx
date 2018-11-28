import React from "react";
import PropTypes from "prop-types";
import Link from "next/link";
import Menu from "@material-ui/core/Menu";
import Avatar from "@material-ui/core/Avatar";
import {
  withStyles,
  WithStyles,
  createStyles,
  Theme
} from "@material-ui/core/styles";

const styles = (theme: Theme) =>
  createStyles({
    avatar: { margin: "0px 20px 0px auto", cursor: "pointer" },
    menuOption: { padding: "0px 20px" }
  });

interface Option {
  href: string;
  text: string;
  as?: string;
}

interface Props extends WithStyles<typeof styles> {
  options: Option[];
  src: string;
  alt: string;
}

interface State {
  open: boolean;
  anchorEl: HTMLElement | undefined;
}

class MenuDrop extends React.Component<Props, State> {
  state = {
    open: false,
    anchorEl: undefined
  };

  button = undefined;

  handleClick = (
    event: React.MouseEvent<HTMLElement> | React.KeyboardEvent<HTMLElement>
  ) => {
    this.setState({ open: true, anchorEl: event.currentTarget });
  };

  handleClose = () => {
    this.setState({ open: false });
  };

  render() {
    const { options, src, alt, classes } = this.props;

    return (
      <div>
        <Avatar
          role="presentation"
          aria-owns="simple-menu"
          aria-haspopup="true"
          onClick={this.handleClick}
          onKeyPress={this.handleClick}
          src={src}
          alt={alt}
          className={classes.avatar}
        />
        <Menu
          id="simple-menu"
          anchorEl={this.state.anchorEl}
          open={this.state.open}
          onClose={this.handleClose}
        >
          <p />
          {options.map(option => (
            <div id="wrappingLink" key={option.text}>
              <Link prefetch href={option.href} as={option.as || option.href}>
                <a className={classes.menuOption}>{option.text}</a>
              </Link>
              <p />
            </div>
          ))}
        </Menu>
      </div>
    );
  }
}

export default withStyles(styles)(MenuDrop);
