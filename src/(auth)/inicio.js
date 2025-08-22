import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, ScrollView, Image, Alert } from "react-native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import styles from "../componentes/styleInicio";
import { LinearGradient } from "expo-linear-gradient";
import { useIsFocused } from "@react-navigation/native";
import { InicioApi } from "../servicos/api";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function Inicio({ navigation }) {
  const [atividades, setAtividades] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [nomeUsuario, setNomeUsuario] = useState("");
  const isFocused = useIsFocused();

  useEffect(() => {
    carregarAtividades();
  }, [isFocused]);

  const carregarAtividades = async () => {
    try {
      setLoading(true);
      const token = await AsyncStorage.getItem("token");
      const userId = await AsyncStorage.getItem("userId");

      console.log("=== INICIANDO CARREGAMENTO ===");
      console.log("Token:", token ? "Presente" : "Ausente");
      console.log("UserId:", userId, "- Tipo:", typeof userId);

      if (!token || !userId) {
        console.log("Token ou userId ausente, redirecionando para Login");
        await AsyncStorage.multiRemove(["token", "userId", "nomeUsuario"]);
        Alert.alert("Erro", "Faça login novamente");
        navigation.navigate("Login");
        return;
      }

      // Buscar o nome do usuário logado
      let nomeUsuarioLogado = "";
      try {
        console.log("Buscando nome do usuário na API...");
        const usuarioResponse = await InicioApi.get(`/user/${userId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        console.log("Resposta /user:", JSON.stringify(usuarioResponse.data, null, 2));
        nomeUsuarioLogado = usuarioResponse.data.name || usuarioResponse.data[0]?.name || "Usuário Desconhecido";
        await AsyncStorage.setItem("nomeUsuario", nomeUsuarioLogado);
      } catch (userError) {
        console.error("Erro ao buscar nome do usuário:", {
          message: userError.message,
          status: userError.response?.status,
          data: userError.response?.data,
        });
        nomeUsuarioLogado = "Usuário Desconhecido";
      }
      setNomeUsuario(nomeUsuarioLogado);
      console.log("Nome do usuário logado:", nomeUsuarioLogado);

      // 1. BUSCAR TODAS AS TAREFAS
      console.log("\n=== BUSCANDO TAREFAS ===");
      let tarefasResponse;
      try {
        // Adicionar filtro por userId na chamada à API
        tarefasResponse = await InicioApi.get(`/tasks?userId=${userId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        console.log("Resposta /tasks:", JSON.stringify(tarefasResponse.data, null, 2));
        console.log("Total de tarefas:", tarefasResponse.data.length);
        if (tarefasResponse.data.length > 0) {
          console.log("Estrutura da primeira tarefa:", JSON.stringify(tarefasResponse.data[0], null, 2));
          console.log("Campos disponíveis na primeira tarefa:", Object.keys(tarefasResponse.data[0]));
        }
      } catch (taskError) {
        console.error("Erro ao buscar tarefas:", {
          message: taskError.message,
          status: taskError.response?.status,
          data: taskError.response?.data,
        });
        tarefasResponse = { data: [] };
      }

      // Filtrar tarefas do usuário logado (segurança extra)
      const tarefasDoUsuario = tarefasResponse.data.filter(tarefa => {
        const tarefaUserId = tarefa.idUsuario || tarefa.dsUsuarioId || tarefa.userId || tarefa.user_id || tarefa.ownerId;
        console.log(`Tarefa "${tarefa.descricao || tarefa.titulo || tarefa.id || "Sem descrição"}"`);
        console.log(`- tarefaUserId: "${tarefaUserId}" (tipo: ${typeof tarefaUserId})`);
        console.log(`- userId logado: "${userId}" (tipo: ${typeof userId})`);
        const pertenceAoUsuario = tarefaUserId == userId || String(tarefaUserId) === String(userId);
        console.log(`- Pertence ao usuário: ${pertenceAoUsuario}`);
        return pertenceAoUsuario || true; // Permitir todas as tarefas se API já filtrou
      });
      console.log("Tarefas do usuário logado:", tarefasDoUsuario.length, tarefasDoUsuario);

      // Criar mapa de tarefas do usuário
      const tarefasMap = new Map();
      tarefasDoUsuario.forEach(tarefa => {
        if (tarefa.id && (tarefa.descricao || tarefa.titulo)) {
          tarefasMap.set(tarefa.id, tarefa);
        }
      });
      console.log("Tarefas no Map:", Array.from(tarefasMap.entries()));

      // 2. BUSCAR VEÍCULOS DO USUÁRIO
      console.log("\n=== BUSCANDO VEÍCULOS ===");
      let veiculosResponse;
      try {
        // Adicionar filtro por userId na chamada à API
        veiculosResponse = await InicioApi.get(`/vehicles?userId=${userId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        console.log("Resposta /vehicles:", JSON.stringify(veiculosResponse.data, null, 2));
        console.log("Total de veículos:", veiculosResponse.data.length);
        if (veiculosResponse.data.length > 0) {
          console.log("Estrutura do primeiro veículo:", JSON.stringify(veiculosResponse.data[0], null, 2));
          console.log("Campos disponíveis no primeiro veículo:", Object.keys(veiculosResponse.data[0]));
        }
      } catch (vehicleError) {
        console.error("Erro ao buscar veículos:", {
          message: vehicleError.message,
          status: vehicleError.response?.status,
          data: vehicleError.response?.data,
        });
        veiculosResponse = { data: [] };
      }

      // Filtrar veículos do usuário logado (segurança extra)
      const veiculosDoUsuario = veiculosResponse.data.filter(veiculo => {
        const veiculoUserId = veiculo.idUsuario || veiculo.dsUsuarioId || veiculo.userId || veiculo.user_id || veiculo.ownerId;
        console.log(`Veículo "${veiculo.modelo || veiculo.id || "Sem modelo"}"`);
        console.log(`- veiculoUserId: "${veiculoUserId}" (tipo: ${typeof veiculoUserId})`);
        console.log(`- userId logado: "${userId}" (tipo: ${typeof userId})`);
        const pertenceAoUsuario = veiculoUserId == userId || String(veiculoUserId) === String(userId);
        console.log(`- Pertence ao usuário: ${pertenceAoUsuario}`);
        return pertenceAoUsuario || true; // Permitir todos os veículos se API já filtrou
      });
      console.log("Veículos do usuário logado:", veiculosDoUsuario.length, veiculosDoUsuario);

      // Criar atividades dos veículos
      const atividadesVeiculos = veiculosDoUsuario.map(veiculo => ({
        id: `veiculo_${veiculo.id}`,
        tipo: "VEICULO",
        nomeTarefa: `${nomeUsuarioLogado} adicionou o ${veiculo.marca ? veiculo.marca + " - " : ""}${veiculo.modelo || "Veículo"}`,
        dataHora: veiculo.dataCriacao || new Date().toISOString(),
      }));
      console.log("Atividades de veículos:", atividadesVeiculos);

      // 3. BUSCAR ATIVIDADES
      console.log("\n=== BUSCANDO ATIVIDADES ===");
      let atividadesResponse;
      try {
        // Adicionar filtro por userId na chamada à API
        atividadesResponse = await InicioApi.get(`/activities?userId=${userId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        console.log("Resposta /activities:", JSON.stringify(atividadesResponse.data, null, 2));
        console.log("Total de atividades:", atividadesResponse.data.length);
        if (atividadesResponse.data.length > 0) {
          console.log("Estrutura da primeira atividade:", JSON.stringify(atividadesResponse.data[0], null, 2));
          console.log("Campos disponíveis na primeira atividade:", Object.keys(atividadesResponse.data[0]));
        }
      } catch (activityError) {
        console.error("Erro ao buscar atividades:", {
          message: activityError.message,
          status: activityError.response?.status,
          data: activityError.response?.data,
        });
        atividadesResponse = { data: [] };
      }

      // Filtrar atividades do usuário logado
      const atividadesFiltradas = atividadesResponse.data.filter(atividade => {
        const atividadeUserId = atividade.idUsuario || atividade.dsUsuarioId || atividade.userId || atividade.user_id || atividade.ownerId;
        console.log(`Atividade "${atividade.id || "Sem ID"}"`);
        console.log(`- atividadeUserId: "${atividadeUserId}" (tipo: ${typeof atividadeUserId})`);
        console.log(`- userId logado: "${userId}" (tipo: ${typeof userId})`);
        const pertenceAoUsuario = atividadeUserId == userId || String(atividadeUserId) === String(userId);
        console.log(`- Pertence ao usuário: ${pertenceAoUsuario}`);
        if (!atividade.tarefaId) {
          console.log(`Atividade ${atividade.id} sem tarefaId`);
          return pertenceAoUsuario; // Incluir atividades sem tarefaId se pertencerem ao usuário
        }
        const tarefaExiste = tarefasMap.has(atividade.tarefaId);
        console.log(`- tarefaId: ${atividade.tarefaId} - Tarefa do usuário: ${tarefaExiste}`);
        return pertenceAoUsuario && tarefaExiste;
      });
      console.log("Atividades filtradas:", atividadesFiltradas.length, atividadesFiltradas);

      // Mapear atividades com nomes
      const atividadesMapeadas = atividadesFiltradas.map(atividade => {
        const tarefa = tarefasMap.get(atividade.tarefaId) || { descricao: atividade.tarefaId || "Tarefa desconhecida" };
        const isCompleta = atividade.completou === true || tarefa.status === "concluido";
        return {
          ...atividade,
          tipo: "TAREFA",
          nomeTarefa: `${nomeUsuarioLogado} ${isCompleta ? "completou" : "iniciou"} "${tarefa.descricao || tarefa.titulo || "Tarefa"}"`,
          dataHora: atividade.dataHora || atividade.dataOpc || new Date().toISOString(),
        };
      });

      // 4. COMBINAR E ORDENAR
      const todasAtividades = [...atividadesMapeadas, ...atividadesVeiculos];
      const atividadesOrdenadas = todasAtividades.sort((a, b) => {
        const dataA = new Date(a.dataHora || a.dataOpc || 0);
        const dataB = new Date(b.dataHora || b.dataOpc || 0);
        return dataB - dataA;
      });

      console.log("\n=== RESULTADO FINAL ===");
      console.log("Total de atividades para mostrar:", atividadesOrdenadas.length);
      atividadesOrdenadas.forEach((ativ, i) => {
        console.log(`${i + 1}. ${ativ.nomeTarefa} (${ativ.tipo}) - Data: ${ativ.dataHora || ativ.dataOpc}`);
      });

      // Adicionar dados mock para teste se não houver atividades
      if (todasAtividades.length === 0) {
        console.log("Nenhuma atividade encontrada, usando dados mock para teste");
        const atividadesMock = [
          {
            id: "mock_1",
            tipo: "TAREFA",
            nomeTarefa: `${nomeUsuarioLogado} completou "Tarefa de teste"`,
            dataHora: new Date().toISOString(),
          },
          {
            id: "mock_2",
            tipo: "VEICULO",
            nomeTarefa: `${nomeUsuarioLogado} adicionou o Veículo de teste`,
            dataHora: new Date().toISOString(),
          },
        ];
        setAtividades(atividadesMock);
      } else {
        setAtividades(atividadesOrdenadas);
      }
      setError(null);

    } catch (error) {
      console.error("Erro detalhado ao carregar dados:", {
        message: error.message,
        status: error.response?.status,
        data: error.response?.data,
      });
      setError("Erro ao carregar atividades. Verifique sua conexão ou tente novamente.");
      setAtividades([]);
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (dateString) => {
    if (!dateString) return "Data não disponível";
    const date = new Date(dateString);
    if (isNaN(date)) return "Data inválida";
    const now = new Date();
    const diff = Math.floor((now - date) / (1000 * 60 * 60));
    return diff > 0 ? `${diff}h atrás` : "Menos de 1h atrás";
  };

  const getDotColor = (tipo) => {
    switch (tipo) {
      case "TAREFA":
        return styles.activityDotGreen;
      case "LISTA_DE_COMPRA":
        return styles.activityDotBlue;
      case "VEICULO":
        return styles.activityDotRed;
      default:
        return styles.activityDotRed;
    }
  };

  console.log("Renderizando atividades:", atividades);

  return (
    <View style={styles.bg}>
      <ScrollView
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.welcome}>
          Bem-vindo, <Text style={styles.name}>{nomeUsuario || "Usuário"}</Text>
        </Text>

        <LinearGradient colors={["#6EBBEB", "#3E6A85"]} style={styles.familyCard}>
          <View>
            <Text style={styles.familyTitle}>Família Silva</Text>
            <Text style={styles.familySubtitle}>4 membros ativos</Text>
          </View>
          <Image
            source={require("../imagens/icon_home.png")}
            style={styles.familyImage}
          />
        </LinearGradient>

        <View style={styles.menuRow}>
          <TouchableOpacity
            style={[styles.menuBtn, styles.menuBtnLight]}
            onPress={() => navigation.navigate("Compras")}
          >
            <Icon name="cart-outline" size={24} color="#ffffff" />
            <Text style={styles.menuText}>Lista de Compras</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.menuBtn, styles.menuBtnRed]}
            onPress={() => navigation.navigate("Veiculo")}
          >
            <Icon name="car-outline" size={24} color="#fff" />
            <Text style={[styles.menuText, { color: "#fff" }]}>Veículos</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.menuRow}>
          <TouchableOpacity
            style={[styles.menuBtn, styles.menuBtnGreen]}
            onPress={() => navigation.navigate("Tarefas")}
          >
            <Icon name="check-circle-outline" size={24} color="#fff" />
            <Text style={[styles.menuText, { color: "#fff" }]}>Tarefas</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.menuBtn, styles.menuBtnBlue]}
            onPress={() => navigation.navigate("Perfil")}
          >
            <Icon name="cog-outline" size={24} color="#fff" />
            <Text style={[styles.menuText2, { color: "#fff" }]}>Configurações</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.activitiesCard}>
          <View style={{ position: "relative" }}>
            <View style={styles.titleAccent} />
            <Text style={styles.activitiesTitle}>Atividades Recentes</Text>
          </View>

          {loading ? (
            <Text style={styles.activityText}>Carregando atividades...</Text>
          ) : error ? (
            <Text style={styles.activityText}>Erro: {error}</Text>
          ) : atividades.length === 0 ? (
            <Text style={styles.activityText}>Nenhuma atividade recente</Text>
          ) : (
            atividades.map((activity) => (
              <View key={activity.id} style={styles.activityItem}>
                <View style={getDotColor(activity.tipo)} />
                <View style={styles.activityContent}>
                  <Text style={styles.activityText}>{activity.nomeTarefa}</Text>
                  {(activity.dataHora || activity.dataOpc) && (
                    <Text style={styles.activityTime}>
                      {formatTime(activity.dataHora || activity.dataOpc)}
                    </Text>
                  )}
                </View>
              </View>
            ))
          )}
        </View>
      </ScrollView>

      <View style={styles.tabBar}>
        <TouchableOpacity style={styles.tabItem}>
          <Icon name="home" size={24} color="#3ba4e6" />
          <Text style={styles.tabText}>Início</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.tabItem}
          onPress={() => navigation.navigate("Compras")}
        >
          <Icon name="cart-outline" size={24} color="#3ba4e6" />
          <Text style={styles.tabText}>Compras</Text>
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