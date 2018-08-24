import PropTypes from "prop-types"
import Link from "next/link"
import AppBar from "@material-ui/core/AppBar"
import Toolbar from "@material-ui/core/Toolbar"
import Typography from "@material-ui/core/Typography"
import Hidden from "@material-ui/core/Hidden"
import Avatar from "@material-ui/core/Avatar"
import { withStyles } from "@material-ui/core/styles"
import MenuIcon from "@material-ui/icons/Menu"
import IconButton from "@material-ui/core/IconButton"

import MenuDrop from "./MenuDrop"
import { withContext } from "../lib/AppContext"

const styles = theme => ({
  root: {
    width: "100%",
    color: theme.palette.primary.contrastText,
    backgroundColor: theme.palette.primary.main,
    [theme.breakpoints.up("md")]: {
      marginLeft: theme.spacing.drawerWidth,
      width: `calc(100% - ${theme.spacing.drawerWidth})`
    }
  },
  toolbar: {
    justifyContent: "space-between"
  }
})

const optionsMenu = [
  {
    text: "Log out",
    href: "/logout"
  }
]

function Header({ classes, user, context: { toggleNav } }) {
  return (
    <AppBar className={classes.root} position="fixed">
      <Toolbar className={classes.toolbar}>
        <Typography color="inherit" variant="title">
          DecoupledCMS
        </Typography>
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
            <div style={{ whiteSpace: " nowrap" }}>
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
              <a style={{ margin: "0px 20px 0px auto" }}>Log in</a>
            </Link>
          )}
        </Hidden>
      </Toolbar>
    </AppBar>
  )
}

Header.propTypes = {
  user: PropTypes.shape({
    avatarUrl: PropTypes.string,
    email: PropTypes.string.isRequired
  })
}

Header.defaultProps = {
  user: null
}

export default withStyles(styles)(withContext(Header))
