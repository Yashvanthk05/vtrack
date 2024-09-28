import { ActivityIndicator, StatusBar, Text, View } from "react-native";
import Login from '../components/Login';
import { auth, db } from "../Configs/FirebaseConfig";
import { Redirect, useRouter } from 'expo-router';
import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";

export default function Index() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setLoading(false);
      if (user) {
        setUser(user);
        router.replace('/home');
      }
    });
    return () => unsubscribe();
  }, []);
  return (
    <>
      <StatusBar barStyle="dark-content" />
      {loading ? (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator size="large" color="#0000ff" />
        </View>
      ) : user ? (
        <Redirect href="./home" />
      ) : (
        <Login />
      )}
    </>
  );
}
