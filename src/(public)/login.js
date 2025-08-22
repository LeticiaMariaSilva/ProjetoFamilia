import React, { useEffect, useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Image, SafeAreaView, Alert } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import Icon from "react-native-vector-icons/MaterialIcons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as WebBrowser from "expo-web-browser";
import * as Linking from "expo-linking";
import { useOAuth } from "@clerk/clerk-expo";

import styles from "../componentes/styleLogin";
import { LoginApi } from "../servicos/api";

// Completa sessão OAuth se o app voltou do navegador
WebBrowser.maybeCompleteAuthSession();

export default function Login({ navigation, route }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [MostrarSenha, setMostrarSenha] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const itensLogin = route.params?.itensLogin;
  const googleOAuth = useOAuth({ strategy: "oauth_google" });

  useEffect(() => {
    if (itensLogin) {
      setEmail(itensLogin.email || "");
      setPassword(itensLogin.password || "");
    }
  }, [itensLogin]);

  // Login tradicional
  const LogarUsuario = async () => {
    if (!email || !password) {
      Alert.alert("Erro", "Preencha todos os campos");
      return;
    }

    setLoading(true);
    try {
      const response = await LoginApi.post("/login", { email, password });
      const token = response.data.accessToken;
      const userId = response.data.user?.id || response.data.id;

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

  // Login com Google OAuth
  async function onGoogleSignIn() {
    try {
      setIsLoading(true);
      const redirectUrl = Linking.createURL("/");
      const oAuthFlow = await googleOAuth.startOAuthFlow({ redirectUrl });

      if (oAuthFlow.authSessionResult?.type === "success" && oAuthFlow.setActive) {
        await oAuthFlow.setActive({ session: oAuthFlow.createdSessionId });
        navigation.navigate("Inicio");
      } else {
        setIsLoading(false);
      }
    } catch (error) {
      console.log(error);
      setIsLoading(false);
    }
  }

  useEffect(() => {
    WebBrowser.warmUpAsync();
    return () => WebBrowser.coolDownAsync();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.topBackground}>
        <Image source={require("../imagens/perfilLogin.png")} style={styles.avatar} />
      </View>

      <View style={styles.content}>
        <Text style={styles.title}>Login</Text>
        <Text style={styles.subtitle}>Preencha os dados abaixo</Text>

        {/* Email */}
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

        {/* Senha */}
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

        {/* Botão login */}
        <TouchableOpacity style={styles.loginButton} onPress={LogarUsuario} disabled={loading}>
          <Text style={styles.loginButtonText}>{loading ? "Carregando..." : "Entrar"}</Text>
        </TouchableOpacity>

        <Text style={styles.orText}>Ou</Text>

        {/* Botões sociais */}
        <View style={styles.socialContainer}>
          <TouchableOpacity style={styles.socialButton} onPress={onGoogleSignIn} disabled={isLoading}>
            <Image source={require("../imagens/logoGoogle.png")} style={styles.socialIcon} />
          </TouchableOpacity>
        </View>

        {/* Cadastro */}
        <View style={styles.registerContainer}>
          <Text style={styles.registerText}>Não tem conta? </Text>
          <TouchableOpacity onPress={() => navigation.navigate("Cadastro")}>
            <Text style={styles.registerLink}>Cadastra-se</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}
