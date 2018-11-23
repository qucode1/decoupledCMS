import React, { Component } from "react";
import { withRouter } from "next/router";
import NavLink from "next/link";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import { withStyles } from "@material-ui/core/styles";

const styles = theme => ({
  navLink: {
    display: "flex"
  },

  activeNavLink: {
    backgroundColor: theme.palette.action.hover
  }
});

class NavigationMenuItem extends Component {
  styles = theme => ({
    navLink: {
      display: "flex"
    },
    itemText: {
      color: this.props.color ? theme.palette[this.props.color].main : "inherit"
    },
    activeNavLink: {
      backgroundColor: theme.palette.action.hover
    }
  });
  div = props => {
    return (
      <NavLink href={props.to}>
        <ListItem
          button
          className={
            props.router.pathname.startsWith(props.to)
              ? props.classes.activeNavLink
              : ""
          }
        >
          <div className={`${props.classes.navLink}`}>
            <ListItemIcon
              classes={{
                root: `${props.classes.itemText}`
              }}
            >
              {props.children}
            </ListItemIcon>
            <ListItemText
              classes={{
                primary: `${props.classes.itemText}`,
                secondary: `${props.classes.itemText}`
              }}
              primary={props.text}
            />
          </div>
        </ListItem>
      </NavLink>
    );
  };
  StyledDiv = withStyles(this.styles)(this.div);
  render() {
    return <this.StyledDiv {...this.props} />;
  }
}

export default withStyles(styles)(withRouter(NavigationMenuItem));
