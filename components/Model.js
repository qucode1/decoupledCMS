import React, { Component } from "react"
import { withStyles } from "@material-ui/core/styles"
import { defaultRootStyling } from "../lib/SharedStyles"
import NewModelForm from "./NewModelForm"

import { serverURL } from "../variables"

const styles = theme => ({
  root: {
    ...defaultRootStyling(theme),
    [theme.breakpoints.up("md")]: {
      padding: `${theme.spacing.unit * 5}px`
    }
  }
})

class Model extends Component {
  state = {}
  async componentDidMount() {
    const {
      router: {
        query: { projectId, modelId }
      },
      user: { _id: userId },
      context: { setPageTitle }
    } = this.props

    const {
      data: { model },
      error
    } = await fetch(
      `${serverURL}/${userId}/projects/${projectId}/models/${modelId}`
    ).then(res => res.json())

    setPageTitle(`${model.name}`)

    if (!error) {
      const { fields, options } = model
      this.setState({
        ...model,
        fields: JSON.parse(fields),
        options: JSON.parse(options)
      })
    }
  }

  updateModel = async ({ newModelName, newModelFields, newModelOptions }) => {
    const {
      user: { _id: userId },
      router: {
        query: { projectId, modelId }
      }
    } = this.props

    const {
      data: { model },
      error
    } = await fetch(
      `${serverURL}/${userId}/projects/${projectId}/models/${modelId}/update`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json"
        },
        body: JSON.stringify({
          name: newModelName,
          fields: newModelFields,
          options: newModelOptions
        })
      }
    ).then(res => res.json())
    if (!error) {
      const { fields, options } = model
      this.setState({
        ...model,
        fields: JSON.parse(fields),
        options: JSON.parse(options)
      })
    }
  }

  render() {
    const { name: newModelName, fields: newModelFields, options } = this.state
    const { classes } = this.props
    return (
      <div className={classes.root}>
        {newModelName && (
          <NewModelForm
            initialValues={{ newModelName, newModelFields, ...options }}
            updateModel={this.updateModel}
          />
        )}
      </div>
    )
  }
}

export default withStyles(styles)(Model)
