import {
  View,
  Text,
  FlatList,
  Pressable,
  Image,
  TouchableOpacity,
} from "react-native";
import style from "../componentes/styleHome";
import { TextInput } from "react-native-web";

export default function Home({ navigation, route}) {
  return (
    <View style={style.container}>
      <Image
        source={require("../imagens/imageTasks.png")}
        style={style.imageTasks}
      />
      <View style={style.header}>
        <View style={style.TextContainer}>
          <Text style={style.Title}>
            Ajude sua família a organizar as tarefas!
          </Text>
          <Text style={style.SubTitle}>
            Organizar tarefas familiares melhora a rotina e facilita a
            coloboração, tornando o dia a dia mais leve e produtivo!
          </Text>
        </View>
        <View style={style.startButtonContainer}>
          <TouchableOpacity style={style.startButton} onPress={() => navigation.navigate("Login")}>
            <Text style={style.startButtonText}>COMEÇAR</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}
