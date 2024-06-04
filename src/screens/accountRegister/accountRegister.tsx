import { Dimensions, Image, StyleSheet, Text, TextInput, TouchableOpacity, View,SafeAreaView } from 'react-native'
import React, { Component } from 'react'
import { CheckBox } from '@rneui/themed';
import Navbar from '../../component/navbar/navbar'
import tool from '../../utils/tool';
import { HttpService } from '../../utils/http';
import Loading from '../../component/Loading/Loading';
const api = require('../../utils/api')
const Fs = Dimensions.get('window').width*0.8

export class AccountRegister extends Component<any,any> {
    constructor(props: any){
        super(props)
        this.state = {
            mobile: '', //手机
            password: '', //密码
            confirmPsw: '', //确认密码
            code: '', //验证码
            isCode: true, //验证码发送状态
            mobiletitle: '获取验证码', //文字提示
            count: 60, //获取验证码时间间隔(S)
            // agree: 'agree' ,//勾选协议，默认勾选
            // checked:true,
            btn_disable: true, //按钮
            agreeVal: false,

            msgType: 1,
            LoadingMsg: '',
            visible: false,
        }
    }
    //输入手机号
    bindMobile=(e:any)=>{
        this.setState({
            mobile: e
        })
        console.log(this.state.mobile);
        
    }
    //输入密码
    bindPassword=(e:any)=>{
        this.setState({
            password: e
        })
    }
    //输入确认密码
    bindconfirmPsw=(e:any)=>{
        this.setState({
            confirmPsw: e
        })
    }
    //输入验证码
    bindCode=(e:any)=>{
        this.setState({
            code: e
        })
    }
    //协议选择
    checkboxChange=(e:any)=>{
        this.setState({
            agreeVal: e
        })
    }
    // 提交-手机注册
    register=(e:any)=>{
        var that = this;
        var mobile = that.state.mobile;
        var password = that.state.password;
        var confirmPsw = that.state.confirmPsw;
        var code = that.state.code;
        var agreeVal = that.state.agreeVal
        if (mobile == '') {
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
        } else if (password == "") {
            this.setState({
                msgType: 2,
                visible: true,
                LoadingMsg:'请输入密码！'
            },()=>{
                setTimeout(()=>{
                    this.setState({
                        visible: false,
                    })
                },2000)
            })
            return false;
        } else if (confirmPsw == "") {
            this.setState({
                msgType: 2,
                visible: true,
                LoadingMsg:'请输入确认密码！'
            },()=>{
                setTimeout(()=>{
                    this.setState({
                        visible: false,
                    })
                },2000)
            })
            return false;
        } else if (confirmPsw != password) {
            this.setState({
                msgType: 2,
                visible: true,
                LoadingMsg:'两次密码不一致！'
            },()=>{
                setTimeout(()=>{
                    this.setState({
                        visible: false,
                    })
                },2000)
            })
            return false;
        } else if (code == '') {
            this.setState({
                msgType: 2,
                visible: true,
                LoadingMsg:'验证码为空！'
            },()=>{
                setTimeout(()=>{
                    this.setState({
                        visible: false,
                    })
                },2000)
            })
            return false;
        } else if (!agreeVal) {
            this.setState({
                msgType: 2,
                visible: true,
                LoadingMsg:'请勾选服务条款！'
            },()=>{
                setTimeout(()=>{
                    this.setState({
                        visible: false,
                    })
                },2000)
            })
            return false;
        }
        //注册
        that.getRegister()
    }
    //注册函数
    getRegister=()=>{
        var that = this;
        this.setState({
            msgType: 1,
            visible: true,
            LoadingMsg:'注册中...'
        }); //加载效果
        var mobile = that.state.mobile;
        var password = that.state.password;
        var verifyCode = that.state.code;
        HttpService.Post(api.appRegister, {
        userName: mobile,
        verifyCode: verifyCode,
        password: password,
        }).then((res:any) => {
            console.log(res);
            if (res.flag == '00') {
                this.setState({
                    msgType: 2,
                    visible: true,
                    LoadingMsg:'注册成功！'
                },()=>{
                    setTimeout(()=>{
                        this.setState({
                            visible: false,
                        })
                    },3000)
                })
                //跳转到账号登录页
                setTimeout(()=>{
                    this.props.navigation.navigate('BindAccount')
                }, 3050)
            } else {
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
        //关闭加载效果
            this.setState({
                visible: false,
            }),
        // //提示信息
        this.setState({
            msgType: 2,
            visible: true,
            LoadingMsg:'注册成功！'
        },()=>{
            setTimeout(()=>{
                this.setState({
                    visible: false,
                })
            },2000)
        })
            
        })
    }
    //获取验证码
    gainCode=(e:any)=>{
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
                LoadingMsg:'加载中...'
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
                    this.setState({
                        visible: false,
                    })
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
                    return false;
                }
            }).catch((err) => {
                //关闭加载效果
                this.setState({
                    visible: false,
                })
                // //信息提示
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
    render() {
        return (
        <View style={{flex: 1}}>
            <View style={{position: 'absolute',top: 0,width: "100%",height: "100%",backgroundColor: '#fff'}}>
            </View>
            <SafeAreaView style={styles.box}>
                <Navbar
                    props={this.props}
                    pageName={'注册账号'}   
                    showBack={true}
                    showHome={false}
                    LoginStatus={3}
                ></Navbar>
                <View style={styles.view}>
                    <View style={styles.con} >
                        <View style={styles.list} >
                            <Image style={styles.Img} source={require('../../image/zc_phone1x.png')}></Image>
                            <TextInput style={styles.Input} placeholder='输入手机号' keyboardType='numeric' onChangeText={this.bindMobile}></TextInput>
                        </View>
                        <View style={styles.list} >
                            <Image style={styles.Img} source={require('../../image/dl_password.png')}></Image>
                            <TextInput style={styles.Input} placeholder='输入密码' onChangeText={this.bindPassword} secureTextEntry={true}></TextInput>
                        </View>
                        <View style={styles.list} >
                            <Image style={styles.Img} source={require('../../image/dl_password.png')}></Image>
                            <TextInput style={styles.Input} placeholder='确认密码' onChangeText={this.bindconfirmPsw} secureTextEntry={true}></TextInput>
                        </View>
                        <View style={styles.list} >
                            <Image style={styles.Img} source={require('../../image/dl_code.png')}></Image>
                            <TextInput style={styles.Input}  placeholder='获取验证码' onChangeText={this.bindCode}></TextInput>
                            <Text style={styles.Code} >获取验证码</Text>
                        </View>
                        <View style={[styles.lists,{marginTop: 25,}]}>
                            <CheckBox
                            checked={this.state.agreeVal}
                            onPress={()=>this.checkboxChange(!this.state.agreeVal)}
                            iconType="material-community"
                            checkedIcon="checkbox-outline"
                            uncheckedIcon={'checkbox-blank-outline'}
                            containerStyle={styles.CheckBox}
                            />
                            <Text style={styles.agree}>我已阅读并同意</Text>
                            <Text style={styles.service}
                                onPress={()=>this.props.navigation.navigate('ServiceInfo')}
                            >《TLINK物联网平台服务条款》</Text>
                        </View>

                        <View style={styles.butList} >
                            <Text style={styles.buttonL}>取消注册</Text>
                            <Text style={styles.buttonR} onPress={this.register} >注册</Text>
                        </View>
                        <View style={styles.link} >
                            <TouchableOpacity>
                                <Text style={styles.Url} onPress={()=>{this.props.navigation.navigate('BindPhone')}}>短信登录</Text> 
                            </TouchableOpacity>
                            <TouchableOpacity>
                                <Text style={styles.Url} onPress={()=>{this.props.navigation.navigate('BindAccount')}}>账号登录</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
                <Loading
                    type={this.state.msgType}
                    LoadingMsg={this.state.LoadingMsg}
                    visible={this.state.visible}
                ></Loading>
            </SafeAreaView>
        </View>
        )
    }
}
const styles = StyleSheet.create({
    box:{
        flex: 1,
        display:'flex',
        alignItems:'center',
        backgroundColor: '#fff',
    },
    view:{
        position: 'relative',
        top: 80,
        width: '90%',
        margin:'auto',
        marginTop:5,
        marginBottom:5
    },
    con:{},
    list:{
        position: 'relative',
        width: '100%',
        height: 50,
        marginTop: 15,
        fontSize: Fs/20,
        borderBottomWidth:1,
        borderBottomColor:'#e3e3e3',
    },
    lists:{
        position: 'relative',
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        width: '100%',
        height: 50,
        marginTop: 15,
        fontSize: Fs/20,
    },
    Img:{
        position: 'absolute',
        top:13,
        left:0,
        width: 25,
        height: 25,
        zIndex: 99,
    },
    Code:{
        position: 'absolute',
        top:0,
        right:0,
        width:100,
        height: 50,
        lineHeight: 50,
        textAlignVertical: 'center',
        textAlign: 'right',
        fontSize: Fs/20,
        color: '#01AAED',
        zIndex: 99,
    },
    Input:{
        position: 'relative',
        width: '100%',
        height: 50,
        lineHeight: 50,
        color: '#333333',
        fontSize: Fs/18,
        paddingLeft: 40,
    },
    agree:{
    },
    CheckBox:{
        padding: 0,
    },
    service:{
        color: '#01AAED',
    },
    butList:{
        position: 'relative',
        width: '100%',
        marginTop: 15,
        overflow: 'hidden',
        display:'flex',
        flexDirection:'row',
        justifyContent:'space-between'
    },
    buttonL:{
        position: 'relative',
        width: '40.5%',
        height: 40,
        lineHeight: 40,
        textAlignVertical: 'center',
        textAlign: 'center',
        fontSize: Fs/18,
        color: '#333',
        backgroundColor: '#eee',
        borderRadius: 5,
        padding: 0,
    },
    buttonR:{
        position: 'relative',
        width: '40.5%',
        height: 40,
        lineHeight: 40,
        textAlignVertical: 'center',
        textAlign: 'center',
        fontSize: Fs/18,
        color: '#fff',
        backgroundColor: '#2EA4FF',
        borderRadius: 5,
        padding: 0,
        verticalAlign: 'middle',
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
        fontSize: Fs/20,
        color: '#01AAED',
        paddingRight:10,
        paddingLeft:10,
        marginTop: 15
    },
}) 
export default AccountRegister