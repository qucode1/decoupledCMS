/* eslint react/prefer-stateless-function: 0 */

import React, { Fragment } from "react"
import PropTypes from "prop-types"
import Head from "next/head"
import { withRouter } from "next/router"
import Link from "next/link"
import fetch from "isomorphic-unfetch"
import Button from "@material-ui/core/Button"
import Typography from "@material-ui/core/Typography"
import AddIcon from "@material-ui/icons/Add"
import ClearIcon from "@material-ui/icons/Clear"
import DeleteIcon from "@material-ui/icons/Delete"

import withAuth from "../../lib/withAuth"
import withLayout from "../../lib/withLayout"
import NewModelForm from "../../components/NewModelForm"

import { serverURL } from "../../variables"

class Projects extends React.Component {
  state = {
    models: [],
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
  deleteModel = async targetId => {
    console.log(`deleteModel ${targetId}`)
  }
  render() {
    const {
      user,
      project: { project },
      error
    } = this.props
    const { showNewModelForm } = this.state
    if (error) return <h2>Error</h2>
    return (
      <div style={{ padding: "10px" }}>
        <Head>
          <title>{project.name}</title>
          <meta name="description" content="description for indexing bots" />
        </Head>
        <Typography variant="display1" style={{ margin: "16px 0" }}>
          {project.name}
        </Typography>
        <div style={{ display: "flex", alignItems: "center" }}>
          <Typography variant="headline" style={{ margin: "8px 8px 8px 0" }}>
            Models ({project.models.length})
          </Typography>
          <Button
            onClick={this.toggleNewModelForm}
            color="primary"
            size="small"
          >
            {showNewModelForm ? (
              <Fragment>
                <ClearIcon />
                Discard
              </Fragment>
            ) : (
              <Fragment>
                <AddIcon />
                New
              </Fragment>
            )}
          </Button>
        </div>
        {showNewModelForm && <NewModelForm addModel={this.addModel} />}
        <hr />
        {project.models.length > 0 &&
          project.models.map((model, index) => (
            <div key={model._id}>
              <Link href={`/projects/${project._id}/models/${model._id}`}>
                <a>{model.name}</a>
              </Link>
              <Button
                color="secondary"
                size="small"
                onClick={() => this.deleteModel(model._id)}
              >
                <DeleteIcon />
                Delete Model
              </Button>
            </div>
          ))}
      </div>
    )
  }
}

export default withAuth(withLayout(withRouter(Projects)))
