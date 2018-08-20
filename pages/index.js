/* eslint react/prefer-stateless-function: 0 */

import React, { Fragment } from "react"
import PropTypes from "prop-types"
import Head from "next/head"
import Link from "next/link"

import withAuth from "../lib/withAuth"
import withLayout from "../lib/withLayout"

import { serverURL } from "../variables"

class Index extends React.Component {
  state = {
    projects: [],
    newProjectName: "",
    showNewProjectForm: false
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
    } = await fetch(`${serverURL}/${this.props.user._id}/projects`).then(res =>
      res.json()
    )
    // const models = await fetch(
    //   `${serverURL}/${
    //     this.props.user._id
    //   }/projects/5b7404035d7e042af89d09e9/models`
    // ).then(res => res.json())
    // const documents = await fetch(
    //   `${serverURL}/${
    //     this.props.user._id
    //   }/projects/5b7404035d7e042af89d09e9/models/5b7421f8a22787471ca6aa4a/documents`
    // ).then(res => res.json())
    this.setState({ projects })
  }
  handleInputChange = e =>
    this.setState({
      [e.target.name]: e.target.value
    })
  toggleNewProjectForm = () =>
    this.setState({ showNewProjectForm: !this.state.showNewProjectForm })
  addProject = async () => {
    const {
      data: { project: newProject },
      error
    } = await fetch(`${serverURL}/${this.props.user._id}/projects/add`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json"
        // "Content-Type": "application/x-www-form-urlencoded"
      },
      body: JSON.stringify({
        name: this.state.newProjectName
      })
    }).then(res => res.json())

    !error &&
      this.setState(prevState => ({
        projects: [...prevState.projects, newProject]
      }))
  }
  deleteProject = async id => {
    const { error, data } = await fetch(
      `${serverURL}/${this.props.user._id}/projects/${id}/delete`,
      {
        method: "DELETE"
      }
    )
    !error &&
      this.setState(prevState => ({
        projects: prevState.projects.filter(project => project._id !== id)
      }))
  }
  render() {
    const { user } = this.props
    const { projects, showNewProjectForm, newProjectName } = this.state
    return (
      <div style={{ padding: "10px 45px" }}>
        <Head>
          <title>Dashboard</title>
          <meta name="description" content="description for indexing bots" />
        </Head>
        <p> Dashboard </p>
        <p>Email: {user.email}</p>
        <h3>My Projects</h3>
        <button onClick={this.toggleNewProjectForm}>New</button>
        {showNewProjectForm && (
          <Fragment>
            <input
              type="text"
              name="newProjectName"
              onChange={this.handleInputChange}
              value={newProjectName}
              placeholder="Example Project"
            />
            <button onClick={this.addProject}>Create Project</button>
          </Fragment>
        )}
        <hr />
        {projects.length > 0 &&
          projects.map(project => (
            <div key={project._id}>
              <Link href={`/projects/${project._id}`}>
                <a>{project.name}</a>
              </Link>
              <button onClick={() => this.deleteProject(project._id)}>
                Delete
              </button>
            </div>
          ))}
      </div>
    )
  }
}

export default withAuth(withLayout(Index))
