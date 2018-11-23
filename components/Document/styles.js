import { defaultRootStyling } from "../../lib/SharedStyles";

const styles = theme => ({
  root: {
    ...defaultRootStyling(theme),
    [theme.breakpoints.up("md")]: {
      padding: `${theme.spacing.unit * 5}px`
    }
  }
});

export default styles;
