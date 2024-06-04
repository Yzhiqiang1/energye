import { Text, View, Image, TouchableOpacity, Dimensions } from 'react-native'
import React, { Component } from 'react'
import { StyleSheet } from 'react-native'
import { Index }from '../../screens/Home/Home'
const Fs = Dimensions.get('window').width*0.8
const ht = Dimensions.get('window').height*0.8

export class Menu extends Component<any,any> {
    constructor(props:any){
        super(props)
        this.state = {
            myMeun: props.myMeun,
            list: [
                {
                  id: '1001',
                  pagePath: "../index/index",
                  iconPath: require("../../image/index.png"),
                  selectedIconPath: require("../../image/index_se.png"),
                  text: "首页"
                },
                {
                  id: '1002',
                  pagePath: "../configuration/configuration",
                  iconPath: require("../../image/configuration.png"),
                  selectedIconPath: require("../../image/configuration_se.png"),
                  text: "云组态"
                },
                {
                  id: '1004',
                  pagePath: "../user/user",
                  iconPath: require("../../image/user.png"),
                  selectedIconPath: require("../../image/user_se.png"),
                  text: "我的"
                }
            ],
        }
    }
    _onPress(id: any){
        if(this.state.myMeun != id){
            if(id == '1001'){
                this.props.props.navigation.navigate('Index')
            }else if(id == '1002'){
                this.props.props.navigation.navigate('Configuration')
            }else if(id == '1004'){
                this.props.props.navigation.navigate('User')
            }
        }
    }
  render() {
    return (
        <View style={{flex: 1}}>
            <Index></Index>
             <View style={styles.menuBar}>
                {this.state.list.map((item:any, index:any) => {
                    return (
                        <View key={index} style={styles.urlFlex}>
                            <TouchableOpacity  style={styles.urlBar} onPress={()=> this._onPress(item.id)}>
                                <Image style={styles.imgBar} source={item.id == this.state.myMeun ? item.selectedIconPath : item.iconPath}></Image>
                                <Text style={[styles.txtBar,item.id == this.state.myMeun ? styles.txtBarSe : null]}>{item.text}</Text>
                            </TouchableOpacity>
                        </View>
                    );
                })}
            </View>
        </View>
    )
  }
}

const styles = StyleSheet.create({
    menuBar:{
        position:'absolute',
        bottom: 0,
        left: 0,
        width: '100%',
        height: ht/8,
        paddingBottom: 10,
        backgroundColor: '#fff',
        display: 'flex',
        flexDirection:'row',
        alignItems: 'center',
        zIndex: 999,
        overflow: 'hidden',
        borderTopColor: '#f4f4f4',
        borderStyle:'solid',
        borderTopWidth: 2,
    },
    urlFlex:{
        flex: 1,
    },
    urlBar:{
        position: 'relative',
        width: '100%',
        overflow: 'hidden',
        display:'flex',
        alignItems:'center',
    },
    imgBar:{
        margin:'auto',
        width:30,
        height:30,
    },
    txtBar:{
        width: '100%',
        textAlign: 'center',
        color: '#707070',
        fontSize: Fs/18,
    },
    txtBarSe:{
        color: '#00b4e6'
    },
})

export default Menu