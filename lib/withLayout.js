import React, { Fragment } from "react"
import PropTypes from "prop-types"
import Router from "next/router"
import NProgress from "nprogress"
import { MuiThemeProvider } from "@material-ui/core/styles"
import CssBaseline from "@material-ui/core/CssBaseline"
import { withStyles } from "@material-ui/core/styles"

import getContext from "../lib/context"
import Header from "../components/Header"
import Navigation from "../components/Navigation"

Router.onRouteChangeStart = () => NProgress.start()
Router.onRouteChangeComplete = () => NProgress.done()
Router.onRouteChangeError = () => NProgress.done()

function withLayout(BaseComponent) {
  const styles = theme => ({
    root: {
      [theme.breakpoints.up("md")]: {
        marginLeft: theme.spacing.drawerWidth
      }
    }
  })
  const BaseComponentWrapper = ({ classes, ...props }) => (
    <div className={classes.root}>
      <BaseComponent {...props} />
    </div>
  )

  const StyledBaseComponent = withStyles(styles)(BaseComponentWrapper)

  class App extends React.Component {
    constructor(props, context) {
      super(props, context)
      this.pageContext = this.props.pageContext || getContext()
    }

    componentDidMount() {
      const jssStyles = document.querySelector("#jss-server-side")
      if (jssStyles && jssStyles.parentNode) {
        jssStyles.parentNode.removeChild(jssStyles)
      }
    }

    render() {
      return (
        <MuiThemeProvider
          theme={this.pageContext.theme}
          sheetsManager={this.pageContext.sheetsManager}
        >
          <CssBaseline />
          <Fragment>
            <Header {...this.props} />
            <Navigation />
            <StyledBaseComponent {...this.props} />
          </Fragment>
        </MuiThemeProvider>
      )
    }
  }

  App.propTypes = {
    pageContext: PropTypes.object // eslint-disable-line
  }

  App.defaultProps = {
    pageContext: null
  }

  App.getInitialProps = ctx => {
    if (BaseComponent.getInitialProps) {
      return BaseComponent.getInitialProps(ctx)
    }

    return {}
  }

  return withStyles(styles)(App)
}

export default withLayout
