import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  Alert,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { LinearGradient } from "expo-linear-gradient";
import { useIsFocused } from "@react-navigation/native";
import styles from "../componentes/styleTarefas";
import { TarefasApi } from "../servicos/api";

export default function Tarefas({ route }) {
  const [descricao, setDescricao] = useState("");
  const [tarefas, setTarefas] = useState([]);
  const isFocused = useIsFocused();

 
  useEffect(() => {
    if (route.params?.itensTarefas) {
      setDescricao(route.params.itensTarefas.descricao);
    }
  }, [route.params?.itensTarefas]);

  
  useEffect(() => {
    if (isFocused) {
      carregarTarefas();
    }
  }, [isFocused]);

  const carregarTarefas = async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      const response = await TarefasApi.get("/tasks", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setTarefas(response.data);
    } catch (error) {
      console.error("Erro ao carregar tarefas:", error);
      Alert.alert("Erro", "Não foi possível carregar as tarefas");
    }
  };

  const salvarTarefa = async () => {
    if (!descricao) {
      Alert.alert("Erro", "Preencha a descrição da tarefa");
      return;
    }

    try {
      const token = await AsyncStorage.getItem("token");
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
      setDescricao(""); 
      carregarTarefas(); 
      Alert.alert("Sucesso", "Tarefa salva com sucesso");
    } catch (error) {
      console.error("Erro ao salvar tarefa:", error);
      Alert.alert("Erro", "Não foi possível salvar a tarefa");
    }
  };

  const CheckFeito = async () => {

  }

  const ExcluirTarefa = async () => {
    try{
      await TarefasApi.delete(`delete-task/${id}`)
      carregarTarefas();
      Alert.alert("Sucesso", "Tarefa excluída com sucesso");
    } catch (error){
      console.error("Erro ao excluir tarefa:", error);
      Alert.alert("Erro", "Não foi possível excluir a tarefa");
    }
  }

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
        />
        <TouchableOpacity style={styles.addBtn} onPress={salvarTarefa}>
          <Icon name="plus" size={24} color="#fff" />
        </TouchableOpacity>
      </View>

      <FlatList
        data={tarefas}
        keyExtractor={(item) => item.id.toString()}
        style={styles.list}
        renderItem={({ item }) => (
          <LinearGradient
            colors={
              item.feito ? ["#90caf9", "#e3f2fd"] : ["#6EBBEB", "#3ba4e6"]
            }
            style={styles.itemCard}
          >
            <View style={styles.itemRow}>
              <TouchableOpacity onPress={() => marcarFeito(item.id)}>
                <Icon
                  name={
                    item.feito
                      ? "check-circle"
                      : "checkbox-blank-circle-outline"
                  }
                  size={26}
                  color={item.feito ? "#4caf50" : "#3ba4e6"}
                />
              </TouchableOpacity>
              <Text
                style={[
                  styles.itemText,
                  item.feito && {
                    textDecorationLine: "line-through",
                    color: "#888",
                  },
                ]}
              >
                {item.descricao}
              </Text>
              <TouchableOpacity onPress={ExcluirTarefa}>
                <Icon name="delete-outline" size={22} color="#f44336" />
              </TouchableOpacity>
            </View>
          </LinearGradient>
        )}
      />
    </View>
  );
}
