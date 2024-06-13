import { AppState, Image, StyleSheet, Text, View, Dimensions, SafeAreaView, ScrollView} from 'react-native'
import React, { Component } from 'react'
import Navbar from '../../../component/navbar/navbar'
import styleg from '../../../indexCss'
import { Register } from '../../../utils/app'
import store from '../../../redux/store'
import { HttpService } from '../../../utils/http'
import { localSocket } from '../../../redux/actions/user'
import Loading from '../../../component/Loading/Loading'
const api = require('../../../utils/api')
const Fs = Dimensions.get('window').width*0.8

let dataPos:any = {}; //dataPOS:{a:{},b:{}}
let eventListener:any = {}

export class Security2 extends Component<any,any> {
    constructor(props:any){
        super(props)
        this.state = {
            LoginStatus: 1, //登录状态 默认未登录
            checked: true,
            show: false, //开关按钮弹窗
    
            /**
             * 漏电检测数据
             */
            leakageArr: [], //传感器数据
    
            //是否启用实时数据
            socketTask: true, //默认不启用
            socketData: [], //实时数据是否返回
    
            //数据项
            optionData: [],

            msgType: 1,
            visible: false,
            LoadingMsg: ''
        }
    }

    componentDidMount(): void {
        //调用登录验证
        Register.userSignIn(true).then(res => {
            //校验登录成功后执行
            if (res == true) {
                //向自定义导航传递登录状态
                this.setState({
                    LoginStatus: 2,
                    socketTask: true,
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
        // 开启监听
        eventListener = AppState.addEventListener('change', this._handleAppStateChange);
    }

    //监听运行状态
    _handleAppStateChange=(nextappState: any)=>{
        if(nextappState == 'background'){//进入后台禁止数据更新
            this.setState({
                socketTask: false,
            })
        }
        if(nextappState == 'active'){//进入前台开始数据更新
            this.setState({
                socketTask: true,
            })
        }
        // 实时数据
        this.refreshData()
    }

    componentWillUnmount(): void {
        //组件销毁禁止实时数据更新
        this.setState({
            socketTask: false,
        })
        this.refreshData()
        // 组件销毁禁止再次循坏创建连接
        store.dispatch(localSocket({inSocket: false}))
        //销毁运行状态监听
        eventListener.remove();
    }
    /************************************
     *     校验登录通过
     * *****************************/
    check_ok=()=>{
        let that = this;
        let parameterGrou = store.getState().userReducer.parameterGroup; //获取选中组和设备信息
        if (parameterGrou.onlyGroup.groupId) {
            //获取漏电检测数据
            that.getData();
            //调用实时数据
            that.refreshData();
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
    //组选中切换
    choiceGroup=(e:any)=>{
        dataPos = {}
        this.getData();
    }
    /****************************
     *   处理实时数据
     * *************************/
    refreshData=()=>{
        let that = this;
        let socket = function (res: any) { //接收服务器发来的数据
            if (that.state.socketTask == true) { //页面卸载后禁止更新 
                if (res.flag == "00") {
                    let deviceId = res.deviceId; //websocket设备id
                    if (dataPos[deviceId] != undefined) {
                        let sensorsDates = res.sensorsDates; //websocket传感器数据集合[]
                        let data: any = that.state.leakageArr
                        data[dataPos[deviceId].index].time = res.time
                        that.setState({
                            leakageArr: data
                        })
                        // 过滤数据
                        for (var a = 0; a < sensorsDates.length; a++) {
                            if (dataPos[deviceId][sensorsDates[a].sensorsId] != undefined) {
                                if (sensorsDates[a].value != '') { //过滤心跳包
                                    let datas: any = that.state.leakageArr
                                    datas[dataPos[deviceId].index][dataPos[deviceId][sensorsDates[a].sensorsId]].value = sensorsDates[a].value
                                    //区分各个参数
                                    that.setState({
                                        leakageArr: datas
                                    })
                                }
                            }
                        }
                    }
                }
            }
        }
        store.dispatch(localSocket({localSocket:socket}))
    }
    /***************************
     *     获取漏电检测数据
     * *************************/
    getData=()=>{
        let that = this;
        let userId = store.getState().userReducer.userId; //用户ID
        let groupId =store.getState().userReducer.parameterGroup.onlyGroup.groupId;
        this.setState({
            msgType: 1,
            visible: true,
            LoadingMsg: '加载中...'
        })
        HttpService.apiPost(api.ldjc_getData, {
            userId: userId,
            groupId: groupId,
        }).then((res:any) => {
            if (res.flag == "00") {
                let listData = res.data;
                if (listData.length > 0) {
                    for (let i = 0; i < listData.length; i++) {
                        let objData = listData[i];
                        if (dataPos[objData.deviceid] == undefined) {
                            dataPos[objData.deviceid] = {};
                        }
                        dataPos[objData.deviceid]["index"] = i; //设备id
                        dataPos[objData.deviceid][objData.deviceid] = objData.deviceid
                        if (objData.In) {
                            dataPos[objData.deviceid][objData.In.id] = "In"
                        }
                        if (objData.T1) {
                            dataPos[objData.deviceid][objData.T1.id] = "T1"
                        }
                        if (objData.T2) {
                            dataPos[objData.deviceid][objData.T2.id] = "T2"
                        }
                        if (objData.T3) {
                            dataPos[objData.deviceid][objData.T3.id] = "T3"
                        }
                        if (objData.T4) {
                            dataPos[objData.deviceid][objData.T4.id] = "T4"
                        }
                        // leakageArr.push(objData)
                    }

                    that.setState({
                        leakageArr: listData,
                    }, () => {
                        this.setState({
                            visible: false
                        })
                    })
                } else {
                    that.setState({
                        leakageArr: [],
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

    //查看历史记录
    historySearch=(e:any)=>{
        let that = this;
        let deviceItemArr = that.state.leakageArr[e];
        let deviceid = deviceItemArr.deviceid
        this.props.navigation.navigate('History_leakage',{deviceid:deviceid})
    }
    render() {
        return (
            <View style={{flex: 1}}>
                <View style={{position: 'absolute',top: 0,width: "100%",height: "100%",backgroundColor: '#fff'}}>
                </View>
                <SafeAreaView style={{flex: 1}}>
                    {/* 引入自定义导航栏 */}
                    <Navbar 
                        pageName={'漏电检测'}
                        showBack={true}
                        showHome={false}
                        isCheck={4}
                        LoginStatus={this.state.LoginStatus}
                        props={this.props}
                        choiceGroup={this.choiceGroup}>
                    </Navbar>

                    {/* 内容区 */}
                    <View style={styleg.containerMini}>
                        <ScrollView contentContainerStyle={styles.containerMini}>
                            {/* 面板item */}
                            {this.state.leakageArr.length == 0?
                                <Text allowFontScaling={false} style={styles.empty}>没有对应传感器</Text>:
                                this.state.leakageArr.map((top_item:any,top_index:number)=>{
                                    return(
                                        <View style={styles.indexMini} key={top_index}>
                                            {/* 设备信息行 */}
                                            <View style={[styles.deviece,styles.tr]}>
                                                <Image 
                                                    source={require('../../../image/ld_1.png')} 
                                                    style={styles.devieceImg}
                                                    resizeMode='contain'>
                                                </Image>
                                                <View style={styles.devieceInfo}>
                                                    <Text allowFontScaling={false} style={styles.devieceName}>{top_item.deviceName}</Text>
                                                    <Text allowFontScaling={false} style={styles.lastTime}>更新时间:
                                                        <Text allowFontScaling={false} style={styles.lastTime}>{top_item.time ? top_item.time :'暂无数据'}</Text>
                                                    </Text>
                                                </View>
                                                <Text allowFontScaling={false} style={styles.search} onPress={()=>this.historySearch(top_index)}>
                                                    查询
                                                </Text>
                                            </View>
        
                                            {/* 漏电流和线缆温度  行 */}
                                            <View style={styles.currentCable}>
                                                {/* 漏电流 */}
                                                <View style={styles.current}>
                                                    <View style={styles.currentUp}>
                                                        <Image style={styles.img} resizeMode='contain' source={require('../../../image/ld_2.png')}></Image>
                                                        <Text allowFontScaling={false} style={styles.name}>漏电流</Text>
                                                    </View>
                                                    <View style={styles.currentDown}>
                                                        <Text allowFontScaling={false} style={styles.DownText}>{top_item.In.value}</Text>
                                                        <Text allowFontScaling={false} style={styles.DownText}>0.mA</Text>
                                                    </View>
                                                </View>
                                                {/* 线缆温度 */}
                                                <View style={styles.cable}>
                                                    <View style={styles.cableUp}>
                                                        <Image style={styles.img} resizeMode='contain' source={require('../../../image/ld_3.png')}></Image>
                                                        <Text allowFontScaling={false} style={styles.name}>线缆温度</Text>
                                                    </View>
                                                    <View style={styles.cableDown}>
                                                        <View style={styles.temperature}>
                                                            <Text allowFontScaling={false} style={[styles.name,styles.dian,{backgroundColor: '#00abd5'}]}></Text>
                                                            <Text allowFontScaling={false} style={styles.name}>&nbsp;A:</Text>
                                                            <Text allowFontScaling={false} style={styles.name}>{top_item.T1!=undefined?top_item.T1.value:''}</Text>
                                                            <Text allowFontScaling={false} style={styles.name}>℃</Text>
                                                        </View>
                                                        <View style={styles.temperature}>
                                                            <Text allowFontScaling={false} style={[styles.name,styles.dian,{backgroundColor: '#46e3d0'}]}></Text>
                                                            <Text allowFontScaling={false} style={styles.name} >&nbsp;B:</Text>
                                                            <Text allowFontScaling={false} style={styles.name}>{top_item.T2!=undefined?top_item.T2.value:''}</Text>
                                                            <Text allowFontScaling={false} style={styles.name}>℃</Text>
                                                        </View>
                                                        <View style={styles.temperature}>
                                                            <Text allowFontScaling={false} style={[styles.name,styles.dian,{backgroundColor: '#ff6893'}]}></Text>
                                                            <Text allowFontScaling={false} style={styles.name} >&nbsp;C:</Text>
                                                            <Text allowFontScaling={false} style={styles.name}>{top_item.T3!=undefined?top_item.T3.value:''}</Text>
                                                            <Text allowFontScaling={false} style={styles.name}>℃</Text>
                                                        </View>
                                                        <View style={styles.temperature}>
                                                            <Text allowFontScaling={false} style={[styles.name,styles.dian,{backgroundColor: '#ffcf05'}]}></Text>
                                                            <Text allowFontScaling={false} style={styles.name}>&nbsp;N:</Text>
                                                            <Text allowFontScaling={false} style={styles.name}>{top_item.T4!=undefined?top_item.T4.value:''}</Text>
                                                            <Text allowFontScaling={false} style={styles.name}>℃</Text>
                                                        </View>
                                                    </View>
                                                </View>
                                            </View>
                                        </View>
                                    )
                                })
                            }
                        </ScrollView>
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
    containerMini:{
        display:'flex',
        alignItems:'center',
        paddingTop: 12
    },
    indexMini :{
        position: 'relative',
        width: Dimensions.get('window').width-30,
        backgroundColor: '#fff',
        borderRadius: 5,
        opacity: 1,
        marginBottom:11,
        fontSize: Fs/22,

        shadowColor: "#000",
        shadowOffset: {
        width: 0,
        height: 4
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5
    },
    tr :{
        borderStyle: 'solid',
        borderBottomWidth: 1,
        borderBottomColor: '#f2f2f2',
        width: '95%',
    },
    
    deviece :{
        height: 65,
        position: 'relative',
    },
    devieceImg :{
        position: 'absolute',
        top: 13,
        left: 14,
        width: 40,
        height: 40,
    },
    
    devieceInfo :{
        position: 'absolute',
        top: 13,
        left: 60,
    },
    devieceName:{
        fontSize: Fs/22,
        fontWeight: '900',
        color: '#333'
    },
    lastTime:{
        fontSize: Fs/24,
    },
    search:{
        position: 'absolute',
        top: 7,
        right: 0,
        color: 'steelblue',
        fontSize: Fs/22
    },
    
    
    /* 漏电检测 */
    currentCable :{
        position: 'relative',
        width: '100%',
        height: 100,
    },
    current :{
        position: 'absolute',
        top: 5,
        left: 20,
    },
    cable:{
        position: 'absolute',
        top: 3,
        right: -10,
    },
    currentUp :{
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 5,
        textAlign: 'center',
    },
    img: {
        height: 20,
        width: 20,
        marginRight: 10,
    },
    image :{
        height: 20,
        width: 20,
        position: 'absolute',
        top: 13,
        left: 3,
    },
    name:{
        fontSize: Fs/22,
        fontWeight: '700'
    },
    currentDown:{
        marginTop: 10,
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
    },
    DownText:{
        fontSize: Fs/12,   
        fontWeight: '700',
        color: '#333'
    },
    cableUp :{
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: 5,
        textAlign: 'center',
    },
    cableDown :{
        display: 'flex',
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginTop: 10,
        width: 200,
    },
    temperature:{
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        marginLeft: 5,
        width: 88,
    },
    dian :{
        width: 8,
        backgroundColor: 'red',
        height: 8,
        borderRadius: 19,
    },
    empty:{
        textAlign: 'center',
        paddingTop: 5,
        paddingBottom: 5,
    },
},)

export default Security2