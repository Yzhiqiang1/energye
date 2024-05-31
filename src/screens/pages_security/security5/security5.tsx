import { AppState, DeviceEventEmitter, Dimensions, Image, PixelRatio, SafeAreaView, StyleSheet, Text, View } from 'react-native'
import {Shadow} from 'react-native-shadow-2'
import React, { Component } from 'react'
import Navbar from '../../../component/navbar/navbar'
import styleg from '../../../indexCss'
import { Register } from '../../../utils/app';
import store from '../../../redux/store';
import { HttpService } from '../../../utils/http';
import { Switch } from '@rneui/themed';
import DateTimePicker from '@react-native-community/datetimepicker';
import Loading from '../../../component/Loading/Loading';
import { localSocket } from '../../../redux/actions/user';
const api = require('../../../utils/api')
const Fs = Dimensions.get('window').width*PixelRatio.getFontScale()

let dataPos:any = {}; 
let eventListener:any = {}

export class Security5 extends Component<any,any> {
    constructor(props:any){
        super(props)
        this.state = {
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
            dateShow: false,

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
        this.refreshData()
    }
    //组件销毁
    componentWillUnmount(): void {
        //禁止实时数据更新
        this.setState({
            socketTask: false,
        },()=>{
            this.refreshData()
        })
        // 组件销毁禁止再次循坏创建连接
        store.dispatch(localSocket({inSocket: false}))
        // 销毁监听
        eventListener.remove()
    }
    /************************************
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
        //通知首页更新
        DeviceEventEmitter.emit('refresh')
        this.getSwitchData();
    }
    /****************************
     *   处理实时数据
     * *************************/
    refreshData=()=>{
        let that = this;
        let socket = function (res: { flag: string; deviceNo: any; sensorsDates: any; time: any; }) { //接收服务器发来的数据
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
                        let data = that.state.sensorArr
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
                                        var swt=sensorsDates[a].switcher==1  ? 1 : 0
                                        var f1=that.state.sensorArr[dataPos[deviceNo].index].sensorList[dataPos[deviceNo][sensorsDates[a].sensorsId]].field1;
                                        var f2=that.state.sensorArr[dataPos[deviceNo].index].sensorList[dataPos[deviceNo][sensorsDates[a].sensorsId]].field2;
                                        var f3=that.state.sensorArr[dataPos[deviceNo].index].sensorList[dataPos[deviceNo][sensorsDates[a].sensorsId]].field3;
                                        var f4=that.state.sensorArr[dataPos[deviceNo].index].sensorList[dataPos[deviceNo][sensorsDates[a].sensorsId]].field4;

                                        f1= f1==1 ? 1 : 0;
                                        f3= f3==1 ? 1 : 0;
                                        f2= f2 !=null && f2 !='' ? f2 : '_' ;
                                        f4= f4 !=null && f4 !='' ? f4 : '_' ;
                
                                        if(swt==f1){
                                            swt=f2;
                                        }else if(swt==f3){
                                            swt=f4;
                                        }
                                        data[dataPos[deviceNo].index].sensorList[dataPos[deviceNo][sensorsDates[a].sensorsId]].sorVal = swt
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
        store.dispatch(localSocket({localSocket: socket}))
    }
    /****************************
     *     获取传感器数据
     * *************************/
    getSwitchData=()=>{
        dataPos = {}//清空
        let that = this;
        let userId = store.getState().userReducer.userId; //用户ID
        let deviceIds = store.getState().userReducer.parameterGroup.radioSonGroup.selectKey; //获取设备ID----【单选-父含子】
        deviceIds = Object.keys(deviceIds).join(",")
        HttpService.apiPost(api.kgjc_getData, {
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

                        var swts=res.data[a].sensorList[b].switch == 1 ? 1 : 0;
                        
                        var prototypeF1 = res.data[a].sensorList[b].hasOwnProperty("field1");  
                        var isMapping =prototypeF1 ? 1 :0// 映射表示 0 无映射  ； 1 有映射
                        sensorArr[a].sensorList[b].isMapping = isMapping
                        if(prototypeF1){
                            var f1=res.data[a].sensorList[b].field1 == 1 ? 1 : 0  
                            var f2=res.data[a].sensorList[b].field2 != null && res.data[a].sensorList[b].field2 != '' ? res.data[a].sensorList[b].field2 : '_';
                            var f4=res.data[a].sensorList[b].field4 != null && res.data[a].sensorList[b].field4 != '' ? res.data[a].sensorList[b].field4 : '_'; 
                            var sorVal='';
                            if(swts==f1){//与f1匹配
                                sorVal=f2
                            }else{
                                sorVal=f4
                            }
                            sensorArr[a].sensorList[b].sorVal = sorVal
                        }
                    }
                }
                that.setState({
                    sensorArr: sensorArr,
                })
            }
        })
    }

    //查看历史记录
    historySearch=(e:any)=>{
        let that = this;
        let deviceItemArr = that.state.sensorArr[e]
        let sids:any = [];
        deviceItemArr.sensorList.forEach((item:any) => {
            sids.push({
                id: item.sensorid,
                name: item.sensorname
            })
        });
        this.props.navigation.navigate('history_switchMonitor',{sids: sids})
    }

    onChange=(e: any)=>{
      this.setState({
        dateShow: false
      })
    }

    render() {
        return (
            <SafeAreaView style={{flex: 1}}>
                {/* 引入自定义导航栏 */}
                <Navbar 
                    pageName={'开关监测'}
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
                                        <Image source={require('../../../image/switch1.png')} style={styles.devieceImg}></Image>
                                        <View style={styles.devieceInfo}>
                                            <Text style={styles.devieceName} onPress={()=>this.setState({dateShow: !this.state.dateShow})}>{top_item.deviceName}</Text>
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
                                                {item.isMapping == 1?
                                                    <Text style={styles.sensorVal}>{item.sorVal}</Text>:
                                                    <Switch
                                                    value={item.switch == 1}
                                                    style={styles.btn}
                                                    color={'#1989fa'}/>
                                                }
                                            </View>
                                        )
                                    })}
                                    {this.state.dateShow?
                                        <DateTimePicker 
                                        display="calendar" 
                                        value={new Date()} 
                                        mode={'date'} 
                                        minimumDate={new Date(1950, 0, 1)}
                                        onChange={(Date)=>this.onChange(Date)}
                                        />
                                        :''
                                    }
                                </Shadow>
                            )
                        })}
                    </View>
                </View>
                {/* 弹窗组件 */}
                <Loading 
                    type={this.state.msgType} 
                    visible={this.state.visible} 
                    LoadingMsg={this.state.LoadingMsg}>
                </Loading>
            </SafeAreaView>
        )
    }
}

const styles = StyleSheet.create({
    pickerStyle: {
        width: 380,
        backgroundColor: 'white',
        borderRadius: 10,
    },
    containerMini:{
        display:'flex',
        alignItems:'center',
        marginTop:12,
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
        fontSize: Fs/18,
        height: 268,

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
        fontSize: Fs/18,
        fontWeight: '900',
        color: '#333'
    },
    lastTime:{
        fontSize: Fs/20,
    },
    search:{
        position: 'absolute',
        top: 7,
        right: 0,
        color: 'steelblue',
        fontSize: Fs/18
    },
    sensor:{
        height: 50,
        position: 'relative',
    },
    sensorName:{
        position: 'absolute',
        top: 13,
        left: 18,
        fontSize: Fs/20,
        color: '#333'
    },
    sensorVal:{
        position: 'absolute',
        right: 34,
        top: 15,
    },
    btn:{
        position: 'absolute',
        top: 5,
        right: 18,
        width: 40,
        height: 40,
    },
    popupCont:{
        // margin: 30rpx auto 10rpx,
        textAlign: 'center',
    },
    popupTitle:{
        marginBottom: 20,
        paddingBottom: 15,
        // border-bottom: 9rpx solid #e5e5e5,
    },
    empty:{
        textAlign: 'center',
        paddingBottom: 5,
        paddingTop: 5,
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
        fontSize: Fs/18,
        fontWeight: '600',
        textAlign: 'center',
    },
    cancel:{
        color: '#333',
    },
    confirm:{
        color: '#576b95'
    },
    SwitchText:{
        width: '100%',
        textAlign: 'center',
        height: 80,
        lineHeight: 80,
        fontSize: Fs/18,
        color: '#333',
        fontWeight: '700',
        borderBottomWidth: 1,
        borderBottomColor: '#f2f2f2',
        borderStyle: 'solid'
    },
})

export default Security5