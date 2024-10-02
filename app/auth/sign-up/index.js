import { View, Text, StatusBar, TextInput, StyleSheet, TouchableOpacity, ToastAndroid } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useNavigation, useRouter } from 'expo-router'
import AntDesign from '@expo/vector-icons/AntDesign';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../../../Configs/FirebaseConfig';

export default function index() {
  const [email,setEmail]=useState();
  const [password,setPassword]=useState();
  const [empid,setEmpid]=useState();
  const router=useRouter();
    const navigation = useNavigation();
    useEffect(()=>{
        
    },[])
    const onCreateAccount=()=>{
      if(!email && !password && !empid){
        ToastAndroid.show('Please Enter all the Deatils',ToastAndroid.BOTTOM);
        return;
      }
      createUserWithEmailAndPassword(auth,email,password).then((userCredential)=>{
        const user = userCredential.user;
        console.log(user);
        router.replace('/');
      }).catch((error)=>{
        const errorCode=error.code;
        const errorMessage = error.message;
        console.log(errorMessage,errorCode);
      })
    }

  return (
    <View style={{backgroundColor:'white'}}><StatusBar barStyle={'dark-content'}/>
       <View style={{padding:25,marginTop:40,height:'100%',gap:50}}>
        <TouchableOpacity onPress={()=>router.back()}>
        <AntDesign name="arrowleft" size={24} color="black" />
        </TouchableOpacity>
        <View>
            <Text style={{fontSize:26,fontWeight:'bold',color:'black'}} >Create VTRACK Account</Text>
            <Text style={{fontSize:18,marginTop:10,color:'black'}}>Dear VIT Faculty,</Text>
            <Text style={{fontSize:18,color:'black'}}>Please Register Yourself!</Text>
        </View>
        <View style={{gap:40}}>
          <TextInput placeholder='Enter VIT Employee ID' placeholderTextColor={'black'} style={styles.input} onChangeText={(value)=>setEmpid(value)}/>
          <TextInput placeholder='Enter VIT Mail ID' placeholderTextColor={'black'} style={styles.input} onChangeText={(value)=>setEmail(value)}/>
          <TextInput placeholder='Enter VIT Mail Password' placeholderTextColor={'black'} style={styles.input} secureTextEntry={true} onChangeText={(value)=>setPassword(value)}/>
          <TouchableOpacity onPress={onCreateAccount} style={styles.button}>
            <Text style={{color:'black',fontWeight:'bold',fontSize:20}}>Create Account</Text>
          </TouchableOpacity>
          <TouchableOpacity style={{borderWidth:1,borderColor:'black',padding:10,alignItems:'center',justifyContent:'center',borderRadius:50,marginTop:-10}} onPress={()=>router.replace('auth/sign-in')}>
            <Text style={{color:'black',fontWeight:'bold',fontSize:20}}>Log In</Text>
          </TouchableOpacity>
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