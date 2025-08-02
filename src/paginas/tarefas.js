import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, FlatList } from "react-native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { LinearGradient } from "expo-linear-gradient";
import styles from "../componentes/styleTarefas";

export default function Tarefas() {
  const [tarefa, setTarefa] = useState("");
  const [lista, setLista] = useState([
    { id: "1", texto: "Fazer lição de casa", feito: false },
    { id: "2", texto: "Limpar o quarto", feito: true },
    { id: "3", texto: "Regar as plantas", feito: false },
  ]);

  function adicionarTarefa() {
    if (tarefa.trim() === "") return;
    setLista([...lista, { id: Date.now().toString(), texto: tarefa, feito: false }]);
    setTarefa("");
  }

  function marcarFeito(id) {
    setLista(lista.map(item =>
      item.id === id ? { ...item, feito: !item.feito } : item
    ));
  }

  function removerTarefa(id) {
    setLista(lista.filter(item => item.id !== id));
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
          value={tarefa}
          onChangeText={setTarefa}
        />
        <TouchableOpacity style={styles.addBtn} onPress={adicionarTarefa}>
          <Icon name="plus" size={24} color="#fff" />
        </TouchableOpacity>
      </View>

      <FlatList
        data={lista}
        keyExtractor={item => item.id}
        style={styles.list}
        renderItem={({ item }) => (
          <LinearGradient colors={item.feito ? ["#90caf9", "#e3f2fd"] : ["#6EBBEB", "#3ba4e6"]} style={styles.itemCard}>
            <View style={styles.itemRow}>
              <TouchableOpacity onPress={() => marcarFeito(item.id)}>
                <Icon
                  name={item.feito ? "check-circle" : "checkbox-blank-circle-outline"}
                  size={26}
                  color={item.feito ? "#4caf50" : "#3ba4e6"}
                />
              </TouchableOpacity>
              <Text
                style={[
                  styles.itemText,
                  item.feito && { textDecorationLine: "line-through", color: "#888" }
                ]}
              >
                {item.texto}
              </Text>
              <TouchableOpacity onPress={() => removerTarefa(item.id)}>
                <Icon name="delete-outline" size={22} color="#f44336" />
              </TouchableOpacity>
            </View>
          </LinearGradient>
        )}
        ListEmptyComponent={
          <Text style={styles.emptyText}>Nenhuma tarefa cadastrada.</Text>
        }
      />
    </View>
  );
}