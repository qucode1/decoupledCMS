import React, { Component } from "react"
import { withStyles } from "@material-ui/core/styles"
import { defaultRootStyling } from "../lib/SharedStyles"
import { cleanName } from "../lib/helpers"

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
        ...projectData,
        name: cleanName(projectData.name)
      })
    }
  }

  updateProject = async values => {
    try {
      const {
        user: { _id: userId },
        router: {
          query: { projectId }
        },
        context: {setPageTitle}
      } = this.props
      const {
        data: { project },
        error
      } = await fetch(`${serverURL}/${userId}/projects/${projectId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json"
        },
        body: JSON.stringify({
          ...values,
          name: `${values.name} -- ${projectId}`
        })
      }).then(res => res.json())
      if(!error) {
        this.setState({ ...project, name: cleanName(project.name) })
        setPageTitle(project.name)
      }
    } catch(err) {
      console.error(`updateProject error: ${err}`)
    }
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
