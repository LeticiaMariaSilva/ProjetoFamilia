import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  Alert,
} from "react-native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { LinearGradient } from "expo-linear-gradient";
import AsyncStorage from "@react-native-async-storage/async-storage";
import styles from "../componentes/styleCompras";
import { InicioApi } from "../servicos/api";

// mapa local de cores e ícones
const categoriasConfig = {
  Mercado: { cor: ["#24b766ff", "#24b766ff"], icon: "cart-outline" },
  Farmácia: { cor: ["#0c97eeff", "#0c97eeff"], icon: "medical-bag" },
  Padaria: { cor: ["#f58b12ff", "#f58b12ff"], icon: "bread-slice-outline" },
  Açougue: { cor: ["#ee3528ff", "#ee3528ff"], icon: "food-steak" },
  Outros: { cor: ["#3ba4e6", "#3ba4e6"], icon: "shape-outline" },
};

// converte o campo `tipo` da API para o `nome` usado na UI
const normalizarTipoParaNome = (tipo) => {
  const t = String(tipo || "").toUpperCase();
  if (t === "MERCADO") return "Mercado";
  if (t === "FARMACIA") return "Farmácia";
  if (t === "PADARIA") return "Padaria";
  return "Outros";
};

// listas padrão para fallback quando a API não responder
const listasPadrao = Object.keys(categoriasConfig).map((nome, idx) => ({
  id: idx + 1,
  nome,
  tipo: String(nome).toUpperCase(),
  cor: categoriasConfig[nome].cor,
  icon: categoriasConfig[nome].icon,
  progresso: 0,
  totalItens: 0,
  itensComprados: 0,
}));

// helper de fetch com timeout para evitar tela travada no loading
const fetchComTimeout = async (url, options = {}, timeoutMs = 8000) => {
  return Promise.race([
    fetch(url, options),
    new Promise((_, reject) =>
      setTimeout(() => reject(new Error("Tempo de requisição excedido")), timeoutMs)
    ),
  ]);
};

export default function Compras({ navigation }) {
  const [listas, setListas] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchListas();
  }, []);

  const fetchListas = async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      if (!token) {
        Alert.alert("Erro", "Token não encontrado. Faça login novamente.");
        // Ainda mostramos algo na tela para não ficar vazio
        setListas(listasPadrao);
        setLoading(false);
        return;
      }

      // Usar fetch manual para evitar erros de parse JSON quando a API retorna HTML
      const url = `${InicioApi?.defaults?.baseURL || ""}/lists`;
      const headers = { Accept: "application/json" };
      if (token) headers["Authorization"] = `Bearer ${token}`;
      const response = await fetch(url, { headers });

      if (!response.ok) {
        throw new Error(`Erro de resposta da API: ${response.status}`);
      }

      const rawText = await response.text();
      let data;
      try {
        data = JSON.parse(rawText);
      } catch (e) {
        throw new Error("Resposta não-JSON recebida da API");
      }
      console.log("🔎 Retorno da API /lists:", data);

      let listasArray = [];
      if (data && typeof data === "string") {
        // HTML/texto inesperado – forçar fallback
        throw new Error("Resposta não-JSON recebida da API");
      } else if (Array.isArray(data)) {
        listasArray = data;
      } else if (Array.isArray(data.listas)) {
        listasArray = data.listas;
      } else {
        listasArray = [];
      }

      // completa com dados locais (cor, ícone, progresso etc)
      const listasCompletas = listasArray.map((item) => {
        const nome = item?.nome || normalizarTipoParaNome(item?.tipo);
        const config = categoriasConfig[nome] || {
          cor: ["#3ba4e6", "#3ba4e6"],
          icon: "cart-outline",
        };

        return {
          ...item,
          nome,
          cor: config.cor,
          icon: config.icon,
          progresso: 0,
          totalItens: 0,
          itensComprados: 0,
        };
      });

      setListas(listasCompletas);
    } catch (error) {
      console.error("Erro ao carregar listas:", error);
      Alert.alert("Erro", "Não foi possível carregar as listas. Exibindo dados locais.");
      setListas(listasPadrao);
    } finally {
      setLoading(false);
    }
  };

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
       
      </View>

      {/* Listas */}
      <FlatList
        data={listas}
        keyExtractor={(item, index) =>
          item?.id != null ? String(item.id) : item?.nome ? String(item.nome) : String(index)
        }
        contentContainerStyle={{ padding: 20 }}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.categoriaBtn}
            onPress={() =>
              navigation.navigate("ItensLista", {
                listaId: item.id,
                tipo: item.tipo || item.nome,
              })
            }
          >
            <LinearGradient colors={item.cor} style={styles.categoriaGradient}>
              <View style={styles.iconArea}>
                <Icon name={item.icon} size={32} color="#fff" />
              </View>
              <View style={{ flex: 1, marginLeft: 18 }}>
                <Text style={styles.categoriaText}>{item.tipo || item.nome}</Text>
                <View style={styles.progressBarContainer}>
                  <View
                    style={[
                      styles.progressBar,
                      { width: `${Math.max(0, Math.min(100, (item?.progresso || 0) * 100))}%` },
                    ]}
                  />
                </View>
                <Text style={styles.progressText}>
                  {`${Math.round((item?.progresso || 0) * 100)}% | ${item?.itensComprados || 0}/${item?.totalItens || 0} comprados`}
                </Text>
              </View>
              <Icon name="chevron-right" size={32} color="#fff" />
            </LinearGradient>
          </TouchableOpacity>
        )}
      />

      {/* TabBar */}
      <View style={styles.tabBar}>
        <TouchableOpacity
          style={styles.tabItem}
          onPress={() => navigation.navigate("Inicio")}
        >
          <Icon name="home-outline" size={24} color="#3ba4e6" />
          <Text style={styles.tabText}>Início</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.tabItem]}>
          <Icon name="cart" size={24} color="#3ba4e6" />
          <Text style={[styles.tabText, { color: "#3ba4e6" }]}>Compras</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.tabItem}
          onPress={() => navigation.navigate("Veiculo")}
        >
          <Icon name="car-outline" size={24} color="#3ba4e6" />
          <Text style={styles.tabText}>Veículos</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.tabItem}
          onPress={() => navigation.navigate("Tarefas")}
        >
          <Icon name="check-circle-outline" size={24} color="#3ba4e6" />
          <Text style={styles.tabText}>Tarefas</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.tabItem}
          onPress={() => navigation.navigate("Perfil")}
        >
          <Icon name="account-circle-outline" size={24} color="#3ba4e6" />
          <Text style={styles.tabText}>Perfil</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
