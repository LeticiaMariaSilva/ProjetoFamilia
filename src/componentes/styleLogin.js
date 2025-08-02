import { StyleSheet} from 'react-native';


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8fafc",
  },
  topBackground: {
    backgroundColor: "#7cc3e6",
    height: 220,
    borderBottomLeftRadius: 200,
    borderBottomRightRadius: 200,
    alignItems: "center",
    justifyContent: "flex-end",
    paddingBottom: 0,
  },
  avatar: {
    width: 200,
    height: 200,
    marginBottom: -55,
  },
  content: {
    flex: 1,
    alignItems: "center",
    paddingHorizontal: 24,
    paddingTop: 70,
  },
  title: {
    color: "#4a90e2",
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 2,
  },
  subtitle: {
    color: "#888",
    fontSize: 15,
    marginBottom: 16,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderColor: "#b3d6f2",
    borderWidth: 2,
    borderRadius: 20,
    marginBottom: 12,
    paddingHorizontal: 12,
    width: "100%",
  },
  icon: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    height: 44,
    fontSize: 16,
  },
  forgotButton: {
    alignSelf: "flex-start",
    marginBottom: 12,
  },
  forgotText: {
    color: "#888",
    fontSize: 14,
  },
  loginButton: {
    backgroundColor: "#7cc3e6",
    borderRadius: 20,
    width: "100%",
    paddingVertical: 12,
    alignItems: "center",
    marginBottom: 16,
  },
  loginButtonText: {
    color: "#fff",
    fontSize: 17,
    fontWeight: "bold",
  },
  orText: {
    color: "#888",
    fontSize: 15,
    marginBottom: 10,
  },
  socialContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 16,
  },
  socialButton: {
    backgroundColor: "#fff",
    borderRadius: 50,
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
    marginHorizontal: 8,
    elevation: 2,
  },
  socialIcon: {
    width: 24,
    height: 24,
  },
  registerContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 8,
  },
  registerText: {
    color: "#222",
    fontSize: 15,
  },
  registerLink: {
    color: "#4a90e2",
    fontWeight: "bold",
    fontSize: 15,
  },
});

export default styles;