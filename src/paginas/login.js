import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  SafeAreaView,
  Alert,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import styles from "../componentes/styleLogin";
import { LoginApi } from "../servicos/api";
import { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Icon from "react-native-vector-icons/MaterialIcons";

export default function Login({ navigation, route }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [MostrarSenha, setMostrarSenha] = useState(false);

  const itensLogin = route.params?.itensLogin;

  useEffect(() => {
    if (itensLogin) {
      setEmail(itensLogin.email || "");
      setPassword(itensLogin.password || "");
    }
  }, [itensLogin]);

  const LogarUsuario = async () => {
    if (!email || !password) {
      Alert.alert("Erro", "Preencha todos os campos");
      return;
    }

    setLoading(true);
    try {
      const response = await LoginApi.post("/login", { email, password });
      const token = response.data.accessToken;
      const userId = response.data.user?.id || response.data.id; // Ajustar se o backend retorna diferente

      if (!token || !userId) {
        Alert.alert("Erro", "Credenciais inválidas");
        return;
      }

      await AsyncStorage.setItem("token", token);
      await AsyncStorage.setItem("userId", String(userId));

      console.log("Usuário logado com sucesso");
      navigation.navigate("Inicio");
    } catch (error) {
      console.error(error);
      Alert.alert("Erro", "Ocorreu um erro ao fazer login");
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.topBackground}>
        <Image
          source={require("../imagens/perfilLogin.png")}
          style={styles.avatar}
        />
      </View>
      <View style={styles.content}>
        <Text style={styles.title}>Login</Text>
        <Text style={styles.subtitle}>Preencha os dados abaixo</Text>

        <View style={styles.inputContainer}>
          <MaterialIcons name="email" size={22} color="#4a90e2" style={styles.icon} />
          <TextInput
            placeholder="Email"
            style={styles.input}
            keyboardType="email-address"
            autoCapitalize="none"
            value={email}
            onChangeText={setEmail}
          />
        </View>

        <View style={styles.inputContainer}>
          <MaterialIcons name="lock" size={22} color="#4a90e2" style={styles.icon} />
          <TextInput
            placeholder="Senha"
            value={password}
            onChangeText={setPassword}
            style={styles.input}
            secureTextEntry={!MostrarSenha}
          />
          <TouchableOpacity onPress={() => setMostrarSenha(!MostrarSenha)} style={styles.eyeIcon}>
            <Icon name={MostrarSenha ? "visibility" : "visibility-off"} size={22} color="#4a90e2" />
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.forgotButton}>
          <Text style={styles.forgotText}>Esqueceu senha?</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.loginButton}
          onPress={LogarUsuario}
          disabled={loading}
        >
          <Text style={styles.loginButtonText}>
            {loading ? "Carregando..." : " Entrar"}
          </Text>
        </TouchableOpacity>

        <Text style={styles.orText}>Ou</Text>
        <View style={styles.socialContainer}>
          <TouchableOpacity style={styles.socialButton}>
            <Image
              source={require("../imagens/logoGoogle.png")}
              style={styles.socialIcon}
            />
          </TouchableOpacity>
          <TouchableOpacity style={styles.socialButton}>
            <Image
              source={require("../imagens/logos_facebook.png")}
              style={styles.socialIcon}
            />
          </TouchableOpacity>
        </View>

        <View style={styles.registerContainer}>
          <Text style={styles.registerText}>Não tem conta? </Text>
          <TouchableOpacity>
            <Text
              style={styles.registerLink}
              onPress={() => navigation.navigate("Cadastro")}
            >
              Cadastra-se
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

