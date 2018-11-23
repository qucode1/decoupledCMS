const styles = theme => ({
  root: {
    width: "100%",
    color: theme.palette.primary.contrastText,
    backgroundColor: theme.palette.primary.main
  },
  withNav: {
    [theme.breakpoints.up("md")]: {
      marginLeft: theme.spacing.drawerWidth,
      width: `calc(100% - ${theme.spacing.drawerWidth})`
    }
  },
  toolbar: {
    justifyContent: "space-between"
  },
  title: { display: "flex", alignItems: "center" },
  avatar: { whiteSpace: " nowrap" },
  login: { margin: "0px 20px 0px auto" }
});

export default styles;
