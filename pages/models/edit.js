/* eslint react/prefer-stateless-function: 0 */

import React from "react";
import { withRouter } from "next/router";

import withAuth from "../../lib/withAuth";
import withLayout from "../../lib/withLayout";
import { withContext } from "../../lib/AppContext";

import Model from "../../components/Model/Model";

class ModelIndex extends React.Component {
  render() {
    return <Model {...this.props} />;
  }
}

export default withAuth(withLayout(withRouter(withContext(ModelIndex))));
