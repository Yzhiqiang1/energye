import { Dimensions, StyleSheet, Text, View, Image, TextInput, TouchableOpacity, Pressable, SafeAreaView } from 'react-native'
import React, { Component,} from 'react'
import {HttpService} from '../../utils/http'
import LoginNavbar from '../../component/loginNavbar/loginNavbar'
import { Set_State } from '../../redux/actions/user';
import store from '../../redux/store'//全局管理
import Loading from '../../component/Loading/Loading';
const Fs = Dimensions.get('window').width*0.8
let api = require('../../utils/api')

//屏幕高
const height = Dimensions.get('window').height
export class BindAccount extends Component<any,any> {
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
                LoadingMsg: '请输入账号！'
            },()=>{
                setTimeout(()=>{
                    this.setState({
                        visible: false,
                    })
                },2000)
            })
            console.log(1);
            return false;
        } else if (that.state.password.length < 1) {
            this.setState({
                msgType: 2,
                visible: true,
                LoadingMsg: '请输入密码！'
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
            LoadingMsg: '登录中...'
        })
        var userName = this.state.userName;
        var password = this.state.password;
        HttpService.Post(api.applogin,{
            userName:userName,
            password:password
        }).then((res:any)=>{
            console.log(res, "登录获取的数据!！")
            if(res.flag){
                if (res.flag == '00') {
                    this.setState({
                        intercept: true,
                    })
                    //保存登录信息到全局
                    store.dispatch(Set_State('Set_State',res))
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
                    LoadingMsg: '登录异常，检查账号是否正确',
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
            console.log(res);
            this.setState({
                msgType: 2,
                visible: true,
                LoadingMsg: '登录异常，检查网络是否连接',
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
                password: 'sd2021',
                userName: 'jg2021',
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
                    name={'账号登入'}   
                    showBack={false}
                    showHome={true}
                ></LoginNavbar>
                <View style={[styles.flex,{top: this.state.boxHeight,height: Dimensions.get('window').height-this.state.boxHeight}]}>
                    <View style={styles.con}>
                        <View  style={styles.list}>
                            <Image style={styles.Img} source={require('../../image/dl_user.png')}></Image>
                            <TextInput style={styles.Input} allowFontScaling={false} placeholder='输入用户名' onChangeText={this.userNameChangeSearch} ></TextInput>
                        </View>
                        <View  style={styles.list}>
                            <Image style={styles.Img} source={require('../../image/dl_password.png')}></Image>
                            <TextInput style={styles.Input} allowFontScaling={false} placeholder='输入密码' onChangeText={this.passwordChangeSearch} secureTextEntry={true} ></TextInput>
                        </View>
                        <View style={styles.forget}>
                            <TouchableOpacity >
                                <Text style={{color:'#2EA4FF'}} allowFontScaling={false}>忘记密码?</Text>
                            </TouchableOpacity>
                        </View>
                        <View  style={styles.butList}>
                            <Pressable style={styles.button} onPress={()=>this.props.navigation.navigate('Tabbar')}>
                                <Text style={styles.buttonL} allowFontScaling={false} >取消登录</Text>
                            </Pressable>
                            <Pressable style={styles.button} onPress={this.Login}>
                                <Text style={styles.buttonR} allowFontScaling={false} >登录</Text>
                            </Pressable>
                        </View>
                        <View style={styles.link}>
                            <TouchableOpacity style={styles.Url}  onPress={()=>this.props.navigation.navigate('BindPhone')}>
                                <Text style={{color: '#01AAED',fontSize:Fs/18}}>短信登录</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.Url} onPress={()=>this.props.navigation.navigate('AccountRegister')}>
                                <Text style={{color: '#01AAED',fontSize:Fs/18}}>注册账号</Text>
                            </TouchableOpacity>
                        </View>
                        
                        <View style={styles.Tourist}>
                            <Pressable style={styles.experience} onPress={this.touristLongin}>
                                <Image style={{width:30,height:30}} source={require('../../image/Tourist.png')}></Image>
                                <Text style={styles.Text} allowFontScaling={false} >体验账号登录</Text>
                            </Pressable> 
                        </View>
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
        lineHeight:60,
        textAlignVertical: 'center',
        textAlign:'center',
        fontSize:Fs/16,
        color:'#fff'
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
    list:{
        position: 'relative',
        width: '100%',
        height: 50,
        marginTop: 30,
        borderBottomWidth:1,
        borderStyle:'solid',
        borderColor: '#dddddd',
        overflow: 'hidden',
    },
    Img:{
        position: 'absolute',
        top:18,
        left:0,
        width: 25,
        height: 25,
        zIndex: 99,
    },
    Input:{
        position: 'relative',
        width: '100%',
        height: 50,
        lineHeight: 50,
        color: '#333333',
        fontSize: Fs/22,
        paddingLeft: 80,
    },
    forget:{
        position: 'relative',
        display:'flex',
        alignItems:'flex-end',
        fontSize: Fs/18,
        marginTop: 15,
        marginBottom: 15,
        overflow: 'hidden',
    },
    butList:{
        position: 'relative',
        width: '100%',
        textAlign: 'center',
        overflow: 'hidden',
        display:'flex',
        flexDirection:'row',
        justifyContent:'space-around',
    },
    button:{
        position: 'relative',
        width: '47.5%',
        height: 40,
        color: '#333',
        backgroundColor: '#eee',
        borderRadius: 10,
        padding: 0,
        overflow:'hidden'
    },
    buttonL:{
        height: 40,
        lineHeight: 40,
        textAlignVertical: 'center',
        textAlign: 'center',
        fontSize: Fs/22,
    },
    buttonR:{
        height: 40,
        lineHeight: 40,
        textAlignVertical: 'center',
        textAlign: 'center',
        fontSize: Fs/22,
        backgroundColor:'#2EA4FF',
        color:'#fff'
    },
    link:{
        position: 'relative',
        width: '100%',
        textAlign: 'center',
        overflow: 'hidden',
        display:'flex',
        flexDirection:'row',
        justifyContent:'center'
    },
    Url:{
        paddingLeft:10,
        paddingRight:10,
        marginTop:15
    },
    Tourist:{
        position: 'absolute',
        left: 25,
        bottom: 10,
        width: '100%',
        display:'flex',
        alignItems:'center',
        overflow: 'hidden',
    },
    experience:{
        position:'relative',
        display:'flex',
        alignItems:'center',
        overflow:'hidden',
        backgroundColor:'transparent',
        padding:0,
    },
    Text:{
        color:'#333',
        fontWeight: '400',
        fontSize: Fs/24,
    },
})

export default BindAccount