import PropTypes from "prop-types";
import Link from "next/link";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import Hidden from "@material-ui/core/Hidden";
import Avatar from "@material-ui/core/Avatar";
import { withStyles } from "@material-ui/core/styles";
import MenuIcon from "@material-ui/icons/Menu";
import BackIcon from "@material-ui/icons/KeyboardBackspace";
import IconButton from "@material-ui/core/IconButton";
import { withRouter } from "next/router";

import { withContext } from "../../lib/AppContext";
import styles from "./styles";

import MenuDrop from "../MenuDrop/MenuDrop";

const optionsMenu = [
  {
    text: "Log out",
    href: "/logout"
  }
];

function Header({
  classes,
  user,
  context: { toggleNav, state: contextState },
  router: { back, route }
}) {
  const { pageTitle } = contextState;
  return (
    <AppBar
      className={`${classes.root} ${user && classes.withNav}`}
      position="fixed"
    >
      <Toolbar className={classes.toolbar}>
        <div className={classes.title}>
          {route !== "/" && route !== "/login" && (
            <IconButton onClick={back} color="inherit">
              <BackIcon />
            </IconButton>
          )}
          <Typography color="inherit" variant="title">
            {pageTitle || "Decoupled CMS"}
          </Typography>
        </div>
        <Hidden mdUp>
          <IconButton
            className={classes.menuButton}
            color="inherit"
            aria-label="Menu"
            onClick={toggleNav}
          >
            <MenuIcon />
          </IconButton>
        </Hidden>
        <Hidden smDown>
          {user ? (
            <div className={classes.avatar}>
              {user.avatarUrl ? (
                <MenuDrop
                  options={optionsMenu}
                  src={user.avatarUrl}
                  alt="User Avatar"
                />
              ) : null}
            </div>
          ) : (
            <Link prefetch href="/login">
              <a className={classes.login}>Log in</a>
            </Link>
          )}
        </Hidden>
      </Toolbar>
    </AppBar>
  );
}

Header.propTypes = {
  user: PropTypes.shape({
    avatarUrl: PropTypes.string,
    email: PropTypes.string.isRequired
  })
};

Header.defaultProps = {
  user: null
};

export default withStyles(styles)(withContext(withRouter(Header)));
