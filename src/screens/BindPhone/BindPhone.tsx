import { Dimensions, StyleSheet, Text, View, Image, TextInput, TouchableOpacity, SafeAreaView, Pressable } from 'react-native'
import React, { Component,} from 'react'
import {HttpService} from '../../utils/http'
import LoginNavbar from '../../component/loginNavbar/loginNavbar'
import Loading from '../../component/Loading/Loading'
import tool from '../../utils/tool'
import { Set_State } from '../../redux/reducers/counterSlice'
import { connect } from 'react-redux'
const height = Dimensions.get('window').height
let api = require('../../utils/api')
const Fs = Dimensions.get('window').width*0.8

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
            boxHeight: 0,
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
                    LoadingMsg: '请输入手机号！'
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
                    LoadingMsg: '手机号格式错误！'
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
                LoadingMsg: '发送中...'
            }); //加载效果
            var down = that.state.count;
            HttpService.Post(api.getVerifyCode, {
                mobile: mobile
            }).then((res:any) => {
                if (res.flag == "00") {
                    this.setState({
                        msgType: 2,
                        visible: true,
                        LoadingMsg: '发送成功！'
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
                            mobiletitle: '(重新获取' + down + ')'
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
                        LoadingMsg: '获取验证码失败！'
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
                LoadingMsg: '请输入手机号！'
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
                LoadingMsg: '手机号格式错误！'
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
                LoadingMsg: '请输入验证码！'
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
        var mobile = this.state.mobile;
        var code = this.state.code;
        this.setState({
            msgType: 1,
            visible: true,
            LoadingMsg: '登录中...'
        })
        HttpService.Post(api.appVerifyCodeLogin,{
            userName:mobile,
            verifyCode:code
        }).then((res:any)=>{
            console.log(res, "登录获取的数据!！")
            if (res.flag == '00') {
                //保存登录信息
                // store.dispatch(Set_State('Set_State',res))
                this.props.Set_State(res)
                //跳转首页关闭之前的所有页面
                this.props.navigation.reset({index: 0,routes: [{ name: 'Tabbar' }]})
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
                <Loading
                    type={this.state.type}
                    LoadingMsg={this.state.LoadingMsg}
                    visible={this.state.visible}
                ></Loading>
                <SafeAreaView style={styles.view}>
                    <LoginNavbar
                        props={this.props}
                        name={'短信登录'}  //短信登录
                        showBack={true}
                        showHome={false}
                    ></LoginNavbar>

                    <View style={[styles.flex,{top: this.state.boxHeight,height: Dimensions.get('window').height-this.state.boxHeight}]}>
                        <View style={styles.con}>
                            <View  style={styles.list}>
                                <Image style={styles.Img} source={require('../../image/dl_user.png')}></Image>
                                <TextInput 
                                placeholderTextColor="#aeaeae"
                                allowFontScaling={false}
                                style={styles.Input} 
                                placeholder={'输入手机号'} 
                                onChangeText={this.mobileChangeSearch} 
                                keyboardType='numeric'>
                                </TextInput>
                            </View>
                            <View  style={styles.list}>
                                <Image style={styles.Img} source={require('../../image/dl_password.png')}></Image>
                                <TextInput allowFontScaling={false} style={styles.Input} placeholderTextColor="#aeaeae" placeholder={'输入验证码'} onChangeText={this.codeChangeSearch}></TextInput>
                                <Text allowFontScaling={false} style={styles.Code} onPress={this.gainCode}>{this.state.mobiletitle}</Text>
                            </View>
                            <View style={styles.forget}>
                            </View>
                            <View  style={styles.butList}>
                                <Pressable style={({ pressed })=>[{backgroundColor: pressed? '#f3f3f3' : '#eeeeee'},styles.button]} onPress={()=>this.props.navigation.navigate('Tabbar')}>
                                    <Text allowFontScaling={false} style={styles.buttonL}>取消登录</Text>
                                </Pressable>
                                <Pressable style={({ pressed })=>[{backgroundColor: pressed? '#2da2fe' : '#1890FF'},styles.button]} onPress={this.Login}>
                                    <Text allowFontScaling={false} style={styles.buttonR}>登录</Text>
                                </Pressable>
                            </View>
                            <View style={styles.link}>
                                <TouchableOpacity style={styles.Url} onPress={()=>this.props.navigation.navigate('BindAccount')}>
                                    <Text allowFontScaling={false} style={{color: '#01AAED',fontSize:Fs/22}}>账号登录</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={styles.Url} onPress={()=>this.props.navigation.navigate('AccountRegister')}>
                                    <Text allowFontScaling={false} style={{color: '#01AAED',fontSize:Fs/22}}>注册账号</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                </SafeAreaView>
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
        borderRadius: 3,
        padding: 0,
        overflow: 'hidden'
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
        fontSize: Fs/24,
        color: '#01AAED',
        zIndex: 99,
    },
})

const mapStateToProps = (state:any)=>{
    return {
        state
    }
}
const mapDispatchToProps = {
    Set_State
}

export default connect(mapStateToProps,mapDispatchToProps)(BindPhone)
