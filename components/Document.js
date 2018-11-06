import React, { Component } from "react"
import { withStyles } from "@material-ui/core/styles"
import { defaultRootStyling } from "../lib/SharedStyles"

import NewDocumentForm from "./NewDocumentForm"

import { serverURL } from "../variables"

const styles = theme => ({
  root: {
    ...defaultRootStyling(theme),
    [theme.breakpoints.up("md")]: {
      padding: `${theme.spacing.unit * 5}px`
    }
  }
})

const removeTimefromDates = obj => {
  return Object.entries(obj)
    .map(([key, value]) => {
      if (
        typeof value === "string" &&
        value.match(/^[0-9]{4}-[0-9]{2}-[0-9]{2}T.*/)
      ) {
        return [key, value.split("T")[0]]
      } else return [key, value]
    })
    .reduce((acc, [key, value]) => {
      acc[key] = value
      return acc
    }, {})
}

class Document extends Component {
  state = {}
  async componentDidMount() {
    const {
      router: {
        query: { projectId, modelId, documentId }
      },
      user: { _id: userId },
      context: { setPageTitle }
    } = this.props

    const [modelRes, documentRes] = await Promise.all([
      fetch(
        `${serverURL}/${userId}/projects/${projectId}/models/${modelId}`
      ).then(res => res.json()),
      fetch(
        `${serverURL}/${userId}/projects/${projectId}/models/${modelId}/documents/${documentId}`
      ).then(res => res.json())
    ])

    const {
      data: { model: modelData },
      modelError
    } = modelRes
    const {
      data: { document: documentData },
      documentError
    } = documentRes

    this.setState({modelData})
    setPageTitle(documentData[modelData.entry] || documentData.name)

    if (modelError || documentError) {
      this.setState({
        error: modelError || documentError
      })
    } else {
      const { _id: id, ...rest } = documentData
      const { fields } = modelData

      this.setState({
        ...removeTimefromDates(rest),
        id,
        [`modelFields-${modelId}`]: JSON.parse(fields)
      })
    }
  }

  updateDocument = async values => {
    const {
      user: { _id: userId },
      router: {
        query: { projectId, modelId, documentId }
      },
      context: { setPageTitle }
    } = this.props
    const { modelData } = this.state
    const {
      data: { document },
      error
    } = await fetch(
      `${serverURL}/${userId}/projects/${projectId}/models/${modelId}/documents/${documentId}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json"
        },
        body: JSON.stringify({
          ...values
        })
      }
    ).then(res => res.json())
    if(!error) {
      this.setState({ ...document })
      setPageTitle(document[modelData.entry || "name"])
    }
  }

  render() {
    const {
      router: {
        query: { modelId }
      },
      classes
    } = this.props
    const fields = this.state[`modelFields-${modelId}`]
    return (
      <div className={classes.root}>
        {fields && (
          <NewDocumentForm
            initialValues={{ ...this.state }}
            fields={this.state[`modelFields-${modelId}`]}
            updateDocument={this.updateDocument}
          />
        )}
      </div>
    )
  }
}

export default withStyles(styles)(Document)
