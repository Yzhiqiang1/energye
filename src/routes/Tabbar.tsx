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
            if(route.name == '首页'){
              if(focused){
                return (<Image style={{width: ht/24}}  resizeMode='contain' source={require('../image/index_se.png')} />)
              }else{
                return (<Image style={{width: ht/24}}  resizeMode='contain' source={require('../image/index.png')} />)
              }
            }else if(route.name == '云组态'){
              if(focused){
                return (<Image style={{width: ht/24}}  resizeMode='contain' source={require('../image/configuration_se.png')} />)
              }else{
                return (<Image style={{width: ht/24}}  resizeMode='contain' source={require('../image/configuration.png')} />)
              }
            }else if(route.name == '我的'){
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
          tabBarLabelStyle: [{ fontSize: 17,fontWeight: '700', marginTop: -10, marginBottom: 10}],
        }}
        name="首页" component={HomeBar} />
        <Tab.Screen
        options={{
          tabBarLabelStyle: [{ fontSize: 17,fontWeight: '700', marginTop: -10, marginBottom: 10 }],
        }}
        name="云组态" component={Configuration} />
        <Tab.Screen
        options={{
          tabBarLabelStyle: [{ fontSize: 17,fontWeight: '700', marginTop: -10, marginBottom: 10 }],
        }}
        name="我的" component={User} />
      </Tab.Navigator>
    )
  }
}

export default Tabbar