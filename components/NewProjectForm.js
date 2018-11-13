import React, { Component } from "react";
import { Form, Field } from "react-final-form";
import Card from "@material-ui/core/Card";
import TextField from "../components/formElements/TextField";
import Button from "@material-ui/core/Button";

class NewProjectForm extends Component {
  state = {
    validOrigins: new Set()
  };
  addOrigin = origin => {
    this.setState(({ validOrigins }) => ({
      validOrigins: validOrigins.add(origin)
    }));
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
    const submit = addProject || updateProject;
    return submit({
      name: values.newProjectName,
      validOrigins: this.state.validOrigins
    });
  };
  customReset = reset => {
    this.setState({
      validOrigins: new Set()
    });
    reset();
  };
  render() {
    const { updateProject, initialValues } = this.props;
    return (
      <Card style={{ padding: "8px" }}>
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
              style={{ margin: "16px 0" }}
            >
              <div style={{ display: "flex", flexDirection: "column" }}>
                <Field
                  name="newProjectName"
                  component={TextField}
                  type="text"
                  label="New Project Name"
                  autoFocus
                />
                <div
                  className="originControls"
                  style={{
                    display: "flex"
                  }}
                >
                  <Field
                    name="newProjectOrigin"
                    component={TextField}
                    type="text"
                    label="New Project Origin"
                    autoFocus
                  />
                  <button
                    type="button"
                    onClick={() => this.addOrigin(values.newProjectOrigin)}
                  >
                    Add Origin
                  </button>
                </div>
                <ul
                  className="originList"
                  style={{
                    listStyleType: "none"
                  }}
                >
                  {[...this.state.validOrigins].map((origin, index) => (
                    <li key={`origin-${index}`}>{origin}</li>
                  ))}
                </ul>
              </div>
              <div className="buttons" style={{ marginTop: "16px" }}>
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
                  disabled={submitting || pristine}
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

export default NewProjectForm;
