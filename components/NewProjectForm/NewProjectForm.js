import React, { Component } from "react";
import { Form, Field } from "react-final-form";
import Card from "@material-ui/core/Card";
import Button from "@material-ui/core/Button";
import DeleteIcon from "@material-ui/icons/Delete";
import { withStyles } from "@material-ui/core/styles";

import styles from "./styles";

import TextField from "../formElements/TextField";

import CopyBtn from "../CopyBtn/CopyBtn";

class NewProjectForm extends Component {
  state = {
    validOrigins: [],
    newValidOrigins: [],
    removedValidOrigins: []
  };
  addOrigin = origin => {
    if (origin && origin.length) {
      this.setState(({ newValidOrigins }) => ({
        newValidOrigins: [...newValidOrigins, origin]
      }));
    }
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
      initialValues: { newProjectValidOrigins: validOrigins = [] } = {}
    } = this.props;
    this.setState({
      validOrigins,
      removedValidOrigins: [],
      newValidOrigins: []
    });
    reset();
  };

  componentDidMount() {
    const {
      initialValues: { newProjectValidOrigins: validOrigins = [] } = {}
    } = this.props;
    this.setState({ validOrigins });
  }
  render() {
    const { updateProject, initialValues, classes } = this.props;
    const { validOrigins, newValidOrigins, removedValidOrigins } = this.state;
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
                    size="small"
                    disabled={
                      pristine ||
                      !values.newProjectOrigin ||
                      !values.newProjectOrigin.length
                    }
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
                            <CopyBtn text="Copy API Key" copyInput={apiKey} />
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
      </Card>
    );
  }
}

export default withStyles(styles)(NewProjectForm);
