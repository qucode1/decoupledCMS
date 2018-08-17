/* eslint react/prefer-stateless-function: 0 */

import React from "react"
import PropTypes from "prop-types"
import Head from "next/head"
import { withRouter } from "next/router"
import fetch from "isomorphic-unfetch"

import withAuth from "../../lib/withAuth"
import withLayout from "../../lib/withLayout"

import { serverURL } from "../../variables"

class Projects extends React.Component {
  state = { project: {} }
  static propTypes = {
    user: PropTypes.shape({
      email: PropTypes.string.isRequired
    })
  }

  static defaultProps = {
    user: null
  }

  static getInitialProps = async ({ req }) => {
    const { data: project, error } = await fetch(
      `${serverURL}/${req.user._id}/projects/${req.params.projectId}`,
      {
        headers: {
          cookie: req.headers.cookie
        }
      }
    ).then(res => res.json())
    return { project: { ...project }, error }
  }

  render() {
    const {
      user,
      project: { project },
      error
    } = this.props
    if (error) return <h2>Error</h2>
    return (
      <div style={{ padding: "10px 45px" }}>
        <Head>
          <title>{project.name}</title>
          <meta name="description" content="description for indexing bots" />
        </Head>
        <p>{project.name} </p>
        <p>Email: {user.email}</p>
      </div>
    )
  }
}

export default withAuth(withLayout(withRouter(Projects)))
