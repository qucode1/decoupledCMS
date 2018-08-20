import React, { Component } from "react"
import PropTypes from "prop-types"
import TextField from "@material-ui/core/TextField"
import Checkbox from "@material-ui/core/Checkbox"
import FormControlLabel from "@material-ui/core/FormControlLabel"

import NewModelFieldForm from "./NewModelFieldForm"

class NewModelForm extends Component {
  state = {
    newModelName: "",
    newModelFields: [],
    newModelOptions: {},
    timestamps: false,
    showNewFieldForm: false
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
  render() {
    const {
      newModelName,
      newModelFields,
      newModelOptions,
      showNewFieldForm
    } = this.state
    return (
      <div>
        <TextField
          id="newModelName"
          label="Model Name"
          value={this.state.newModelName}
          margin="normal"
          onChange={this.handleChange("newModelName")}
        />
        <h4>Fields</h4>
        <button onClick={this.toggleNewFieldForm}>New Field</button>
        {showNewFieldForm && <NewModelFieldForm />}
        {newModelFields.map((field, index) => {
          const [fieldName, fieldType, fieldOptions] = field
          return (
            <div>
              <NewModelFieldForm
                displayOnly={{ fieldName, fieldType, fieldOptions }}
                disabled
              />
              <button onClick={console.log(`remove newModelFields[${index}]`)}>
                Remove Field
              </button>
            </div>
          )
        })}
        <h4>Model Options</h4>
        <button
          onClick={() =>
            this.props.addModel({
              newModelName,
              newModelFields,
              newModelOptions
            })
          }
        >
          Add Model
        </button>
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
      </div>
    )
  }
}

NewModelForm.propTypes = {
  addModel: PropTypes.func
}

export default NewModelForm
