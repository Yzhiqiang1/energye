import { Image, StyleSheet, Text, View } from 'react-native'
import React, { Component } from 'react'
import Navbar from '../../../component/navbar/navbar'
import styleg from '../../../indexCss'
import util from '../../../utils/util'
import { Register } from '../../../utils/app'
import store from '../../../redux/store'
import { HttpService } from '../../../utils/http'
import Loading from '../../../component/Loading/Loading'
import Picker from '../../../component/Picker/Picker'
const api = require('../../../utils/api')

let arrWeekTime = String(util.nowDate(1)).split('-');
let getWeek = util.getWeek(arrWeekTime[0], arrWeekTime[1])

export class GasAnalysis3 extends Component<any,any> {
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
            //月报处理
            _month: util.nowDate(1),
            //数据项
            optionData: [],
            titleData:[],

            // 弹出窗口
            msgType: 1,
            visible: false,//加载效果控制
            LoadingMsg:''// 加载效果文字
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
            _month: e
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
        })
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
        let url = dataSwitchIn == 0 ? api.hb_gases_getDayData : dataSwitchIn == 1 ? api.hb_gases_getWeekData : api.hb_gases_getMonthData;
        //接口参数
        let parameter = {
            userId: userId,
            deviceIds: strdeviceId,
            date: '',
        }
        let dataName:any = [];
        if (dataSwitchIn == 0) {
            parameter.date = that.state._day;
            dataName = ['回路名称','当日用电(gc·h)', '上日用电  (gc·h)', '增加值','环比(%)'];
        } else if (dataSwitchIn == 1) {
            parameter.date = that.state._weekTimeDate[that.state._weekTimeIn][1];
            dataName = ['回路名称','当月' + that.state._weekTimeDate[that.state._weekTimeIn][0]+'(gc·h)', '上月' + that.state._weekTimeDate[that.state._weekTimeIn][0]+'(gc·h)', '增加值','环比(%)'];
        } else if (dataSwitchIn == 2) {
            parameter.date = that.state._month;
            dataName = ['回路名称','当月用电(gc·h)', '上月用电(gc·h)', '增加值','环比(%)'];
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
                            visible: false,
                        })
                    })
                } else {
                    that.setState({
                        optionData: [],
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
            <View>
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
                            <Text style={[styles.tabFlex,this.state.dataSwitchIn == 0 ? styles.flexIs : null]} onPress={()=>this.clickDataSwitch(0)}>日</Text>
                            <Text style={[styles.tabFlex,this.state.dataSwitchIn == 1 ? styles.flexIs : null]} onPress={()=>this.clickDataSwitch(1)}>周</Text>
                            <Text style={[styles.tabFlex,this.state.dataSwitchIn == 2 ? styles.flexIs : null]} onPress={()=>this.clickDataSwitch(2)}>月</Text>
                        </View>
                        {/* 日报处理 */}
                        {this.state.dataSwitchIn == 0?
                            <View style={styles.flex}>
                                <Picker
                                    pickerType={1}
                                    date={this.state._day}
                                    precisionType={1}
                                    click={this._dayClick}
                                ></Picker>
                            </View>:''
                        }
                        {/* 周报处理 */}
                        {this.state.dataSwitchIn == 1?
                            <View style={[styles.flex,styles.week]}>
                                <Picker
                                    pickerType={1}
                                    date={this.state._week}
                                    precisionType={2}
                                    click={this._weekClick}
                                ></Picker>
                                {/* 多列选择器 */}
                                <Picker
                                    pickerType={3}
                                    monthTime={this.state._weekTime}
                                    monthTimeIn={this.state._weekTimeIn}
                                    precisionType={2}
                                    click={this._weekTimeClick}
                                ></Picker>
                            </View>:''
                        }
                        {/* 月报处理 */}
                            {this.state.dataSwitchIn == 2?
                                <View style={styles.flex}>
                                    <Picker
                                        pickerType={1}
                                        date={this.state._month}
                                        precisionType={2}
                                        click={this._monthClick}
                                    ></Picker>
                                </View>:''
                            }
                        <Text style={styles.button} onPress={this.clickSearch}>查询</Text>
                    </View>

                    <View style={styles.echarts_con}>
                        {this.state.optionData.length == 0?
                            <Text style={styles.empty}>暂无数据</Text>:
                            <View style={styles.item}>
                                <Text style={styles.name}>
                                    环比分析数据
                                </Text>
                                <View style={styles.table}>
                                    <View style={styles.row}>
                                        <Text style={styles.th}>{this.state.titleData[0]}</Text>
                                        <Text style={styles.th}>{this.state.titleData[1]}</Text>
                                        <Text style={styles.th}>{this.state.titleData[2]}</Text>
                                        <Text style={styles.th}>{this.state.titleData[3]}</Text>
                                        <Text style={styles.th}>{this.state.titleData[4]}</Text>
                                    </View>
                                    {this.state.optionData.map((item:any,index:number)=>{
                                        return(
                                            <View key={index} style={[styles.row,index%2 == 0? styles.b1 : null]}>
                                                <Text style={[styles.td,styles.c1]}>{item.name}</Text>
                                                <Text style={styles.td}>{item.vala}</Text>
                                                <Text style={styles.td}>{item.valb}</Text>
                                                <Text style={styles.td}>{item.vald}</Text>
                                                <Text style={styles.td}>{item.valc}</Text>
                                            </View>
                                        )
                                    })}
                                </View>
                            </View>
                        }
                    </View>
                </View>
                 {/* 弹窗效果 */}
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
        lineHeight: 35,
        textAlign: 'center',
        fontSize: 18,
        color: '#333',
    },
    choice_date:{
        position: 'relative',
        width: '100%',
        height: 30,
        lineHeight: 30,
        // padding: 0 20rpx,
        fontSize: 18,
        color: '#666666',
        // border: 1px solid #d9d9d9,
        borderRadius: 5,
        paddingRight: 25,
        overflow: 'hidden',
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
        lineHeight: 34,
        paddingLeft: 12,
        paddingRight: 12,
        fontSize: 18,
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
        lineHeight: 45,
        fontSize: 18,
        paddingLeft: 15,
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
        fontSize: 18,
        color: '#999999',
        overflow: 'hidden',
    },
    img:{
        width: 15,
        height: 15,
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
        fontSize: 18,
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
        fontSize: 16,
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

export default GasAnalysis3
