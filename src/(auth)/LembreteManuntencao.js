import { useEffect, useState } from "react";
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
import styles from "../componentes/styleLembrete";
import { VeiculosApi } from "../servicos/api";

export default function LembreteDeManutencao({ route, navigation }) {
  const [descricao, setDescricao] = useState("");
  const [data, setData] = useState("");
  const [valor, setValor] = useState("");
  const [idVeiculos, setIdVeiculos] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [editingVeiculosId, setEditingVeiculoId] = useState(null);
  const [veiculos, setVeiculos] = useState([]);
  const isFocused = useIsFocused();

  useEffect(() => {
    if (route.params?.itensVeiculos) {
      // Editando um lembrete existente
      setDescricao(route.params.itensVeiculos.descricao || "");
      setData(route.params.itensVeiculos.data || "");
      setValor(route.params.itensVeiculos.valor || "");
      setIdVeiculos(route.params.itensVeiculos.idVeiculos || "");
      setEditingVeiculoId(route.params.itensVeiculos.id || null);
    } else if (route.params?.veiculoSelecionado) {
      // Criando um novo lembrete para um veículo específico
      setDescricao("");
      setData("");
      setValor("");
      setIdVeiculos(route.params.veiculoSelecionado.id);
      setEditingVeiculoId(null);
    } else {
      // Limpando os campos
      setDescricao("");
      setData("");
      setValor("");
      setIdVeiculos("");
      setEditingVeiculoId(null);
    }
  }, [route.params?.itensVeiculos, route.params?.veiculoSelecionado]);

  useEffect(() => {
    if (isFocused) {
      carregarVeiculos();
    }
  }, [isFocused]); // Added dependency array to prevent infinite loop

  const carregarVeiculos = async () => {
    setIsLoading(true);
    try {
      const token = await AsyncStorage.getItem("token");
      const userId = await AsyncStorage.getItem("userId");

      if (!token || !userId) {
        Alert.alert("Erro", "Faça login novamente");
        navigation.navigate("Login");
        return;
      }

      let endpoint;

      // Se um veículo específico foi selecionado, busca apenas os lembretes dele
      if (route.params?.veiculoSelecionado) {
        console.log(
          "Carregando lembretes para o veículo ID:",
          route.params.veiculoSelecionado.id
        );
        endpoint = `/vehicle/${route.params.veiculoSelecionado.id}/maintenance`;
      } else {
        // Se não tem veículo selecionado, busca todos os lembretes do usuário
        endpoint = `/maintenance`; // ou outro endpoint que liste todos os lembretes do usuário
      }

      console.log("Fazendo requisição para:", endpoint);

      const response = await VeiculosApi.get(endpoint, {
        headers: { Authorization: `Bearer ${token}` },
      });

      console.log("Lembretes carregados:", response.data);
      setVeiculos(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      console.error("Erro ao carregar lembretes", {
        message: error.message,
        status: error.response?.status,
        data: error.response?.data,
        endpoint: error.config?.url,
      });
      Alert.alert(
        "Erro",
        error.response?.data?.message ||
          `Não foi possível carregar os lembretes.`
      );
    } finally {
      setIsLoading(false);
    }
  };

  const salvarLembrete = async () => {
    if (!descricao.trim() || !data.trim() || !valor.trim()) {
      Alert.alert("Erro", "Preencha todos os campos");
      return;
    }

    // Se não tem veículo selecionado, não permite salvar
    if (!route.params?.veiculoSelecionado && !idVeiculos) {
      Alert.alert("Erro", "Selecione um veículo para criar o lembrete");
      return;
    }

    setIsLoading(true);
    try {
      const token = await AsyncStorage.getItem("token");

      if (!token) {
        Alert.alert("Erro", "Faça login novamente");
        navigation.navigate("Login");
        return;
      }

      // Usa o ID do veículo selecionado ou o idVeiculos do state
      const veiculoId = route.params?.veiculoSelecionado?.id || idVeiculos;

      const lembreteData = {
        descricao: descricao.trim(),
        data: data.trim(),
        valor: parseFloat(valor) || 0,
      };

      console.log("Salvando lembrete para veículo ID:", veiculoId);
      console.log("Dados do lembrete:", lembreteData);

      if (editingVeiculosId) {
        // Editando lembrete existente
        await VeiculosApi.put(
          `/vehicle/${veiculoId}/maintenance/${editingVeiculosId}`,
          lembreteData,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        Alert.alert("Sucesso", "Lembrete atualizado com sucesso!");
      } else {
        // Criando novo lembrete
        await VeiculosApi.post(
          `/vehicle/${veiculoId}/maintenance`,
          lembreteData,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        Alert.alert("Sucesso", "Lembrete criado com sucesso!");
      }

      // Limpar campos
      setDescricao("");
      setData("");
      setValor("");
      setIdVeiculos("");
      setEditingVeiculoId(null);

      // Recarregar lista
      carregarVeiculos();
    } catch (error) {
      console.error("Erro ao salvar lembrete", {
        message: error.message,
        status: error.response?.status,
        data: error.response?.data,
      });
      Alert.alert(
        "Erro",
        error.response?.data?.message || "Não foi possível salvar o lembrete"
      );
    } finally {
      setIsLoading(false);
    }
  };

  const deletarLembrete = async (lembreteId) => {
    Alert.alert(
      "Confirmar exclusão",
      "Deseja realmente excluir este lembrete?",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Excluir",
          style: "destructive",
          onPress: async () => {
            try {
              const token = await AsyncStorage.getItem("token");

              // Usa o ID do veículo selecionado ou busca na lista
              const veiculoId = route.params?.veiculoSelecionado?.id;

              if (!veiculoId) {
                Alert.alert("Erro", "ID do veículo não encontrado");
                return;
              }

              await VeiculosApi.delete(`/maintenance/${lembreteId}`, {
                headers: { Authorization: `Bearer ${token}` },
              });

              Alert.alert("Sucesso", "Lembrete excluído com sucesso!");
              carregarVeiculos();
            } catch (error) {
              console.error("Erro ao deletar lembrete", error);
              Alert.alert("Erro", "Não foi possível excluir o lembrete");
            }
          },
        },
      ]
    );
  };

  const editarLembrete = async (item) => {
    try {
      const token = await AsyncStorage.getItem("token");

      const response = await VeiculosApi.put(`/maintenance/${lembreteId}/`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setDescricao(item.descricao || "");
      setData(item.data || "");
      setValor(item.valor?.toString() || "");
      setIdVeiculos(item.idVeiculos || "");
      setEditingVeiculoId(item.id);
    } catch (error) {
      console.error("Erro ao editar lembrete", error);
      Alert.alert("Erro", "Não foi possível editar o lembrete");
      navigation.navigate("Login");
      return;
    }
  };

  return (
    <View style={styles.bg}>
      <LinearGradient colors={["#3E6A85", "#3E6A85"]} style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <Icon name="arrow-left" size={24} color="#FFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>
          {route.params?.veiculoSelecionado
            ? `${route.params.veiculoSelecionado.marca} ${route.params.veiculoSelecionado.modelo}`
            : "Lembretes de Manutenção"}
        </Text>
        <View style={styles.headerSpacer} />
      </LinearGradient>

      <View style={styles.inputCard}>
        {route.params?.veiculoSelecionado && (
          <View style={styles.veiculoInfo}>
            <Icon name="car" size={20} color="#3E6A85" />
            <Text style={styles.veiculoInfoText}>
              {route.params.veiculoSelecionado.marca}{" "}
              {route.params.veiculoSelecionado.modelo} -{" "}
              {route.params.veiculoSelecionado.ano}
            </Text>
            {route.params.veiculoSelecionado.placa && (
              <Text style={styles.placaText}>
                {route.params.veiculoSelecionado.placa}
              </Text>
            )}
          </View>
        )}
        <TextInput
          style={styles.input}
          placeholder="Descrição (ex: Troca de óleo)"
          placeholderTextColor="#3ba4e6"
          value={descricao}
          onChangeText={setDescricao}
        />
        <TextInput
          style={styles.input}
          placeholder="Data (DD/MM/AAAA)"
          placeholderTextColor="#3ba4e6"
          value={data}
          onChangeText={setData}
        />
        <TextInput
          style={styles.input}
          placeholder="Valor estimado"
          placeholderTextColor="#3ba4e6"
          keyboardType="numeric"
          value={valor}
          onChangeText={setValor}
        />
        <TouchableOpacity
          style={styles.saveButton}
          onPress={salvarLembrete}
          disabled={isLoading}
          accessibilityLabel={
            editingVeiculosId ? "Atualizar lembrete" : "Adicionar lembrete"
          }
        >
          <Text style={styles.saveButtonText}>
            <Icon
              name={editingVeiculosId ? "update" : "plus"}
              size={24}
              color="#fff"
            />
          </Text>
        </TouchableOpacity>
      </View>

      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#3E6A85" />
          <Text style={styles.loadingText}>Carregando veículos...</Text>
        </View>
      ) : veiculos.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>
            {route.params?.veiculoSelecionado
              ? "Nenhum lembrete cadastrado para este veículo"
              : "Nenhum lembrete cadastrado"}
          </Text>
          <Text style={styles.emptySubText}>
            {route.params?.veiculoSelecionado
              ? "Crie lembretes de manutenção para não esquecer dos cuidados importantes"
              : "Crie lembretes de manutenção para seus veículos"}
          </Text>
        </View>
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
                <Icon
                  name="wrench"
                  size={28}
                  color="#3E6A85"
                  style={{ marginRight: 10 }}
                />
                <View style={{ flex: 1 }}>
                  <Text style={styles.itemTitle}>{item.descricao}</Text>
                  {item.data ? (
                    <Text style={styles.itemInfo}>📅 Data: {item.data}</Text>
                  ) : null}
                  {item.valor ? (
                    <Text style={styles.itemInfo}>
                      💰 Valor: R$ {parseFloat(item.valor).toFixed(2)}
                    </Text>
                  ) : null}
                  {!route.params?.veiculoSelecionado && item.veiculo ? (
                    <Text style={styles.itemInfo}>
                      🚗 {item.veiculo.marca} {item.veiculo.modelo}
                    </Text>
                  ) : null}
                </View>
                {/* Botão de editar */}
                <TouchableOpacity
                  style={{ marginRight: 10 }}
                  onPress={() => editarLembrete(item)}
                >
                  <Icon name="pencil-outline" size={24} color="#4CAF50" />
                </TouchableOpacity>
                {/* Botão de excluir */}
                <TouchableOpacity onPress={() => deletarLembrete(item.id)}>
                  <Icon name="delete-outline" size={24} color="#f44336" />
                </TouchableOpacity>
              </View>
            </LinearGradient>
          )}
        />
      )}
    </View>
  );
}
