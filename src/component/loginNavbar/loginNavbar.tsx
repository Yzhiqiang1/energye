import { Image, Pressable, StyleSheet, Text, View } from 'react-native'
import React, { Component } from 'react'
import { Icon } from '@rneui/themed';//ico图标
export class LoginNavbar extends Component<any,any> {
  render() {
    return (
        <View style={styles.nav}>
            {this.props.showHome ?
              <Pressable style={styles.navLeft} onPress={()=>{this.props.props.navigation.navigate('Index')}}>
                <Image style={styles.navImg} source={require('../../image/Home.png')}></Image>
              </Pressable> : ''
            }
            {this.props.showBack ?
              <Pressable style={styles.navbar_left} onPress={()=>{this.props.props.navigation.goBack()}}>
              <Icon
                  name='left'
                  type='antdesign'
                  color='#fff'
                  size={22}
              />
          </Pressable>:''
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
        zIndex: 9999,
        width:'100%',
        height:60,
      },
      navLeft:{
        position:'absolute',
        left:10,
        top:15,
        zIndex:999,
        width: 30,
        height: 30,
        backgroundColor:'#234e73',
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
        color:'#fff'
      },
      navbar_left: {
        position: 'absolute',
        top:15,
        width:30,
        height:30,
        left: 5,
        zIndex:999
      },
})

export default LoginNavbar
