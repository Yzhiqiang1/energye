import { Image, Pressable, StyleSheet, Text, View } from 'react-native'
import React, { Component } from 'react'
import { Icon } from '@rneui/themed';

export class Navbars extends Component<any,any> {
  render() {
    return (
        <View style={styles.nav}>
            {this.props.showHome ?
            <Pressable style={styles.navLeft} onPress={()=>{this.props.props.navigation.navigate('Index')}}>
                <Icon 
                name='home'
                type='antdesign'
                color='#333'
                size={22}/>
            </Pressable> : ''
            }
            {this.props.showBack ?
            <Pressable style={[styles.navLeft,{backgroundColor:'none'}]} onPress={()=>{this.props.props.navigation.goBack()}}>
                <Icon 
                name='left'
                type='antdesign'
                color='#333'
                size={22}/>
            </Pressable> : ''
            }
        <Text style={styles.navName}>{this.props.name}</Text>
    </View>
    )
  }
}

const styles = StyleSheet.create({
    nav:{
        position:'absolute',
        top: 0,
        zIndex: 999,
        width:'100%',
        height:60,
        backgroundColor:'#ffffff',
      },
      navLeft:{
        position:'absolute',
        left:10,
        top:15,
        zIndex:999,
        width: 30,
        height: 30,
        backgroundColor:'#ffffff',
        borderRadius: 20,
        display:'flex',
        alignItems:'center',
        justifyContent:'center',
      },
      navImg:{
        width:25,
        height:25,
      },
      navName:{
        height:60,
        lineHeight:75,
        textAlign:'center',
        fontSize:20,
        color:'#333'
      },
})

export default Navbars