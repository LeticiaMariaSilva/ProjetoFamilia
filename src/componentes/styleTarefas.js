import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  bg: {
    flex: 1,
    backgroundColor: "#f8fafd",
    paddingTop: 40,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 20,
    borderRadius: 16,
    margin: 20,
    marginBottom: 10,
    elevation: 3,
  },
  title: {
    color: "#fff",
    fontSize: 22,
    fontWeight: "bold",
  },
  inputArea: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: 20,
    marginBottom: 16,
    backgroundColor: "#e3f2fd",
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: "#222",
    paddingVertical: 8,
    backgroundColor: "#fff",
    borderRadius: 8,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: "#90caf9",
  },
  addBtn: {
    backgroundColor: "#3ba4e6",
    borderRadius: 10,
    padding: 8,
    marginLeft: 8,
  },
  list: {
    marginHorizontal: 20,
  },
  itemCard: {
    borderRadius: 12,
    marginBottom: 12,
    elevation: 2,
    padding: 2,
  },
  itemRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 12,
    elevation: 1,
  },
  itemText: {
    flex: 1,
    fontSize: 16,
    color: "#3E6A85",
    fontWeight: "bold",
    marginLeft: 12,
  },
  emptyText: {
    textAlign: "center",
    color: "#888",
    marginTop: 40,
    fontSize: 15,
  },
});

export default styles;