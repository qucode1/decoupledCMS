import React, { Component } from "react";
import { Form, Field } from "react-final-form";
import Card from "@material-ui/core/Card";
import Button from "@material-ui/core/Button";
import { withStyles } from "@material-ui/core/styles";

import styles from "./styles";

import TextField from "../formElements/TextField";
import Checkbox from "../formElements/Checkbox";
import Radio from "../formElements/Radio";

class NewDocumentForm extends Component {
  state = {};

  validate = values => {
    const errors = {};
    // if (!values.newDocumentName) {
    //   errors.newProjectName = "Required"
    // }
    return errors;
  };

  changeTextInputType = e => {
    this.setState({
      [e.target.name]: !!!this.state[e.target.name]
    });
  };

  required = value => (value ? undefined : "Required");

  composeValidators = (...validators) => value => {
    validators.reduce(
      (error, validator) => error || validator(value),
      undefined
    );
  };

  getType = fieldType => {
    const table = {
      String: "text",
      Date: "date",
      Number: "number",
      checkbox: "checkbox"
    };
    return table[fieldType];
  };

  capitalize = str => `${str[0].toUpperCase()}${str.slice(1)}`;

  render() {
    const {
      addDocument,
      updateDocument,
      fields,
      initialValues,
      classes
    } = this.props;
    return (
      <Card className={classes.root}>
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
            <form
              onSubmit={val => handleSubmit(val).then(reset)}
              className={classes.form}
            >
              {fields
                .filter(
                  ([name]) => !["owner", "project", "model"].includes(name)
                )
                .map(([fieldName, fieldType, fieldOptions], index) => (
                  <div key={`field-${index}`} className={classes.field}>
                    <div
                      className={`${classes.fieldHeader} ${
                        fieldType === "String" ? classes.string : ""
                      }`}
                    >
                      <label
                        htmlFor={fieldName}
                        className={classes.fieldName}
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
                      className={
                        fieldType === "String" &&
                        this.state[`${fieldName}Multiline`]
                          ? classes.fieldInputMultiline
                          : classes.fieldInput
                      }
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
              <div className="buttons" className={classes.formControls}>
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
    );
  }
}

export default withStyles(styles)(NewDocumentForm);
