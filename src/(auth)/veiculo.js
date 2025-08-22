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

  // 🚀 TESTE AUTOMÁTICO DAS ROTAS
  useEffect(() => {
    const testarApi = async () => {
      try {
        const token = await AsyncStorage.getItem("token");
        const usuarioId = await AsyncStorage.getItem("userId");

        console.log("🔑 Token:", token);
        console.log("👤 UsuarioId:", usuarioId);

        // --- TESTE 1: query string ---
        try {
          const res1 = await VeiculosApi.get(`/vehicles?usuarioId=${usuarioId}`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          console.log("✅ TESTE 1 OK (query string):", res1.data);
        } catch (e) {
          console.log("❌ TESTE 1 falhou (query string):", e.response?.data || e.message);
        }

        // --- TESTE 2: rota dinâmica ---
        try {
          const res2 = await VeiculosApi.get(`/vehicles/usuario/${usuarioId}`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          console.log("✅ TESTE 2 OK (rota dinâmica):", res2.data);
        } catch (e) {
          console.log("❌ TESTE 2 falhou (rota dinâmica):", e.response?.data || e.message);
        }
      } catch (err) {
        console.log("Erro geral:", err.message);
      }
    };

    testarApi();
  }, []);

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

      if (!Array.isArray(response.data)) {
        setVeiculos([]);
        return;
      }

      const veiculosUsuario = response.data.filter((v) => {
        const usuarioId = v.userId ?? v.usuarioId ?? v.ownerId ?? v.user?.id;
        return String(usuarioId) === userId;
      });

      setVeiculos(veiculosUsuario);
    } catch (error) {
      console.error("Erro ao carregar veículos:", {
        message: error.message,
        status: error.response?.status,
        data: error.response?.data,
      });
      Alert.alert(
        "Erro",
        error.response?.data?.message || `Não foi possível carregar os veículos.`
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
      const userId = await AsyncStorage.getItem("userId");

      if (!token || !userId) {
        Alert.alert("Erro", "Faça o login novamente.");
        navigation.navigate("Login");
        return;
      }

      const payload = {
        marca,
        modelo,
        ano: anoNumero,
        placa,
        usuarioId: userId, // ✅ Corrigido para bater com seu backend
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

      setMarca("");
      setModelo("");
      setAno("");
      setPlaca("");
      setEditingVeiculoId(null);

      carregarVeiculos();
    } catch (error) {
      console.error("Erro ao salvar veículo:", {
        message: error.message,
        status: error.response?.status,
        data: error.response?.data,
      });
      Alert.alert(
        "Erro",
        error.response?.data?.message || `Não foi possível salvar o veículo.`
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
        error.response?.data?.message || `Não foi possível excluir o veículo.`
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

  const navegarParaLembretes = (veiculo) => { navigation.navigate("LembreteDeManutencao", { veiculoSelecionado: veiculo }); };
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
                <TouchableOpacity onPress={() => navegarParaLembretes(item)} style={{ marginRight: 10 }} >
                <Icon
                  name="car"
                  size={28}
                  color="#3E6A85"
                  style={{ marginRight: 10 }}
                />
                </TouchableOpacity>
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
                <TouchableOpacity
                  onPress={() => editarVeiculo(item)}
                  style={{ marginRight: 10 }}
                >
                  <Icon name="pencil-outline" size={24} color="#4CAF50" />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => excluirVeiculo(item.id)}>
                  <Icon name="delete-outline" size={24} color="#f44336" />
                </TouchableOpacity>
              </View>
            </LinearGradient>
          )}
        />
      )}


      <View style={styles.tabBar}>
        <TouchableOpacity style={styles.tabItem} onPress={() => navigation.navigate("Inicio")}>
          <Icon name="home-outline" size={24} color="#3ba4e6" />
          <Text style={styles.tabText}>Início</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.tabItem]} onPress={() => navigation.navigate("Compras")}>
          <Icon name="cart-outline" size={24} color="#3ba4e6" />
          <Text style={[styles.tabText, { color: "#3ba4e6" }]}>Compras</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.tabItem} onPress={() => navigation.navigate("Veiculo")}>
          <Icon name="car" size={24} color="#3ba4e6" />
          <Text style={styles.tabText}>Veículos</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.tabItem} onPress={() => navigation.navigate("Tarefas")}>
          <Icon name="check-circle-outline" size={24} color="#3ba4e6" />
          <Text style={styles.tabText}>Tarefas</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.tabItem} onPress={() => navigation.navigate("Perfil")}>
          <Icon name="account-circle-outline" size={24} color="#3ba4e6" />
          <Text style={styles.tabText}>Perfil</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
