import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, FlatList } from "react-native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { LinearGradient } from "expo-linear-gradient";
import styles from "../componentes/styleVeiculos";

export default function Veiculo() {
  const [nome, setNome] = useState("");
  const [placa, setPlaca] = useState("");
  const [ano, setAno] = useState("");
  const [lembrete, setLembrete] = useState("");
  const [lista, setLista] = useState([
    {
      id: "1",
      nome: "Carro - Fiat Uno",
      placa: "ABC-1234",
      ano: "2012",
      lembrete: "IPVA vence em setembro",
    },
    {
      id: "2",
      nome: "Moto - Honda CG",
      placa: "XYZ-5678",
      ano: "2018",
      lembrete: "Troca de óleo em 15/08",
    },
    {
      id: "3",
      nome: "Bicicleta - Caloi",
      placa: "",
      ano: "2020",
      lembrete: "Revisão anual pendente",
    },
  ]);

  function adicionarVeiculo() {
    if (nome.trim() === "") return;
    setLista([
      ...lista,
      {
        id: Date.now().toString(),
        nome,
        placa,
        ano,
        lembrete,
      },
    ]);
    setNome("");
    setPlaca("");
    setAno("");
    setLembrete("");
  }

  function removerVeiculo(id) {
    setLista(lista.filter((item) => item.id !== id));
  }

  return (
    <View style={styles.bg}>
      <LinearGradient colors={["#3E6A85", "#3E6A85"]} style={styles.header}>
        <Text style={styles.title}>Veículos</Text>
        <Icon name="car-outline" size={32} color="#fff" />
      </LinearGradient>

      <View style={styles.inputCard}>
        <TextInput
          style={styles.input}
          placeholder="Nome do veículo"
          placeholderTextColor="#3ba4e6"
          value={nome}
          onChangeText={setNome}
        />
        <TextInput
          style={styles.input}
          placeholder="Placa"
          placeholderTextColor="#3ba4e6"
          value={placa}
          onChangeText={setPlaca}
        />
        <TextInput
          style={styles.input}
          placeholder="Ano"
          placeholderTextColor="#3ba4e6"
          value={ano}
          onChangeText={setAno}
          keyboardType="numeric"
        />
        <TextInput
          style={styles.input}
          placeholder="Lembrete de manutenção"
          placeholderTextColor="#3ba4e6"
          value={lembrete}
          onChangeText={setLembrete}
        />
        <TouchableOpacity style={styles.addBtn} onPress={adicionarVeiculo}>
          <Icon name="plus" size={24} color="#fff" />
        </TouchableOpacity>
      </View>

      <FlatList
        data={lista}
        keyExtractor={(item) => item.id}
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
                <Text style={styles.itemTitle}>{item.nome}</Text>
                {item.placa ? (
                  <Text style={styles.itemInfo}>Placa: {item.placa}</Text>
                ) : null}
                {item.ano ? (
                  <Text style={styles.itemInfo}>Ano: {item.ano}</Text>
                ) : null}
                {item.lembrete ? (
                  <Text style={styles.itemLembrete}>{item.lembrete}</Text>
                ) : null}
              </View>
              <TouchableOpacity onPress={() => removerVeiculo(item.id)}>
                <Icon name="delete-outline" size={24} color="#f44336" />
              </TouchableOpacity>
            </View>
          </LinearGradient>
        )}
        ListEmptyComponent={
          <Text style={styles.emptyText}>Nenhum veículo cadastrado.</Text>
        }
      />
    </View>
  );
}