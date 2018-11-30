import React from "react";
import { withStyles } from "@material-ui/core/styles";

import { AppContextProvider } from "../lib/AppContext";

import Header from "../components/Header/Header";
import Navigation from "../components/Navigation/Navigation";

function withLayout(BaseComponent) {
  const styles = theme => ({
    content: {
      [theme.breakpoints.up("md")]: {
        marginLeft: theme.mySidebar.width
      }
    },
    toolbar: theme.mixins.toolbar
  });

  class Layout extends React.Component {
    constructor(props, context) {
      super(props, context);
    }
    componentDidMount() {
      // Remove the server-side injected CSS.
      const jssStyles = document.querySelector("#jss-server-side");
      if (jssStyles && jssStyles.parentNode) {
        jssStyles.parentNode.removeChild(jssStyles);
      }
    }
    render() {
      const { classes, ...props } = this.props;
      return (
        <AppContextProvider>
          <Header {...props} />
          {props.user && <Navigation {...props} />}
          <div className={props.user && classes.content}>
            <div className={classes.toolbar} />
            <BaseComponent {...props} />
          </div>
        </AppContextProvider>
      );
    }
  }

  Layout.getInitialProps = ctx => {
    if (BaseComponent.getInitialProps) {
      return BaseComponent.getInitialProps(ctx);
    }

    return {};
  };

  return withStyles(styles)(Layout);
}

export default withLayout;
