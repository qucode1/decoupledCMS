import React, { Component } from "react";
import { Form, Field } from "react-final-form";
import Card from "@material-ui/core/Card";
import TextField from "../components/formElements/TextField";
import Button from "@material-ui/core/Button";
import DeleteIcon from "@material-ui/icons/Delete";
import { withStyles } from "@material-ui/core/styles";

import Tooltip from "./Tooltip";

const styles = theme => ({
  root: { padding: "8px" },
  form: {
    margin: "16px 0",
    display: "flex",
    flexDirection: "column"
  },
  originControls: {
    display: "flex"
  },
  originList: {
    listStyleType: "none"
  },
  origin: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between"
  },
  deleteBtn: {
    color: theme.palette.error.main,
    alignSelf: "center",
    "&:hover": {
      backgroundColor: "#ffe7e7"
    }
  },
  formElement: {
    margin: "20px 0",
    "&:first-of-type": {
      margin: "0"
    },
    display: "flex",
    alignItems: "center"
  },
  formControls: { marginTop: "16px" }
});

class NewProjectForm extends Component {
  state = {
    validOrigins: [],
    newValidOrigins: [],
    removedValidOrigins: [],
    showTooltip: false,
    tooltipPosition: [0, 0],
    currentApiKey: "",
    tooltipTimeout: null,
    timeoutTimer: 300
  };
  addOrigin = origin => {
    this.setState(({ newValidOrigins }) => ({
      newValidOrigins: [...newValidOrigins, origin]
    }));
  };
  removeOrigin = obsolete => {
    if (typeof obsolete === "string") {
      this.setState(({ newValidOrigins }) => ({
        newValidOrigins: newValidOrigins.filter(o => o !== obsolete)
      }));
    } else {
      this.setState(({ validOrigins, removedValidOrigins }) => ({
        validOrigins: validOrigins.filter(o => o.name !== obsolete.name),
        removedValidOrigins: [...removedValidOrigins, obsolete._id]
      }));
    }
  };
  validate = values => {
    const errors = {};
    if (!values.newProjectName) {
      errors.newProjectName = "Required";
    }
    return errors;
  };
  submitProject = values => {
    const { addProject, updateProject } = this.props;
    const { validOrigins, newValidOrigins, removedValidOrigins } = this.state;
    const submit = addProject || updateProject;
    return submit({
      name: values.newProjectName,
      validOrigins,
      newValidOrigins,
      removedValidOrigins
    });
  };
  customReset = reset => {
    const {
      initialValues: { newProjectValidOrigins: validOrigins = [] }
    } = this.props;
    this.setState({
      validOrigins,
      removedValidOrigins: [],
      newValidOrigins: []
    });
    reset();
  };
  handleCopyClick = apiKey => {
    navigator.permissions.query({ name: "clipboard-write" }).then(result => {
      if (result.state == "granted" || result.state == "prompt") {
        /* write to the clipboard now */
        navigator.clipboard.writeText(apiKey).then(
          function() {
            /* clipboard successfully set */
          },
          function() {
            /* clipboard write failed */
            console.log("copy failure");
          }
        );
      }
    });
  };

  handleMouseEnter = (e, currentApiKey) => {
    this.setState({
      showTooltip: true,
      tooltipPosition: [e.clientX, e.clientY],
      currentApiKey
    });
    clearTimeout(this.state.tooltipTimeout);
  };

  handleMouseLeave = () => {
    const tooltipTimeout = setTimeout(() => {
      this.setState({ showTooltip: false, currentApiKey: "" });
    }, this.state.timeoutTimer);
    this.setState({
      tooltipTimeout
    });
  };

  componentDidMount() {
    const {
      initialValues: { newProjectValidOrigins: validOrigins = [] } = {}
    } = this.props;
    this.setState({ validOrigins });
  }
  render() {
    const { updateProject, initialValues, classes } = this.props;
    const {
      validOrigins,
      newValidOrigins,
      removedValidOrigins,
      currentApiKey,
      tooltipPosition
    } = this.state;
    return (
      <Card className={classes.root}>
        <Form
          onSubmit={this.submitProject}
          initialValues={{ employed: true, stooge: "larry" }}
          validate={this.validate}
          initialValues={initialValues}
          render={({
            handleSubmit,
            form: { reset },
            submitting,
            pristine,
            values
          }) => (
            <form
              onSubmit={val => {
                handleSubmit(val).then(() => this.customReset(reset));
              }}
              className={classes.form}
            >
              <Field
                name="newProjectName"
                component={TextField}
                type="text"
                label="New Project Name"
                autoFocus
              />
              <div className={classes.formElement}>
                <div className={classes.originControls}>
                  <Field
                    name="newProjectOrigin"
                    component={TextField}
                    type="text"
                    label="New Project Origin"
                    autoFocus
                  />
                  <Button
                    color="primary"
                    size="small" // disabled={pristine || invalid || disabled}
                    onClick={() => {
                      this.addOrigin(values.newProjectOrigin);
                    }}
                  >
                    Add Origin
                  </Button>
                </div>
              </div>

              <div className={classes.formElement}>
                <div>
                  {validOrigins.length ? (
                    <ul className={classes.originList}>
                      {[...this.state.validOrigins].map((origin, index) => {
                        const { name, apiKey } = origin;
                        return (
                          <div
                            key={`origin-${index}`}
                            className={classes.origin}
                          >
                            <li>{name}</li>
                            <Button
                              size="small"
                              color="primary"
                              className={classes.tooltipElement}
                              onClick={() => this.handleCopyClick(apiKey)}
                              onMouseEnter={e =>
                                this.handleMouseEnter(e, apiKey)
                              }
                              onMouseLeave={this.handleMouseLeave}
                            >
                              Copy API Key
                            </Button>
                            <Button
                              size="small"
                              className={classes.deleteBtn}
                              onClick={() => this.removeOrigin(origin)}
                            >
                              <DeleteIcon />
                            </Button>
                          </div>
                        );
                      })}
                    </ul>
                  ) : null}
                  {newValidOrigins.length ? (
                    <ul className={classes.originList}>
                      {[...this.state.newValidOrigins].map((name, index) => {
                        return (
                          <div
                            key={`newOrigin-${index}`}
                            className={classes.origin}
                          >
                            <li>{name}</li>
                            <Button
                              size="small"
                              className={classes.deleteBtn}
                              onClick={() => this.removeOrigin(name)}
                            >
                              <DeleteIcon />
                            </Button>
                          </div>
                        );
                      })}
                    </ul>
                  ) : null}
                </div>
              </div>
              <div className={`${classes.formControls} ${classes.formElement}`}>
                <Button
                  type="submit"
                  color="primary"
                  variant="contained"
                  disabled={submitting || pristine}
                >
                  {updateProject ? "Edit Project" : "Add Project"}
                </Button>
                <Button
                  type="button"
                  color="secondary"
                  onClick={() => this.customReset(reset)}
                  disabled={
                    submitting ||
                    (pristine &&
                      !newValidOrigins.length &&
                      !removedValidOrigins.length)
                  }
                >
                  Reset
                </Button>
              </div>
            </form>
          )}
        />
        {this.state.showTooltip && (
          <Tooltip position={tooltipPosition} message={currentApiKey} />
        )}
      </Card>
    );
  }
}

export default withStyles(styles)(NewProjectForm);
