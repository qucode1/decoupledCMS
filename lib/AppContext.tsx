import React, { Component, createContext } from "react";
import { cleanName } from "../lib/helpers";

const defaultContext = {
  user: null,
  navIsOpen: false,
  pageTitle: ""
};

interface State {
  user: any;
  navIsOpen: boolean;
  pageTitle: string;
  [propType: string]: any;
}

export interface Value {
  user: any;
  navIsOpen: boolean;
  pageTitle: string;
  state: State;
  toggleNav: () => void;
  setPageTitle: (pageTitle: string) => void;
  setContext: (name: string, obj: any, toLocalStorage: boolean) => any;
  resetContext: () => void;
}

const AppContext = createContext(defaultContext);

export const withContext = <P extends object>(
  Component: React.ComponentType<P>
) => {
  const AppContextConsumer = (props: any) => (
    <AppContext.Consumer>
      {ctx => <Component {...props} context={ctx} />}
    </AppContext.Consumer>
  );
  return AppContextConsumer;
};

export class AppContextProvider extends Component<{}, State> {
  state = { ...defaultContext };
  setContext = async (name: string, obj: any, toLocalStorage = false) => {
    this.setState({
      [name]: obj
    });
    if (toLocalStorage) {
      const string = await JSON.stringify(obj);
      localStorage.setItem(name, string);
    }
    return obj;
  };
  resetContext = () => {
    this.setState(defaultContext);
  };
  toggleNav = () => {
    this.setState(prevState => ({
      navIsOpen: !prevState.navIsOpen
    }));
  };
  setPageTitle = (pageTitle: string) => {
    this.setState({
      pageTitle: cleanName(pageTitle)
    });
  };
  render() {
    const { children } = this.props;
    return (
      <AppContext.Provider
        value={
          {
            state: this.state,
            toggleNav: this.toggleNav,
            setPageTitle: this.setPageTitle,
            setContext: this.setContext,
            resetContext: this.resetContext
          } as Value
        }
      >
        {children}
      </AppContext.Provider>
    );
  }
}
