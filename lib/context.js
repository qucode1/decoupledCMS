import { SheetsRegistry } from "react-jss"
import {
  createMuiTheme,
  createGenerateClassName
} from "@material-ui/core/styles"
import primary from "@material-ui/core/colors/indigo"
import secondary from "@material-ui/core/colors/amber"

const theme = createMuiTheme({
  palette: {
    primary,
    secondary
  },
  spacing: {
    drawerWidth: "250px"
  }
})

function createPageContext() {
  return {
    theme,
    sheetsManager: new Map(),
    sheetsRegistry: new SheetsRegistry(),
    generateClassName: createGenerateClassName()
  }
}

export default function getContext() {
  if (!process.browser) {
    return createPageContext()
  }

  if (!global.INIT_MATERIAL_UI) {
    global.INIT_MATERIAL_UI = createPageContext()
  }

  return global.INIT_MATERIAL_UI
}
