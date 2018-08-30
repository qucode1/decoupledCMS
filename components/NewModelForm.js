import React, { Component, Fragment } from "react"
import { Form, Field } from "react-final-form"
import TextField from "../components/formElements/TextField"
import Checkbox from "../components/formElements/Checkbox"
import PropTypes from "prop-types"
import Typography from "@material-ui/core/Typography"
import Button from "@material-ui/core/Button"
import AddIcon from "@material-ui/icons/Add"
import DeleteIcon from "@material-ui/icons/Delete"
import ClearIcon from "@material-ui/icons/Clear"
import Card from "@material-ui/core/Card"
import Wrapper from "./formElements/Wrapper"
import NewModelFieldForm from "./NewModelFieldForm"

class NewModelForm extends Component {
  state = {
    newModelName: "",
    newModelFields: [],
    newModelOptions: {},
    timestamps: false,
    showNewFieldForm: false
  }

  modelOptions = ["timestamps"]

  validate = values => {
    const { newModelFields } = this.state
    console.log("newModelFields", newModelFields)
    const errors = {}
    if (!values.newModelName) {
      errors.newModelName = "Required"
    }
    if (!values.newModelFields || !values.newModelFields.length) {
      errors.newModelFields = "You need to add at least one field."
    }
    return errors
  }

  changeTextInput = e => {
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

  handleChange = name => event => {
    const { target } = event
    name === "newModelOptions"
      ? this.setState(prevState => {
          const options = { ...prevState.newModelOptions }
          return {
            newModelOptions: {
              ...options,
              [target.value]: target.checked
            }
          }
        })
      : this.setState({
          [name]: target.value
        })
  }

  toggleNewFieldForm = () => {
    this.setState({
      showNewFieldForm: !this.state.showNewFieldForm
    })
  }

  addField = field => {
    this.setState(prevState => ({
      newModelFields: [...prevState.newModelFields, field]
    }))
  }

  removeField = targetIndex => {
    this.setState(prevState => ({
      newModelFields: prevState.newModelFields.filter(
        (_, index) => index !== targetIndex
      )
    }))
  }

  submitModel = ({ newModelName, ...values }) => {
    const { newModelFields = [] } = this.state
    const { addModel } = this.props
    const newModelOptions = this.modelOptions.reduce((acc, option) => {
      if (values[option]) {
        acc[option] = values[option]
      }
      return acc
    }, {})
    addModel({
      newModelName,
      newModelFields,
      newModelOptions
    })
  }
  render() {
    const { newModelFields, showNewFieldForm } = this.state
    return (
      <Card style={{ padding: "8px" }}>
        <Form
          onSubmit={this.submitModel}
          validate={this.validate}
          render={({
            handleSubmit,
            form: { reset, change },
            submitting,
            pristine,
            values,
            invalid
          }) => (
            <form onSubmit={handleSubmit}>
              <div>
                <Field
                  component={TextField}
                  name="newModelName"
                  type="text"
                  label="Model Name"
                />
              </div>
              <Field name="newModelFields" component={Wrapper}>
                <div style={{ display: "flex", alignItems: "center" }}>
                  <Typography
                    variant="subheading"
                    style={{ marginRight: "8px" }}
                  >
                    Model Fields
                  </Typography>
                  <Button
                    color="primary"
                    size="small"
                    onClick={this.toggleNewFieldForm}
                  >
                    {showNewFieldForm ? (
                      <Fragment>
                        <ClearIcon />
                        Discard Field
                      </Fragment>
                    ) : (
                      <Fragment>
                        <AddIcon />
                        New Field
                      </Fragment>
                    )}
                  </Button>
                </div>
              </Field>

              {showNewFieldForm && (
                <NewModelFieldForm
                  addField={fieldData => {
                    const { newModelFields = [] } = values
                    this.addField(fieldData)
                    change("newModelFields", [
                      ...newModelFields,
                      this.state.newModelFields
                    ])
                  }}
                />
              )}
              <div style={{ margin: "16px 0" }}>
                {newModelFields.map((field, index) => {
                  const [fieldName, fieldType, fieldOptions] = field
                  return (
                    <div key={`newModelFields[${index}]`}>
                      <NewModelFieldForm
                        initialValues={{ fieldName, fieldType, fieldOptions }}
                        disabled
                        removeField={() => {
                          const { newModelFields = [] } = values
                          this.removeField(index)
                          change(
                            "newModelFields",
                            newModelFields.filter((f, i) => i !== index)
                          )
                        }}
                      />
                    </div>
                  )
                })}
              </div>
              <Typography variant="subheading" style={{ margin: "8px 0" }}>
                Model Options
              </Typography>
              {this.modelOptions.map((option, index) => (
                <div key={`modelOption-${index}`}>
                  <Field name={option} component={Checkbox} type="checkbox" />
                  <label>{option}</label>
                </div>
              ))}
              <div style={{ display: "block" }}>
                <Button
                  color="primary"
                  size="small"
                  variant="contained"
                  type="submit"
                  disabled={submitting || pristine || invalid}
                >
                  Add Model
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
        {/* <TextField
          id="newModelName"
          label="Model Name"
          value={this.state.newModelName}
          margin="normal"
          onChange={this.handleChange("newModelName")}
        />
        <div
          style={{ display: "flex", alignItems: "center", margin: "8px 0 0 0" }}
        >
          <Typography variant="subheading" style={{ marginRight: "8px" }}>
            Model Fields
          </Typography>
          <Button
            color="primary"
            size="small"
            onClick={this.toggleNewFieldForm}
          >
            {showNewFieldForm ? (
              <Fragment>
                <ClearIcon />
                Discard Field
              </Fragment>
            ) : (
              <Fragment>
                <AddIcon />
                New Field
              </Fragment>
            )}
          </Button>
        </div>
        {showNewFieldForm && <NewModelFieldForm addField={this.addField} />}
        <div style={{ margin: "16px 0" }}>
          {newModelFields.map((field, index) => {
            const [fieldName, fieldType, fieldOptions] = field
            return (
              <div key={`newModelFields[${index}]`}>
                <NewModelFieldForm
                  defaultValues={{ fieldName, fieldType, fieldOptions }}
                  disabled
                  removeField={() => this.removeField(index)}
                />
              </div>
            )
          })}
        </div>
        <Typography variant="subheading" style={{ margin: "8px 0" }}>
          Model Options
        </Typography>
        <FormControlLabel
          control={
            <Checkbox
              checked={NewModelFieldForm.timestamps}
              value="timestamps"
              onChange={this.handleChange("newModelOptions")}
            />
          }
          label="timestamps"
        />
        <div style={{ display: "block" }}>
          <Button
            color="primary"
            size="small"
            variant="contained"
            onClick={() =>
              this.props.addModel({
                newModelName,
                newModelFields,
                newModelOptions
              })
            }
          >
            Add Model
          </Button>
        </div> */}
      </Card>
    )
  }
}

NewModelForm.propTypes = {
  addModel: PropTypes.func
}

export default NewModelForm
