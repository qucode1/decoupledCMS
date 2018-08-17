import React, { Fragment } from "react"
import PropTypes from "prop-types"
import NProgress from "nprogress"
import { withStyles } from "@material-ui/core/styles"

import Header from "../components/Header"
import Navigation from "../components/Navigation"

function withLayout(BaseComponent) {
  const styles = theme => ({
    root: {
      [theme.breakpoints.up("md")]: {
        marginLeft: theme.spacing.drawerWidth
      }
    }
  })

  class Layout extends React.Component {
    constructor(props, context) {
      super(props, context)
    }

    render() {
      return (
        <Fragment>
          <Header {...this.props} />
          <Navigation {...this.props} />
          <div className={this.props.classes.root}>
            <BaseComponent {...this.props} />
          </div>
        </Fragment>
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
