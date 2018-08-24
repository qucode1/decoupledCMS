import React, { Component, Fragment } from "react"
import PropTypes from "prop-types"
import Select from "@material-ui/core/Select"
import MenuItem from "@material-ui/core/MenuItem"
import Checkbox from "@material-ui/core/Checkbox"
import FormControlLabel from "@material-ui/core/FormControlLabel"
import TextField from "@material-ui/core/TextField"
import Button from "@material-ui/core/Button"
import Typography from "@material-ui/core/Typography"
import FormControl from "@material-ui/core/FormControl"
import InputLabel from "@material-ui/core/InputLabel"
import Input from "@material-ui/core/Input"
import DeleteIcon from "@material-ui/icons/Delete"
import Card from "@material-ui/core/Card"
import { withStyles } from "@material-ui/core/styles"

const styles = theme => ({
  deleteBtn: {
    color: theme.palette.error.main,
    "&:hover": {
      backgroundColor: "#ffe7e7"
    }
  }
})

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
    const { disabled, addField, removeField, classes } = this.props
    const { fieldName, fieldType, fieldOptions } = this.state
    return (
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          flexWrap: "wrap",
          justifyContent: "space-between",
          alignItems: "center",
          padding: disabled ? "8px" : "0",
          borderBottom: disabled ? "1px solid rgba(0,0,0,0.4)" : "none",
          backgroundColor: disabled ? "aliceblue" : "inherit"
        }}
      >
        <TextField
          id="name"
          label="Name"
          disabled={disabled}
          value={fieldName}
          margin="normal"
          required
          onChange={this.handleChange("fieldName")}
        />
        <FormControl margin="normal">
          <InputLabel shrink htmlFor="field-type-placeholder">
            Field Type
          </InputLabel>
          <Select
            value={this.state.fieldType}
            onChange={this.handleChange("fieldType")}
            input={<Input name="fieldType" id="field-type-placeholder" />}
            displayEmpty
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
        </FormControl>
        <FormControl margin="normal">
          <div style={{ display: "flex", alignItems: "center" }}>
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
          </div>
        </FormControl>
        {disabled ? (
          <Fragment>
            <Button
              className={classes.deleteBtn}
              size="small"
              onClick={removeField}
            >
              <DeleteIcon />
              Delete Field
            </Button>
          </Fragment>
        ) : (
          <Fragment>
            <Button
              color="primary"
              size="small"
              variant="outlined"
              onClick={() => addField([fieldName, fieldType, fieldOptions])}
            >
              Add Field
            </Button>
          </Fragment>
        )}
      </div>
    )
  }
}

NewModelFieldForm.propTypes = {}

export default withStyles(styles)(NewModelFieldForm)
