/* eslint react/prefer-stateless-function: 0 */

import React, { Fragment } from "react";
import Head from "next/head";

import { withStyles, WithStyles } from "@material-ui/core/styles";

import withAuth from "../lib/withAuth";
import withLayout from "../lib/withLayout";
import { withContext } from "../lib/AppContext";

import Projects from "../components/Projects/Projects";

const styles = theme => ({});

interface Props extends WithStyles<typeof styles> {
  context: {
    setPageTitle: (title: string) => void
  },
  user: object
}

class Index extends React.Component<Props, {}> {
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
