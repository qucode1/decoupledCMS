import React, { Fragment } from "react";
import { withRouter } from "next/router";
import { withStyles } from "@material-ui/core/styles";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import Divider from "@material-ui/core/Divider";
import HomeIcon from "@material-ui/icons/Home";
import PowerIcon from "@material-ui/icons/PowerSettingsNew";
import Typography from "@material-ui/core/Typography";

import NavigationMenuItem from "../NavigationMenuItem/NavigationMenuItem";

const styles = theme => ({
  toolbar: theme.mixins.toolbar,
  title: {
    width: "100%",
    textAlign: "center"
  }
});

const NavigationMenu = props => {
  const { classes } = props;
  return (
    <List component="nav">
      <ListItem className={classes.toolbar}>
        <Typography variant="title" classes={{ root: classes.title }}>
          <ListItemText primary="DecoupledCMS" disableTypography />
        </Typography>
      </ListItem>
      <NavigationMenuItem to="/" text="Home">
        <HomeIcon />
      </NavigationMenuItem>
      <Divider />
      <NavigationMenuItem color="error" to="/logout" text="Logout">
        <PowerIcon />
      </NavigationMenuItem>
    </List>
  );
};

export default withStyles(styles)(withRouter(NavigationMenu));
