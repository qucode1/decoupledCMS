import React, { Component, Fragment } from "react";
import { Form, Field } from "react-final-form";
import PropTypes from "prop-types";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import AddIcon from "@material-ui/icons/Add";
import ClearIcon from "@material-ui/icons/Clear";
import Card from "@material-ui/core/Card";
import MenuItem from "@material-ui/core/MenuItem";
import { withStyles } from "@material-ui/core/styles";

import styles from "./styles";

import Wrapper from "../formElements/Wrapper";
import Select from "../formElements/Select";
import TextField from "../formElements/TextField";
import Checkbox from "../formElements/Checkbox";

import NewModelFieldForm from "../NewModelFieldForm/NewModelFieldForm";

class NewModelForm extends Component {
  state = {
    newModelName: "",
    newModelFields: [],
    newModelOptions: {},
    timestamps: false,
    showNewFieldForm: false
  };

  modelOptions = ["timestamps"];
  componentDidMount() {
    const { initialValues } = this.props;
    if (
      initialValues &&
      initialValues.newModelFields &&
      initialValues.newModelFields.length
    ) {
      this.setState({
        newModelFields: initialValues.newModelFields
      });
    }
  }

  validate = values => {
    const errors = {};
    if (!values.newModelName) {
      errors.newModelName = "Required";
    }
    if (!values.newModelFields || !values.newModelFields.length) {
      errors.newModelFields = "You need to add at least one field.";
    }
    return errors;
  };

  changeTextInput = e => {
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

  handleChange = name => event => {
    const { target } = event;
    name === "newModelOptions"
      ? this.setState(prevState => {
          const options = { ...prevState.newModelOptions };
          return {
            newModelOptions: {
              ...options,
              [target.value]: target.checked
            }
          };
        })
      : this.setState({
          [name]: target.value
        });
  };

  toggleNewFieldForm = () => {
    this.setState({
      showNewFieldForm: !this.state.showNewFieldForm
    });
  };

  addField = field => {
    this.setState(prevState => ({
      newModelFields: [...prevState.newModelFields, field]
    }));
  };

  removeField = targetIndex => {
    this.setState(prevState => ({
      newModelFields: prevState.newModelFields.filter(
        (_, index) => index !== targetIndex
      )
    }));
  };

  submitModel = ({ newModelName, newModelEntry, ...values }) => {
    const { newModelFields = [] } = this.state;
    const { addModel, updateModel } = this.props;
    const submit = addModel || updateModel;
    const newModelOptions = this.modelOptions.reduce((acc, option) => {
      if (values[option]) {
        acc[option] = values[option];
      }
      return acc;
    }, {});
    return submit({
      newModelName,
      newModelFields,
      newModelEntry,
      newModelOptions
    });
  };
  customReset = reset => {
    const { updateModel, initialValues } = this.props;
    reset();
    if (!updateModel) this.setState({ newModelFields: [] });
    else {
      this.setState({
        newModelFields: initialValues.newModelFields
      });
    }
  };
  render() {
    const { newModelFields, showNewFieldForm } = this.state;
    const { initialValues, addModel, updateModel, classes } = this.props;
    const filteredNewModelFields = newModelFields.filter(
      ([fieldName]) => !["owner", "project", "model"].includes(fieldName)
    );
    return (
      <Card className={classes.root}>
        <Form
          onSubmit={this.submitModel}
          validate={this.validate}
          initialValues={initialValues}
          render={({
            handleSubmit,
            form: { reset, change },
            submitting,
            pristine,
            values,
            invalid
          }) => (
            <form
              onSubmit={val =>
                handleSubmit(val).then(() => this.customReset(reset))
              }
            >
              <div className={classes.formElement}>
                <Field
                  component={TextField}
                  name="newModelName"
                  type="text"
                  label="Model Name"
                />
              </div>
              <div className={classes.formElement}>
                <Field name="newModelFields" component={Wrapper}>
                  <div className={classes.newModelFieldsControls}>
                    <Typography
                      variant="subheading"
                      className={classes.subheading}
                    >
                      Model Fields ({filteredNewModelFields.length})
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
                      const { newModelFields = [] } = values;
                      this.addField(fieldData);
                      change("newModelFields", [
                        ...newModelFields,
                        this.state.newModelFields
                      ]);
                    }}
                  />
                )}
                {newModelFields.length > 0 && <hr />}
                <div className={classes.newModelFieldContainer}>
                  {filteredNewModelFields.map((field, index) => {
                    const [fieldName, fieldType, fieldOptions] = field;
                    return (
                      <div
                        key={`newModelFields[${index}]`}
                        className={classes.newModelField}
                      >
                        <NewModelFieldForm
                          initialValues={{ fieldName, fieldType, fieldOptions }}
                          disabled
                          removeField={() => {
                            const { newModelFields = [] } = values;
                            this.removeField(index);
                            change(
                              "newModelFields",
                              newModelFields.filter((f, i) => i !== index)
                            );
                          }}
                        />
                      </div>
                    );
                  })}
                </div>
                {newModelFields.length > 0 && <hr />}
              </div>
              <div className={classes.formElement}>
                <Typography variant="subheading" className={classes.subheading}>
                  Model Entry
                </Typography>
                <Field
                  component={Select}
                  displayEmpty
                  name="newModelEntry"
                  label="Entry Field"
                  validate={this.required}
                >
                  <MenuItem value="">
                    <em>Entry Field</em>
                  </MenuItem>
                  {newModelFields.map((field, fieldIndex) => (
                    <MenuItem
                      key={`selectEntry-${fieldIndex}`}
                      value={field[0]}
                    >
                      {field[0]}
                    </MenuItem>
                  ))}
                </Field>
              </div>
              <div className={classes.formElement}>
                <Typography variant="subheading" className={classes.subheading}>
                  Model Options
                </Typography>
                {this.modelOptions.map((option, index) => (
                  <div key={`modelOption-${index}`}>
                    <Field name={option} component={Checkbox} type="checkbox" />
                    <label>{option}</label>
                  </div>
                ))}
              </div>
              <div className={classes.formControls}>
                <Button
                  color="primary"
                  size="small"
                  variant="contained"
                  type="submit"
                  disabled={submitting || pristine || invalid}
                >
                  {updateModel ? "Edit Model" : "Add Model"}
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

NewModelForm.propTypes = {
  addModel: PropTypes.func
};

export default withStyles(styles)(NewModelForm);
