import React, { Component, Fragment } from "react"
import { Form, Field } from "react-final-form"
import Select from "./formElements/Select"
import TextField from "./formElements/TextField"
import Checkbox from "./formElements/Checkbox"
import MenuItem from "@material-ui/core/MenuItem"
import Button from "@material-ui/core/Button"
import DeleteIcon from "@material-ui/icons/Delete"
import { withStyles } from "@material-ui/core/styles"

const styles = theme => ({
  root: {
    display: "flex",
    flexWrap: "wrap",
    justifyContent: "space-around",
    alignItems: "baseline"
  },
  deleteBtn: {
    color: theme.palette.error.main,
    "&:hover": {
      backgroundColor: "#ffe7e7"
    }
  }
})

class NewModelFieldForm extends Component {
  required = value => (value ? undefined : "Required")

  render() {
    const {
      disabled,
      addField,
      removeField,
      classes,
      initialValues: {
        fieldOptions: { required, unique } = {},
        ...initialValues
      } = {}
    } = this.props
    return (
      <Form
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
        onSubmit={({ fieldName, fieldType, required, unique, ...rest }) => {
          addField([fieldName, fieldType, { required, unique }])
        }}
        initialValues={{ ...initialValues, required, unique }}
        render={({
          handleSubmit,
          form: { reset },
          submitting,
          pristine,
          values,
          invalid
        }) => (
          <div className={classes.root}>
            <Field
              name="fieldName"
              type="text"
              component={TextField}
              disabled={disabled}
              label="Field Name"
              validate={this.required}
            />
            <Field
              component={Select}
              displayEmpty
              disabled={disabled}
              name="fieldType"
              label="Field Type"
              validate={this.required}
            >
              <MenuItem value="">
                <em>Type</em>
              </MenuItem>
              <MenuItem value={"String"}>String</MenuItem>
              <MenuItem value={"Boolean"}>Boolean</MenuItem>
              <MenuItem value={"Date"}>Date</MenuItem>
              <MenuItem value={"Number"}>Number</MenuItem>
              <MenuItem value={"ObjectId"}>ObjectId</MenuItem>
            </Field>
            <div>
              <label htmlFor="required">required</label>
              <Field
                name="required"
                component={Checkbox}
                type="checkbox"
                disabled={disabled}
              />
            </div>
            <div>
              <label htmlFor="unique">unique</label>
              <Field
                name="unique"
                component={Checkbox}
                type="checkbox"
                disabled={disabled}
              />
            </div>
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
                  disabled={pristine || invalid || disabled}
                  onClick={() => {
                    handleSubmit()
                    reset()
                  }}
                >
                  Add Field
                </Button>
              </Fragment>
            )}
          </div>
        )}
      />
    )
  }
}

NewModelFieldForm.propTypes = {}

export default withStyles(styles)(NewModelFieldForm)
