import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  Modal,
  TextInput,
  Alert,
  ScrollView,
} from "react-native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { LinearGradient } from "expo-linear-gradient";
import styles from "../componentes/stylePerfil";
import { useIsFocused } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { PerfilApi } from "../servicos/api";
import * as ImagePicker from "expo-image-picker";


const membros = [
  { id: "1", nome: "Alex Silva", tipo: "Administrador" },
  { id: "2", nome: "Maria Silva", tipo: "Mãe" },
  { id: "3", nome: "Pedro Silva", tipo: "Filho" },
  { id: "4", nome: "João Silva", tipo: "Filho" },
];

export default function Perfil({ route, navigation }) {
  const [modalVisible, setModalVisible] = useState(false);
  const [modalSenhaVisible, setModalSenhaVisible] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [usuario, setUsuario] = useState(null);
  const [notificacoes, setNotificacoes] = useState(true);
  const [senhaAtual, setSenhaAtual] = useState("");
  const [novaSenha, setNovaSenha] = useState("");
  const [avatar, setAvatar] = useState(
    "https://cdn-icons-png.flaticon.com/512/9131/9131529.png"
  );
  const [MostrarSenha, setMostrarSenha] = useState(false);

  const isFocused = useIsFocused();

  useEffect(() => {
    if (isFocused) {
      carregarPerfil();
    }
  }, [isFocused]);

  const carregarPerfil = async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      const userId = await AsyncStorage.getItem("userId");
      const savedAvatar = await AsyncStorage.getItem("userAvatar");

      if (!token || !userId) {
        Alert.alert("Erro", "Faça login novamente");
        navigation.navigate("Login");
        return;
      }

      const response = await PerfilApi.get(`/user/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      console.log("Dados do usuário:", response.data);
      setUsuario(response.data);
      setAvatar(
        savedAvatar || "https://cdn-icons-png.flaticon.com/512/9131/9131529.png"
      );
    } catch (error) {
      console.error("Erro ao carregar perfil", {
        message: error.message,
        status: error.response?.status,
        data: error.response?.data,
      });
      Alert.alert(
        "Erro",
        error.response?.data?.message || "Erro ao carregar perfil"
      );
    }
  };

  const salvarEdicao = async () => {
    if (!name.trim() || !email.trim()) {
      Alert.alert("Erro", "Os campos não podem estar vazios.");
      return;
    }

    try {
      const token = await AsyncStorage.getItem("token");
      const userId = await AsyncStorage.getItem("userId");

      if (!token || !userId) {
        Alert.alert("Erro", "Faça login novamente");
        navigation.navigate("Login");
        return;
      }

      const response = await PerfilApi.put(
        `/update-user/${userId}`,
        { name: name.trim(), email: email.trim() },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("Resposta update:", response.data);
      Alert.alert("Sucesso", "Usuário atualizado com sucesso");
      setModalVisible(false);
      carregarPerfil();
      setName("");
      setEmail("");
    } catch (error) {
      console.error("Erro ao salvar dados do usuário:", error);
      Alert.alert(
        "Erro",
        error.response?.data?.message ||
          error.message ||
          "Não foi possível salvar os dados do usuário"
      );
    }
  };

  const salvarSenha = async () => {
    if (!senhaAtual || !novaSenha) {
      Alert.alert("Erro", "Preencha todos os campos.");
      return;
    }

    try {
      const token = await AsyncStorage.getItem("token");
      const userId = await AsyncStorage.getItem("userId");

      if (!token || !userId) {
        Alert.alert("Erro", "Faça login novamente");
        navigation.navigate("Login");
        return;
      }

      console.log("Enviando para API:", {
        currentPassword: senhaAtual,
        password: novaSenha,
      });

      const response = await PerfilApi.put(
        `/update-user/${userId}/password`,
        { currentPassword: senhaAtual, password: novaSenha },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      Alert.alert("Sucesso", "Senha alterada com sucesso!");
      setModalSenhaVisible(false);
      setSenhaAtual("");
      setNovaSenha("");
    } catch (error) {
      console.error("Erro ao alterar senha:", {
        message: error.message,
        status: error.response?.status,
        data: error.response?.data,
      });
      Alert.alert(
        "Erro",
        error.response?.data?.message || "Não foi possível alterar a senha"
      );
    }
  };

  const abrirCamera = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("Permissão negada", "Você precisa liberar acesso à câmera.");
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.7,
    });

    if (!result.canceled) {
      const uri = result.assets[0].uri;
      setAvatar(uri);
      await AsyncStorage.setItem("userAvatar", uri);
      Alert.alert("Sucesso", "Avatar atualizado com sucesso!");
    }
  };

  const abrirGaleria = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("Permissão negada", "Você precisa liberar acesso à galeria.");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.7,
    });

    if (!result.canceled) {
      const uri = result.assets[0].uri;
      setAvatar(uri);
      await AsyncStorage.setItem("userAvatar", uri);
      Alert.alert("Sucesso", "Avatar atualizado com sucesso!");
    }
  };

  function sairConta() {
    Alert.alert("Sair", "Deseja realmente sair da conta?", [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Sair",
        style: "destructive",
        onPress: async () => {
          await AsyncStorage.removeItem("token");
          await AsyncStorage.removeItem("userId");
          await AsyncStorage.removeItem("userAvatar");
          navigation.replace("Login");
        },
      },
    ]);
  }

  return (
    <ScrollView style={styles.bg} contentContainerStyle={{ paddingBottom: 40 }}>
      <LinearGradient colors={["#6EBBEB", "#3E6A85"]} style={styles.header}>
        <Text style={styles.title}>Perfil</Text>
        <TouchableOpacity
          style={styles.configBtn}
          onPress={() => navigation.goBack()}
        >
          <Icon name="arrow-left" size={28} color="#fff" />
        </TouchableOpacity>
      </LinearGradient>

      {/* --- Avatar --- */}
      <View style={styles.avatarArea}>
        <Image source={{ uri: avatar }} style={styles.avatar} />
        <TouchableOpacity
          style={styles.editAvatar}
          onPress={() =>
            Alert.alert("Foto de Perfil", "Escolha uma opção:", [
              { text: "Cancelar", style: "cancel" },
              { text: "Câmera", onPress: abrirCamera },
              { text: "Galeria", onPress: abrirGaleria },
            ])
          }
        >
          <Icon name="camera" size={22} color="#fff" />
        </TouchableOpacity>
      </View>

      {/* --- Exibição do perfil --- */}
      <View style={styles.infoCard}>
        <View style={styles.infoRow}>
          <Icon name="account" size={22} color="#3ba4e6" />
          <Text style={styles.infoLabel}>Nome:</Text>
          <Text style={styles.infoText}>{usuario?.name || "—"}</Text>
        </View>
        <View style={styles.infoRow}>
          <Icon name="email" size={22} color="#3ba4e6" />
          <Text style={styles.infoLabel}>Email:</Text>
          <Text style={styles.infoText}>{usuario?.email || "—"}</Text>
        </View>

        <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
          <TouchableOpacity
            style={[styles.editBtn, { flex: 1, marginRight: 5 }]}
            onPress={() => {
              setName(usuario?.name || "");
              setEmail(usuario?.email || "");
              setModalVisible(true);
            }}
          >
            <Icon name="pencil" size={20} color="#fff" />
            <Text style={styles.editBtnText}>Editar Perfil</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.editBtn, { flex: 1, marginLeft: 5 }]}
            onPress={() => setModalSenhaVisible(true)}
          >
            <Icon name="lock-reset" size={20} color="#fff" />
            <Text style={styles.editBtnText}>Mudar Senha</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* --- Notificações --- */}
      <View style={styles.sectionCard}>
        <View style={styles.sectionHeader}>
          <Icon name="bell-outline" size={22} color="#3ba4e6" />
          <Text style={styles.sectionTitle}>Notificações</Text>
        </View>
        <TouchableOpacity
          style={styles.switchRow}
          onPress={() => setNotificacoes(!notificacoes)}
        >
          <Text style={styles.switchLabel}>
            {notificacoes ? "Ativadas" : "Desativadas"}
          </Text>
          <Icon
            name={notificacoes ? "toggle-switch" : "toggle-switch-off-outline"}
            size={32}
            color={notificacoes ? "#3ba4e6" : "#888"}
          />
        </TouchableOpacity>
      </View>

      {/* --- Membros da Família --- */}
      <View style={styles.sectionCard}>
        <View style={styles.sectionHeader}>
          <Icon name="account-group-outline" size={22} color="#3ba4e6" />
          <Text style={styles.sectionTitle}>Membros da Família</Text>
        </View>
        {membros.map((item) => (
          <View key={item.id} style={styles.memberRow}>
            <Icon name="account-circle" size={28} color="#6EBBEB" />
            <View style={{ marginLeft: 10 }}>
              <Text style={styles.memberName}>{item.nome}</Text>
              <Text style={styles.memberType}>{item.tipo}</Text>
            </View>
          </View>
        ))}
      </View>

      {/* --- Sair da conta --- */}
      <TouchableOpacity style={styles.logoutBtn} onPress={sairConta}>
        <Icon name="logout" size={22} color="#fff" />
        <Text style={styles.logoutText}>Sair da Conta</Text>
      </TouchableOpacity>

      {/* --- Modal de edição de perfil --- */}
      <Modal visible={modalVisible} animationType="slide" transparent>
        <View style={styles.modalBg}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>Editar Perfil</Text>
            <TextInput
              style={styles.modalInput}
              value={name}
              onChangeText={setName}
              placeholder="Nome"
            />
            <TextInput
              style={styles.modalInput}
              value={email}
              onChangeText={setEmail}
              placeholder="Email"
              keyboardType="email-address"
            />

            <View style={styles.modalBtns}>
              <TouchableOpacity style={styles.saveBtn} onPress={salvarEdicao}>
                <Icon name="check" size={20} color="#fff" />
                <Text style={styles.saveBtnText}>Salvar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.cancelBtn}
                onPress={() => setModalVisible(false)}
              >
                <Icon name="close" size={20} color="#fff" />
                <Text style={styles.saveBtnText}>Cancelar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* --- Modal de mudança de senha --- */}
      <Modal visible={modalSenhaVisible} animationType="slide" transparent>
        <View style={styles.modalBg}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>Mudar Senha</Text>
            <TextInput
              style={styles.modalInput}
              value={senhaAtual}
              onChangeText={setSenhaAtual}
              placeholder="Senha Atual"
              secureTextEntry={!MostrarSenha}
            />
            <TouchableOpacity
              onPress={() => setMostrarSenha(!MostrarSenha)}
              style={styles.eyeIcon}
            >
              <Icon
                name={MostrarSenha ? "eye" : "visibility-off"}
                size={22}
                color="#4a90e2"
              />
            </TouchableOpacity>

            <TextInput
              style={styles.modalInput}
              value={novaSenha}
              onChangeText={setNovaSenha}
              placeholder="Nova Senha"
              secureTextEntry
            />
            <TouchableOpacity
              onPress={() => setMostrarSenha(!MostrarSenha)}
              style={styles.eyeIcon}
            >
              <Icon
                name={MostrarSenha ? "visibility" : "visibility-off"}
                size={22}
                color="#4a90e2"
              />
            </TouchableOpacity>

            <View style={styles.modalBtns}>
              <TouchableOpacity style={styles.saveBtn} onPress={salvarSenha}>
                <Icon name="check" size={20} color="#fff" />
                <Text style={styles.saveBtnText}>Salvar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.cancelBtn}
                onPress={() => setModalSenhaVisible(false)}
              >
                <Icon name="close" size={20} color="#fff" />
                <Text style={styles.saveBtnText}>Cancelar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
}
