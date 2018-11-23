const styles = theme => ({
  root: {
    padding: "8px"
  },
  formElement: {
    margin: "20px 0",
    "&:first-of-type": {
      margin: "0"
    }
  },
  subheading: { margin: "8px 8px 8px 0" },
  newModelFieldsControls: {
    display: "flex",
    alignItems: "center"
  },
  newModelFieldContainer: { margin: "16px 0" },
  newModelField: {
    margin: "5px 0",
    padding: "5px 0",
    borderBottom: "1px dotted rgba(0,0,0,0.3)"
  },
  formControls: { display: "block" }
});

export default styles;
