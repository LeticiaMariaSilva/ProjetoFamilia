import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  Modal,
  TextInput,
  Alert,
  ScrollView,
} from "react-native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { LinearGradient } from "expo-linear-gradient";
import styles from "../componentes/stylePerfil";

const membros = [
  { id: "1", nome: "Alex Silva", tipo: "Administrador" },
  { id: "2", nome: "Maria Silva", tipo: "Mãe" },
  { id: "3", nome: "Pedro Silva", tipo: "Filho" },
  { id: "4", nome: "João Silva", tipo: "Filho" },
];

export default function Perfil() {
  const [modalVisible, setModalVisible] = useState(false);
  const [nome, setNome] = useState("Alex Silva");
  const [email, setEmail] = useState("alex.silva@email.com");
  const [telefone, setTelefone] = useState("(11) 91234-5678");
  const [notificacoes, setNotificacoes] = useState(true);

  function salvarEdicao() {
    setModalVisible(false);
  }

  function sairConta() {
    Alert.alert("Sair", "Deseja realmente sair da conta?", [
      { text: "Cancelar", style: "cancel" },
      { text: "Sair", style: "destructive", onPress: () => {/* lógica de logout */} }
    ]);
  }

  return (
    <ScrollView style={styles.bg} contentContainerStyle={{ paddingBottom: 40 }}>
      <LinearGradient colors={["#6EBBEB", "#3E6A85"]} style={styles.header}>
        <Text style={styles.title}>Perfil</Text>
        <TouchableOpacity style={styles.configBtn}>
          <Icon name="cog-outline" size={28} color="#fff" />
        </TouchableOpacity>
      </LinearGradient>

      <View style={styles.avatarArea}>
        <Image
          source={{ uri: "https://i.pravatar.cc/150?img=3" }}
          style={styles.avatar}
        />
        <TouchableOpacity style={styles.editAvatar}>
          <Icon name="camera" size={22} color="#fff" />
        </TouchableOpacity>
      </View>

      <View style={styles.infoCard}>
        <View style={styles.infoRow}>
          <Icon name="account" size={22} color="#3ba4e6" />
          <Text style={styles.infoLabel}>Nome:</Text>
          <Text style={styles.infoText}>{nome}</Text>
        </View>
        <View style={styles.infoRow}>
          <Icon name="email" size={22} color="#3ba4e6" />
          <Text style={styles.infoLabel}>Email:</Text>
          <Text style={styles.infoText}>{email}</Text>
        </View>
        <View style={styles.infoRow}>
          <Icon name="cellphone" size={22} color="#3ba4e6" />
          <Text style={styles.infoLabel}>Telefone:</Text>
          <Text style={styles.infoText}>{telefone}</Text>
        </View>
        <TouchableOpacity style={styles.editBtn} onPress={() => setModalVisible(true)}>
          <Icon name="pencil" size={20} color="#fff" />
          <Text style={styles.editBtnText}>Editar Perfil</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.sectionCard}>
        <View style={styles.sectionHeader}>
          <Icon name="bell-outline" size={22} color="#3ba4e6" />
          <Text style={styles.sectionTitle}>Notificações</Text>
        </View>
        <TouchableOpacity
          style={styles.switchRow}
          onPress={() => setNotificacoes(!notificacoes)}
        >
          <Text style={styles.switchLabel}>
            {notificacoes ? "Ativadas" : "Desativadas"}
          </Text>
          <Icon
            name={notificacoes ? "toggle-switch" : "toggle-switch-off-outline"}
            size={32}
            color={notificacoes ? "#3ba4e6" : "#888"}
          />
        </TouchableOpacity>
      </View>

      <View style={styles.sectionCard}>
        <View style={styles.sectionHeader}>
          <Icon name="account-group-outline" size={22} color="#3ba4e6" />
          <Text style={styles.sectionTitle}>Membros da Família</Text>
        </View>
        {membros.map(item => (
          <View key={item.id} style={styles.memberRow}>
            <Icon name="account-circle" size={28} color="#6EBBEB" />
            <View style={{ marginLeft: 10 }}>
              <Text style={styles.memberName}>{item.nome}</Text>
              <Text style={styles.memberType}>{item.tipo}</Text>
            </View>
          </View>
        ))}
      </View>

      <TouchableOpacity style={styles.logoutBtn} onPress={sairConta}>
        <Icon name="logout" size={22} color="#fff" />
        <Text style={styles.logoutText}>Sair da Conta</Text>
      </TouchableOpacity>

      <Modal visible={modalVisible} animationType="slide" transparent>
        <View style={styles.modalBg}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>Editar Perfil</Text>
            <TextInput
              style={styles.modalInput}
              value={nome}
              onChangeText={setNome}
              placeholder="Nome"
            />
            <TextInput
              style={styles.modalInput}
              value={email}
              onChangeText={setEmail}
              placeholder="Email"
              keyboardType="email-address"
            />
            <TextInput
              style={styles.modalInput}
              value={telefone}
              onChangeText={setTelefone}
              placeholder="Telefone"
              keyboardType="phone-pad"
            />
            <View style={styles.modalBtns}>
              <TouchableOpacity style={styles.saveBtn} onPress={salvarEdicao}>
                <Icon name="check" size={20} color="#fff" />
                <Text style={styles.saveBtnText}>Salvar</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.cancelBtn} onPress={() => setModalVisible(false)}>
                <Icon name="close" size={20} color="#fff" />
                <Text style={styles.saveBtnText}>Cancelar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
}
