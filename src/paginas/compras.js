import React from "react";
import { View, Text, TouchableOpacity, FlatList } from "react-native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { LinearGradient } from "expo-linear-gradient";
import styles from "../componentes/styleCompras";

export default function Compras() {
  return (
    <View style={styles.bg}>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          marginHorizontal: 24,
          marginBottom: 7,
        }}
      >
        <Text style={styles.title}>Lista de Compras</Text>
        <TouchableOpacity
          style={{
            backgroundColor: "#3ba4e6",
            borderRadius: 12,
            padding: 8,
            marginTop: 20
          }}
        >
          <Icon name="plus" size={24} color="#fff" />
        </TouchableOpacity>
      </View>
      <FlatList
        data={[
          {
            id: "1",
            nome: "Mercado",
            cor: ["#24b766ff", "#24b766ff"],
            icon: "cart-outline",
            progresso: 0.6,
            totalItens: 10,
            itensComprados: 6,
          },
          {
            id: "2",
            nome: "Farmácia",
            cor: ["#0c97eeff", "#0c97eeff"],
            icon: "medical-bag",
            progresso: 0.2,
            totalItens: 5,
            itensComprados: 1,
          },
          {
            id: "3",
            nome: "Padaria",
            cor: ["#f58b12ff", "#f58b12ff"],
            icon: "bread-slice-outline",
            progresso: 0.8,
            totalItens: 8,
            itensComprados: 7,
          },
          {
            id: "4",
            nome: "Açougue",
            cor: ["#ee3528ff", "#ee3528ff"],
            icon: "food-steak",
            progresso: 0.0,
            totalItens: 4,
            itensComprados: 0,
          },
        ]}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ padding: 20 }}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.categoriaBtn}>
            <LinearGradient colors={item.cor} style={styles.categoriaGradient}>
              <View style={styles.iconArea}>
                <Icon name={item.icon} size={32} color="#fff" />
              </View>
              <View style={{ flex: 1, marginLeft: 18 }}>
                <Text style={styles.categoriaText}>{item.nome}</Text>
                <View style={styles.progressBarContainer}>
                  <View
                    style={[
                      styles.progressBar,
                      { width: `${item.progresso * 100}%` },
                    ]}
                  />
                </View>
                <Text style={styles.progressText}>
                  {Math.round(item.progresso * 100)}% &nbsp;|&nbsp;{" "}
                  {item.itensComprados}/{item.totalItens} comprados
                </Text>
              </View>
              <Icon name="chevron-right" size={32} color="#fff" />
            </LinearGradient>
          </TouchableOpacity>
        )}
        
      />
      <View style={styles.tabBar}>
  <TouchableOpacity style={styles.tabItem}>
    <Icon name="home" size={24} color="#3ba4e6" />
    <Text style={styles.tabText}>Início</Text>
  </TouchableOpacity>
  <TouchableOpacity style={[styles.tabItem, { backgroundColor: "#3ba4e6", borderRadius: 16 }]}>
    <Icon name="cart" size={24} color="#fff" />
    <Text style={[styles.tabText, { color: "#fff" }]}>Compras</Text>
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
