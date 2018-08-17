/* eslint react/prefer-stateless-function: 0 */

import React from "react"
import PropTypes from "prop-types"
import Head from "next/head"

import withAuth from "../../lib/withAuth"
import withLayout from "../../lib/withLayout"

class Projects extends React.Component {
  static propTypes = {
    user: PropTypes.shape({
      email: PropTypes.string.isRequired
    })
  }

  static defaultProps = {
    user: null
  }

  render() {
    const { user } = this.props
    return (
      <div style={{ padding: "10px 45px" }}>
        <Head>
          <title>My Projects</title>
          <meta name="description" content="description for indexing bots" />
        </Head>
        <p> Projects </p>
        <p>Email: {user.email}</p>
      </div>
    )
  }
}

export default withAuth(withLayout(Projects))
