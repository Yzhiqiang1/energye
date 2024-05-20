import { Image } from 'react-native'
import React, { Component } from 'react'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeBar from "./homeBar/homeBar"
import Configuration from "../screens/Configuration/Configuration"
import User from "../screens/User/User"

//创建底部导航
const Tab = createBottomTabNavigator();

export class Tabbar extends Component {
  state = {
    count:0
  }
  componentDidMount(){
    console.log('发送请求')
  }
  render() {
    return (
      <Tab.Navigator
        screenOptions={({route})=>({
          tabBarIcon: (React) =>{
            if(route.name == '首页'){
              return (<Image style={{width:35}}  resizeMode='contain' source={require('../image/index.png')} />)
            }else if(route.name == '云组态'){
              return (<Image style={{width:35}}  resizeMode='contain' source={require('../image/configuration.png')} />)
            }else if(route.name == '我的'){
              return (<Image style={{width:35}}  resizeMode='contain' source={require('../image/user.png')} />)
            }
          },
          headerShown: false,
          tabBarStyle: { 
            height: 75,
            paddingBottom: 10,
          },
        })}
      >
        <Tab.Screen name="首页" component={HomeBar} />
        <Tab.Screen name="云组态" component={Configuration} />
        <Tab.Screen name="我的" component={User} />
      </Tab.Navigator>
    )
  }
}

export default Tabbar