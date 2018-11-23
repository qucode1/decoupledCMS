/* eslint react/prefer-stateless-function: 0 */

import React, { Fragment } from "react";
import Head from "next/head";

import { withStyles } from "@material-ui/core/styles";

import withAuth from "../lib/withAuth";
import withLayout from "../lib/withLayout";
import { withContext } from "../lib/AppContext";

import Projects from "../components/Projects/Projects";

const styles = theme => ({});

class Index extends React.Component {
  componentDidMount() {
    const {
      context: { setPageTitle }
    } = this.props;
    setPageTitle("Dashboard");
  }
  render() {
    const { user } = this.props;

    return (
      <Fragment>
        <Projects user={user} />
      </Fragment>
    );
  }
}

export default withAuth(withLayout(withStyles(styles)(withContext(Index))));
