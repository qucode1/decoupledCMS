import React, { Fragment, Component } from "react";

import Drawer from "@material-ui/core/Drawer";
import Hidden from "@material-ui/core/Hidden";
import {
  withStyles,
  WithStyles,
  Theme,
  createStyles
} from "@material-ui/core/styles";

import { withContext, Value } from "../../lib/AppContext";

import NavigationMenu from "../NavigationMenu/NavigationMenu";

const styles = (theme: Theme) =>
  createStyles({
    root: {
      width: theme.mySidebar.width,
      maxWidth: "75%"
    }
  });

interface Props extends WithStyles<typeof styles> {
  context: Value;
}

interface State {
  mobileOpen: boolean;
}

class Navigation extends Component<Props, State> {
  state = {
    mobileOpen: false
  };
  render() {
    const {
      context: {
        state: { navIsOpen },
        toggleNav
      }
    } = this.props;
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
    );
  }
}

export default withStyles(styles)(withContext(Navigation));
