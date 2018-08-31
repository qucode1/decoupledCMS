import React, { Component } from "react"
import { withStyles } from "@material-ui/core/styles"
import { defaultRootStyling } from "../lib/SharedStyles"

import NewProjectForm from "./NewProjectForm"

import { serverURL } from "../variables"

const styles = theme => ({
  root: {
    ...defaultRootStyling(theme),
    [theme.breakpoints.up("md")]: {
      padding: `${theme.spacing.unit * 5}px`
    }
  }
})

class Project extends Component {
  state = {}
  async componentDidMount() {
    const {
      router: {
        query: { projectId }
      },
      user: { _id: userId },
      context: { setPageTitle }
    } = this.props

    const projectRes = await fetch(
      `${serverURL}/${userId}/projects/${projectId}/`
    ).then(res => res.json())

    const {
      data: { project: projectData },
      projectError
    } = projectRes

    setPageTitle(projectData.name)

    if (projectError) {
      this.setState({
        error: projectError
      })
    } else {
      this.setState({
        ...projectData
      })
    }
  }

  updateProject = async values => {
    const {
      user: { _id: userId },
      router: {
        query: { projectId }
      }
    } = this.props
    const {
      data: { project },
      error
    } = await fetch(`${serverURL}/${userId}/projects/${projectId}/update`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json"
      },
      body: JSON.stringify({
        ...values
      })
    }).then(res => res.json())
    !error && this.setState({ ...project })
  }

  render() {
    const {
      router: {
        query: { projectId }
      },
      classes
    } = this.props
    return (
      <div className={classes.root}>
        {this.state.name && (
          <NewProjectForm
            initialValues={{ newProjectName: this.state.name }}
            updateProject={this.updateProject}
          />
        )}
      </div>
    )
  }
}

export default withStyles(styles)(Project)
