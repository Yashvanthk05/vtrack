import { View, Text, StyleSheet, ToastAndroid } from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { TouchableOpacity } from 'react-native';
import { auth } from '../../Configs/FirebaseConfig';
import { Redirect } from 'expo-router';

export default function profile() {
  const user = auth.currentUser;

  const handleSignOut = async () => {
    try {
      await auth.signOut();
      ToastAndroid.show("Logged Out",ToastAndroid.BOTTOM);
    } catch (error) {
      console.error("Sign Out Error", error);
      ToastAndroid.show("Failed to log out. Please try again.",ToastAndroid.BOTTOM);
    }
  };

  return (
    <>
    {user?<SafeAreaView style={styles.container}>
      <Text style={{fontSize:28,fontWeight:'bold'}}>VTRACK</Text>
      <View style={styles.box}>
        <Text style={{color:'#40A578',fontSize:20,fontWeight:'bold'}}>Contributors</Text>
        <Text style={{color:'#DEF9C4',fontSize:18,fontWeight:'bold'}}>Lakshan 23BAI1393</Text>
        <Text style={{color:'#DEF9C4',fontSize:18,fontWeight:'bold'}}>Sudharshan 23BAI1097</Text>
        <Text style={{color:'#DEF9C4',fontSize:18,fontWeight:'bold'}}>Surya 23BAI1386</Text>
        <Text style={{color:'#DEF9C4',fontSize:18,fontWeight:'bold'}}>Yashvanth 23BAI1589</Text>
      </View>
      <TouchableOpacity onPress={handleSignOut} style={{backgroundColor:'black',borderRadius:50,justifyContent:'center',paddingHorizontal:20,paddingVertical:15}}>
        <Text style={{color:'#F9D689',fontSize:20}}>Sign Out  <FontAwesome name="sign-out" size={24} color="#D24545" /></Text>
      </TouchableOpacity>
    </SafeAreaView>:<Redirect href={'./'}/>}
  </>
  )
}

const styles = StyleSheet.create({
  container:{
    height:'100%',
    backgroundColor:'white',
    padding:25,
    gap:20,
    paddingTop:10
  },
  box:{
    backgroundColor:'black',
    borderRadius:15,
    padding:15,
    gap: 10
  }
})