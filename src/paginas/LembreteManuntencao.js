import React, { useEffect, useState } from "react";
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

export default function Veiculo({ route, navigation }) {
  const [marca, setMarca] = useState("");
  const [modelo, setModelo] = useState("");
  const [ano, setAno] = useState("");
  const [placa, setPlaca] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [editingVeiculosId, setEditingVeiculoId] = useState(null);
  const [veiculos, setVeiculos] = useState([]);
  const isFocused = useIsFocused();

  useEffect(() => {
    if (route.params?.itensVeiculos) {
      setMarca(route.params.itensVeiculos.marca || "");
      setModelo(route.params.itensVeiculos.modelo || "");
      setAno(String(route.params.itensVeiculos.ano || ""));
      setPlaca(route.params.itensVeiculos.placa || "");
      setEditingVeiculoId(route.params.itensVeiculos.id || null);
    } else {
      setMarca("");
      setModelo("");
      setAno("");
      setPlaca("");
      setEditingVeiculoId(null);
    }
  }, [route.params?.itensVeiculos]);

  useEffect(() => {
    if (isFocused) {
      carregarVeiculos();
    }
  }, [isFocused]);

  const carregarVeiculos = async () => {
    setIsLoading(true);
    try {
      const token = await AsyncStorage.getItem("token");
      const userId = await AsyncStorage.getItem("userId");

      if (!token || !userId) {
        Alert.alert("Erro", "Faça login novamente.");
        navigation.navigate("Login");
        return;
      }

      const response = await VeiculosApi.get(`/vehicles`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setVeiculos(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      console.error("Erro ao carregar veículos:", {
        message: error.message,
        status: error.response?.status,
        data: error.response?.data,
      });
      Alert.alert(
        "Erro",
        error.response?.data?.message ||
          `Não foi possível carregar os veículos.`
      );
    } finally {
      setIsLoading(false);
    }
  };

  const salvarVeiculo = async () => {
    const anoNumero = parseInt(ano, 10);

    if (!marca.trim() || !modelo.trim() || !anoNumero || !placa.trim()) {
      Alert.alert("Erro", "Preencha todos os campos.");
      return;
    }

    try {
      const token = await AsyncStorage.getItem("token");
      if (!token) {
        Alert.alert("Erro", "Faça o login novamente.");
        navigation.navigate("Login");
        return;
      }

      const payload = {
        marca,
        modelo,
        ano: anoNumero,
        placa,
      };

      if (editingVeiculosId) {
        await VeiculosApi.put(`/update-vehicle/${editingVeiculosId}`, payload, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
        Alert.alert("Sucesso", "Veículo atualizado com sucesso");
      } else {
        await VeiculosApi.post("/create-vehicle", payload, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
        Alert.alert("Sucesso", "Veículo salvo com sucesso");
      }

      // Resetar campos
      setMarca("");
      setModelo("");
      setAno("");
      setPlaca("");
      setEditingVeiculoId(null);

      // Atualizar lista
      carregarVeiculos();

    } catch (error) {
      console.error("Erro ao salvar veículo:", {
        message: error.message,
        status: error.response?.status,
        data: error.response?.data,
      });
      Alert.alert(
        "Erro",
        error.response?.data?.message ||
          `Não foi possível salvar o veículo.`
      );
    }
  };

  const excluirVeiculo = async (id) => {
    try {
      const token = await AsyncStorage.getItem("token");
      if (!token) {
        Alert.alert("Erro", "Faça o login novamente.");
        navigation.navigate("Login");
        return;
      }
      await VeiculosApi.delete(`/delete-vehicle/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      carregarVeiculos();
      Alert.alert("Sucesso", "Veículo excluído com sucesso");
    } catch (error) {
      console.error("Erro ao excluir veículo:", {
        message: error.message,
        status: error.response?.status,
        data: error.response?.data,
      });
      Alert.alert(
        "Erro",
        error.response?.data?.message ||
          `Não foi possível excluir o veículo.`
      );
    }
  };

  const editarVeiculo = (item) => {
    setMarca(item.marca);
    setModelo(item.modelo);
    setAno(String(item.ano));
    setPlaca(item.placa);
    setEditingVeiculoId(item.id);
  };

  return (
    <View style={styles.bg}>
      <LinearGradient colors={["#3E6A85", "#3E6A85"]} style={styles.header}>
        <Text style={styles.title}>Veículos</Text>
        <Icon name="car-outline" size={32} color="#fff" />
      </LinearGradient>

      <View style={styles.inputCard}>
        <TextInput
          style={styles.input}
          placeholder="Marca do veículo"
          placeholderTextColor="#3ba4e6"
          value={marca}
          onChangeText={setMarca}
        />
        <TextInput
          style={styles.input}
          placeholder="Modelo do veículo"
          placeholderTextColor="#3ba4e6"
          value={modelo}
          onChangeText={setModelo}
        />
        <TextInput
          style={styles.input}
          placeholder="Ano"
          placeholderTextColor="#3ba4e6"
          value={String(ano)}
          onChangeText={setAno}
          keyboardType="numeric"
        />
        <TextInput
          style={styles.input}
          placeholder="Placa - ABC1287"
          placeholderTextColor="#3ba4e6"
          value={placa}
          onChangeText={setPlaca}
        />
        <TouchableOpacity
          style={styles.addBtn}
          onPress={salvarVeiculo}
          accessibilityLabel={
            editingVeiculosId ? "Atualizar veículo" : "Adicionar veículo"
          }
        >
          <Icon
            name={editingVeiculosId ? "update" : "plus"}
            size={24}
            color="#fff"
          />
        </TouchableOpacity>
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
                />
                <View style={{ flex: 1 }}>
                  <Text style={styles.itemTitle}>{item.marca}</Text>
                  {item.modelo ? (
                    <Text style={styles.itemInfo}>Modelo: {item.modelo}</Text>
                  ) : null}
                  {item.ano ? (
                    <Text style={styles.itemInfo}>Ano: {item.ano}</Text>
                  ) : null}
                  {item.placa ? (
                    <Text style={styles.itemLembrete}>{item.placa}</Text>
                  ) : null}
                </View>
                {/* Botão de editar */}
                <TouchableOpacity
                  onPress={() => editarVeiculo(item)}
                  style={{ marginRight: 10 }}
                >
                  <Icon name="pencil-outline" size={24} color="#4CAF50" />
                </TouchableOpacity>
                {/* Botão de excluir */}
                <TouchableOpacity onPress={() => excluirVeiculo(item.id)}>
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
