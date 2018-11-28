import React from "react";
import {
  withStyles,
  WithStyles,
  Theme,
  createStyles
} from "@material-ui/core/styles";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import Divider from "@material-ui/core/Divider";
import HomeIcon from "@material-ui/icons/Home";
import PowerIcon from "@material-ui/icons/PowerSettingsNew";
import Typography from "@material-ui/core/Typography";

import NavigationMenuItem from "../NavigationMenuItem/NavigationMenuItem";

const styles = (theme: Theme) =>
  createStyles({
    toolbar: theme.mixins.toolbar,
    title: {
      width: "100%",
      textAlign: "center"
    }
  });

interface Props extends WithStyles<typeof styles> {}

const NavigationMenu = (props: Props) => {
  const { classes } = props;
  return (
    <List component="nav">
      <ListItem className={classes.toolbar}>
        <Typography variant="h6" classes={{ root: classes.title }}>
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

export default withStyles(styles)(NavigationMenu);
