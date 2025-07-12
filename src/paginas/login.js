import {
  View,
  Text,
  FlatList,
  Pressable,
  Image,
  TouchableOpacity,
} from "react-native";
import style from "../componentes/styleLogin";
import { TextInput } from "react-native-web";

export default function Login({ navigation, route}) {
    return (
        <View style={style.container}>
            <View style={style.bolaAzulGrande}></View>
            <Text style={style.textoLogin}> Login </Text>
        </View>
    )
}