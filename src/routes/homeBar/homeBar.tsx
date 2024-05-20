import { Text, View } from 'react-native'
import React, { Component } from 'react'
import { createStackNavigator } from '@react-navigation/stack';


import Home from '../../screens/Home/Home';

const Stack = createStackNavigator();

export class HomeBar extends Component {
  render() {
    return (
      <Stack.Navigator
        screenOptions={{headerShown:false}}
      >
        <Stack.Screen name="Index" component={Home}></Stack.Screen>
      </Stack.Navigator>
    )
  }
}

export default HomeBar