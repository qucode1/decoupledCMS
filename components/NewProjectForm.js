import React, { Component } from "react"
import { Form, Field } from "react-final-form"
import Card from "@material-ui/core/Card"
import TextField from "../components/formElements/TextField"
import Button from "@material-ui/core/Button"

class NewProjectForm extends Component {
  validate = values => {
    const errors = {}
    if (!values.newProjectName) {
      errors.newProjectName = "Required"
    }
    return errors
  }
  render() {
    const { addProject } = this.props
    return (
      <Card style={{ padding: "8px" }}>
        <Form
          onSubmit={addProject}
          initialValues={{ employed: true, stooge: "larry" }}
          validate={this.validate}
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
      </Card>
    )
  }
}

export default NewProjectForm
