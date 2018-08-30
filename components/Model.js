import React, { Component } from "react"

import NewModelForm from "./NewModelForm"

import { serverURL } from "../variables"

class Model extends Component {
  state = {}
  async componentDidMount() {
    const {
      router: {
        query: { projectId, modelId }
      },
      user: { _id: userId }
    } = this.props
    const {
      data: { model },
      error
    } = await fetch(
      `${serverURL}/${userId}/projects/${projectId}/models/${modelId}`
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
    return (
      <div>
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

export default Model
