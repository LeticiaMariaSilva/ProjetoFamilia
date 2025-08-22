import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  TextInput,
  ActivityIndicator,
  Alert,
} from "react-native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import styles from "../componentes/styleCompras";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function ItensLista({ route, navigation }) {
  const { listaId, tipo } = route.params;
  const [itens, setItens] = useState([]);
  const [novoItem, setNovoItem] = useState("");
  const [quantidade, setQuantidade] = useState("1");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Busca os itens da lista
  const fetchItens = async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      const headers = { Accept: "application/json" };
      if (token) headers["Authorization"] = `Bearer ${token}`;
      const res = await fetch(
        `https://api-gerenciador-familiar.vercel.app/list-items/${listaId}`,
        { headers }
      );
      const raw = await res.text();
      let data;
      try {
        data = JSON.parse(raw);
      } catch (e) {
        throw new Error("Resposta não-JSON recebida da API (itens)");
      }
      let itensArray = [];
      if (Array.isArray(data)) itensArray = data;
      else if (Array.isArray(data.items)) itensArray = data.items;
      else if (Array.isArray(data.data)) itensArray = data.data;
      else if (data && data.id) itensArray = [data];
      setItens(itensArray);
    } catch (error) {
      console.error("Erro ao buscar itens:", error);
      Alert.alert("Erro", "Não foi possível carregar os itens.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItens();
  }, []);

  // Marca/desmarca item como comprado
  const toggleComprado = async (item) => {
    try {
      const token = await AsyncStorage.getItem("token");
      const headers = { "Content-Type": "application/json", Accept: "application/json" };
      if (token) headers["Authorization"] = `Bearer ${token}`;
      const res = await fetch(
        `https://api-gerenciador-familiar.vercel.app/list-items/${item.id}`,
        {
          method: "PUT",
          headers,
          body: JSON.stringify({ comprado: !item.comprado }),
        }
      );
      const ok = res.ok;
      if (ok) {
        setItens((prev) =>
          prev.map((it) => (it.id === item.id ? { ...it, comprado: !item.comprado } : it))
        );
      } else {
        const msg = await res.text();
        throw new Error(`HTTP ${res.status} - ${msg}`);
      }
    } catch (error) {
      console.error("Erro ao atualizar item:", error);
      Alert.alert("Erro", `Não foi possível atualizar. ${error.message || ""}`);
    }
  };

  // Adiciona novo item
  const adicionarItem = async () => {
    if (!novoItem.trim()) return Alert.alert("Aviso", "Digite o nome do item.");
    if (saving) return;
    setSaving(true);
    try {
      const token = await AsyncStorage.getItem("token");
      const headers = {
        "Content-Type": "application/json",
        Accept: "application/json",
      };
      if (token) headers["Authorization"] = `Bearer ${token}`;

      const res = await fetch(
        "https://api-gerenciador-familiar.vercel.app/add-item-to-list",
        {
          method: "POST",
          headers,
          body: JSON.stringify({
            listaId,
            descricao: novoItem,
            quantidade: parseInt(quantidade) || 1,
          }),
        }
      );

      const text = await res.text();
      if (!res.ok) {
        throw new Error(`HTTP ${res.status} - ${text}`);
      }

      // tentar parsear resposta e atualizar localmente
      try {
        const created = JSON.parse(text);
        console.log("Item adicionado:", created);
        if (created && created.id) {
          setItens((prev) => [created, ...prev]);
        } else {
          // fallback: recarregar da API
          await fetchItens();
        }
      } catch (_) {
        await fetchItens();
      }

      setNovoItem("");
      setQuantidade("1");
    } catch (error) {
      console.error("Erro ao adicionar item:", error);
      Alert.alert("Erro", `Não foi possível adicionar. ${error.message || ""}`);
    } finally {
      setSaving(false);
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
          padding: 20,
          justifyContent: "space-between",
        }}
      >
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="arrow-left" size={28} color="#3ba4e6" />
        </TouchableOpacity>
        <Text style={[styles.title, { flex: 1, textAlign: "center" }]}>
          {tipo ? `Itens - ${tipo}` : "Itens da Lista"}
        </Text>
        <View style={{ width: 28 }} />
      </View>

      {/* Campo de adicionar item */}
      <View
        style={{
          flexDirection: "row",
          paddingHorizontal: 20,
          marginBottom: 15,
        }}
      >
        <TextInput
          style={{
            flex: 1,
            borderWidth: 1,
            borderColor: "#ccc",
            borderRadius: 10,
            paddingHorizontal: 10,
            marginRight: 10,
          }}
          placeholder="Novo item..."
          value={novoItem}
          onChangeText={setNovoItem}
        />
        <TextInput
          style={{
            width: 60,
            borderWidth: 1,
            borderColor: "#ccc",
            borderRadius: 10,
            textAlign: "center",
            marginRight: 10,
          }}
          keyboardType="numeric"
          value={quantidade}
          onChangeText={setQuantidade}
        />
        <TouchableOpacity
          style={{
            backgroundColor: "#3ba4e6",
            borderRadius: 10,
            padding: 10,
          }}
          onPress={adicionarItem}
          disabled={saving}
        >
          <Icon name="plus" size={22} color="#fff" />
        </TouchableOpacity>
      </View>

      {/* Lista de itens */}
      <FlatList
        data={itens}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ paddingHorizontal: 20 }}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={{
              flexDirection: "row",
              alignItems: "center",
              backgroundColor: "#fff",
              padding: 12,
              borderRadius: 12,
              marginBottom: 10,
              elevation: 2,
            }}
            onPress={() => toggleComprado(item)}
          >
            <Icon
              name={item.comprado ? "checkbox-marked" : "checkbox-blank-outline"}
              size={28}
              color={item.comprado ? "#24b766" : "#aaa"}
            />
            <View style={{ marginLeft: 15, flex: 1 }}>
              <Text
                style={{
                  fontSize: 16,
                  textDecorationLine: item.comprado ? "line-through" : "none",
                  color: item.comprado ? "#888" : "#000",
                }}
              >
                {item.descricao}
              </Text>
              <Text style={{ fontSize: 14, color: "#555" }}>
                Quantidade: {item.quantidade}
              </Text>
            </View>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}
