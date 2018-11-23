/* eslint react/prefer-stateless-function: 0 */

import React from "react";
import { withRouter } from "next/router";
import { withStyles } from "@material-ui/core/styles";

import withAuth from "../../lib/withAuth";
import withLayout from "../../lib/withLayout";
import { withContext } from "../../lib/AppContext";

import Models from "../../components/Models/Models";

class ProjectIndex extends React.Component {
  render() {
    return <Models {...this.props} />;
  }
}

export default withAuth(withLayout(withRouter(withContext(ProjectIndex))));
