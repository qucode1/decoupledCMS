/* eslint react/prefer-stateless-function: 0 */

import React from "react";
import { withRouter } from "next/router";

import withAuth from "../../lib/withAuth";
import withLayout from "../../lib/withLayout";
import { withContext } from "../../lib/AppContext";

import Project from "../../components/Project/Project";

class ProjectIndex extends React.Component {
  render() {
    return <Project {...this.props} />;
  }
}

export default withAuth(withLayout(withRouter(withContext(ProjectIndex))));
