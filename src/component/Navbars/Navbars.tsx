import { Dimensions, Pressable, StyleSheet, Text, View } from 'react-native'
import React, { Component } from 'react'
import { Icon } from '@rneui/themed';
const Fs = Dimensions.get('window').width*0.8
const ht = Dimensions.get('window').height*0.8

export class Navbars extends Component<any,any> {
  render() {
    return (
        <View style={styles.nav}>
            {this.props.showHome ?
            <Pressable style={styles.navLeft} onPress={()=>{this.props.props.navigation.navigate('Tabbar')}}>
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
        position:'relative',
        top: 0,
        left: 0,
        zIndex: 999,
        width:'100%',
        height: ht/10,
        backgroundColor:'#ffffff',
      },
      navLeft:{
        position:'absolute',
        left:10,
        top:'50%',
        marginTop: -15,
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
        height: ht/10,
        lineHeight: ht/10,
        textAlignVertical: 'center',
        textAlign:'center',
        fontSize: Fs/16,
        color:'#333'
      },
})

export default Navbars