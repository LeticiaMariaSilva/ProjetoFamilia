import { StyleSheet } from "react-native";

const style = StyleSheet.create({
  container: {
    backgroundColor: "#F8FAFE",
    flex: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  imageTasks: {
    width: '100%',
    height: 390,
  },
  header: {
    alignItems: "center",
    justifyContent: "center",
    marginTop: 30,
  },
  TextContainer: {
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 20,
    backgroundColor: "#F8FAFE",
  },
  Title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#6EBBEB",
    textAlign: "center",
    paddingTop: 20,
    lineHeight: 32,
  },
  SubTitle: {
    fontSize: 16,
    color: "#475569",
    textAlign: "center",
    paddingTop: 10,
    lineHeight: 24,
  },
  startButton: {
    marginTop: 40,
    height: 50,
    width: 300,
    textAlign: "center",
    justifyContent: "center",
    backgroundColor: "#6EBBEB",
    borderRadius: 25,
  },
  startButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
  },
  startButtonContainer: {
    justifyContent: "center",
    alignItems: "center",
  },
});

export default style;
