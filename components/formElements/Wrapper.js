import React, { Fragment } from "react"
import Checkbox from "@material-ui/core/Checkbox"
import { withStyles } from "@material-ui/core"

const styles = theme => ({
  error: {
    color: theme.palette.error.main
  }
})

const Wrapper = ({
  input: { name, ...restInput },
  meta,
  children,
  classes,
  ...rest
}) => (
  <Fragment>
    <div {...rest} name={name} {...restInput} {...rest}>
      {children}
    </div>
    {meta.error &&
      meta.touched && <span className={classes.error}>{meta.error}</span>}
  </Fragment>
)

export default withStyles(styles)(Wrapper)
