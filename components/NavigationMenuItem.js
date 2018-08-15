import React from "react"
import { withRouter } from "next/router"
import NavLink from "next/link"
import ListItem from "@material-ui/core/ListItem"
import ListItemIcon from "@material-ui/core/ListItemIcon"
import ListItemText from "@material-ui/core/ListItemText"
import { withStyles } from "@material-ui/core/styles"

const styles = theme => ({
  navLink: {
    display: "flex"
  },
  activeNavLink: {
    backgroundColor: theme.palette.action.hover
  }
})

const NavigationMenuItem = props => (
  <ListItem
    button
    className={
      props.router.pathname === props.to ? props.classes.activeNavLink : ""
    }
  >
    <NavLink href={props.to}>
      <div className={`${props.classes.navLink}`}>
        <ListItemIcon>{props.children}</ListItemIcon>
        <ListItemText primary={props.text} />
      </div>
    </NavLink>
  </ListItem>
)

export default withStyles(styles)(withRouter(NavigationMenuItem))
