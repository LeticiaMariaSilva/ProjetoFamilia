import React, { useEffect } from "react";
import { View, ActivityIndicator } from "react-native";
import { useAuth } from "@clerk/clerk-expo";
import { useNavigation } from "@react-navigation/native";

export default function ProtectedRoute({ component: Component, ...props }) {
  const { isSignedIn, isLoaded } = useAuth();
  const navigation = useNavigation();

  useEffect(() => {
    if (!isLoaded) return;

    if (!isSignedIn) {
      navigation.replace("Login"); // redireciona se não estiver logado
    }
  }, [isLoaded, isSignedIn]);

  if (!isLoaded || !isSignedIn) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return <Component {...props} />;
}
