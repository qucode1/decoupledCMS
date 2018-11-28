import React, { Component } from "react";
import { withRouter } from "next/router";
import NavLink from "next/link";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import {
  withStyles,
  WithStyles,
  Theme,
  createStyles
} from "@material-ui/core/styles";
import { Palette, PaletteColor } from "@material-ui/core/styles/createPalette";
import { RouterProps } from "next/router";

interface Props {
  color?: string | undefined;
  router: RouterProps;
  to: string;
  text: string;
  children: JSX.Element;
}

const NavigationMenuItem = (props: Props) => {
  const styles = (theme: Theme) => {
    const paletteItem = theme.palette[
      props.color as keyof Palette
    ] as PaletteColor;

    return createStyles({
      navLink: {
        display: "flex"
      },
      itemText: {
        color: props.color ? paletteItem.main : "inherit"
      },
      activeNavLink: {
        backgroundColor: theme.palette.action.hover
      }
    });
  };

  interface InnerProps extends Props, WithStyles<typeof styles> {}

  const div = (props: InnerProps) => {
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
  const StyledDiv = withStyles(styles)(div);

  return <StyledDiv {...props} />;
};

export default withRouter(NavigationMenuItem);
