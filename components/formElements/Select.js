import React, { Fragment } from "react"
import Select from "@material-ui/core/Select"
import Input from "@material-ui/core/Input"
import InputLabel from "@material-ui/core/InputLabel"

export default ({
  input: { value, name, onChange, label, ...restInput },
  children,
  ...rest
}) => (
  <Fragment>
    <InputLabel shrink htmlFor="field-type-placeholder">
      {label}
    </InputLabel>
    <Select
      {...rest}
      name={name}
      value={value}
      onChange={onChange}
      inputProps={restInput}
      input={<Input name="fieldType" id="field-type-placeholder" />}
    >
      {children}
    </Select>
  </Fragment>
)
