/* eslint react/prefer-stateless-function: 0 */

import React, { Fragment } from "react"
import PropTypes from "prop-types"
import Head from "next/head"
import { withRouter } from "next/router"
import Button from "@material-ui/core/Button"
import AddIcon from "@material-ui/icons/Add"
import ClearIcon from "@material-ui/icons/Clear"
import Link from "next/link"
import fetch from "isomorphic-unfetch"

import withAuth from "../../lib/withAuth"
import withLayout from "../../lib/withLayout"

import { serverURL } from "../../variables"

import NewDocumentForm from "../../components/NewDocumentForm"

class Model extends React.Component {
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

  static getInitialProps = async ({ req }) => {
    const { data: model, error } = await fetch(
      `${serverURL}/${req.user._id}/projects/${req.params.projectId}/models/${
        req.params.modelId
      }?populate=true`,
      {
        headers: {
          cookie: req.headers.cookie
        }
      }
    ).then(res => res.json())
    return { model: { ...model }, error }
  }
  componentDidMount() {
    const { _id: id, name, documents, fields, options } = this.props.model.model
    this.setState({
      name,
      id,
      documents,
      fields: JSON.parse(fields),
      options: JSON.parse(options)
    })
  }
  handleInputChange = e =>
    this.setState({
      [e.target.name]: e.target.value
    })
  toggleNewDocumentForm = () =>
    this.setState({ showNewDocumentForm: !this.state.showNewDocumentForm })
  addDocument = async values => {
    console.log(`addDocument`, values)
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
    console.log("addDocument data", data)
    console.log("addDocument error", error)
    !error &&
      this.setState(prevState => ({
        documents: prevState.documents.push(data.document)
      }))
  }
  render() {
    const { user, error } = this.props
    const { name, documents, fields, showNewDocumentForm } = this.state
    if (error) return <h2>Error</h2>
    return (
      <div style={{ padding: "10px 45px" }}>
        <Head>
          <title>{name}</title>
          <meta name="description" content="description for indexing bots" />
        </Head>
        <h3>{name} </h3>
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
        {showNewDocumentForm && (
          <NewDocumentForm fields={fields} addDocument={this.addDocument} />
        )}
        <h4>Documents ({documents.length})</h4>
        {documents.length > 0 && documents.map(doc => <p>{doc.name}</p>)}
      </div>
    )
  }
}

export default withAuth(withLayout(withRouter(Model)))
