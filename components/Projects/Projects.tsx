import React, { Component, Fragment } from "react";
import PropTypes from "prop-types";
import Button from "@material-ui/core/Button";
import AddIcon from "@material-ui/icons/Add";
import ClearIcon from "@material-ui/icons/Clear";
import Typography from "@material-ui/core/Typography";
import {
  withStyles,
  WithStyles,
  createStyles,
  Theme
} from "@material-ui/core/styles";
import { withContext } from "../../lib/AppContext";

import { defaultRootStyling } from "../../lib/SharedStyles";
import { serverURL } from "../../variables";

import NewProjectForm from "../NewProjectForm/NewProjectForm";
import CustomList from "../CustomList/CustomList";

const styles = (theme: Theme) =>
  createStyles({
    root: defaultRootStyling(theme)
  });

interface Props extends WithStyles<typeof styles> {
  user: {
    _id: string;
    avatarUrl: string;
    displayName: string;
    email: string;
    isAdmin: boolean;
    isGithubConnected: boolean;
  };
}

interface State {
  projects: Array<any>;
  newProjectName: string;
  showNewProjectForm: boolean;
}

class Projects extends Component<Props, State> {
  state = {
    projects: [],
    newProjectName: "",
    showNewProjectForm: false
  };
  static propTypes = {
    user: PropTypes.shape({
      email: PropTypes.string.isRequired
    })
  };
  static defaultProps = {
    user: null
  };
  async componentDidMount() {
    const {
      data: { projects }
    } = await fetch(`${serverURL}/${this.props.user._id}/projects`).then(res =>
      res.json()
    );
    this.setState({ projects });
  }
  toggleNewProjectForm = () =>
    this.setState({ showNewProjectForm: !this.state.showNewProjectForm });
  addProject = async values => {
    const { name, validOrigins, newValidOrigins, removedValidOrigins } = values;
    const {
      data: { project: newProject },
      error
    } = await fetch(`${serverURL}/${this.props.user._id}/projects`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json"
        // "Content-Type": "application/x-www-form-urlencoded"
      },
      body: JSON.stringify({
        name,
        validOrigins,
        newValidOrigins,
        removedValidOrigins
      })
    }).then(res => res.json());

    !error &&
      this.setState(prevState => ({
        projects: [...prevState.projects, newProject]
      }));
  };
  deleteProject = async id => {
    const { error, data } = await fetch(
      `${serverURL}/${this.props.user._id}/projects/${id}`,
      {
        method: "DELETE"
      }
    ).then(res => res.json());
    !error &&
      this.setState(prevState => ({
        projects: prevState.projects.filter(project => project._id !== id)
      }));
  };
  render() {
    const { user, classes } = this.props;
    const { projects, showNewProjectForm, newProjectName } = this.state;
    return (
      <div className={classes.root}>
        <div style={{ display: "flex", alignItems: "center" }}>
          <Typography variant="h5" style={{ margin: "8px" }}>
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
            itemName="project"
            baseURL={`/projects`}
            deleteItem={this.deleteProject}
            edit
          />
        )}
      </div>
    );
  }
}

// const Test: React.FunctionComponent = (props: any) => (
//   <div>
//     <Projects {...props} />
//   </div>
// );

export default withStyles(styles)(Projects);
