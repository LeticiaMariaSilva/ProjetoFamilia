import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  SafeAreaView,
  Alert,
} from "react-native";
import styles from "../componentes/styleCadastro";
import { MaterialIcons, FontAwesome6 } from "@expo/vector-icons";
import React, { useState, useEffect } from "react";
import { CadastroApi } from "../servicos/api";

export default function Cadastro({ navigation, route }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const itensCadastro = route.params?.itensCadastro;

  useEffect(() => {
    if (itensCadastro) {
      setName(itensCadastro.name || "");
      setEmail(itensCadastro.email || "");
      setPassword(itensCadastro.password || "");
    }
  }, [itensCadastro]);

  const SalvarUsuario = async () => {
    const validarEmail = (email) => {
      const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return regex.test(email);
    };

    const validarSenha = (password) => {
      return password.length >= 6;
    };

    if (!name || !email || !password) {
      Alert.alert("Erro", "Preencha todos os campos");
      console.log("Preencha todos os campos");
      return;
    }

    if (!validarEmail(email)) {
      Alert.alert("Erro", "Email inválido");
      console.log("Email inválido");
      return;
    }

    if (!validarSenha(password)) {
      Alert.alert("Erro", "A senha deve ter pelo menos 6 caracteres");
      console.log("Senha inválida");
      return;
    }

    setLoading(true);
    try {
      const response = await CadastroApi.post("/register", {
        name,
        email,
        password,
      });
      console.log("Usuário cadastrado:", response.data);
      Alert.alert("Sucesso", "Usuário cadastrado com sucesso!");
      navigation.navigate("Login");
    } catch (error) {
      console.error("Erro ao cadastrar usuário:", error);
      Alert.alert("Erro", "Não foi possível cadastrar o usuário. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.topBackground}>
        <Image
          source={require("../imagens/User_CriarConta.png")}
          style={styles.avatar}
        />
      </View>
      <View style={styles.content}>
        <Text style={styles.title}>Criar conta</Text>
        <Text style={styles.subtitle}>Preencha os dados abaixo</Text>
        <View style={styles.inputContainer}>
          <FontAwesome6
            name="user-large"
            size={18}
            color="#4a90e2"
            style={styles.icon}
          />
          <TextInput
            placeholder="Nome"
            style={styles.input}
            value={name}
            onChangeText={setName}
            autoCapitalize="none"
          />
        </View>
        <View style={styles.inputContainer}>
          <MaterialIcons
            name="email"
            size={22}
            color="#4a90e2"
            style={styles.icon}
          />
          <TextInput
            placeholder="Email"
            style={styles.input}
            keyboardType="email-address"
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
          />
        </View>
        <View style={styles.inputContainer}>
          <MaterialIcons
            name="lock"
            size={22}
            color="#4a90e2"
            style={styles.icon}
          />
          <TextInput
            placeholder="Senha"
            style={styles.input}
            secureTextEntry={true}
            value={password}
            onChangeText={setPassword}
            autoCapitalize="none"
          />
        </View>
        <TouchableOpacity
          style={[styles.loginButton, loading && { opacity: 0.6 }]}
          onPress={SalvarUsuario}
          disabled={loading}
        >
          <Text style={styles.loginButtonText}>
            {loading ? "Carregando..." : "Criar conta"}
          </Text>
        </TouchableOpacity>
        <View style={styles.registerContainer}>
          <Text style={styles.registerText}>Já tem uma conta? </Text>
          <TouchableOpacity onPress={() => navigation.navigate("Login")}>
            <Text style={styles.registerLink}>Entrar</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}