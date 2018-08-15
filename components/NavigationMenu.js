import React, { Fragment } from "react"
import { withRouter } from "next/router"
import { withStyles } from "@material-ui/core/styles"
import List from "@material-ui/core/List"
import ListItem from "@material-ui/core/ListItem"
import HomeIcon from "@material-ui/icons/Home"
import PeopleIcon from "@material-ui/icons/People"
import PortraitIcon from "@material-ui/icons/Portrait"

import NavigationMenuItem from "./NavigationMenuItem"

const styles = theme => ({
  toolbar: theme.mixins.toolbar
})

const NavigationMenu = props => {
  return (
    <List component="nav">
      <ListItem className={props.classes.toolbar} />
      <NavigationMenuItem to="/" text="Home">
        <HomeIcon />
      </NavigationMenuItem>
      <NavigationMenuItem to="/about" text="About">
        <PortraitIcon />
      </NavigationMenuItem>
      <NavigationMenuItem to="/categories" text="Categories">
        <PeopleIcon />
      </NavigationMenuItem>
    </List>
  )
}

export default withStyles(styles)(withRouter(NavigationMenu))
