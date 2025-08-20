import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, FlatList, ActivityIndicator } from "react-native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { LinearGradient } from "expo-linear-gradient";
import styles from "../componentes/styleCompras";

export default function Compras({ navigation }) {
  const [listas, setListas] = useState([]);
  const [loading, setLoading] = useState(true);

  // Mapeamento de categorias para cores e ícones
  const categoriasConfig = {
    MERCADO: {
      cor: ["#24b766ff", "#24b766ff"],
      icon: "cart-outline",
    },
    FARMACIA: {
      cor: ["#0c97eeff", "#0c97eeff"],
      icon: "medical-bag",
    },
    PADARIA: {
      cor: ["#f58b12ff", "#f58b12ff"],
      icon: "bread-slice-outline",
    },
    OUTROS: {
      cor: ["#8e44ad", "#8e44ad"],
      icon: "basket-outline",
    },
  };

  useEffect(() => {
    const fetchListas = async () => {
      try {
        const response = await fetch("https://api-gerenciador-familiar.vercel.app/lists");
        const rawData = await response.json();

        console.log("Retorno da API /lists:", rawData);

        // Garante que temos um array para trabalhar
        const data = Array.isArray(rawData)
          ? rawData
          : Array.isArray(rawData.listas)
          ? rawData.listas
          : [];

        if (data.length === 0) {
          console.warn("Nenhuma lista encontrada no retorno da API.");
        }

        // Para cada lista, busca os itens em /lists/:id
        const listasComItens = await Promise.all(
          data.map(async (lista) => {
            try {
              const res = await fetch(
                `https://api-gerenciador-familiar.vercel.app/lists/${lista.id}`
              );
              const listaCompleta = await res.json();

              const totalItens = listaCompleta.itens?.length || 0;
              const itensComprados =
                listaCompleta.itens?.filter((i) => i.comprado).length || 0;
              const progresso = totalItens > 0 ? itensComprados / totalItens : 0;

              return {
                ...lista,
                totalItens,
                itensComprados,
                progresso,
              };
            } catch (err) {
              console.error("Erro ao buscar itens da lista:", err);
              return {
                ...lista,
                totalItens: 0,
                itensComprados: 0,
                progresso: 0,
              };
            }
          })
        );

        setListas(listasComItens);
      } catch (error) {
        console.error("Erro ao carregar listas:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchListas();
  }, []);

  if (loading) {
    return (
      <View style={[styles.bg, { justifyContent: "center", alignItems: "center" }]}>
        <ActivityIndicator size="large" color="#3ba4e6" />
      </View>
    );
  }

  return (
    <View style={styles.bg}>
      {/* Cabeçalho */}
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
            marginTop: 20,
          }}
        >
          <Icon name="plus" size={24} color="#fff" />
        </TouchableOpacity>
      </View>

      {/* Listagem de categorias */}
      <FlatList
        data={listas}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ padding: 20 }}
        renderItem={({ item }) => {
          const config = categoriasConfig[item.tipo] || categoriasConfig.OUTROS;

          return (
            <TouchableOpacity
              style={styles.categoriaBtn}
              onPress={() => navigation.navigate("ItensLista", { listaId: item.id })}
            >
              <LinearGradient colors={config.cor} style={styles.categoriaGradient}>
                <View style={styles.iconArea}>
                  <Icon name={config.icon} size={32} color="#fff" />
                </View>
                <View style={{ flex: 1, marginLeft: 18 }}>
                  <Text style={styles.categoriaText}>{item.tipo}</Text>
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
          );
        }}
      />

      {/* TabBar */}
      <View style={styles.tabBar}>
        <TouchableOpacity style={styles.tabItem} onPress={() => navigation.navigate("Inicio")}>
          <Icon name="home-outline" size={24} color="#3ba4e6" />
          <Text style={styles.tabText}>Início</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.tabItem]}>
          <Icon name="cart" size={24} color="#3ba4e6" />
          <Text style={[styles.tabText, { color: "#3ba4e6" }]}>Compras</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.tabItem} onPress={() => navigation.navigate("Veiculo")}>
          <Icon name="car-outline" size={24} color="#3ba4e6" />
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
