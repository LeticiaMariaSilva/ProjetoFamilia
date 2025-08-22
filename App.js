import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { ClerkProvider } from "@clerk/clerk-expo";
import { tokenCache } from "./src/storage/tokenCache";

import Home from "./src/(public)/home";
import Login from "./src/(public)/login";
import Cadastro from "./src/(public)/cadastro";
import Inicio from "./src/(auth)/inicio";
import Compras from "./src/(auth)/compras";
import Veiculo from "./src/(auth)/veiculo";
import Tarefas from "./src/(auth)/tarefas";
import Perfil from "./src/(auth)/perfil";
import LembreteDeManutencao from "./src/(auth)/LembreteManuntencao";

import ProtectedRoute from "./src/componentes/ProtectedRoute"; // componente que protege rotas privadas

const Stack = createNativeStackNavigator();

const PUBLIC_CLERK_PUBLISHABLE_KEY = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY;

export default function App() {
  return (
    <ClerkProvider publishableKey={PUBLIC_CLERK_PUBLISHABLE_KEY} tokenCache={tokenCache}>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Home">
          {/* Rotas públicas */}
          <Stack.Screen name="Home" component={Home} options={{ headerShown: false }} />
          <Stack.Screen name="Login" component={Login} options={{ headerShown: false }} />
          <Stack.Screen name="Cadastro" component={Cadastro} options={{ headerShown: false }} />

          {/* Rotas privadas */}
          <Stack.Screen
            name="Inicio"
            options={{ headerShown: false }}
          >
            {props => <ProtectedRoute component={Inicio} {...props} />}
          </Stack.Screen>

          <Stack.Screen
            name="Compras"
            options={{ headerShown: false }}
          >
            {props => <ProtectedRoute component={Compras} {...props} />}
          </Stack.Screen>

          <Stack.Screen
            name="Veiculo"
            options={{ headerShown: false }}
          >
            {props => <ProtectedRoute component={Veiculo} {...props} />}
          </Stack.Screen>

          <Stack.Screen
            name="Tarefas"
            options={{ headerShown: false }}
          >
            {props => <ProtectedRoute component={Tarefas} {...props} />}
          </Stack.Screen>

          <Stack.Screen
            name="Perfil"
            options={{ headerShown: false }}
          >
            {props => <ProtectedRoute component={Perfil} {...props} />}
          </Stack.Screen>

          <Stack.Screen
            name="LembreteDeManutencao"
            options={{ headerShown: false }}
          >
            {props => <ProtectedRoute component={LembreteDeManutencao} {...props} />}
          </Stack.Screen>
        </Stack.Navigator>
      </NavigationContainer>
    </ClerkProvider>
  );
}
