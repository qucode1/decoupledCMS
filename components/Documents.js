/* eslint react/prefer-stateless-function: 0 */

import React, { Fragment } from "react"
import PropTypes from "prop-types"
import Head from "next/head"
import Button from "@material-ui/core/Button"
import AddIcon from "@material-ui/icons/Add"
import ClearIcon from "@material-ui/icons/Clear"
import fetch from "isomorphic-unfetch"
import Typography from "@material-ui/core/Typography"
import { withStyles } from "@material-ui/core/styles"
import { defaultRootStyling } from "../lib/SharedStyles"
import { serverURL } from "../variables"

import NewDocumentForm from "./NewDocumentForm"
import CustomList from "./CustomList"

const styles = theme => ({
  root: defaultRootStyling(theme)
})

class Documents extends React.Component {
  state = {
    id: "",
    name: "",
    documents: [],
    fields: [],
    options: {},
    showNewDocumentForm: false
  }
  static propTypes = {
    user: PropTypes.shape({
      email: PropTypes.string.isRequired
    })
  }

  static defaultProps = {
    user: null
  }

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
      `${serverURL}/${userId}/projects/${projectId}/models/${modelId}?populate=true`
    ).then(res => res.json())

    const { _id: id, fields, options, ...rest } = model

    const {
      context: { setPageTitle }
    } = this.props
    setPageTitle(model.name)

    this.setState({
      ...rest,
      id,
      fields: JSON.parse(fields),
      options: JSON.parse(options)
    })
  }

  handleInputChange = e =>
    this.setState({
      [e.target.name]: e.target.value
    })

  toggleNewDocumentForm = () => {
    this.setState({ showNewDocumentForm: !this.state.showNewDocumentForm })
  }

  addDocument = async values => {
    const {
      user: { _id: userId },
      router: {
        query: { projectId, modelId }
      }
    } = this.props
    const { documents } = this.state
    const { data, error } = await fetch(
      `${serverURL}/${userId}/projects/${projectId}/models/${modelId}/documents/add`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json"
        },
        body: JSON.stringify({
          ...values
        })
      }
    ).then(res => res.json())
    !error &&
      this.setState(prevState => ({
        documents: [...prevState.documents, data.document]
      }))
  }

  deleteDocument = async targetId => {
    const {
      user: { _id: userId }
    } = this.props
    const { id: modelId, project: projectId } = this.state
    const { data, error } = await fetch(
      `${serverURL}/${userId}/projects/${projectId}/models/${modelId}/documents/${targetId}/delete`,
      {
        method: "DELETE"
      }
    ).then(res => res.json())
    !error &&
      this.setState(prevState => ({
        documents: prevState.documents.filter(
          document => document._id !== targetId
        )
      }))
  }

  render() {
    const { user, error, classes } = this.props
    const {
      name,
      entry,
      documents,
      fields,
      showNewDocumentForm,
      project,
      id: modelId
    } = this.state
    if (error) return <h2>Error</h2>
    return (
      <div className={classes.root}>
        <div style={{ display: "flex", alignItems: "center" }}>
          <Typography variant="headline" style={{ margin: "8px 8px 8px 0" }}>
            Documents ({documents.length})
          </Typography>
          <Button
            onClick={this.toggleNewDocumentForm}
            size="medium"
            color="primary"
          >
            {showNewDocumentForm ? (
              <Fragment>
                <ClearIcon />
                Discard
              </Fragment>
            ) : (
              <Fragment>
                <AddIcon />
                New
              </Fragment>
            )}
          </Button>
        </div>
        {showNewDocumentForm && (
          <NewDocumentForm fields={fields} addDocument={this.addDocument} />
        )}
        {documents.length > 0 && (
          <CustomList
            items={documents}
            itemName="document"
            baseURL={`${modelId}/documents`}
            deleteItem={this.deleteDocument}
            icon="document"
            entry={entry}
          />
        )}
      </div>
    )
  }
}

export default withStyles(styles)(Documents)
