/* eslint react/prefer-stateless-function: 0 */

import React, { Fragment } from "react"
import PropTypes from "prop-types"
import Head from "next/head"
import { withRouter } from "next/router"
import Link from "next/link"
import fetch from "isomorphic-unfetch"

import withAuth from "../../lib/withAuth"
import withLayout from "../../lib/withLayout"

import { serverURL } from "../../variables"

class Model extends React.Component {
  state = {
    id: "",
    name: "",
    documents: [],
    fields: [],
    options: {}
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
      }?populate`,
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
  addDocument = async () => {
    console.log(`addDocument`)
  }
  render() {
    const { user, error } = this.props
    const { name, documents } = this.state
    if (error) return <h2>Error</h2>
    return (
      <div style={{ padding: "10px 45px" }}>
        <Head>
          <title>{name}</title>
          <meta name="description" content="description for indexing bots" />
        </Head>
        <h3>{name} </h3>
        <hr />
        <h4>Documents ({documents.length})</h4>
        {documents.length > 0 && documents.map(doc => <p>{doc.name}</p>)}
      </div>
    )
  }
}

export default withAuth(withLayout(withRouter(Model)))