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
import styles from "../componentes/styleTarefas";
import { TarefasApi } from "../servicos/api";

export default function Tarefas({ route, navigation }) {
  const [descricao, setDescricao] = useState("");
  const [tarefas, setTarefas] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [editingTaskId, setEditingTaskId] = useState(null);
  const isFocused = useIsFocused();

  useEffect(() => {
    if (route.params?.itensTarefas) {
      setDescricao(route.params.itensTarefas.descricao);
      setEditingTaskId(route.params.itensTarefas.id);
    } else {
      setDescricao("");
      setEditingTaskId(null);
    }
  }, [route.params?.itensTarefas]);

  useEffect(() => {
    if (isFocused) {
      carregarTarefas();
    }
  }, [isFocused]);

  const carregarTarefas = async () => {
    setIsLoading(true);
    try {
      const token = await AsyncStorage.getItem("token");
      const userId = await AsyncStorage.getItem("userId"); // salvo no login

      if (!token || !userId) {
        Alert.alert("Erro", "Faça login novamente.");
        navigation.navigate("Login");
        return;
      }

    
      const response = await TarefasApi.get(`/tasks/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setTarefas(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      console.error("Erro ao carregar tarefas:", {
        message: error.message,
        status: error.response?.status,
        data: error.response?.data,
      });
      Alert.alert(
        "Erro",
        error.response?.data?.message || "Não foi possível carregar as tarefas."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const salvarTarefa = async () => {
    if (!descricao.trim()) {
      Alert.alert("Erro", "A descrição da tarefa não pode estar vazia.");
      return;
    }

    try {
      const token = await AsyncStorage.getItem("token");
      if (!token) {
        Alert.alert("Erro", "Faça login novamente.");
        navigation.navigate("Login");
        return;
      }

      if (editingTaskId) {
        await TarefasApi.put(
          `/update-task/${editingTaskId}`,
          { descricao, status: false },
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );
        Alert.alert("Sucesso", "Tarefa atualizada com sucesso");
      } else {
        await TarefasApi.post(
          "/create-task",
          { descricao },
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );
        Alert.alert("Sucesso", "Tarefa salva com sucesso");
      }

      setDescricao("");
      setEditingTaskId(null);
      carregarTarefas();
    } catch (error) {
      console.error(
        "Erro ao salvar tarefa:",
        error.response?.data || error.message
      );
      Alert.alert(
        "Erro",
        error.response?.data?.message || "Não foi possível salvar a tarefa."
      );
    }
  };

  const marcarFeito = async (id, statusAtual) => {
    try {
      const token = await AsyncStorage.getItem("token");
      if (!token) {
        Alert.alert("Erro", "Faça login novamente.");
        navigation.navigate("Login");
        return;
      }

      await TarefasApi.put(
        `/update-task/${id}`,
        { status: !statusAtual },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      carregarTarefas();
    } catch (error) {
      console.error(
        "Erro ao atualizar tarefa:",
        error.response?.data || error.message
      );
      Alert.alert(
        "Erro",
        error.response?.data?.message || "Não foi possível atualizar a tarefa."
      );
    }
  };

  const excluirTarefa = async (id) => {
    try {
      const token = await AsyncStorage.getItem("token");
      if (!token) {
        Alert.alert("Erro", "Faça login novamente.");
        navigation.navigate("Login");
        return;
      }
      await TarefasApi.delete(`/delete-task/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      carregarTarefas();
      Alert.alert("Sucesso", "Tarefa excluída com sucesso");
    } catch (error) {
      console.error(
        "Erro ao excluir tarefa:",
        error.response?.data || error.message
      );
      Alert.alert(
        "Erro",
        error.response?.data?.message || "Não foi possível excluir a tarefa."
      );
    }
  };

  return (
    <View style={styles.bg}>
      <LinearGradient colors={["#66bb6a", "#66bb6a"]} style={styles.header}>
        <Text style={styles.title}>Tarefas</Text>
        <Icon name="check-circle-outline" size={32} color="#fff" />
      </LinearGradient>

      <View style={styles.inputArea}>
        <TextInput
          style={styles.input}
          placeholder="Nova tarefa..."
          placeholderTextColor="#3ba4e6"
          value={descricao}
          onChangeText={setDescricao}
          accessibilityLabel="Digite uma nova tarefa"
        />
        <TouchableOpacity
          style={styles.addBtn}
          onPress={salvarTarefa}
          accessibilityLabel={
            editingTaskId ? "Atualizar tarefa" : "Adicionar tarefa"
          }
        >
          <Icon
            name={editingTaskId ? "update" : "plus"}
            size={24}
            color="#fff"
          />
        </TouchableOpacity>
      </View>

      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#66bb6a" />
          <Text style={styles.loadingText}>Carregando tarefas...</Text>
        </View>
      ) : tarefas.length === 0 ? (
        <Text style={styles.emptyText}>Nenhuma tarefa disponível</Text>
      ) : (
        <FlatList
          data={tarefas}
          keyExtractor={(item) => item.id.toString()}
          style={styles.list}
          renderItem={({ item }) => (
            <LinearGradient
              colors={
                item.status ? ["#90caf9", "#e3f2fd"] : ["#6EBBEB", "#3ba4e6"]
              }
              style={styles.itemCard}
            >
              <View style={styles.itemRow}>
                <TouchableOpacity
                  onPress={() => marcarFeito(item.id, item.status)}
                  accessibilityLabel={
                    item.status
                      ? "Desmarcar tarefa"
                      : "Marcar tarefa como concluída"
                  }
                >
                  <Icon
                    name={
                      item.status
                        ? "check-circle"
                        : "checkbox-blank-circle-outline"
                    }
                    size={26}
                    color={item.status ? "#4caf50" : "#3ba4e6"}
                  />
                </TouchableOpacity>
                <Text
                  style={[
                    styles.itemText,
                    item.status && {
                      textDecorationLine: "line-through",
                      color: "#888",
                    },
                  ]}
                >
                  {item.descricao}
                </Text>
                <TouchableOpacity
                  onPress={() => excluirTarefa(item.id)}
                  accessibilityLabel="Excluir tarefa"
                >
                  <Icon name="delete-outline" size={22} color="#f44336" />
                </TouchableOpacity>
              </View>
            </LinearGradient>
          )}
        />
      )}
    </View>
  );
}

