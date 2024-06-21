import { Dimensions, Image, Pressable, SafeAreaView, StyleSheet, Text, View } from 'react-native'
import React, { Component } from 'react'
import Navbar from '../../../component/navbar/navbar'
import styleg from '../../../indexCss'
import util from '../../../utils/util'
import { Register } from '../../../utils/app'
import store from '../../../redux/store'
import { HttpService } from '../../../utils/http'
import Loading from '../../../component/Loading/Loading'
import Picker from '../../../component/Picker/Picker'
import PickerBut from '../../../component/PickerBut/PickerBut'
const api = require('../../../utils/api')
const Fs = Dimensions.get('window').width*0.8

let arrWeekTime = String(util.nowDate(1)).split('-');
let getWeek = util.getWeek(arrWeekTime[0], arrWeekTime[1])

export class WaterAnalysis3 extends Component<any,any> {
    constructor(props:any){
        super(props)
        this.state={
            LoginStatus: 1, //登录状态 默认未登录

            //日周月切换
            dataSwitchIn: 0,
            //日报处理
            _day: util.nowDate(),
    
            //周报处理 
            _week: util.nowDate(1),
            _weekTime: getWeek.value,
            _weekTimeDate: getWeek.data,
            _weekTimeIn: 0,
            _weekSeveral: ['第一周','第二周','第三周','第四周'],
            //月报处理
            _month: util.nowDate(1),
            //数据项
            optionData: [],
            titleData:[],

            msgType: 1,
            visible: false,
            LoadingMsg: ''
        }
    }
    componentDidMount(): void {
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

        if (parameterGrou.multiGroup.selectKey) {
            //查询数据
            that.getData();
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
        //查询数据
        this.getData();
    }
    //日月年 选项卡切换
    clickDataSwitch=(e:any)=>{
        let that = this;
        let index = Number(e);
        let dataSwitchIn = that.state.dataSwitchIn;
        if (dataSwitchIn != index) {
            that.setState({
                dataSwitchIn: index
            })
        }
    }
    /********
     * 日报处理
     * *********/
    _dayClick=(e:any)=>{
        this.setState({
            _day: e
        })
    }
    /********
     * 周报处理
     * *********/
    _weekClick=(e:any)=>{
        let _week = this.state._week;
        if (_week != e) {
            let new_arrWeekTime = e.split('-');
            let new_getWeek = util.getWeek(new_arrWeekTime[0], new_arrWeekTime[1])
            this.setState({
                _week: e,
                _weekTime: new_getWeek.value,
                _weekTimeDate: new_getWeek.data,
                _weekTimeIn: 0,
            })
        }
    }
    _weekTimeClick=(e:any)=>{
        this.setState({
            _weekTimeIn: e
        })
    }
    /********
     * 月报处理
     * *********/
    _monthClick=(e:any)=>{
        this.setState({
            _month: e,
        })

    }
    //搜索
    clickSearch=()=>{
        //查询数据
        this.getData();
    }
    //获取数据
    getData=()=>{
        let that = this;
        let LoginStatus = that.state.LoginStatus; //登录状态
        if (LoginStatus == 1) {
            //错误提示信息
            this.setState({
                msgType: 2,
                visible: true,
                LoadingMsg: '您还未登录,无法查询数据！'
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
        //用户ID
        let userId = store.getState().userReducer.userId;
        //查询设备ID
        let ObjdeviceId = store.getState().userReducer.parameterGroup.multiGroup.selectKey;
        let strdeviceId = "";
        for (let i in ObjdeviceId) {
            strdeviceId += strdeviceId == "" ? ObjdeviceId[i] : ',' + ObjdeviceId[i];
        }
        //查询类型 日 周 月
        let dataSwitchIn = that.state.dataSwitchIn;
        //处理日报 月报 年报 接口切换
        let url = dataSwitchIn == 0 ? api.hb_water_getDayData : dataSwitchIn == 1 ? api.hb_water_getWeekData : api.hb_water_getMonthData;
        //接口参数
        let parameter = {
            userId: userId,
            deviceIds: strdeviceId,
            date: '',
        }
        let dataName:any = [];
        if (dataSwitchIn == 0) {
            parameter.date = that.state._day;
            dataName = ['回路名称','当日用电(kc·h)', '上日用电  (kc·h)', '增加值','环比(%)'];
        } else if (dataSwitchIn == 1) {
            parameter.date = that.state._weekTimeDate[that.state._weekTimeIn][1];
            dataName = ['回路名称','当月' + that.state._weekTimeDate[that.state._weekTimeIn][0]+'(kc·h)', '上月' + that.state._weekTimeDate[that.state._weekTimeIn][0]+'(kc·h)', '增加值','环比(%)'];
        } else if (dataSwitchIn == 2) {
            parameter.date = that.state._month;
            dataName = ['回路名称','当月用电(kc·h)', '上月用电(kc·h)', '增加值','环比(%)'];
        }
        that.setState({
            titleData:dataName
        })
        //定义图表数据
        let queryData = []
        //查询数据
        HttpService.apiPost(url, parameter).then((res:any) => {
            if (res.flag == "00") {
                let listData = res.data;
                // console.log(listData, 'listData-----res.data');
                //校验数据是否为空
                if (listData.length > 0) {
                    for (let i = 0; i < listData.length; i++) {
                        //传感器数据
                        let objData = listData[i];
                        
                        //本（日，周，年）值
                        let vala = objData.this_day ? objData.this_day : objData.this_week ? objData.this_week : objData.this_month;
                        //上一（日，周，年）值
                        let valb = objData.last_day ? objData.last_day : objData.last_week ? objData.last_week : objData.last_month;
                        //环比
                        let valc = objData.rel_day ? objData.rel_day : objData.rel_week ? objData.rel_week : objData.rel_month;
                        //增加值
                        let vald = objData.add_day ? objData.add_day : objData.add_week ? objData.add_week : objData.add_month;

                        queryData.push({
                            name: objData.deviceName,
                            vala:vala,
                            valb:valb,
                            valc:valc,
                            vald:vald,
                        })
                    }
                    that.setState({
                        optionData: queryData,
                    }, () => {
                        //关闭加载效果
                        this.setState({
                            visible: false
                        })
                    })
                } else {
                    that.setState({
                        optionData: [],
                    }, () => {
                        //关闭加载效果
                        this.setState({
                            visible: false
                        })
                    })
                }
            } else {
                //关闭加载效果
                this.setState({
                    visible: false
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
                visible: false
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
                {/* 弹窗效果组件 */}
                <Loading 
                    type={this.state.msgType} 
                    visible={this.state.visible} 
                    LoadingMsg={this.state.LoadingMsg}>
                </Loading>
                <SafeAreaView style={{flex: 1}}>
                    {/* 引入自定义导航栏 */}
                    <Navbar 
                        pageName={'环比分析'}
                        showBack={true}
                        showHome={false}
                        isCheck={3}
                        LoginStatus={this.state.LoginStatus}
                        props={this.props}
                        handleSelect={this.handleSelect}>
                    </Navbar>
                    {/* 内容区 */}
                    <View style={styleg.container}>
                        {/* 查询框 */}
                        <View style={styles.query_head}>
                            <View style={styles.tab}>
                                <Text allowFontScaling={false} style={[styles.tabFlex,this.state.dataSwitchIn == 0 ? styles.flexIs : null]} onPress={()=>this.clickDataSwitch(0)}>日</Text>
                                <Text allowFontScaling={false} style={[styles.tabFlex,this.state.dataSwitchIn == 1 ? styles.flexIs : null]} onPress={()=>this.clickDataSwitch(1)}>周</Text>
                                <Text allowFontScaling={false} style={[styles.tabFlex,this.state.dataSwitchIn == 2 ? styles.flexIs : null]} onPress={()=>this.clickDataSwitch(2)}>月</Text>
                            </View>
                            {/* 日报处理 */}
                            {this.state.dataSwitchIn == 0?
                                <View style={styles.flex}>
                                    {/* <Picker
                                        pickerType={1}
                                        date={this.state._day}
                                        precisionType={1}
                                        click={this._dayClick}
                                    ></Picker> */}
                                    <Pressable style={styleg.button} onPress={()=>this.setState({open: true,typePk: 1})}>
                                        <Text allowFontScaling={false} style={styleg.TextButton}>{this.state._day}</Text>
                                        <Image style={styleg.ico} source={require('../../../image/down.png')}></Image>
                                    </Pressable>
                                </View>:''
                            }
                            {/* 周报处理 */}
                            {this.state.dataSwitchIn == 1?
                                <View style={[styles.flex,,styles.week]}>
                                    {/* <Picker
                                        pickerType={1}
                                        date={this.state._week}
                                        precisionType={2}
                                        click={this._weekClick}
                                    ></Picker> */}
                                    <Pressable style={styleg.button} onPress={()=>this.setState({open: true,typePk: 2})}>
                                        <Text allowFontScaling={false} style={styleg.TextButton}>{this.state._week}</Text>
                                        <Image style={styleg.ico} source={require('../../../image/down.png')}></Image>
                                    </Pressable>
                                    {/* 多列选择器 */}
                                    {/* <Picker
                                        pickerType={3}
                                        monthTime={this.state._weekTime}
                                        monthTimeIn={this.state._weekTimeIn}
                                        precisionType={2}
                                        click={this._weekTimeClick}
                                    ></Picker> */}
                                    <Pressable style={styleg.button} onPress={()=>this.setState({open: true,typePk: 3})}>
                                        <Text allowFontScaling={false} style={styleg.TextButton}>{this.state._weekSeveral[this.state._weekTimeIn]}</Text>
                                        <Image style={styleg.ico} source={require('../../../image/down.png')}></Image>
                                    </Pressable>
                                </View>
                                :''
                            }
                            {/* // 月报处理 */}
                            {this.state.dataSwitchIn == 2?
                                <View style={styles.flex}>
                                    {/* <Picker
                                        pickerType={1}
                                        date={this.state._month}
                                        precisionType={2}
                                        click={this._monthClick}
                                    ></Picker> */}
                                    <Pressable style={styleg.button} onPress={()=>this.setState({open: true,typePk: 4})}>
                                        <Text allowFontScaling={false} style={styleg.TextButton}>{this.state._month}</Text>
                                        <Image style={styleg.ico} source={require('../../../image/down.png')}></Image>
                                    </Pressable>
                                </View>:''
                            }
                            <Text allowFontScaling={false} style={styles.button} onPress={this.clickSearch}>查询</Text>
                        </View>

                        <View style={styles.echarts_con}>
                            {this.state.optionData.length == 0?
                                <Text allowFontScaling={false} style={styles.empty}>暂无数据</Text>:
                                <View style={styles.item}>
                                    <Text allowFontScaling={false} style={styles.name}>
                                        环比分析数据
                                        <View style={styles.down}>
                                            <Image style={styles.img} src='../../image/download.png'></Image>
                                        </View>
                                    </Text>
                                    <View style={styles.table}>
                                        <View style={styles.row}>
                                            <Text allowFontScaling={false} style={styles.th}>{this.state.titleData[0]}</Text>
                                            <Text allowFontScaling={false} style={styles.th}>{this.state.titleData[1]}</Text>
                                            <Text allowFontScaling={false} style={styles.th}>{this.state.titleData[2]}</Text>
                                            <Text allowFontScaling={false} style={styles.th}>{this.state.titleData[3]}</Text>
                                            <Text allowFontScaling={false} style={styles.th}>{this.state.titleData[4]}</Text>
                                        </View>
                                        {this.state.optionData.map((item:any,index:number)=>{
                                            <View key={index} style={[styles.row,index%2 == 0? styles.b1 : null]}>
                                                <Text allowFontScaling={false} style={[styles.td,styles.c1]}>{item.name}</Text>
                                                <Text allowFontScaling={false} style={styles.td}>{item.vala}</Text>
                                                <Text allowFontScaling={false} style={styles.td}>{item.valb}</Text>
                                                <Text allowFontScaling={false} style={styles.td}>{item.vald}</Text>
                                                <Text allowFontScaling={false} style={styles.td}>{item.valc}</Text>
                                            </View>
                                        })}
                                    </View>
                                </View>
                            }
                        </View>
                    </View>
                    {/* 日期选择器 */}
                    {this.state.open?
                        this.state.typePk==1?
                            <PickerBut
                                pickerType={1}
                                date={this.state._day}
                                precisionType={1}
                                click={this._dayClick}
                                cancel={()=>this.setState({open: false})}
                            ></PickerBut>:
                        this.state.typePk==2? 
                            <PickerBut
                                pickerType={1}
                                date={this.state._week}
                                precisionType={2}
                                click={this._weekClick}
                                cancel={()=>this.setState({open: false})}
                            ></PickerBut>:
                        this.state.typePk==3? 
                            <PickerBut
                                pickerType={3}
                                monthTime={this.state._weekTime}
                                monthTimeIn={this.state._weekTimeIn}
                                precisionType={2}
                                click={this._weekTimeClick}
                                cancel={()=>this.setState({open: false})}
                            ></PickerBut>:
                        this.state.typePk==4? 
                            <PickerBut
                                pickerType={1}
                                date={this.state._month}
                                precisionType={2}
                                click={this._monthClick}
                                cancel={()=>this.setState({open: false})}
                            ></PickerBut>:""
                    :''
                    }
                </SafeAreaView>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    tab:{
        position: 'relative',
        width: 120,
        height:30,
        paddingLeft:10,
        paddingRight:10,
        marginRight: 5,
        display: 'flex',
        flexDirection:'row',
        alignItems: 'center',
        overflow: 'hidden',
        borderStyle:'solid',
        borderColor:'#d9d9d9',
        borderWidth:1,
        borderRadius: 5,
    },
    tabFlex:{
        position: 'relative',
        width: 0,
        flex: 1,
        height: 30,
        lineHeight: 30,
        textAlignVertical: 'center',
        textAlign: 'center',
        fontSize: Fs/22,
        color: '#333',
    },
    ico:{
        position: 'absolute',
        top: 7,
        right: 5,
        width: 15,
        height: 15,
        overflow: 'hidden',
    },
    flexIs:{
        color: '#1890FF',
        borderStyle:'solid',
        borderBottomColor:'#1890FF',
        borderBottomWidth:2
    },
    query_head:{
        position: 'relative',
        width: '100%',
        height: 50,
        paddingRight:10,
        paddingLeft:10,
        display: 'flex',
        flexDirection:'row',
        alignItems: 'center',
        backgroundColor: '#fff',
        overflow: 'hidden',
    },
    timing:{
        flex:1,
        display:'flex',
        flexDirection:'row',
    },
    flex:{
        flex: 1,
    },
    button:{
        position: 'relative',
        width: 'auto',
        height: 30,
        lineHeight: 30,
        textAlignVertical: 'center',
        paddingLeft: 12,
        paddingRight: 12,
        fontSize: Fs/22,
        color: '#666666',
        borderStyle:'solid',
        borderWidth: 1,
        borderColor: '#d9d9d9',
        borderRadius: 5,
        marginLeft: 7,
        overflow: 'hidden',
    },
    down:{
        position: 'absolute',
        top: 0,
        right: 0,
        width: 40,
        height: 40,
        zIndex: 99,
        textAlign: 'center',
        overflow: 'hidden',
    },
    echarts_con:{
        position: 'absolute',
        top: 50,
        width: '100%',
        bottom: 0,
    },
    item:{
        position: 'relative',
        width: '100%',
        backgroundColor: '#fff',
        marginTop: 10,
        
    },
    name:{
        position: 'relative',
        width: '100%',
        height: 40,
        lineHeight: 40,
        fontSize: Fs/22,
        textAlign: 'center',
        borderColor: '#E5E5E5',
        borderBottomWidth: 1,
        borderStyle: 'solid',
        overflow: 'hidden',
    },
    echarts:{
        position: 'relative',
        width: '100%',
        padding: 10,
    },
    empty:{
        position: 'relative',
        width: '100%',
        paddingTop: 25,
        paddingBottom: 25,
        textAlign: 'center',
        fontSize: Fs/22,
        color: '#999999',
        overflow: 'hidden',
    },
    img:{
        width: 15,
        height: 15,
        verticalAlign: 'middle',
    },
    table:{
        position: 'relative',
        width: '100%',
        paddingTop: 10,
        paddingBottom: 10,
        paddingRight: 5,
        paddingLeft: 5,
        overflow: 'hidden',
    },
    row:{
        display:'flex',
        flexDirection:'row'
    },
    th:{
        flex:1,
        paddingBottom:7,
        paddingTop:7,
        paddingRight:3,
        paddingLeft:3,
        overflow: 'hidden',
        fontSize: Fs/22,
        color: '#666666',
        textAlign:'center'

    },
    td:{
        flex:1,
        paddingBottom:7,
        paddingTop:7,
        paddingRight:3,
        paddingLeft:3,
        overflow: 'hidden',
        fontSize: Fs/24,
        color: '#666666',
        textAlign:'center'
    },
    c1:{
        color: '#1890FF',
    },
    b1:{
        backgroundColor: "#F3FAFF",
    },
    w22:{
        flex:2,
        width: '22%'
    },
    w24:{
        flex:2,
        width: '24%'
    },
    week:{
        display:'flex',
        flexDirection: 'row'
    },
})

export default WaterAnalysis3