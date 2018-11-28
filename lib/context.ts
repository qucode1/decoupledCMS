import { SheetsRegistry } from "react-jss";
import {
  createMuiTheme,
  createGenerateClassName,
  Theme
} from "@material-ui/core/styles";
import primary from "@material-ui/core/colors/indigo";
import secondary from "@material-ui/core/colors/amber";
import { Spacing } from "@material-ui/core/styles/spacing";

// interface MySpacing extends Spacing {
//   drawerWidth: string
// }

// interface MyTheme extends Theme {
//   spacing: Spacing & { drawerWidth: string}
// }

// type Intersection = Theme & MyTheme

const theme = createMuiTheme({
    palette: {
      primary,
      secondary
    },
    spacing: {
      drawerWidth: "250px"
    },
    typography: {
      useNextVariants: true
    }
  }) /* as MyTheme */;

function createPageContext() {
  return {
    theme,
    sheetsManager: new Map(),
    sheetsRegistry: new SheetsRegistry(),
    generateClassName: createGenerateClassName()
  };
}

export default function getContext() {
  if (!process.browser) {
    return createPageContext();
  }

  if (!global.INIT_MATERIAL_UI) {
    global.INIT_MATERIAL_UI = createPageContext();
  }

  return global.INIT_MATERIAL_UI;
}
