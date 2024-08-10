import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  roundButton: {
    borderRadius: 50,
    backgroundColor: "#4a5768",
    width: 60,
    height: 60,
    marginHorizontal: 7.5,
  },

  redButton: {
    borderRadius: 50,
    backgroundColor: "#e01314",
    width: 45,
    height: 45,
    marginTop: 85,
    marginLeft: "auto",
    marginRight: "auto",
  },

  closeredButton: {
    color: "#e01314",
    marginLeft: "auto",
    paddingRight: 10,
    paddingTop: 10,
  },

  redoundoButton: {
    borderRadius: 10,
    backgroundColor: "#1e293b",
    width: 90,
    height: 60,
    marginHorizontal: 40,
  },

  alignRedoUndo: {
    marginLeft: "auto",
    marginRight: "auto",
    marginTop: "auto",
    paddingTop: 15,
  },

  boxWrap: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },

  roundButtonNew: {
    borderRadius: 50,
    backgroundColor: "#c026d3",
    width: 25,
    height: 25,
    marginHorizontal: 7.5,
  },

  txtNew: {
    textAlign: "left",
    fontSize: 15,
    color: "#c026d3",
  },

  dateAdd: {
    fontSize: 12,
    color: "#595f6d",
  },

  titleAdd: {
    fontSize: 24,
    color: "white",
    fontWeight: "bold",
    paddingBottom: 2.5,
  },

  addNoteColor: {
    marginTop: "auto",
    marginBottom: "auto",
  },

  deleteButton: {
    backgroundColor: "#ff1717",
    borderRadius: 5,
    height: "100%",
    alignSelf: "flex-end",
    width: "30%",
    alignItems: "center",
    flexDirection: "row",
  },

  dropDown: {
    textAlign: "left",
    fontSize: 13.5,
    color: "white",
    fontWeight: "bold",
    paddingBottom: 5,
    paddingTop: 5,
    paddingLeft: 5,
  },

  test: {
    flexDirection: "row",
    alignSelf: "flex-start",
    marginTop: 5,
    paddingBottom: 5,
  },

  dropdownbuttonIcon: {
    marginLeft: "auto",
    marginRight: "auto",
    marginTop: "auto",
    marginBottom: "auto",
    borderRadius: 5,
    borderColor: "#949BA6",
    borderWidth: 1.5,
    paddingLeft: 3,
    paddingBottom: 3,
    paddingTop: 3,
    paddingRight: 2,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  blockSelect: {
    verticalAlign: "middle",
    justifyContent: "center",
    //flex: 1,
    marginLeft: "auto",
    marginRight: "auto",
  },

  greyBoxAddBlock: {
    backgroundColor: "#1d293b",
    borderRadius: 5,
    height: 150,
    width: "100%",
    alignSelf: "flex-end",
    alignItems: "center",
    flexDirection: "row",
  },

  deleteButtonIcon: {
    textAlign: "center",
    verticalAlign: "middle",
    justifyContent: "center",

    //flex: 1,
    marginLeft: "auto",
    marginRight: "auto",
  },

  homepageTitle: {
    fontSize: 17,
    color: "white",
    fontWeight: "bold",
    paddingBottom: "auto",
    paddingTop: "auto",
  },

  viewNew: {
    justifyContent: "center",
    marginRight: "auto",
    paddingTop: 10,
  },

  barNew: {
    justifyContent: "center",
    marginLeft: "auto",
  },

  swapBlock: {
    justifyContent: "center",
    marginRight: "auto",
    //verticalAlign: "middle",
  },

  rowAligin: {
    flexDirection: "row",
    marginRight: "auto",
    paddingBottom: 10,
    paddingTop: 10,
  },

  buttonIcon: {
    marginLeft: "auto",
    marginRight: "auto",
    marginTop: "auto",
    marginBottom: "auto",
    paddingLeft: 2.2,
  },

  playButton: {
    marginTop: "auto",
    marginBottom: "auto",
    paddingLeft: 17.5,
  },

  // buttonIconHome: {
  //   position: "relative",
  //   marginLeft: 100,
  //   height: 25,
  //   width: 25

  // },

  buttonText: {
    color: "white",
    textAlign: "center",
    fontSize: 15,
    paddingBottom: 5,
  },

  recordingBlock: {
    marginBottom: -15,
    marginLeft: -15,
  },

  noteHome: {
    width: "45%",
    backgroundColor: "#334155",
    borderRadius: 10,
    paddingBottom: 10,

    paddingLeft: 10,
    marginVertical: 10,
    paddingRight: 10,
  },

  sliderHome: {
    color: "black",
    textAlign: "center",
    fontSize: 16,
    width: 120,
    height: 30,
    verticalAlign: "middle",
  },

  beans: {
    borderRadius: 50,
  },

  backForAdd: {
    borderRadius: 70,
    backgroundColor: "#1f2a3b",
    justifyContent: "center",
    height: 64,
    width: 220,
    marginLeft: "auto",
    marginRight: "auto",
    marginBottom: 10,
    marginTop: 15,
  },

  verticalGap: {
    marginHorizontal: 10,
  },

  heartHome: {
    marginLeft: "auto",
    position: "absolute",
    marginLeft: 113,
    marginTop: 8,
  },

  noNotes: {
    fontSize: 24,
    marginLeft: "auto",
    marginRight: "auto",
    color: "#9fa2aa",
    flex: 1,
  },

  searchBar: {
    height: 50,
    fontSize: 16,
    paddingLeft: 17.5,
  },
  noteBoxTxt: {
    fontSize: 11,
  },

  Login: {
    fontSize: 32,
    color: "white",
    fontWeight: 500,
    lineHeight: 40 /* 125% */,
    letterSpacing: -1.5,
    textAlign: "center",
    paddingBottom: 50,
  },

  LoginImg: {
    
    justifyContent: 'center', 
    alignItems: 'center',    
    paddingBottom: 50,
  },

  loginTxt: {
    fontSize: 16,
    color: "white",
    fontWeight: 400,
    lineHeight: 16 /* 125% */,
    letterSpacing: -0.25,
    textAlign: "center",
  },
  loginTxtPurp: {
    fontSize: 16,
    color: "#DD00FF",
    fontWeight: 400,
    lineHeight: 16 /* 125% */,
    letterSpacing: -0.25,
    textDecorationLine: "underline",
    textAlign: "center",
    paddingBottom: 35,
  },

  loginButton: {
    borderRadius: 5,
    backgroundColor: "#C026D3",
    width: 230,
    height: 50,
    marginTop: 25,
    marginLeft: "auto",
    marginRight: "auto",
  },

  neAcButton: {
    borderRadius: 5,
    backgroundColor: "#4a5768",
    width: 230,
    height: 50,
    marginTop: 35,
    marginLeft: "auto",
    marginRight: "auto",
  },

  loginbuttonTxt: {
    marginBottom: "auto",
    marginLeft: "auto",
    marginRight: "auto",
    marginTop: "auto",
    color: "white",
    fontSize: 16,
  },

  searchBlocks: {
    flexDirection: "row",
    alignItems: "center",
  },

  searchBarBlocks: {
    height: 50,
    fontSize: 16,
    paddingLeft: 17.5,
    width: 150,
  },

  //TESTING
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  camera: {
    flex: 1,
  },
  buttonContainer: {
    flex: 1,
    flexDirection: "row",
    backgroundColor: "transparent",
    margin: 64,
  },
  button: {
    flex: 1,
    alignSelf: "flex-end",
    alignItems: "center",
  },
  text: {
    fontSize: 24,
    fontWeight: "bold",
    color: "white",
  },

  preview: {
    alignSelf: "stretch",
    flex: 1,
  },

  takePhoto: {
    flex: 1,
    alignSelf: "flex-end",
    alignItems: "center",
    marginTop: "99%",
    paddingRight: 15,
  },

  exit: {
    flex: 1,
    alignSelf: "flex-end",
    alignItems: "center",
    marginTop: "30%",
    paddingRight: 15,
  },

  dropdownMenu: {
    position: "absolute",
    top: 54, // Adjust this value to position the dropdown menu
    right: 50,
    backgroundColor: "#1d293b",
    padding: 15,
    borderRadius: 5,
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    zIndex: 1,
  },

  dropdownItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
  },
  dropdownItemText: {
    marginLeft: 10,
  },
});

//Styling and UI Done By Isaac Giesajtis 

export const layout = {};

export default styles;
