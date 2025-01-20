import { Dimensions, Image, StyleSheet, Text, TextInput, TouchableOpacity, View,SafeAreaView, Pressable } from 'react-native'
import React, { Component } from 'react'
import { CheckBox } from '@rneui/themed';
import Navbar from '../../component/navbar/navbar'
import tool from '../../utils/tool';
import { HttpService } from '../../utils/http';
import Loading from '../../component/Loading/Loading';
const api = require('../../utils/api')
const Fs = Dimensions.get('window').width*0.8
import { t } from 'i18next';

export class AccountRegister extends Component<any,any> {
    constructor(props: any){
        super(props)
        this.state = {
            mobile: '', //手机
            password: '', //密码
            confirmPsw: '', //确认密码
            code: '', //验证码
            isCode: true, //验证码发送状态
            mobiletitle: t('getVerificationCode'), //文字提示
            count: 120, //获取验证码时间间隔(S)
            btn_disable: true, //按钮
            agreeVal: false,//勾选协议，默认勾选
            msgType: 1,
            LoadingMsg: '',
            visible: false,
        }
    }
    //输入手机号
    bindMobile=(e: any)=>{
        this.setState({
            mobile: e
        })
    }

    //输入密码
    bindPassword=(e: any)=>{
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
                LoadingMsg: t('pleaseEnterThePhoneNumber')
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
                LoadingMsg: t('phoneError')
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
                LoadingMsg: t('pleaseEnterYourPassword')
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
                LoadingMsg: t('PleasePassword')
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
                LoadingMsg: t('twoDifferentPasswords')
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
                LoadingMsg: t('TVCIE')
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
                LoadingMsg: t('PCTTOS')
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
            LoadingMsg: t('underEegistration')
        }); //加载效果
        var mobile = that.state.mobile;
        var password = that.state.password;
        var verifyCode = that.state.code;
        HttpService.Post(api.appRegister, {
        userName: mobile,
        verifyCode: verifyCode,
        password: password,
        }).then((res:any) => {
            if (res.flag == '00') {
                this.setState({
                    msgType: 2,
                    visible: true,
                    LoadingMsg: t('registeredSuccessfully')
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
            LoadingMsg:t('registeredSuccessfully')
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
                    LoadingMsg: t('pleaseEnterThePhoneNumber')
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
                    LoadingMsg: t('phoneError')
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
                LoadingMsg: t('Loading')
            }); //加载效果
            var down = that.state.count;
            HttpService.Post(api.getVerifyCode, {
                mobile: mobile
            }).then((res:any) => {
                if (res.flag == "00") {
                    this.setState({
                        msgType: 2,
                        visible: true,
                        LoadingMsg: t('sentSuccessfully')
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
                            mobiletitle: '('+ t('reacquire') + down + ')'
                        })
                        if (down == 0) {
                            clearInterval(interval)
                            that.setState({
                                isCode: true,
                                mobiletitle:  t('getVerification')
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
                        LoadingMsg: res.msg
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
            <Loading
                type={this.state.msgType}
                LoadingMsg={this.state.LoadingMsg}
                visible={this.state.visible}
            ></Loading>
            <SafeAreaView style={styles.box}>
                <Navbar
                    props={this.props}
                    pageName={t('registerAnAccount')}
                    showBack={true}     
                    showHome={false}
                    LoginStatus={3}
                ></Navbar>
                <View style={styles.view}>
                    <View style={styles.con} >
                        <View style={styles.list} >
                            <Image style={styles.Img} source={require('../../image/zc_phone1x.png')}></Image>
                            <TextInput placeholderTextColor="#aeaeae" allowFontScaling={false} style={styles.Input} placeholder={t('enterMobileNumber')} keyboardType='numeric' onChangeText={this.bindMobile}></TextInput>
                        </View>
                        <View style={styles.list} >
                            <Image style={styles.Img} source={require('../../image/dl_password.png')}></Image>
                            <TextInput placeholderTextColor="#aeaeae" allowFontScaling={false} style={styles.Input2} placeholder={t('enterPassword')} onChangeText={this.bindPassword}></TextInput>
                        </View>
                        <View style={styles.list} >
                            <Image style={styles.Img} source={require('../../image/dl_password.png')}></Image>
                            <TextInput placeholderTextColor="#aeaeae" allowFontScaling={false} style={styles.Input3} placeholder={t('confirmPassword')} onChangeText={this.bindconfirmPsw} secureTextEntry={true}></TextInput>
                        </View>
                        <View style={styles.list} >
                            <Image style={styles.Img} source={require('../../image/dl_code.png')}></Image>
                            <TextInput placeholderTextColor="#aeaeae" allowFontScaling={false} style={styles.Input4} placeholder={t('enterVerificationCode')} onChangeText={this.bindCode}></TextInput>
                            <Text style={styles.Code} allowFontScaling={false} onPress={this.gainCode}>{this.state.mobiletitle}</Text>
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
                            <Text style={styles.agree} allowFontScaling={false}>{t('IAgree')}</Text>
                            <Text style={styles.service} allowFontScaling={false}
                                onPress={()=>this.props.navigation.navigate('ServiceInfo')}
                            >{t('TLINK')}</Text>
                        </View>

                        <View style={styles.butList}>
                            <Pressable style={({ pressed })=>[{backgroundColor: pressed ? '#f3f3f3' : '#eeeeee'},styles.buttonL]} onPress={()=>this.props.navigation.navigate('Tabbar')}>
                                <Text style={styles.buttonText} allowFontScaling={false}>{t('cancelRegister')}</Text>
                            </Pressable>
                            <Pressable style={({ pressed })=>[{backgroundColor: pressed ? '#2da2fe' : '#1890FF'},styles.buttonR]} onPress={this.register} >
                                <Text style={[styles.buttonText,{color: '#fff'}]} allowFontScaling={false}>{t('registerAnAccount')}</Text>
                            </Pressable>
                        </View>
                        <View style={styles.link} >
                            <TouchableOpacity>
                                <Text style={styles.Url} onPress={()=>{this.props.navigation.navigate('BindPhone')}} allowFontScaling={false}>{t('SMSlogin')}</Text>
                            </TouchableOpacity>
                            <TouchableOpacity>
                                <Text style={styles.Url} onPress={()=>{this.props.navigation.navigate('BindAccount')}} allowFontScaling={false}>{t('AccountLogin')}</Text>
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
        justifyContent: 'center',
        flexWrap: 'wrap',
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
        fontSize: Fs/24,
        color: '#01AAED',
        zIndex: 99,
    },
    Input:{
        position: 'relative',
        width: '100%',
        height: 50,
        color: '#333333',
        fontSize: Fs/22,
        paddingLeft: 40,
        textAlignVertical: 'center'
    },
    Input2:{
        position: 'relative',
        width: '100%',
        height: 50,
        lineHeight: 50,
        color: '#333333',
        fontSize: Fs/22,
        paddingLeft: 40,
        textAlignVertical: 'center'
    },
    Input3:{
        position: 'relative',
        width: '100%',
        height: 50,
        color: '#333333',
        fontSize: Fs/22,
        paddingLeft: 40,
        textAlignVertical: 'center'
    },
    Input4:{
        position: 'relative',
        width: '100%',
        height: 50,
        color: '#333333',
        fontSize: Fs/22,
        padding: 10,
        paddingLeft: 40,
        textAlignVertical: 'center',
    },
    agree:{
        fontSize: Fs/24,
    },
    CheckBox:{
        padding: 0,
    },
    service:{
        color: '#01AAED',
        fontSize: Fs/24,
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
        borderRadius: 3,
        padding: 0,
    },
    buttonText:{
        height: 40,
        lineHeight: 40,
        textAlignVertical: 'center',
        textAlign: 'center',
        fontSize: Fs/20,
        color: '#333',
    },
    buttonR:{
        position: 'relative',
        width: '40.5%',
        height: 40,
        borderRadius: 3,
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
        fontSize: Fs/22,
        color: '#01AAED',
        paddingRight:10,
        paddingLeft:10,
        marginTop: 15
    },
}) 
export default AccountRegister