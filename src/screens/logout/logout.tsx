import { Dimensions, StyleSheet, Text, View, Image, TextInput, TouchableOpacity, Pressable, SafeAreaView, TouchableHighlight, Alert } from 'react-native'
import React, { Component,} from 'react'
import {HttpService} from '../../utils/http'
import LoginNavbar from '../../component/loginNavbar/loginNavbar'
import Loading from '../../component/Loading/Loading';
import { connect } from 'react-redux';
import { Set_State } from '../../redux/reducers/counterSlice';
import tool from '../../utils/tool';

const Fs = Dimensions.get('window').width*0.8
let api = require('../../utils/api')
//屏幕高
const height = Dimensions.get('window').height

export class Logout extends Component<any,any> {
    constructor(props: any) {
        super(props);
        this.state = {  
            mobile: '',
            code: '',
            boxHeight: 0,
            intercept: true,
        };
    };
    //输入手机号
    PhoneNumberChangeSearch = (value: string)=>{
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
    //注销校验
    littleTiger = ()=>{
        let that = this;
        if (that.state.mobile.length < 1) {
            this.setState({
                msgType: 2,
                visible: true,
                LoadingMsg: "请输入手机号！"
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
        } else if (that.state.code.length < 1) {
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
        that.logout(); //注销
    }
    logout = () => {
        this.setState({
            msgType: 1,
            visible: true,
            LoadingMsg: '注销中...'
        })
        var mobile = this.state.mobile;
        var code = this.state.code;
        HttpService.Post(api.applogin,{
            userName: mobile,
            password: code
        }).then((res:any)=>{
            this.setState({
                msgType: 2,
                visible: true,
                LoadingMsg: '注销失败'
            },()=>{
                setTimeout(()=>{
                    this.setState({
                        visible: false,
                    })
                },2000)
            })
        }).catch(res=>{
            this.setState({
                msgType: 2,
                visible: true,
                LoadingMsg: '注销失败'
            },()=>{
                setTimeout(()=>{
                    this.setState({
                        visible: false,
                    })
                },2000)
            })
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
            {/* 弹窗效果组件 */}
           <Loading 
                type={this.state.msgType} 
                visible={this.state.visible} 
                LoadingMsg={this.state.LoadingMsg}>
            </Loading>
            <View style={styles.images} onLayout={(event) => this.boxH(event)}>
                <Image style={styles.loginBac} resizeMethod='auto' source={require('../../image/loginBac.png')}></Image>
            </View>
            <SafeAreaView style={styles.view}>
                <LoginNavbar
                    props={this.props}
                    name={'注销账号'}
                    showBack={false}
                    showHome={true}
                ></LoginNavbar>
                <View style={[styles.flex,{top: this.state.boxHeight,height: Dimensions.get('window').height-this.state.boxHeight}]}>
                    <View style={styles.con}>
                        <View  style={styles.list}>
                            <Image style={styles.Img} source={require('../../image/zc_phone1x.png')}></Image>
                            <TextInput allowFontScaling={false} style={styles.Input} placeholder={'注册时手机号'} onChangeText={this.PhoneNumberChangeSearch} ></TextInput>
                        </View>
                        <View  style={styles.list}>
                            <Image style={styles.Img} source={require('../../image/dl_code.png')}></Image>
                            <TextInput allowFontScaling={false} style={styles.Input} placeholder={'输入验证码'} onChangeText={this.codeChangeSearch}></TextInput>
                            <Text style={styles.Code} allowFontScaling={false}>{"获取验证码"}</Text>
                        </View>
                        <View style={styles.forget}>
                            <TouchableOpacity >
                            </TouchableOpacity>
                        </View>
                        <View style={styles.butList}>
                            <Pressable style={({ pressed })=>[{backgroundColor: pressed ? '#f3f3f3' : '#eeeeee'},styles.button]} onPress={()=>this.props.navigation.navigate('Tabbar')}>
                                <Text style={styles.buttonL} allowFontScaling={false} >取消注销</Text>
                            </Pressable>
                            <Pressable style={({ pressed })=>[{backgroundColor: pressed ? '#2da2fe' : '#1890FF'},styles.button]} onPress={this.littleTiger}>
                                <Text style={styles.buttonR} allowFontScaling={false} >注销</Text>
                            </Pressable>
                        </View>
                        <View style={styles.butList}>
                            <Text style={styles.hint} allowFontScaling={false}>注销后账号所有数据将删除，请谨慎操作！！！</Text>
                        </View>
                    </View>
                </View>
            </SafeAreaView>
        </View>
       
    )
  }
}

const styles = StyleSheet.create({
    view:{
        flex: 1,
        display: 'flex',
        alignItems: 'center',
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
        marginBottom: 10
    },
    button:{
        position: 'relative',
        width: '47.5%',
        height: 40,
        color: '#333',
        borderRadius: 3,
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
    hint: {
        color: '#ff1137',
        fontWeight: '400',
        fontSize: Fs/24,
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
})

const mapStateToProps = (state:any)=>{
    return {
        state
    }
}
const mapDispatchToProps = {
    Set_State
}
export default connect(mapStateToProps,mapDispatchToProps)(Logout);