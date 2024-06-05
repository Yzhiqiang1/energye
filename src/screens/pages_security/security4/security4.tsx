import { Dimensions, Image, SafeAreaView, StyleSheet, Text, View } from 'react-native'
import React, { Component } from 'react'
import Navbar from '../../../component/navbar/navbar'
import styleg from '../../../indexCss'
import { Register } from '../../../utils/app'
import store from '../../../redux/store'
import { HttpService } from '../../../utils/http'
import Loading from '../../../component/Loading/Loading'
const api = require('../../../utils/api')
const Fs = Dimensions.get('window').width*0.8

export class Security4 extends Component<any,any> {
    constructor(props:any){
        super(props)
        this.state={
            LoginStatus: 1, //登录状态默认未登录
            //数据项
            dataArr: [],

            msgType: 1,
            visible: false,
            LoadingMsg: ''
        }
    }
    componentDidMount(): void {
         //调用登录验证
         Register.userSignIn(false).then(res => {
            //校验登录成功后执行
            if (res == true) {
                //向自定义导航传递登录状态
                this.setState({
                    LoginStatus: 2
                }, () => {
                    //校验通过后调用方法
                    this.check_ok();
                })
            } else {
                //向自定义导航传递登录状态
                this.setState({
                    LoginStatus: 1
                })
            }
        });
    }
    /************************************
     *     校验登录通过
     * *****************************/
    check_ok=()=>{
        let that = this;
        let parameterGrou = store.getState().userReducer.parameterGroup; //获取选中组和设备信息
        if (parameterGrou.onlyGroup.groupId) {
            that.getLoadList();
        } else {
            //信息提示
            this.setState({
                msgType: 2,
                visible: true,
                LoadingMsg: '获取参数失败！'
            },()=>{
                setTimeout(()=>{
                    this.setState({
                        visible: false,
                    })
                },2000)
            })
        }
    }
    /**组选中切换**/
    choiceGroup=()=>{
        //获取ph值数据列表
        this.getLoadList();
    }
    //获取ph值数据列表
    getLoadList=()=>{
        let that = this;
        let LoginStatus = that.state.LoginStatus; //登录状态
        if (LoginStatus == 1) {
            //错误提示信息
            this.setState({
                msgType: 2,
                visible: true,
                LoadingMsg: '获您还未登录,无法查询数据！取参数失败！'
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
            LoadingMsg: '加载中...'
        }); //加载效果
        let userId = store.getState().userReducer.userId; //用户ID
        let groupId = store.getState().userReducer.parameterGroup.onlyGroup.groupId; //获取组ID
        //查询数据
        HttpService.apiPost(api.xdl_getLoadList, {
            userId: userId,
            deviceIds: groupId,
        }).then((res:any) => {
            if (res.flag == "00") {
                let listData = res.data;
                //校验数据是否为空
                if (listData.length > 0) {
                    that.setState({
                        dataArr: listData,
                    }, () => {
                        //关闭加载效果
                        this.setState({
                            visible: false,
                        })
                    })
                }
            } else {
                //关闭加载效果
                this.setState({
                    visible: false,
                })
                // //错误提示信息
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
        }).catch((fail_message) => {
            //关闭加载效果
            this.setState({
                visible: false,
            })
            // //错误提示信息
            this.setState({
                msgType: 2,
                visible: true,
                LoadingMsg: fail_message
            },()=>{
                setTimeout(()=>{
                    this.setState({
                        visible: false,
                    })
                },2000)
            })
        });
    }
    render() {
        return (
            <View style={{flex: 1}}>
                <View style={{position: 'absolute',top: 0,width: "100%",height: "100%",backgroundColor: '#fff'}}>
                </View>
                <SafeAreaView style={{flex: 1}}>
                    {/* 引入自定义导航栏 */}
                    <Navbar 
                        pageName={'相电流'}
                        showBack={true}
                        showHome={false}
                        isCheck={4}
                        LoginStatus={this.state.LoginStatus}
                        props={this.props}>
                    </Navbar>
                    {/* 内容区 */}
                    <View style={styleg.container}>
                        <View  style={styles.device}>
                            {this.state.dataArr.length == 0?
                                <Text allowFontScaling={false} style={styles.empty}>暂无数据</Text>:''
                            }
                            {this.state.dataArr.map((item:any,index:number)=>{
                                return(
                                    <View style={styles.item} key={index}>
                                        <View style={styles.block}>
                                            {/* <navigator 
                                                url="../index4_dl/index4_dl?deviceId={{item.deviceid}}&deviceName={{item.deviceName}}"
                                                class="url"
                                                open-type="navigate"
                                            > */}
                                            <View style={styles.title}>
                                                    <View style={styles.image}>
                                                        <Image style={styles.img} src='../../image/dianbiao.png'></Image>
                                                    </View>
                                                    <View style={styles.flex}>
                                                        <Text allowFontScaling={false} style={styles.name}>
                                                            {item.deviceName}
                                                        </Text>
                                                    </View>
                                                </View>
                                                <View style={styles.ul}>
                                                    <Text allowFontScaling={false} style={styles.p1}>
                                                        <View style={styles.t1c1}></View>
                                                        A:
                                                        <Text allowFontScaling={false} style={styles.t2}>
                                                            {item.data.Ia.val}
                                                            {item.data.Ia.dangwei}
                                                        </Text>
                                                    </Text>
                                                    <Text allowFontScaling={false} style={styles.p1}>
                                                        <View style={styles.t1c2}></View>
                                                        B:
                                                        <Text allowFontScaling={false} style={styles.t2}>
                                                            {item.data.Ib.val}
                                                            {item.data.Ib.dangwei}
                                                        </Text>
                                                    </Text>
                                                    <Text allowFontScaling={false} style={styles.p1}>
                                                        <View style={styles.t1c3}></View>
                                                        C:
                                                        <Text allowFontScaling={false} style={styles.t2}>
                                                            {item.data.Ic.val}
                                                            {item.data.Ic.dangwei}
                                                        </Text>
                                                    </Text>
                                                    <Text allowFontScaling={false} style={styles.t2}>{item.lastDate}</Text>
                                                </View>
                                            {/* </navigator> */}
                                        </View>
                                    </View>
                                )
                            })}
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
    device:{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 9,
        // padding: 0 10rpx,
    },
    item:{
        position: 'relative',
        width: '50%',
        padding: 5,
    },
//     item:nth-child(1),
//    item:nth-child(2):{
//       margin-top: 10rpx,
//     },
    block:{
        position: 'relative',
        width: '100%',
        backgroundColor: '#fff',
        borderRadius: 5,
    },
    flex:{
        flex: 1,
        width: 0,
    },
    url:{
        position: 'relative',
        width: '100%',
        // padding: 0 15rpx,
        overflow: 'hidden',
    },
    title:{
        position: 'relative',
        width: '100%',
        height: 40,
        display: 'flex',
        alignItems: 'center',
        borderStyle: 'solid',
        borderBottomWidth: 1,
        borderBottomColor: '#f2f2f2',
        overflow: 'hidden',
    },
    image:{
        width: 25,
        height: 25,
        // borderRadius: '50%',
        backgroundColor: '#068B4E',
        marginRight: 5,
        overflow: 'hidden',
    },
    img:{
        width: '100%',
        height: '100%',
        // borderRadius: 50%,
        overflow: 'hidden',
    },
    name:{
        position: 'relative',
        width: '100%',
        height: 40,
        lineHeight: 40,
        fontSize: Fs/24,
        color: '#333',
        overflow: 'hidden',
    },
    ul:{
        position: 'relative',   
        width: '100%',
        // padding: 10rpx 0,
        overflow: 'hidden',
    },
    p1:{
        position: 'relative',
        width: '100%',
        height: 25,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: '#333',
        overflow: 'hidden',
    },
    t1c1:{
        width: 8,
        height: 8,
        backgroundColor: '#00abd5',
        verticalAlign: 'middle',
        // borderRadius: 50%,
        marginRight: 5,
    },
    t1c2:{
        width: 8,
        height: 8,
        backgroundColor: '#46e3d0',
        verticalAlign: 'middle',
        // borderRadius: 50%,
        marginRight: 5,
    },
    t1c3:{
        width: 8,
        height: 8,
        backgroundColor: '#ff6893',
        verticalAlign: 'middle',
        // borderRadius: 50%,
        marginRight: 5,
    },
    t2:{
        fontWeight: '700',
        marginLeft: 5,
    },
    p2:{
        position: 'relative',
        width: '100%',
        height: 20,
        lineHeight: 20,
        textAlign: 'center',
        fontSize: Fs/24,
        color: '#999',
        overflow: 'hidden',
    },
    empty:{
        position: 'relative',
        width: '100%',
        // padding: 50rpx 0,
        textAlign: 'center',
        fontSize: Fs/22,
        color: '#999999',
        overflow: 'hidden',
    },
})

export default Security4