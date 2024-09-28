import { View, Text, StatusBar, TextInput, StyleSheet, TouchableOpacity, ToastAndroid } from 'react-native'
import React, { useEffect } from 'react'
import { useNavigation, useRouter } from 'expo-router'
import AntDesign from '@expo/vector-icons/AntDesign';
import { auth } from '../../../Configs/FirebaseConfig';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { useState } from 'react';

export default function index() {
  const [email,setEmail]=useState();
  const [password,setPassword]=useState();
  const router=useRouter();
    const navigation = useNavigation();
    useEffect(()=>{
        
    },[])
    const onSignIn=()=>{
      const emailPattern = /^[a-zA-Z0-9._%+-]+@vit\.ac\.in$/;
      if(!email && !password){
        ToastAndroid.show("Please Enter all the Details",ToastAndroid.BOTTOM);
        return
      }
      if(!emailPattern.test(email)){
        ToastAndroid.show("VIT Faculty Mail ID only Allowed!!",ToastAndroid.BOTTOM);
        return
      }
      signInWithEmailAndPassword(auth,email,password).then((userCredential)=>{
        const user=userCredential.user;
        router.replace('/');
      }).catch((error)=>{
        const errorCode=error.code;
        const errorMessage = error.message;
        if(errorCode=='auth/invalid-credential'){
          ToastAndroid.show("Invalid Credential",ToastAndroid.BOTTOM);
        }
      })
    }
  return (
    <View><StatusBar barStyle={'dark-content'}/>
       <View style={{padding:25,marginTop:50,height:'100%',gap:50}}>
       <TouchableOpacity onPress={()=>router.back()}>
        <AntDesign name="arrowleft" size={24} color="black" />
        </TouchableOpacity>
        <View>
            <Text style={{fontSize:26,fontWeight:'bold',color:'black'}}>Welcome to VTRACK</Text>
            <Text style={{fontSize:18,marginTop:10,color:'black'}}>Dear VIT Faculty,</Text>
            <Text style={{fontSize:18,color:'black'}}>Please Log In to Continue</Text>
        </View>
        <View style={{gap:40}}>
          <TextInput placeholder='Enter VIT Mail ID' placeholderTextColor={'black'} style={styles.input} onChangeText={(value)=>setEmail(value)}/>
          <TextInput placeholder='Enter VIT Mail Password' placeholderTextColor={'black'} style={styles.input} secureTextEntry={true} onChangeText={(value)=>setPassword(value)}/>
          <View style={{height:20}}></View>
          <TouchableOpacity onPress={onSignIn} style={styles.button}>
            <Text style={{color:'white',fontWeight:'bold',fontSize:20}}>Log in</Text>
          </TouchableOpacity>
          {/* <TouchableOpacity style={{borderWidth:1,borderColor:'black',padding:10,alignItems:'center',justifyContent:'center',borderRadius:50,marginTop:-10}} onPress={()=>router.replace('auth/sign-up')}>
            <Text style={{color:'black',fontWeight:'bold',fontSize:20}}>Register</Text>
          </TouchableOpacity> */}
        </View>
        
    </View>
    </View>
  )
}

const styles = StyleSheet.create({
  input:{
    borderWidth:1,
    borderColor:'black',
    borderRadius:50,
    padding:20,
    color:'black'
  },
  button:{
    backgroundColor: 'black',
    padding:15,
    borderRadius:50,
    alignItems:'center',
    justifyContent:'center'
  }
})