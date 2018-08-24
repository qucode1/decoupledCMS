import React, { Fragment } from "react"
import PropTypes from "prop-types"
import NProgress from "nprogress"
import { withStyles } from "@material-ui/core/styles"

import Header from "../components/Header"
import Navigation from "../components/Navigation"
import { AppContextProvider } from "../lib/AppContext"

function withLayout(BaseComponent) {
  const styles = theme => ({
    content: {
      [theme.breakpoints.up("md")]: {
        marginLeft: theme.spacing.drawerWidth
      }
    }
  })

  class Layout extends React.Component {
    constructor(props, context) {
      super(props, context)
    }
    componentDidMount() {
      // Remove the server-side injected CSS.
      const jssStyles = document.querySelector("#jss-server-side")
      if (jssStyles && jssStyles.parentNode) {
        jssStyles.parentNode.removeChild(jssStyles)
      }
    }
    render() {
      const { classes, ...props } = this.props
      return (
        <AppContextProvider>
          <Header {...props} />
          <Navigation {...props} />
          <div className={classes.content}>
            <BaseComponent {...props} />
          </div>
        </AppContextProvider>
      )
    }
  }

  Layout.getInitialProps = ctx => {
    if (BaseComponent.getInitialProps) {
      return BaseComponent.getInitialProps(ctx)
    }

    return {}
  }

  return withStyles(styles)(Layout)
}

export default withLayout
