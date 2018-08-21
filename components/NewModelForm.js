import React, { Component, Fragment } from "react"
import PropTypes from "prop-types"
import TextField from "@material-ui/core/TextField"
import Checkbox from "@material-ui/core/Checkbox"
import FormControlLabel from "@material-ui/core/FormControlLabel"
import Typography from "@material-ui/core/Typography"
import Button from "@material-ui/core/Button"
import AddIcon from "@material-ui/icons/Add"
import DeleteIcon from "@material-ui/icons/Delete"
import ClearIcon from "@material-ui/icons/Clear"
import Card from "@material-ui/core/Card"

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
  render() {
    const {
      newModelName,
      newModelFields,
      newModelOptions,
      showNewFieldForm
    } = this.state
    return (
      <Card style={{ padding: "8px" }}>
        <TextField
          id="newModelName"
          label="Model Name"
          value={this.state.newModelName}
          margin="normal"
          onChange={this.handleChange("newModelName")}
        />
        <div style={{ display: "flex", alignItems: "center", margin: "8px 0" }}>
          <Typography variant="title" style={{ marginRight: "8px" }}>
            Fields
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
                {/* <Button
                color="secondary"
                size="small"
                onClick={() => this.removeField(index)}
              >
                <DeleteIcon />
                Remove Field
              </Button> */}
              </div>
            )
          })}
        </div>
        <Typography variant="title" style={{ margin: "8px 0" }}>
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
      </Card>
    )
  }
}

NewModelForm.propTypes = {
  addModel: PropTypes.func
}

export default NewModelForm
