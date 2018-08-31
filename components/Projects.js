import React, { Component, Fragment } from "react"
import PropTypes from "prop-types"
import Button from "@material-ui/core/Button"
import AddIcon from "@material-ui/icons/Add"
import ClearIcon from "@material-ui/icons/Clear"
import Typography from "@material-ui/core/Typography"
import { withStyles } from "@material-ui/core/styles"
import { defaultRootStyling } from "../lib/SharedStyles"
import { serverURL } from "../variables"

import NewProjectForm from "../components/NewProjectForm"
import CustomList from "../components/CustomList"

const styles = theme => ({
  root: defaultRootStyling(theme),
  deleteBtn: {
    color: theme.palette.error.main,
    "&:hover": {
      backgroundColor: "#ffe7e7"
    }
  }
})

class Projects extends Component {
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
    this.setState({ projects })
  }
  handleInputChange = e =>
    this.setState({
      [e.target.name]: e.target.value
    })
  toggleNewProjectForm = () =>
    this.setState({ showNewProjectForm: !this.state.showNewProjectForm })
  addProject = async values => {
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
        name: values.name
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
    ).then(res => res.json())
    !error &&
      this.setState(prevState => ({
        projects: prevState.projects.filter(project => project._id !== id)
      }))
  }
  render() {
    const { user, classes } = this.props
    const { projects, showNewProjectForm, newProjectName } = this.state
    return (
      <div className={classes.root}>
        <div style={{ display: "flex", alignItems: "center" }}>
          <Typography variant="headline" style={{ margin: "8px" }}>
            My Projects ({projects.length})
          </Typography>
          <Button
            onClick={this.toggleNewProjectForm}
            size="medium"
            color="primary"
          >
            {showNewProjectForm ? (
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
        {showNewProjectForm && <NewProjectForm addProject={this.addProject} />}
        {projects.length > 0 && (
          <CustomList
            items={projects}
            baseURL={`/projects`}
            deleteItem={this.deleteProject}
            edit
          />
        )}
      </div>
    )
  }
}

export default withStyles(styles)(Projects)
