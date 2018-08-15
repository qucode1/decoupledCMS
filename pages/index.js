/* eslint react/prefer-stateless-function: 0 */

import React from "react"
import PropTypes from "prop-types"
import Head from "next/head"

import withAuth from "../lib/withAuth"
import withLayout from "../lib/withLayout"

class Index extends React.Component {
  state = {
    projects: []
  }
  static propTypes = {
    user: PropTypes.shape({
      email: PropTypes.string.isRequired
    })
  }

  static defaultProps = {
    user: null
  }
  async componentDidMount() {
    const {
      data: { projects }
    } = await fetch(
      `http://localhost:8000/user/${this.props.user._id}/projects`
    ).then(res => res.json())
    // const models = await fetch(
    //   `http://localhost:8000/user/${
    //     this.props.user._id
    //   }/projects/5b7404035d7e042af89d09e9/models`
    // ).then(res => res.json())
    // const documents = await fetch(
    //   `http://localhost:8000/user/${
    //     this.props.user._id
    //   }/projects/5b7404035d7e042af89d09e9/models/5b7421f8a22787471ca6aa4a/documents`
    // ).then(res => res.json())
    this.setState({ projects })
  }

  render() {
    const { user } = this.props
    const { projects } = this.state
    return (
      <div style={{ padding: "10px 45px" }}>
        <Head>
          <title>Dashboard</title>
          <meta name="description" content="description for indexing bots" />
        </Head>
        <p> Dashboard </p>
        <p>Email: {user.email}</p>
        <h3>My Projects</h3>
        <hr />
        {projects.length &&
          projects.map(project => (
            <div key={project._id}>
              <h4>{project.name}</h4>
            </div>
          ))}
      </div>
    )
  }
}

export default withAuth(withLayout(Index))
