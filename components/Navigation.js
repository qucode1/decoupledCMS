import React, { Fragment, Component } from "react"

import Drawer from "@material-ui/core/Drawer"
import Hidden from "@material-ui/core/Hidden"
import { withStyles } from "@material-ui/core/styles"

import NavigationMenu from "./NavigationMenu"

import { withContext } from "../lib/AppContext"

const styles = theme => ({
  root: {
    width: theme.spacing.drawerWidth,
    maxWidth: "75%"
  }
})

class Navigation extends Component {
  state = {
    mobileOpen: false
  }
  render() {
    const {
      context: {
        state: { navIsOpen },
        toggleNav
      }
    } = this.props
    return (
      <Fragment>
        <Hidden mdUp>
          <Drawer
            variant="temporary"
            anchor={"left"}
            open={navIsOpen}
            onClose={toggleNav}
            ModalProps={{
              keepMounted: true
            }}
            classes={{ paper: this.props.classes.root }}
          >
            <NavigationMenu />
          </Drawer>
        </Hidden>
        <Hidden smDown>
          <Drawer
            variant="permanent"
            open
            classes={{ paper: this.props.classes.root }}
          >
            <NavigationMenu />
          </Drawer>
        </Hidden>
      </Fragment>
    )
  }
}

export default withStyles(styles)(withContext(Navigation))
