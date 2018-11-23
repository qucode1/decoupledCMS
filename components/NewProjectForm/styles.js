const styles = theme => ({
  root: { padding: "8px" },
  form: {
    margin: "16px 0",
    display: "flex",
    flexDirection: "column"
  },
  originControls: {
    display: "flex"
  },
  originList: {
    listStyleType: "none"
  },
  origin: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between"
  },
  deleteBtn: {
    color: theme.palette.error.main,
    alignSelf: "center",
    "&:hover": {
      backgroundColor: "#ffe7e7"
    }
  },
  formElement: {
    margin: "20px 0",
    "&:first-of-type": {
      margin: "0"
    },
    display: "flex",
    alignItems: "center"
  },
  formControls: { marginTop: "16px" }
});

export default styles;
