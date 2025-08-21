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
  inputCard: {
    backgroundColor: "#e3f2fd",
    borderRadius: 16,
    marginHorizontal: 20,
    marginBottom: 18,
    padding: 16,
    elevation: 2,
  },
  input: {
    fontSize: 16,
    color: "#222",
    backgroundColor: "#fff",
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 12,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#90caf9",
  },
  addBtn: {
    backgroundColor: "#3E6A85",
    borderRadius: 10,
    padding: 10,
    alignSelf: "flex-end",
    marginTop: 4,
  },
  list: {
    marginHorizontal: 20,
    marginBottom: 40,
  },
  itemCard: {
    borderRadius: 14,
    marginBottom: 30,
    padding: 1,
    elevation: 2,
  },
  itemRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 14,
    elevation: 1,
  },
  itemTitle: {
    fontSize: 17,
    color: "#3E6A85",
    fontWeight: "bold",
    marginBottom: 2,
  },
  itemInfo: {
    fontSize: 14,
    color: "#3ba4e6",
    marginBottom: 2,
  },
  itemLembrete: {
    fontSize: 13,
    color: "#f44336",
    fontStyle: "italic",
    marginBottom: 2,
  },
  emptyText: {
    textAlign: "center",
    color: "#888",
    marginTop: 40,
    fontSize: 15,
  },
  tabBar: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "#e3f2fd",
    flexDirection: "row",
    justifyContent: "space-around",
    height: 60,
    height: 60,
    borderTopWidth: 1,
    borderTopColor: "#cfd8dc",
    paddingBottom: 4,
  },
  tabItem: {
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
  },
  tabText: {
    fontSize: 11,
    color: "#3ba4e6",
    marginTop: 2,
    fontWeight: "bold",
  },
  headerTitle: {
    color: "#fff",
    fontSize: 22,
    fontWeight: "bold",
    textAlign: "center"
    
  }
});

export default styles;