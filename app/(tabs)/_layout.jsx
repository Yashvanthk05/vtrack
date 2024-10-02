import { View, Text } from 'react-native'
import React from 'react'
import { Tabs } from 'expo-router'
import AntDesign from '@expo/vector-icons/AntDesign';
import Ionicons from '@expo/vector-icons/Ionicons';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { StatusBar } from 'react-native';

export default function TabLayout() {
  return (
    <>
    <StatusBar barStyle={'dark-content'} />
    <Tabs screenOptions={{
        headerShown:false,
        tabBarActiveTintColor:'black',
        tabBarInactiveTintColor:'grey',
        tabBarStyle:{backgroundColor:'white',height:70,alignItems:'center',justifyContent:'center',borderTopWidth:0,paddingBottom:15},
    }}>
        <Tabs.Screen name="home"
        options={{
            tabBarLabel:'Home',
            tabBarIcon:({color})=><AntDesign name="home" size={24} color={color} />
        }}
        />
        <Tabs.Screen name="profile"
        options={{
          tabBarLabel:'Profile',
          tabBarIcon:({color})=><FontAwesome name="user-circle-o" size={24} color={color} />
        }}/>
    </Tabs>
    </>
  )
}