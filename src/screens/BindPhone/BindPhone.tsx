import { Dimensions, StyleSheet, Text, View, Image, TextInput, TouchableOpacity, Pressable } from 'react-native'
import React, { Component,} from 'react'
import {HttpService} from '../../utils/http'
import LoginNavbar from '../../component/loginNavbar/loginNavbar'
let api = require('../../utils/api')
import Loading from '../../component/Loading/Loading'
import tool from '../../utils/tool'
import store from '../../redux/store'
import { Set_State } from '../../redux/actions/user'

//全屏幕宽高
const height = Dimensions.get('window').height
const width = Dimensions.get('window').width
export class BindPhone extends Component<any,any> {
    constructor(props: any) {
        super(props);
        this.state = {  
            mobile: '',//手机
            code: '', //验证码
            isCode: true, //验证码发送状态
            mobiletitle: '获取验证码', //文字提示
            count: 120, //获取验证码时间间隔(S)

            type: 2,
            LoadingMsg: '',
            visible: false,
         };
    };
    //输入手机号
    mobileChangeSearch = (value: string)=>{
        this.setState({
            mobile: value
        })
    }
    //输入验证码
    codeChangeSearch = (value: string)=>{
        this.setState({
            code: value
        })
    }
    //获取验证码
    gainCode=()=>{
        var that = this;
        if (that.state.isCode == true) {
            var mobile = that.state.mobile
            if (mobile == "") {
                this.setState({
                    msgType: 2,
                    visible: true,
                    LoadingMsg:'请输入手机号！'
                },()=>{
                    setTimeout(()=>{
                        this.setState({
                            visible: false,
                        })
                    },2000)
                })
                return false;
            } else if (tool.regMobile(mobile) == false) {
                this.setState({
                    msgType: 2,
                    visible: true,
                    LoadingMsg:'手机号格式错误！'
                },()=>{
                    setTimeout(()=>{
                        this.setState({
                            visible: false,
                        })
                    },2000)
                })
                return false;
            }
            this.setState({
                msgType: 1,
                visible: true,
                LoadingMsg:'发送中...'
            }); //加载效果
            var down = that.state.count;
            HttpService.Post(api.getVerifyCode, {
                mobile: mobile
            }).then((res:any) => {
                if (res.flag == "00") {
                    this.setState({
                        msgType: 2,
                        visible: true,
                        LoadingMsg:'发送成功！'
                    },()=>{
                        setTimeout(()=>{
                            this.setState({
                                visible: false,
                            })
                        },2000)
                    })
                    //更改验证码发送状态
                    that.setState({
                        isCode: false
                    })
                    //倒计时从新发送
                    var interval = setInterval(function () {
                        down--;
                        that.setState({
                            mobiletitle: '重新获取(' + down + ')'
                        })
                        if (down == 0) {
                            clearInterval(interval)
                            that.setState({
                                isCode: true,
                                mobiletitle: '重新获取验证码'
                            })
                        }
                    }, 1000)
                } else {
                    //关闭加载效果
                    this.setState({
                        visible: false,
                    })
                    this.setState({
                        msgType: 2,
                        visible: true,
                        LoadingMsg:'获取验证码失败！'
                    },()=>{
                        setTimeout(()=>{
                            this.setState({
                                visible: false,
                            })
                        },2000)
                    })
                    return false;
                }
            }).catch((err) => {
                //关闭加载效果
                this.setState({
                    visible: false,
                })
                //信息提示
                this.setState({
                    msgType: 2,
                    visible: true,
                    LoadingMsg: err
                },()=>{
                    setTimeout(()=>{
                        this.setState({
                            visible: false,
                        })
                    },2000)
                })
                //终止程序
                return false;
            });
        }
    }
    //登入校验
    Login = ()=>{
        let that = this;
        if (that.state.mobile == '') {
            this.setState({
                msgType: 2,
                visible: true,
                LoadingMsg:'请输入手机号！'
            },()=>{
                setTimeout(()=>{
                    this.setState({
                        visible: false,
                    })
                },2000)
            })
            return false;
        } else if (tool.regMobile(that.state.mobile) == false) {
            this.setState({
                msgType: 2,
                visible: true,
                LoadingMsg:'手机号格式错误！'
            },()=>{
                setTimeout(()=>{
                    this.setState({
                        visible: false,
                    })
                },2000)
            })
            return false;
        }else if (that.state.code == "") {
            this.setState({
                msgType: 2,
                visible: true,
                LoadingMsg:'请输入验证码！'
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
    //请求登录
    getLogin = () => {
        var that = this;
        var mobile = this.state.mobile;
        var code = this.state.code;
        HttpService.Post(api.appVerifyCodeLogin,{
            userName:mobile,
            verifyCode:code
        }).then((res:any)=>{
            console.log(res, "登录获取的数据!！")
            if (res.flag == '00') {
                //保存登录信息
                store.dispatch(Set_State('Set_State',res))
                //跳转首页关闭之前的所有页面
                this.props.navigation.reset({index: 0,routes: [{ name: 'Index' }]})
            }else{
                this.setState({
                    msgType: 2,
                    visible: true,
                    LoadingMsg: res.msg
                },()=>{
                    setTimeout(()=>{
                        this.setState({
                            visible: false,
                        })
                    },2000)
                })
            }
        }).catch(res=>{
            console.log(res);
        })
    }
    render() {
        return (
            <View style={styles.view}>
                <LoginNavbar
                    props={this.props}
                    name={'短信登录'}   
                    showBack={true}
                    showHome={false}
                ></LoginNavbar>
                <View style={styles.images}>
                    <Image style={styles.loginBac} resizeMethod='auto' source={require('../../image/loginBac.png')}></Image>
                </View>
                <View style={styles.flex}>
                    <View style={styles.con}>
                        <View  style={styles.list}>
                            <Image style={styles.Img} source={require('../../image/dl_user.png')}></Image>
                            <TextInput 
                            style={styles.Input} 
                            placeholder='输入手机号' 
                            onChangeText={this.mobileChangeSearch} 
                            keyboardType='numeric'>
                            </TextInput>
                        </View>
                        <View  style={styles.list}>
                            <Image style={styles.Img} source={require('../../image/dl_password.png')}></Image>
                            <TextInput style={styles.Input} placeholder='输入验证码' onChangeText={this.codeChangeSearch} secureTextEntry={true} ></TextInput>
                            <Text  style={styles.Code} onPress={this.gainCode}>{this.state.mobiletitle}</Text>
                        </View>
                        <View style={styles.forget}>
                            <TouchableOpacity >
                                <Text style={{color:'#2EA4FF'}}>忘记密码?</Text>
                            </TouchableOpacity>
                        </View>
                        <View  style={styles.butList}>
                            <View style={styles.button}>
                                <Text style={styles.buttonL} onPress={()=>this.props.navigation.navigate('Index')}>取消登录</Text>
                            </View>
                            <View style={styles.button}>
                                <Text style={styles.buttonR} onPress={this.Login}>登录</Text>
                            </View>
                        </View>
                        <View style={styles.link}>
                            <TouchableOpacity style={styles.Url} onPress={()=>this.props.navigation.navigate('BindAccount')}>
                                <Text style={{color: '#01AAED',fontSize:18}}>账号登入</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.Url} onPress={()=>this.props.navigation.navigate('AccountRegister')}>
                                <Text style={{color: '#01AAED',fontSize:18}}>注册账号</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
                <Loading
                    type={this.state.type}
                    LoadingMsg={this.state.LoadingMsg}
                    visible={this.state.visible}
                ></Loading>
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
    view:{
        position: 'relative',
        height:height,
        width:width,
        backgroundColor: '#f4f4f4',
        overflow: 'hidden',
        flexDirection: 'column',
    },
    images:{
        position: 'relative',
        width: '100%',
        overflow: 'hidden',
    },
    loginBac:{
        width:'100%',
        height:height/3.3
    },
    flex:{
        position: 'relative',
        flex: 1,
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
        fontSize: 18,
        paddingLeft: 80,
    },
    forget:{
        position: 'relative',
        display:'flex',
        alignItems:'flex-end',
        fontSize: 18,
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
        fontSize: 28,
        color: '#333',
        backgroundColor: '#eee',
        borderRadius: 10,
        padding: 0,
    },
    buttonL:{
        height: 40,
        lineHeight: 40,
        textAlignVertical: 'center',
        textAlign: 'center',
        fontSize:18,
    },
    buttonR:{
        height: 40,
        lineHeight: 40,
        textAlignVertical: 'center',
        textAlign: 'center',
        fontSize:18,
        backgroundColor:'#2EA4FF',
        borderRadius: 10,
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
    },
    Code:{
        position: 'absolute',
        top:0,
        right:0,
        width:100,
        height: 50,
        lineHeight: 50,
        textAlign: 'right',
        fontSize: 16,
        color: '#01AAED',
        zIndex: 99,
    },
})

export default BindPhone
