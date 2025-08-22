import * as SecureStore from "expo-secure-store";

async function getToken(key) {
  try {
    return SecureStore.getItemAsync(key);
  } catch (error) {
    throw error;
  }
}

async function saveToken(key, value) {
  try {
    return SecureStore.setItemAsync(key, value);
  } catch (error) {
    throw error;
  }
}

export const tokenCache = { getToken, saveToken };
