import { SheetsRegistry } from "react-jss";
import {
  createMuiTheme,
  createGenerateClassName,
  Theme
} from "@material-ui/core/styles";
import primary from "@material-ui/core/colors/indigo";
import secondary from "@material-ui/core/colors/amber";
import { ThemeOptions } from "@material-ui/core/styles/createMuiTheme";

declare module "@material-ui/core/styles/createMuiTheme" {
  interface Theme {
    mySidebar: {
      width: React.CSSProperties["width"];
    };
  }
  interface ThemeOptions {
    mySidebar?: {
      width?: React.CSSProperties["width"];
    };
  }
}

const createMyTheme = (options?: ThemeOptions) => {
  return createMuiTheme({
    palette: {
      primary,
      secondary
    },
    mySidebar: {
      width: "250px"
    },
    typography: {
      useNextVariants: true
    },
    ...options
  });
};

const theme = createMyTheme();

function createPageContext() {
  return {
    theme,
    sheetsManager: new Map(),
    sheetsRegistry: new SheetsRegistry(),
    generateClassName: createGenerateClassName()
  };
}

// const isBrowser = typeof window !== 'undefined';

export default function getContext() {
  const globalAny: any = global;

  if (typeof window === "undefined") {
    return createPageContext();
  }

  if (!globalAny.INIT_MATERIAL_UI) {
    globalAny.INIT_MATERIAL_UI = createPageContext();
  }

  return globalAny.INIT_MATERIAL_UI;
}
