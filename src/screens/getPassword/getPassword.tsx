import { Dimensions, StyleSheet, Text, View, Image, TextInput, TouchableOpacity, Pressable, SafeAreaView } from 'react-native'
import React, { Component,} from 'react'
import {HttpService} from '../../utils/http'
import LoginNavbar from '../../component/loginNavbar/loginNavbar'
import Loading from '../../component/Loading/Loading';
const Fs = Dimensions.get('window').width*0.8
let api = require('../../utils/api')
import { t } from 'i18next'

//屏幕高
const height = Dimensions.get('window').height
export class GetPassword extends Component<any,any> {
    constructor(props: any) {
        super(props);
        this.state = {  
            password: '',
            userName: '',
            boxHeight: 0,
            intercept: true,
         };
    };
    //输入用户名
    userNameChangeSearch = (value: string)=>{
        this.setState({
            userName: value
        })
    }
    //输入密码
    passwordChangeSearch = (value: string)=>{
        this.setState({
            password: value
        })
    }
    //登入校验
    Login = ()=>{
        let that = this;
        if (that.state.userName.length < 1) {
            this.setState({
                msgType: 2,
                visible: true,
                LoadingMsg: t('Pleaseente')
            },()=>{
                setTimeout(()=>{
                    this.setState({
                        visible: false,
                    })
                },2000)
            })
            return false;
        } else if (that.state.password.length < 1) {
            this.setState({
                msgType: 2,
                visible: true,
                LoadingMsg: t('pleaseEnterYourPassword')
            },()=>{
                setTimeout(()=>{
                    this.setState({
                        visible: false,
                    })
                },2000)
            })
            return false;
        }
        that.getLogin(); //登录
    }
    getLogin = () => {
        this.setState({
            msgType: 1,
            visible: true,
            LoadingMsg: t('beLoggingIn')
        })
        var userName = this.state.userName;
        var password = this.state.password;
        HttpService.Post(api.applogin,{
            userName:userName,
            password:password
        }).then((res:any)=>{
            console.log(res, t('DOBL'))
            if(res.flag){
                if (res.flag == '00') {
                    this.setState({
                        intercept: true,
                    })
                    //保存登录信息到全局
                    //跳转首页关闭之前的所有页面
                    this.props.navigation.reset({index: 0,routes: [{ name: 'Tabbar' }]})
                }else{
                    this.setState({
                        msgType: 2,
                        visible: true,
                        LoadingMsg: res.msg,
                        intercept: true,
                    },()=>{
                        setTimeout(()=>{
                            this.setState({
                                visible: false,
                            })
                        },2000)
                    })
                }
            }else{
                this.setState({
                    msgType: 2,
                    visible: true,
                    LoadingMsg: t('LECW'),
                    intercept: true,
                },()=>{
                    setTimeout(()=>{
                        this.setState({
                            visible: false,
                        })
                    },3000)
                })
            }
        }).catch(res=>{
            this.setState({
                msgType: 2,
                visible: true,
                LoadingMsg: t('loginError'),
                intercept: true,
            },()=>{
                setTimeout(()=>{
                    this.setState({
                        visible: false,
                    })
                },3000)
            })
        })
    }
    //游客模式登陆
    touristLongin = () => {
        var that = this;
        //游客登陆
        if(that.state.intercept){
            that.setState({
                //账号：jg2021 密码：sd2021
                userName: 'tlink',
                password: 'admin',
                intercept: false
            }, () => {
                that.getLogin(); //登录
            })
        }
    }
    boxH=(e:any)=>{
        const { height: newHeight } = e.nativeEvent.layout;
        this.setState({
            boxHeight: newHeight
        })
    }
  render() {
    return (
        <View style={{flex: 1}}>
            <View style={styles.images} onLayout={(event) => this.boxH(event)}>
                <Image style={styles.loginBac} resizeMethod='auto' source={require('../../image/loginBac.png')}></Image>
            </View>
            <SafeAreaView style={styles.view}>
                <LoginNavbar
                    props={this.props}
                    name={t('resetPasswords')}   
                    showBack={true}
                    showHome={false}
                ></LoginNavbar>
                <View style={[styles.flex,{top: this.state.boxHeight,height: Dimensions.get('window').height-this.state.boxHeight}]}>
                    <View style={styles.con}>
                        
                    </View>
                </View>
                {/* 弹窗效果组件 */}
                <Loading 
                    type={this.state.msgType} 
                    visible={this.state.visible} 
                    LoadingMsg={this.state.LoadingMsg}>
                </Loading>
            </SafeAreaView>
        </View>
    )
  }
}


const styles = StyleSheet.create({
    view:{
        flex: 1,
        display: 'flex',
        alignItems: 'center'
    },
    images:{
        position: 'absolute',
        width: '100%',
        overflow: 'hidden',
    },
    loginBac:{
        width:'100%',
        height:height/3.3
    },
    flex:{
        position: 'absolute',
        width: '100%',
        bottom: 10
    },
    con:{
        position: 'absolute',
        top: -25,
        left: 20,
        right: 20,
        bottom: 10,
        paddingTop:10,
        paddingRight:25,
        paddingLeft:25,
        backgroundColor: '#fff',
        borderRadius: 10,
        zIndex: 99,
    },

})


export default GetPassword