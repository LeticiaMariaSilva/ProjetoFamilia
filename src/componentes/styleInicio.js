import { StyleSheet } from "react-native";

const styles = StyleSheet.create({

  
  bg: {
    flex: 1,
    backgroundColor: "#f8fafd",
    marginTop: 40,
  },
  container: {
    padding: 24,
  },
  welcome: {
    fontSize: 22,
    color: "#3ba4e6",
    fontWeight: "bold",
    marginBottom: 30,
  },
  name: {
    color: "#3ba4e6",
    fontWeight: "bold",
  },
  familyCard: {
    backgroundColor: "#3ba4e6",
    borderRadius: 16,
    padding: 18,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 30,
    shadowColor: "#3ba4e6",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 3,
  },
  familyTitle: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  familySubtitle: {
    color: "#e3f2fd",
    fontSize: 14,
    marginTop: 2,
  },
  familyIcon: {
    backgroundColor: "#ffb74d",
    borderRadius: 12,
    padding: 6,
  },
  menuRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
    gap: 8,
  },
  menuBtn: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 12,
    padding: 12,
    Width: 140,
    height: 70,
    marginHorizontal: 4,
    marginBottom: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.07,
    shadowRadius: 2,
    elevation: 1,
  },
  menuBtnLight: {
    backgroundColor: "#6EBBEB",
  },
  menuBtnRed: {
    backgroundColor: "#f44336",
  },
  menuBtnGreen: {
    backgroundColor: "#4caf50",
  },
  menuBtnBlue: {
    backgroundColor: "#3E6A85",
    opacity: "50%",
  },
  menuText: {
    marginLeft: 8,
    fontSize: 15,
    color: "#ffffff",
    fontWeight: "bold",
  },
  activitiesCard: {
    flex: 1,
  marginTop: 10,
  },

  activitiesTitle: {
    fontSize: 20,
    fontWeight: "700",
    marginBottom: 16,

    position: "relative",
    paddingLeft: 10,
  },

  // Para simular o efeito da barra lateral no título, você pode adicionar uma View antes do texto:
  titleAccent: {
    position: "absolute",
    left: 0,
    top: 2,
    width: 4,
    height: 20,
    backgroundColor: "#3ba4e6",
    borderRadius: 2,
  },

  activityItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(59, 164, 230, 0.03)",
    borderRadius: 12,
    padding: 16,
    marginBottom: 10,
    shadowColor: "#3ba4e6",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    borderColor: "#e3f2fd",
    borderWidth: 2,
    transform: [{ translateX: 2 }],
    transition: "transform 0.2s ease-in-out",
    
  },
  
  // Estado pressionado (equivalente ao hover)
  activityItemPressed: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(59, 164, 230, 0.03)",
    borderRadius: 12,
    padding: 16,
    
    transform: [{ translateX: 4 }],
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.12,
    shadowRadius: 12,
    elevation: 8,
  },

  activityDot: {
    width: 12,
    height: 12,
    borderRadius: 6, // 50% em React Native = metade do width/height
    marginRight: 12,
  },

  activityDotGreen: {
    backgroundColor: "#66bb6a",
     width: 12,
    height: 12,
    borderRadius: 6, // 50% em React Native = metade do width/height
    marginRight: 12,
  },

  activityDotBlue: {
    backgroundColor: "#4fc3f7",
    width: 12,
    height: 12,
    borderRadius: 6, // 50% em React Native = metade do width/height
    marginRight: 12,
  },

  activityDotRed: {
    backgroundColor: "#ef5350",
    width: 12,
    height: 12,
    borderRadius: 6, // 50% em React Native = metade do width/height
    marginRight: 12,
  },

  activityContent: {
    flex: 1,
  },

  activityText: {
    fontSize: 15,
    fontWeight: "500",
    color: "#333",
    marginBottom: 2,
  },

  activityTime: {
    fontSize: 13,
    color: "#888",
    fontWeight: "400",
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
  menuText2: {
    marginLeft: 3,
    fontSize: 15,
    color: "#ffffff",
    fontWeight: "bold",
  }
});

export default styles