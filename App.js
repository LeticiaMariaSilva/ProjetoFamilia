import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { StatusBar } from "expo-status-bar";
import Login from "./src/paginas/login";
import Home from "./src/paginas/home";
import Cadastro from "./src/paginas/cadastro";
import Inicio from "./src/paginas/inicio";
import Compras from "./src/paginas/compras";
import Veiculo from "./src/paginas/veiculo";
import Tarefas from "./src/paginas/tarefas";
import Perfil from "./src/paginas/perfil";




const Stack = createNativeStackNavigator()

export default function App() {
  return (
    <NavigationContainer>
    <Stack.Navigator initialRouteName="Home" >
      <Stack.Screen name="Home" component={Home} options={{headerShown: false}}/>
      <Stack.Screen name="Login" component={Login} options={{headerShown: false}}/>
      <Stack.Screen name="Cadastro" component={Cadastro} options={{headerShown: false}}/>
      <Stack.Screen name="Inicio" component={Inicio} options={{headerShown: false}}/>
      <Stack.Screen name="Compras" component={Compras} options={{headerShown: false}}/>
      <Stack.Screen name="Veiculo" component={Veiculo} options={{headerShown: false}}/>
      <Stack.Screen name="Tarefas" component={Tarefas} options={{headerShown: false}}/>
      <Stack.Screen name="Perfil" component={Perfil} options={{headerShown: false}}/>
    </Stack.Navigator>
    </NavigationContainer>
  )
}
