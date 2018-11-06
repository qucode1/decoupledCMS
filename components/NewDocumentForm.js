import React, { Component } from "react"
import { Form, Field } from "react-final-form"
import Card from "@material-ui/core/Card"
import TextField from "../components/formElements/TextField"
import Checkbox from "../components/formElements/Checkbox"
import Radio from "../components/formElements/Radio"
import Button from "@material-ui/core/Button"

class NewDocumentForm extends Component {
  state = {}

  validate = values => {
    const errors = {}
    // if (!values.newDocumentName) {
    //   errors.newProjectName = "Required"
    // }
    return errors
  }

  changeTextInputType = e => {
    this.setState({
      [e.target.name]: !!!this.state[e.target.name]
    })
  }

  required = value => (value ? undefined : "Required")

  composeValidators = (...validators) => value => {
    validators.reduce(
      (error, validator) => error || validator(value),
      undefined
    )
  }

  getType = fieldType => {
    const table = {
      String: "text",
      Date: "date",
      Number: "number",
      checkbox: "checkbox"
    }
    return table[fieldType]
  }

  capitalize = str => `${str[0].toUpperCase()}${str.slice(1)}`

  render() {
    const { addDocument, updateDocument, fields, initialValues } = this.props
    return (

      <Card style={{ padding: "8px" }}>
        <Form
          onSubmit={addDocument || updateDocument}
          validate={this.validate}
          initialValues={initialValues}
          render={({
            handleSubmit,
            form: { reset },
            submitting,
            pristine,
            values,
            invalid
          }) => (
            <form onSubmit={(val) => handleSubmit(val).then(reset)} style={{ margin: "16px 0" }}>
              {fields
                .filter(
                  ([name]) => !["owner", "project", "model"].includes(name)
                )
                .map(([fieldName, fieldType, fieldOptions], index) => (
                  <div key={`field-${index}`} style={{ marginBottom: "16px" }}>
                    <div
                      style={{
                        display:
                          fieldType === "String" ? "flex" : "inline-block",
                        alignItems: "center",
                        justifyContent: "flex-start",
                        flexWrap: "wrap"
                      }}
                    >
                      <label
                        htmlFor={fieldName}
                        style={{ marginRight: "16px" }}
                      >{`${this.capitalize(fieldName)}`}</label>
                      {fieldType === "String" && (
                        <div>
                          <Checkbox
                            input={{
                              name: `${fieldName}Multiline`,
                              checked: !!this.state[`${fieldName}Multiline`],
                              onChange: this.changeTextInputType
                            }}
                          />
                          <label>Multiline</label>
                        </div>
                      )}
                    </div>
                    <Field
                      component={fieldType === "Boolean" ? Checkbox : TextField}
                      multiline={
                        fieldType === "String" &&
                        this.state[`${fieldName}Multiline`]
                          ? "true"
                          : "false"
                      }
                      style={{
                        width:
                          fieldType === "String" &&
                          this.state[`${fieldName}Multiline`]
                            ? "100%"
                            : "auto"
                      }}
                      name={`${fieldName}`}
                      type={
                        fieldType === "Boolean"
                          ? "checkbox"
                          : this.getType(fieldType)
                      }
                      validate={
                        fieldType === "Boolean"
                          ? null
                          : fieldOptions.required
                            ? this.required
                            : null
                      }
                    />
                  </div>
                ))}
              <div className="buttons" style={{ marginTop: "16px" }}>
                <Button
                  type="submit"
                  color="primary"
                  variant="contained"
                  disabled={submitting || pristine || invalid}
                >
                  {updateDocument ? "Update Document" : "Add Document"}
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

export default NewDocumentForm
