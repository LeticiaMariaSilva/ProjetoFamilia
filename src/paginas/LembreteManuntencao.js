import { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  Alert,
  ActivityIndicator,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { LinearGradient } from "expo-linear-gradient";
import { useIsFocused } from "@react-navigation/native";
import styles from "../componentes/styleVeiculos";
import { VeiculosApi } from "../servicos/api";

export default function LembreteDeManutencao({ route, navigation }) {
  const [descricao, setDescricao] = useState("");
  const [data, setData] = useState("");
  const [valor, setValor] = useState("");
  const [idVeiculos, setIdVeiculos] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [editingVeiculosId, setEditingVeiculoId] = useState(null);
  const [veiculos, setVeiculos] = useState([]);
  const isFocused = useIsFocused();

  useEffect(() => {
    if (route.params?.itensVeiculos) {
      setDescricao(route.params.itensVeiculos.descricao || "");
      setData(route.params.itensVeiculos.data || "");
      setValor(route.params.itensVeiculos.valor || "");
      setIdVeiculos(route.params.itensVeiculos.idVeiculos || "");
      setEditingVeiculoId(route.params.itensVeiculos.id || null);

    } else {
      setDescricao("");
      setData("");
      setValor("");
      setIdVeiculos("");
      setEditingVeiculoId(null);
    }
  }, [route.params?.itensVeiculos]);

  useEffect(() => {
    if (isFocused) {
      carregarVeiculos();
    }
  });

  const carregarVeiculos = async () => {
    setIsLoading(true);
    try {
      const token = await AsyncStorage.getItem("token");
      const userId = await AsyncStorage.getItem("userId");

      if (!token || !userId) {
        Alert.alert("Erro", "Faça login novamente");
        navigation.navigate("Login");
        return;
      }
      const response = await VeiculosApi.get(`/vehicle/${UserId}/maintenance`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setVeiculos(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      console.error("Erro ao carregar lembretes", {
        message: error.message,
        status: error.response?.status,
        data: error.response?.data,
      });
      Alert.alert(
        "Erro",
        error.response?.data?.message ||
          `Não foi possível carregar os lembretes.`
      );
    }
  };

  return (
    <View style={styles.bg}>
      <LinearGradient colors={["#3E6A85", "#3E6A85"]} style={styles.header}>
        <Text></Text>
      </LinearGradient>

      <View style={styles.inputCard}>
        <TextInput
          style={styles.input}
          placeholder="Descrição"
          placeholderTextColor="#3ba4e6"
        />
        <TextInput
          style={styles.input}
          placeholder="Data"
          placeholderTextColor="#3ba4e6"
        />
        <TextInput
          style={styles.input}
          placeholder="Valor"
          placeholderTextColor="#3ba4e6"
          keyboardType="numeric"
        />
        <TouchableOpacity></TouchableOpacity>
      </View>

      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#3E6A85" />
          <Text style={styles.loadingText}>Carregando veículos...</Text>
        </View>
      ) : veiculos.length === 0 ? (
        <Text style={styles.emptyText}> Nenhum veículo cadastrado</Text>
      ) : (
        <FlatList
          data={veiculos}
          keyExtractor={(item) => item.id.toString()}
          style={styles.list}
          renderItem={({ item }) => (
            <LinearGradient
              colors={["#6EBBEB", "#3E6A85"]}
              style={styles.itemCard}
            >
              <View style={styles.itemRow}>
                <Icon
                  name="car"
                  size={28}
                  color="#3E6A85"
                  style={{ marginRight: 10 }}
                  onPress={() => navigation.navigate("LembreteDeManutencao")}
                />
                <View style={{ flex: 1 }}>
                  <Text style={styles.itemTitle}>{item.descricao}</Text>
                  {item.data ? (
                    <Text style={styles.itemInfo}>Modelo: {item.data}</Text>
                  ) : null}
                  {item.valor ? (
                    <Text style={styles.itemInfo}>Ano: {item.valor}</Text>
                  ) : null}
                </View>
                {/* Botão de editar */}
                <TouchableOpacity style={{ marginRight: 10 }}>
                  <Icon name="pencil-outline" size={24} color="#4CAF50" />
                </TouchableOpacity>
                {/* Botão de excluir */}
                <TouchableOpacity>
                  <Icon name="delete-outline" size={24} color="#f44336" />
                </TouchableOpacity>
              </View>
            </LinearGradient>
          )}
        />
      )}
    </View>
  );
}
