/* eslint react/prefer-stateless-function: 0 */

import React, { Fragment } from "react"
import PropTypes from "prop-types"
import Head from "next/head"
import { withRouter } from "next/router"
import fetch from "isomorphic-unfetch"

import withAuth from "../../lib/withAuth"
import withLayout from "../../lib/withLayout"
import NewModelForm from "../../components/NewModelForm"

import { serverURL } from "../../variables"

class Projects extends React.Component {
  state = {
    models: [],
    newModelName: "",
    newModelFields: [],
    newModelOptions: {},
    showNewModelForm: false
  }
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
  componentDidMount() {
    this.setState({
      models: this.props.project.project.models
    })
  }
  handleInputChange = e =>
    this.setState({
      [e.target.name]: e.target.value
    })
  toggleNewModelForm = () =>
    this.setState({ showNewModelForm: !this.state.showNewModelForm })
  addModel = async ({ newModelName, newModelFields, newModelOptions }) => {
    const {
      data: { model: newModel },
      error
    } = await fetch(
      `${serverURL}/${this.props.user._id}/projects/${
        this.props.project.project._id
      }/models/add`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json"
          // "Content-Type": "application/x-www-form-urlencoded"
        },
        body: JSON.stringify({
          name: newModelName,
          fields: newModelFields,
          options: newModelOptions
        })
      }
    ).then(res => res.json())

    !error &&
      this.setState(prevState => ({
        models: [...prevState.models, newModel]
      }))
  }
  render() {
    const {
      user,
      project: { project },
      error
    } = this.props
    const {
      newModelName,
      showNewModelForm,
      newModelFields,
      newModelOptions
    } = this.state
    if (error) return <h2>Error</h2>
    return (
      <div style={{ padding: "10px 45px" }}>
        <Head>
          <title>{project.name}</title>
          <meta name="description" content="description for indexing bots" />
        </Head>
        <p>{project.name} </p>
        <hr />
        <h3>{project.name} - Models</h3>
        <button onClick={this.toggleNewModelForm}>
          {showNewModelForm ? "Abandon Model" : "New Model"}
        </button>
        {showNewModelForm && <NewModelForm addModel={this.addModel} />}
        {project.models.length > 0 &&
          project.models.map((model, index) => (
            <div key={model.model._id}>
              <Link href={`/projects/${project._id}/models/${model._id}`}>
                <a>{project.model.name}</a>
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

export default withAuth(withLayout(withRouter(Projects)))
