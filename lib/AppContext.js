import React, { Component, createContext } from "react"

const defaultContext = {
  user: null,
  navIsOpen: false,
  pageTitle: ""
}

const AppContext = createContext(defaultContext)

export const withContext = Component => {
  const AppContextConsumer = props => (
    <AppContext.Consumer>
      {ctx => <Component {...props} context={ctx} />}
    </AppContext.Consumer>
  )
  return AppContextConsumer
}

export class AppContextProvider extends Component {
  state = { ...defaultContext }
  setContext = async (name, obj, toLocalStorage = false) => {
    this.setState({
      [name]: obj
    })
    if (toLocalStorage) {
      const string = await JSON.stringify(obj)
      localStorage.setItem(name, string)
    }
    return obj
  }
  resetContext = () => {
    this.setState(defaultContext)
  }
  toggleNav = () => {
    this.setState(prevState => ({
      navIsOpen: !prevState.navIsOpen
    }))
  }
  setPageTitle = pageTitle => {
    this.setState({
      pageTitle
    })
  }
  render() {
    const { children } = this.props
    return (
      <AppContext.Provider
        value={{
          state: this.state,
          toggleNav: this.toggleNav,
          setPageTitle: this.setPageTitle,
          setContext: this.setContext,
          resetContext: this.resetContext
        }}
      >
        {children}
      </AppContext.Provider>
    )
  }
}
