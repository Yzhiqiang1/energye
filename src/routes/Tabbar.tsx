import { Image, Dimensions } from 'react-native'
import React, { Component } from 'react'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeBar from "./homeBar/homeBar"
import Configuration from "../screens/Configuration/Configuration"
import User from "../screens/User/User"
const ht =  Dimensions.get('window').height
//创建底部导航
const Tab = createBottomTabNavigator();

export class Tabbar extends Component {
  render() {
    return (
      <Tab.Navigator
        screenOptions={({route})=>({
          tabBarIcon: ({ focused }) =>{
            if(route.name == 'HomeBar'){
              if(focused){
                return (<Image style={{width: ht/24}}  resizeMode='contain' source={require('../image/index_se.png')} />)
              }else{
                return (<Image style={{width: ht/24}}  resizeMode='contain' source={require('../image/index.png')} />)
              }
            }else if(route.name == 'Configuration'){
              if(focused){
                return (<Image style={{width: ht/24}}  resizeMode='contain' source={require('../image/configuration_se.png')} />)
              }else{
                return (<Image style={{width: ht/24}}  resizeMode='contain' source={require('../image/configuration.png')} />)
              }
            }else if(route.name == 'User'){
              if(focused){
                return (<Image style={{width: ht/24}}  resizeMode='contain' source={require('../image/user_se.png')} />)
              }else{
                return (<Image style={{width: ht/24}}  resizeMode='contain' source={require('../image/user.png')} />)
              }
            }
          },
          headerShown: false,
          tabBarStyle: {
            height: ht/10,
            paddingBottom: 10,
          },
        })}
      >
        <Tab.Screen
        options={{
          title: '首页',
          tabBarLabelStyle: [{ fontSize: 17,fontWeight: '700', marginTop: -10, marginBottom: 10}],
        }}
        name="HomeBar" component={HomeBar} />
        <Tab.Screen
        options={{
          title: '云组态',
          tabBarLabelStyle: [{ fontSize: 17,fontWeight: '700', marginTop: -10, marginBottom: 10 }],
        }}
        name="Configuration" component={Configuration} />
        <Tab.Screen
        options={{
          title: '我的',
          tabBarLabelStyle: [{ fontSize: 17,fontWeight: '700', marginTop: -10, marginBottom: 10 }],
        }}
        name="User" component={User} />
      </Tab.Navigator>
    )
  }
}

export default Tabbar