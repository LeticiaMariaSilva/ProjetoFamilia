import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, FlatList } from "react-native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { LinearGradient } from "expo-linear-gradient";
import styles from "../componentes/styleLembrete";

export default function Lembrete() {
  const [lembrete, setLembrete] = useState("");
  const [lista, setLista] = useState([
    { id: "1", texto: "Consulta médica amanhã", feito: false },
    { id: "2", texto: "Pagar conta de luz", feito: true },
    { id: "3", texto: "Reunião da escola às 19h", feito: false },
  ]);

  function adicionarLembrete() {
    if (lembrete.trim() === "") return;
    setLista([...lista, { id: Date.now().toString(), texto: lembrete, feito: false }]);
    setLembrete("");
  }

  function marcarFeito(id) {
    setLista(lista.map(item =>
      item.id === id ? { ...item, feito: !item.feito } : item
    ));
  }

  function removerLembrete(id) {
    setLista(lista.filter(item => item.id !== id));
  }

  return (
    <View style={styles.bg}>
      <LinearGradient colors={["#f44336", "#f44336"]} style={styles.header}>
        <Text style={styles.title}>Lembretes</Text>
        <Icon name="bell-outline" size={32} color="#fff" />
      </LinearGradient>

      <View style={styles.inputArea}>
        <TextInput
          style={styles.input}
          placeholder="Novo lembrete..."
          placeholderTextColor="#3ba4e6"
          value={lembrete}
          onChangeText={setLembrete}
        />
        <TouchableOpacity style={styles.addBtn} onPress={adicionarLembrete}>
          <Icon name="plus" size={24} color="#fff" />
        </TouchableOpacity>
      </View>

      <FlatList
        data={lista}
        keyExtractor={item => item.id}
        style={styles.list}
        renderItem={({ item }) => (
          <View style={styles.itemRow}>
            <TouchableOpacity onPress={() => marcarFeito(item.id)}>
              <Icon
                name={item.feito ? "check-circle" : "checkbox-blank-circle-outline"}
                size={24}
                color={item.feito ? "#4caf50" : "#f44336"}
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
            <TouchableOpacity onPress={() => removerLembrete(item.id)}>
              <Icon name="delete-outline" size={22} color="#f44336" />
            </TouchableOpacity>
          </View>
        )}
        ListEmptyComponent={
          <Text style={styles.emptyText}>Nenhum lembrete.</Text>
        }
      />
      <View style={styles.tabBar}>
              <TouchableOpacity style={styles.tabItem}>
                <Icon name="home" size={24} color="#3ba4e6" />
                <Text style={styles.tabText}>Início</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.tabItem} onPress={() => navigation.navigate("Compras")}>
                <Icon name="cart-outline" size={24} color="#3ba4e6" />
                <Text style={styles.tabText}>Compras</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.tabItem}>
                <Icon name="bell-outline" size={24} color="#3ba4e6" />
                <Text style={styles.tabText}>Lembretes</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.tabItem}>
                <Icon name="car-outline" size={24} color="#3ba4e6" />
                <Text style={styles.tabText}>Veículos</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.tabItem}>
                <Icon name="check-circle-outline" size={24} color="#3ba4e6" />
                <Text style={styles.tabText}>Tarefas</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.tabItem}>
                <Icon name="account-circle-outline" size={24} color="#3ba4e6" />
                <Text style={styles.tabText}>Perfil</Text>
              </TouchableOpacity>
            </View>
    </View>
  );
}