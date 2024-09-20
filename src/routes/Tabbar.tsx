import { Image, Dimensions, StyleSheet, Modal, View, Text } from 'react-native'
import React, { Component } from 'react'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeBar from "./homeBar/homeBar"
import Configuration from "../screens/Configuration/Configuration"
import User from "../screens/User/User"
import { store } from '../redux/storer';
import { appPrivacy } from '../redux/reducers/counterSlice';
import { connect } from 'react-redux';
const Fs = Dimensions.get('window').width*0.8//屏幕宽比 
const ht =  Dimensions.get('window').height
//创建底部导航
const Tab = createBottomTabNavigator();

export class Tabbar extends Component<any,any> {
  constructor(props: any){
    super(props)
    this.state={

    }
  }
  policy=(e:boolean)=>{
    store.dispatch(appPrivacy({privacy:e}))
  }
  render() {
    return (
      !this.props.firstApp?
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
          title: '首页',//'首页',
          tabBarLabelStyle: [{ fontSize: 17,fontWeight: '700', marginTop: -5, marginBottom: 5 }],
        }}
        name="HomeBar" component={HomeBar} />
        <Tab.Screen
        options={{
          title: '云组态',//'云组态',
          tabBarLabelStyle: [{ fontSize: 17,fontWeight: '700', marginTop: -5, marginBottom: 5 }],
        }}
        name="Configuration" component={Configuration} />
        <Tab.Screen
        options={{
          title: '我的',//'我的',
          tabBarLabelStyle: [{ fontSize: 17,fontWeight: '700', marginTop: -5, marginBottom: 5 }],
        }}
        name="User" component={User} />
      </Tab.Navigator>
      :
      <View style={{flex: 1}}>
        <View style={styles.privacy}>
            <View><Text style={styles.privacyTitle} allowFontScaling={false}>隐私政策协议</Text></View>
            <Text allowFontScaling={false} style={styles.content}>请你务必审慎阅读、充分理解<Text allowFontScaling={false} style={styles.url} onPress={()=>this.props.navigation.navigate('ServiceInfo')}>《TLINK物联网平台服务条款》</Text>各条款，其中包含了“服务条款”和“隐私政策”，包括但不限于:为了更好的向你提供服务，我们需要收集你的设备标识、操作日志等信息用于分析、优化应用性能。如果你同意，请点击下面按钮开始接受我们。</Text>
            <View style={styles.privacyBut}>
                <Text allowFontScaling={false} style={[styles.privacyButText,styles.partition]} onPress={()=>this.policy(false)}>暂不同意</Text>
                <Text allowFontScaling={false} style={[styles.privacyButText,styles.url]} onPress={()=>this.policy(true)}>同意并接受</Text>
            </View>
        </View>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  privacy: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    width: Fs,
    marginTop:-100,
    marginLeft:-Fs/2,
    backgroundColor: '#fff',
    shadowColor: "#000",
    shadowOffset: {
        width: 0,
        height: 4
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    borderRadius: 5,
    display: 'flex',
    padding: 20
},
privacyTitle: {
    fontSize: Fs/18,
    fontWeight: '600',
    textAlign: 'center',
    color: '#333'
},
content: {
    fontSize: Fs/24,
    borderBottomWidth: 1,
    borderStyle: 'solid',
    borderBottomColor: '#acacac', 
    padding: 10
},
url: {
    color: '#21a2f1'
},
privacyBut: {
    display: 'flex',
    flexDirection: 'row',
    marginTop: 10,
    height: 30,
},
partition: {
    borderRightWidth: 1,
    borderStyle: 'solid',
    borderRightColor: '#acacac', 
},
privacyButText: {
    width: '50%',
    height: 30,
    fontSize: Fs/20,
    lineHeight: 30,
    textAlign: 'center',
}
})
const mapStateToProps = (state:any)=>{
  return {
    firstApp: state.firstApp
  }
}
const mapDispatchToProps = {
  appPrivacy
}
export default connect(mapStateToProps,mapDispatchToProps)(Tabbar)