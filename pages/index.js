/* eslint react/prefer-stateless-function: 0 */

import React, { Fragment } from "react"
import PropTypes from "prop-types"
import Head from "next/head"
import Link from "next/link"
import { Form, Field } from "react-final-form"
import TextField from "../components/formElements/TextField"
import Button from "@material-ui/core/Button"
import red from "@material-ui/core/colors/red"
import DeleteIcon from "@material-ui/icons/Delete"
import AddIcon from "@material-ui/icons/Add"
import ClearIcon from "@material-ui/icons/Clear"
import Typography from "@material-ui/core/Typography"
import { withStyles } from "@material-ui/core/styles"

import withAuth from "../lib/withAuth"
import withLayout from "../lib/withLayout"

import { serverURL } from "../variables"

const deleteColor = red[500]

const validate = values => {
  const errors = {}
  if (!values.newProjectName) {
    errors.newProjectName = "Required"
  }
  return errors
}

const styles = theme => ({
  deleteBtn: {
    color: theme.palette.error.main,
    "&:hover": {
      backgroundColor: "#ffe7e7"
    }
  }
})

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
        name: values.newProjectName
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
    const { user, classes } = this.props
    const { projects, showNewProjectForm, newProjectName } = this.state
    return (
      <div style={{ padding: "10px 45px" }}>
        <Head>
          <title>Dashboard</title>
          <meta name="description" content="description for indexing bots" />
        </Head>
        <Typography variant="display1" style={{ margin: "16px 0" }}>
          Dashboard
        </Typography>
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
        {showNewProjectForm && (
          <Fragment>
            <Form
              onSubmit={this.addProject}
              initialValues={{ employed: true, stooge: "larry" }}
              validate={validate}
              render={({
                handleSubmit,
                form: { reset },
                submitting,
                pristine,
                values
              }) => (
                <form onSubmit={handleSubmit} style={{ margin: "16px 0" }}>
                  <div>
                    <Field
                      name="newProjectName"
                      component={TextField}
                      type="text"
                      label="New Project Name"
                    />
                  </div>
                  <div className="buttons" style={{ marginTop: "16px" }}>
                    <Button
                      type="submit"
                      color="primary"
                      variant="contained"
                      disabled={submitting || pristine}
                    >
                      Add Project
                    </Button>
                    <Button
                      type="button"
                      color="secondary"
                      onClick={reset}
                      disabled={submitting || pristine}
                    >
                      Reset
                    </Button>
                  </div>
                </form>
              )}
            />
          </Fragment>
        )}
        <hr />
        {projects.length > 0 &&
          projects.map(project => (
            <div key={project._id}>
              <Link href={`/projects/${project._id}`}>
                <a style={{ marginRight: "8px" }}>{project.name}</a>
              </Link>
              <Button
                className={classes.deleteBtn}
                onClick={() => this.deleteProject(project._id)}
                variant="flat"
                size="small"
              >
                <DeleteIcon />
                Delete
              </Button>
            </div>
          ))}
      </div>
    )
  }
}

export default withAuth(withLayout(withStyles(styles)(Index)))
