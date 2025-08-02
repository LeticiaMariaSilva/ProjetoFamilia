import React from "react";
import { View, Text, TouchableOpacity, ScrollView, Image } from "react-native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import styles from "../componentes/styleInicio";
import { LinearGradient } from "expo-linear-gradient";

export default function Inicio({ navigation }) {
  return (
    <View style={styles.bg}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.welcome}>
          Bem vindo, <Text style={styles.name}>Alex</Text>
        </Text>

        <LinearGradient
          colors={["#6EBBEB", "#3E6A85"]}
          style={styles.familyCard}
        >
          <View>
            <Text style={styles.familyTitle}>Família Silva</Text>
            <Text style={styles.familySubtitle}>4 membros ativos</Text>
          </View>
          <Image
            source={require("../imagens/icon_home.png")}
            style={styles}
          />
        </LinearGradient>

        <View style={styles.menuRow}>
          <TouchableOpacity style={[styles.menuBtn, styles.menuBtnLight]} onPress={() => navigation.navigate("Compras")}>
            <Icon name="cart-outline" size={24} color="#ffffff" />
            <Text style={styles.menuText}>Lista de Compras</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.menuBtn, styles.menuBtnRed]} onPress={() => navigation.navigate("Lembrete")}>
            <Icon name="bell-outline" size={24} color="#fff" />
            <Text style={[styles.menuText, { color: "#fff" }]}>Lembretes</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.menuRow}>
          <TouchableOpacity style={[styles.menuBtn, styles.menuBtnGreen]} onPress={() => navigation.navigate("Tarefas")}>
            <Icon name="check-circle-outline" size={24} color="#fff" />
            <Text style={[styles.menuText, { color: "#fff" }]}>Tarefas</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.menuBtn, styles.menuBtnBlue]}>
            <Icon name="car-outline" size={24} color="#fff" />
            <Text style={[styles.menuText, { color: "#fff" }]}>Veículos</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.activitiesCard}>
  <View style={{ position: "relative" }}>
    <View style={styles.titleAccent} />
    <Text style={styles.activitiesTitle}>Atividades Recentes</Text>
  </View>
  
  <View style={styles.activityItem}>
    <View style={styles.activityDotGreen} />
    <View style={styles.activityContent}>
      <Text style={styles.activityText}>
        Pedro completou "Fazer lição de casa"
      </Text>
      <Text style={styles.activityTime}>2h atrás</Text>
    </View>
  </View>
  
  <View style={styles.activityItem}>
    <View style={[styles.activityDotBlue]} />
    <View style={styles.activityContent}>
      <Text style={styles.activityText}>
        Maria adicionou um item à lista "Supermercado"
      </Text>
      <Text style={styles.activityTime}>4h atrás</Text>
    </View>
  </View>
  
  <View style={styles.activityItem}>
    <View style={styles.activityDotRed} />
    <View style={styles.activityContent}>
      <Text style={styles.activityText}>
        João criou um lembrete "Consulta médica"
      </Text>
      
    </View>
  </View>
  </View>
      </ScrollView>

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
        <TouchableOpacity style={styles.tabItem} onPress={() => navigation.navigate("Veiculo")}>
          <Icon name="car-outline" size={24} color="#3ba4e6" />
          <Text style={styles.tabText}>Veículos</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.tabItem}>
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
