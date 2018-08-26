import React, { Component, Fragment } from "react"
import PropTypes from "prop-types"
import Head from "next/head"
import Button from "@material-ui/core/Button"
import Typography from "@material-ui/core/Typography"
import AddIcon from "@material-ui/icons/Add"
import ClearIcon from "@material-ui/icons/Clear"
import { withStyles } from "@material-ui/core/styles"

import NewModelForm from "./NewModelForm"
import CustomList from "./CustomList"

import { serverURL } from "../variables"

const styles = theme => ({})

class Models extends Component {
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

  // static getInitialProps = async ({ req }) => {
  //   const { data: project, error } = await fetch(
  //     `${serverURL}/${req.user._id}/projects/${req.params.projectId}`,
  //     {
  //       headers: {
  //         cookie: req.headers.cookie
  //       }
  //     }
  //   ).then(res => res.json())
  //   return { project: { ...project }, error }
  // }
  async componentDidMount() {
    const {
      router: {
        query: { projectId }
      },
      user: { _id: userId }
    } = this.props
    const {
      data: { project },
      error
    } = await fetch(`${serverURL}/${userId}/projects/${projectId}`).then(res =>
      res.json()
    )
    const {
      context: { setPageTitle }
    } = this.props
    setPageTitle(project.name)
    localStorage.setItem(`project-${projectId}`, JSON.stringify(project))
    this.setState({
      project,
      error,
      models: project.models
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
        this.state.project._id
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
    const {
      router: {
        query: { projectId }
      },
      user: { _id: userId }
    } = this.props
    const { data, error } = await fetch(
      `${serverURL}/${userId}/projects/${projectId}/models/${targetId}/delete`,
      {
        method: "DELETE"
      }
    ).then(res => res.json())
    !error &&
      this.setState(prevState => ({
        models: prevState.models.filter(model => model._id !== targetId)
      }))
  }
  render() {
    const { user, classes } = this.props
    const { showNewModelForm, project = {}, error, models } = this.state
    if (error) return <h2>Error</h2>
    return (
      <div style={{ padding: "10px" }}>
        <div style={{ display: "flex", alignItems: "center" }}>
          <Typography variant="headline" style={{ margin: "8px 8px 8px 0" }}>
            Models ({models.length})
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
        {models.length > 0 && (
          <CustomList
            items={models}
            baseURL={`/projects/${project._id}/models`}
            deleteItem={this.deleteModel}
          />
        )}
      </div>
    )
  }
}

export default withStyles(styles)(Models)
