import React, { Component } from "react"
import PropTypes from "prop-types"
import Select from "@material-ui/core/Select"
import MenuItem from "@material-ui/core/MenuItem"
import Checkbox from "@material-ui/core/Checkbox"
import FormControlLabel from "@material-ui/core/FormControlLabel"
import TextField from "@material-ui/core/TextField"

class NewModelFieldForm extends Component {
  state = {
    fieldName: "",
    fieldType: "String",
    fieldOptions: {
      required: false,
      unique: false,
      index: false
    }
  }
  componentDidMount() {
    if (this.props.defaultValues) {
      const { fieldName, fieldType, fieldOptions } = this.props.defaultValues
      this.setState({
        fieldName,
        fieldType,
        fieldOptions
      })
    }
  }
  handleChange = name => event => {
    const { target } = event
    name === "fieldOptions"
      ? this.setState(prevState => {
          const options = { ...prevState.fieldOptions }
          console.log("prevOptions", options)
          return {
            fieldOptions: {
              ...options,
              [target.value]: target.checked
            }
          }
        })
      : this.setState({
          [name]: target.value
        })
  }
  render() {
    const disabled = this.props.disabled
    return (
      <div>
        <TextField
          id="name"
          label="Name"
          disabled={disabled}
          value={this.state.fieldName}
          margin="normal"
          required
          onChange={this.handleChange("fieldName")}
        />
        <Select
          value={this.state.fieldType}
          onChange={this.handleChange("fieldType")}
          disabled={disabled}
          name="fieldType"
        >
          <MenuItem value="">
            <em>None</em>
          </MenuItem>
          <MenuItem value={"String"}>String</MenuItem>
          <MenuItem value={"Boolean"}>Boolean</MenuItem>
          <MenuItem value={"Date"}>Date</MenuItem>
          <MenuItem value={"Number"}>Number</MenuItem>
          <MenuItem value={"ObjectId"}>ObjectId</MenuItem>
        </Select>
        <FormControlLabel
          control={
            <Checkbox
              checked={this.state.fieldOptions.required}
              disabled={disabled}
              value="required"
              onChange={this.handleChange("fieldOptions")}
            />
          }
          label="required"
        />
        <FormControlLabel
          control={
            <Checkbox
              checked={this.state.fieldOptions.unique}
              disabled={disabled}
              value="unique"
              onChange={this.handleChange("fieldOptions")}
            />
          }
          label="unique"
        />
        <button>Add Field</button>
      </div>
    )
  }
}

NewModelFieldForm.propTypes = {}

export default NewModelFieldForm
