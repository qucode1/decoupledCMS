import React from "react"
import TextField from "@material-ui/core/TextField"

export default ({
  input: { name, onChange, value, multiline, ...restInput },
  meta,
  ...rest
}) => (
  <TextField
    {...rest}
    name={name}
    helperText={meta.touched ? meta.error : undefined}
    error={meta.error && meta.touched}
    inputProps={restInput}
    multiline={Boolean(multiline)}
    onChange={onChange}
    value={value}
  />
)
