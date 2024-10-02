import { View, Text, Image, StyleSheet, TouchableOpacity, StatusBar, ActivityIndicator } from 'react-native';
import React from 'react';
import AntDesign from '@expo/vector-icons/AntDesign';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function Login() {
    const router = useRouter();

    return (
        <>
            <StatusBar barStyle={'dark-content'} />
            <View style={styles.container}>
                <StatusBar barStyle={'dark-content'} />
                <Image source={require("../assets/images/vitlogo.png")} style={styles.logo} />
                <Text style={{ fontWeight: '700', fontSize: 32, textAlign: 'center' }}>VTRACK</Text>
                <Text style={{ textAlign: 'center', fontSize: 18, color: 'grey' }}>Geolocation based Attendance System App for VIT Faculty.</Text>
                <TouchableOpacity style={styles.button} onPress={() => router.push('auth/sign-in')}>
                    <Text style={{ color: 'white', fontSize: 22 }}>Get Started</Text>
                    <AntDesign name="arrowright" size={24} color="white" />
                </TouchableOpacity>
            </View>
        </>
    );
}

const styles = StyleSheet.create({
    logo: {
        height: 265,
        width: 250
    },
    container: {
        justifyContent: 'center',
        alignItems: 'center',
        gap: 20,
        height: '100%',
        padding: 20
    },
    button: {
        backgroundColor: 'black',
        justifyContent: 'center',
        padding: 10,
        flexDirection: 'row',
        marginTop: '20%',
        borderRadius: 50,
        width: '100%',
        alignItems: 'center',
        gap: 15
    }
});
