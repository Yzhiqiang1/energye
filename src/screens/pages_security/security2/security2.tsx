import { AppState, DeviceEventEmitter, Dimensions, Image, StyleSheet, Text, View } from 'react-native'
import {Shadow} from 'react-native-shadow-2'
import React, { Component } from 'react'
import Navbar from '../../../component/navbar/navbar'
import { Register } from '../../../utils/app'
import store from '../../../redux/store'
import { HttpService } from '../../../utils/http'
import styleg from '../../../indexCss'
import { Switch } from '@rneui/themed';
import { Dialog } from '@rneui/themed';
import Loading from '../../../component/Loading/Loading'
import { localSocket } from '../../../redux/actions/user'
const api = require('../../../utils/api')

let dataPos:any = {}; //dataPOS:{a:{},b:{}}
let eventListener:any = {}

export class Security1 extends Component<any,any> {
    constructor(props:any){
        super(props)
        this.state={
            LoginStatus: 1, //登录状态 默认未登录
            checked: true,
            show: false, //开关按钮弹窗
    
            /**
             * 传感器数据
             */
            sensorArr: [], //传感器数据
            //是否启用实时数据
            socketTask: true, //默认不启用
            socketData: [], //实时数据是否返回

            visibleM:false, //对话框
            switchData: {
                top_index: '',
                index: '',
                switchs: '',
                devieceNo: '',
                sensorid: ''
            }, //操作开关数据

            msgType: 1,
            visible: false,
            LoadingMsg: ''
        }
    }
    componentDidMount(): void {
        Register.userSignIn(true).then(res => {
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
        // 监听软件进入后台或息屏
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
        this.refreshData()
    }
    // 组件销毁时
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
    /********************************
     *     校验登录通过
     * *****************************/
    check_ok=()=>{
        let that = this;
        let parameterGrou = store.getState().userReducer.parameterGroup; //获取选中组和设备信息
        if (parameterGrou.radioSonGroup.selectKey) {
            //获取传感器数据-数据
            that.getSwitchData();
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
    handleSelect=(e:any)=>{
        dataPos = {}
        //通知首页更新
        DeviceEventEmitter.emit('refresh')
        this.getSwitchData();
    }

    /****************************
     *   处理实时数据
     * *************************/
    refreshData=()=>{
        let that = this;
        let socket = function (res: { flag: string; deviceNo: any; sensorsDates: any; time: any }) { //接收服务器发来的数据
            if (that.state.socketTask == true) { //页面卸载后禁止更新 
                if (res.flag == "00") {
                    let deviceNo = res.deviceNo; //websocket设备序列号
                    if (dataPos[deviceNo] != undefined) {
                        let sensorsDates = res.sensorsDates; //websocket传感器数据集合[]
                        let times = res.time; //websocket更新时间
                        //上次更新时间
                        let _sensorTime = that.state.sensorArr[dataPos[deviceNo].index].updateTime; //获取传感器上次更新时间
                        let LastTime = _sensorTime ? _sensorTime.replace(/-|:|\ +/g, "") : 0; //传感器上次更新时间
                        let thisTime = times ? times.replace(/-|:|\ +/g, "") : ''; //传感器当前更新时间

                        if (thisTime) {
                            if (Number(thisTime) <= Number(LastTime)) {
                                return
                            }
                        }
                        let data: any = that.state.sensorArr
                        data[dataPos[deviceNo].index].updateTime = times
                        that.setState({
                            sensorArr: data
                        })
                        //过滤数据
                        for (var a = 0; a < sensorsDates.length; a++) {
                            if (sensorsDates[a].sensorsTypeId == 2) { //筛选开关类型
                                if (dataPos[deviceNo][sensorsDates[a].sensorsId] != undefined) {
                                    //过滤心跳包 
                                    if (sensorsDates[a].switcher != '') {
                                        data[dataPos[deviceNo].index].sensorList[dataPos[deviceNo][sensorsDates[a].sensorsId]].loading = false
                                        data[dataPos[deviceNo].index].sensorList[dataPos[deviceNo][sensorsDates[a].sensorsId]].switch = sensorsDates[a].switcher
                                        that.setState({
                                            sensorArr: data
                                        })
                                    }
                                }
                            }
                        }
                    }
                    // 更新设备数据上传时间
                }
            }
        }
        store.dispatch(localSocket({localSocket:socket}))
    }
    /****************************
     *     获取传感器数据
     * *************************/
    getSwitchData=()=>{
        let that = this;
        let userId = store.getState().userReducer.userId; //用户ID
        let deviceIds = store.getState().userReducer.parameterGroup.radioSonGroup.selectKey; //获取设备ID----【单选-父含子】
        deviceIds = Object.keys(deviceIds).join(",")
        HttpService.apiPost(api.kgkz_getData, {
            userId: userId,
            deviceIds: deviceIds,
        }).then((res:any) => {
            if (res.flag == "00") {
                let sensorArr = res.data;
                for (let a = 0; a < res.data.length; a++) {
                    if (dataPos[res.data[a].devieceNo] == undefined) {
                        dataPos[res.data[a].devieceNo] = {};
                    }
                    dataPos[res.data[a].devieceNo]["index"] = a; //设备位置
                    for (let b = 0; b < res.data[a].sensorList.length; b++) {
                        if (dataPos[res.data[a].devieceNo][res.data[a].sensorList[b].sensorid] == undefined) {
                            dataPos[res.data[a].devieceNo][res.data[a].sensorList[b].sensorid] = {};
                        }
                        dataPos[res.data[a].devieceNo][res.data[a].sensorList[b].sensorid] = b; //传感器位置
                        sensorArr[a].sensorList[b].loading = false; //给每一个传感器添加一个loading属性
                    }
                }
                that.setState({
                    sensorArr: sensorArr,
                })
            }
        })
    }

    //传感器开关按钮
    showPopup=(top_index:any,index:number,switchs:any,devieceNo:any,sensorid:any)=>{
        let data =  {
            top_index: top_index,
            index: index,
            switchs: switchs,
            devieceNo: devieceNo,
            sensorid: sensorid
        }
        this.setState({
            switchData: data
        },()=>{
            setTimeout(()=>{
                this.setState({
                    visibleM: true,
                })
            },1000)
        })
    }
    // 取消操作
    cancel=()=>{
        this.setState({
            visibleM: false
        })
    }
    // 确定操作
    confirm=()=>{
        let data = this.state.switchData
        let userId = store.getState().userReducer.userId; //用户ID
        let devieceNo = data.devieceNo
        let sensorId = data.sensorid
        let switchs = data.switchs
        let top_index = data.top_index
        let index = data.index
        this.setState({
            msgType: 1,
            visible: true,
            LoadingMsg: '加载中...'
        })
        HttpService.apiPost(api.kgkz_sendData, {
            userId: userId,
            deviceNo: devieceNo,
            sensorId: sensorId,
            value: switchs,
        }).then((data:any) => {
            this.setState({
                visible: false,
            })
            if (data.flag == '00') {
                this.setState({
                    msgType: 2,
                    visible: true,
                    LoadingMsg: '操作下发成功,请等待设备回传!'
                },()=>{
                    setTimeout(()=>{
                        this.setState({
                            visible: false,
                        })
                    },2000)
                })
                this.setState({
                    ['sensorArr[' + top_index + '].sensorList[' + index + '].loading']: true,
                })
            } else {
                this.setState({
                    msgType: 2,
                    visible: true,
                    LoadingMsg: data.msg,
                },()=>{
                    setTimeout(()=>{
                        this.setState({
                            visible: false,
                        })
                    },2000)
                })
            }
        })
        this.setState({
            visibleM: false
        })
    }
    //查看历史记录
    historySearch=(e:any)=>{
        let that = this;
        let deviceItemArr = that.state.sensorArr[e];
        let sids:any = [];
        deviceItemArr.sensorList.forEach((item:any) => {
            sids.push({
                id: item.sensorid,
                name: item.sensorname
            })
        });
        this.props.navigation.navigate('History',{sids:sids})
    }
    render() {
        return (
            <View>
                {/* 引入自定义导航栏 */}
                <Navbar 
                    pageName={'开关控制'}
                    showBack={true}
                    showHome={false}
                    isCheck={5}
                    LoginStatus={this.state.LoginStatus}
                    props={this.props}
                    handleSelect={this.handleSelect}>
                </Navbar>

                {/* 内容区 */}
                <View style={styleg.containerMini}>
                    <View style={styles.containerMini}>
                        {this.state.sensorArr.length==0?
                            <Text style={styles.empty}>没有对应传感器</Text>:''
                        }
                        {/* 面板item */}
                        {this.state.sensorArr.map((top_item:any,top_index:number)=>{
                            return(
                                <Shadow distance={4} style={styles.indexMini} key={top_index}>
                                    {/* 设备信息行 */}
                                    <View style={[styles.deviece,styles.tr]}>
                                        <Image source={require('../../../image/switch1.png')} resizeMode='contain' style={styles.devieceImg}></Image>
                                        <View style={styles.devieceInfo}>
                                            <Text style={styles.devieceName}>{top_item.deviceName}</Text>
                                            <Text>更新时间: 
                                                <Text style={styles.lastTime}>{top_item.updateTime ? top_item.updateTime :'暂无数据'}</Text>
                                            </Text>
                                        </View>
                                        <Text 
                                            style={styles.search}
                                            onPress={()=>this.historySearch(top_index)}
                                        >
                                        查询
                                        </Text>
                                    </View>
                                    {/* 传感器信息行 */}
                                    {top_item.sensorList.length==0?
                                        <Text>暂无数据</Text>:''
                                    }
                                    {top_item.sensorList.map((item:any,index:number)=>{
                                        return(
                                            <View style={[styles.sensor,styles.tr]} key={index}>
                                                <Text style={styles.sensorName}>{item.sensorname}</Text>
                                                {/* 开关 */}
                                                <Switch
                                                value={item.switch == 1}
                                                onValueChange={() => this.showPopup(top_index,index,item.switch==1 ?  0 : 1,top_item.devieceNo,item.sensorid)}
                                                style={styles.btn}
                                                color={'#1989fa'}/>
                                            </View>
                                        )
                                    })}
                                </Shadow>
                            )
                        })}
                         {/* 对话框 */}
                         <Dialog
                            isVisible={this.state.visibleM}
                            overlayStyle={styles.overlay}
                            backdropStyle={{height:'120%'}}
                            >
                            <Text style={styles.SwitchText}>确定操作设备开关吗？</Text>
                            <Dialog.Actions>
                                <View style={styles.actions}>
                                    <Text style={[styles.Dialog,styles.cancel]} onPress={this.cancel}>取消</Text>
                                    <Text style={[styles.Dialog,styles.confirm]} onPress={this.confirm}>确定</Text>
                                </View>
                            </Dialog.Actions>
                        </Dialog>
                    </View>
                </View>
                {/* 弹窗效果组件 */}
                <Loading 
                    type={this.state.msgType} 
                    visible={this.state.visible} 
                    LoadingMsg={this.state.LoadingMsg}>
                </Loading>
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
        borderRadius: 7,
        display:'flex',
        alignItems:'center',
        opacity: 1,
        marginBottom:11,
        fontSize: 18,
    },
    
    tr :{
        borderStyle: 'solid',
        borderBottomWidth: 1,
        borderBottomColor: '#f2f2f2',
        width: '95%'
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
        fontSize: 18,
        fontWeight: '900',
        color: '#333'
    },
    lastTime:{
        fontSize: 16,
    },
    search:{
        position: 'absolute',
        top: 7,
        right: 0,
        color: 'steelblue',
        fontSize:18
    },
    sensor:{
        height: 50,
        position: 'relative',
    },
    sensorName:{
        position: 'absolute',
        top: 13,
        left: 18,
        fontSize: 16,
        color: '#333'
    },
    btn:{
        position: 'absolute',
        top: 5,
        right: 18,
        width: 40,
        height: 40,
    },
    popupCont:{
        marginTop: 15,
        marginBottom: 5,
        textAlign: 'center',
    },
    popupTitle:{
        marginBottom: 20,
        paddingBottom: 15,
        borderBottomWidth: 4,
        borderBottomColor: '#e5e5e5',
        borderStyle: 'solid',

    },
    empty:{
        textAlign: 'center',
        paddingTop: 10,
        paddingBottom: 10,
    },
    SwitchText:{
        width: '100%',
        textAlign: 'center',
        height: 80,
        lineHeight: 80,
        fontSize: 18,
        color: '#333',
        fontWeight: '700',
        borderBottomWidth: 1,
        borderBottomColor: '#f2f2f2',
        borderStyle: 'solid'
    },
    overlay:{
        borderRadius: 20
    },
    actions:{
        width: '100%',
        display:'flex',
        flexDirection: 'row',
        justifyContent: 'space-around'
    },
    Dialog:{
        width: '50%',
        height: '100%',
        fontSize: 18,
        fontWeight: '600',
        textAlign: 'center',
    },
    cancel:{
        color: '#333',
    },
    confirm:{
        color: '#576b95'
    },
})

export default Security1