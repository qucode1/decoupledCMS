/* eslint react/prefer-stateless-function: 0 */

import React from "react"
import { withRouter } from "next/router"

import withAuth from "../../lib/withAuth"
import withLayout from "../../lib/withLayout"
import { withContext } from "../../lib/AppContext"

import Documents from "../../components/Documents"

class ModelIndex extends React.Component {
  render() {
    return <Documents {...this.props} />
  }
}

export default withAuth(withLayout(withRouter(withContext(ModelIndex))))
