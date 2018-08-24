import React, { Fragment } from "react"
import { withRouter } from "next/router"
import { withStyles } from "@material-ui/core/styles"
import List from "@material-ui/core/List"
import ListItem from "@material-ui/core/ListItem"
import Divider from "@material-ui/core/Divider"
import HomeIcon from "@material-ui/icons/Home"
import PowerIcon from "@material-ui/icons/PowerSettingsNew"

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
      <Divider />
      <NavigationMenuItem color="error" to="/logout" text="Logout">
        <PowerIcon />
      </NavigationMenuItem>
    </List>
  )
}

export default withStyles(styles)(withRouter(NavigationMenu))
