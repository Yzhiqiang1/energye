import { Dimensions, SafeAreaView, ScrollView, StyleSheet, Text, View } from 'react-native'
import React, { Component } from 'react'
import styleg from '../../../indexCss'
import MyCanvas from '../../../component/my-canvas/MyCanvas'
import util from '../../../utils/util'
import Picker from '../../../component/Picker/Picker'//选择器
import store from '../../../redux/store'
import { HttpService } from '../../../utils/http'
import Navbars from '../../../component/Navbars/Navbars'
import Loading from '../../../component/Loading/Loading'
const api = require('../../../utils/api')
const Fs = Dimensions.get('window').width*0.8

export class History_leakage extends Component<any,any> {
    constructor(props:any){
        super(props)
        this.state={
            _date: util.nowDate(), //查询日期
            //数据项
            optionData: [],
            optionData2: [],
            sids: '',
            dateShow: false,

            msgType: 1,
            visible: false,
            LoadingMsg: ''
        }
    }
    componentDidMount(): void {
        let deviceid = this.props.route.params.deviceid ? this.props.route.params.deviceid : "获取参数失败";
        this.setState({
            deviceid: deviceid
        }, () => {
            this.getHistory();
        })
    }
    /************************************
     *     校验登录通过
     * *****************************/
    //日期选择
    clickDate=(e:any)=>{
        this.setState({
            _date: e,
            dateShow: false
        })
    }
    //上一日
    preDate=()=>{
        let that = this;
        that.setState({
            _date: util.plusReduceData(this.state._date, 1)
        }, () => {
            //查询日原数据
            that.getHistory();
        })
    }
    //下一日
    nextData=()=>{
        let that = this;
        that.setState({
            _date: util.plusReduceData(this.state._date, 2)
        }, () => {
            //查询历史数据
            that.getHistory();
        })
    }
    //搜索
    clickSearch=()=>{
        //查询历史数据
        this.getHistory();
    }
    //获取历史数据
    getHistory=()=>{
        let that = this;
        let userId = store.getState().userReducer.userId; //用户ID
        let deviceId = that.state.deviceid; //获取设备id
        let date = that.state._date; //查询日期
        /**
         * ///////////////////////////////处理漏电流数据
         */
        //定义图表数据
        let queryData:any = [{ //漏电流
                state: true,
                title: '', //跟上面选择的时间一致
                name: "漏电流",
                xAxisData: [], //x轴信息
                series: [{ //y轴信息
                    type: 'line',
                    data: [],
                    connectNulls: true
                }],
                yAxisName: "单位：(mA)", //y轴单位
            },
            { //温度
                state: true,
                legendData: [],
                title: [], //跟上面选择的时间一致
                name: "温度",
                xAxisData: [], //x轴信息
                series: [], //y轴信息
                yAxisName: "单位：(℃)", //y轴单位
            }
        ];
       this.setState({
            msgType: 1,
            visible: true,
            LoadingMsg: '加载中...'
       })
        HttpService.apiPost(api.ldjc_getVoltage, {
            userId: userId,
            deviceId: deviceId,
            date: date
        }).then((res:any) => {
            if (res.flag === '00') {
                let listData = res.data;
                if (Object.keys(listData).length > 0) { //有数据
                    let times = listData.times;
                    let values = listData.values;
                    queryData[0].title = date
                    queryData[0].xAxisData = times
                    queryData[0].series[0].data = values
                    //更新数据
                    let data = this.state.optionData
                    data[0] = queryData[0]
                    that.setState({
                        optionData: data,
                    }, () => {
                        this.setState({
                            visible: false
                        })
                    })
                } else { //数据为空
                    queryData[0].title = date
                    that.setState({
                        optionData: queryData,
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
        })
        /**
         * ///////////////////////////////处理温度数据
         */
        //定义图表数据
        let objName:any = {
            "T1": "A",
            "T2": "B",
            "T3": "C",
            "T4": "N"
        }
        HttpService.apiPost(api.ldjc_getTemperature, {
            userId: userId,
            deviceId: deviceId,
            date: date
        }).then((res:any) => {
            if (res.flag === '00') {
                let listData = res.data;
                if (Object.keys(listData).length > 0) { //有数据
                    let times = listData.times;
                    let series = [];
                    let legendData = [];
                    for (let i = 0; i < listData.labels.length; i++) {

                        let label = listData.labels[i]

                        legendData.push(objName[listData.labelnames[i]]) //处理legendData
                        series.push({ //处理 series
                            name: objName[listData.labelnames[i]],
                            type: 'line',
                            connectNulls: true,
                            data: listData[label],
                        })
                    }
                    queryData[1].legendData = legendData;
                    queryData[1].title = date;
                    queryData[1].xAxisData = times;
                    queryData[1].series = series;
                    // 更新数据
                    let data = this.state.optionData
                    data[1] = queryData[1]
                    that.setState({
                        optionData: data,
                    }, () => {
                        //关闭加载效果
                        this.setState({
                            visible: false
                        })
                    })
                } else { //数据为空
                    queryData[0].title = date
                    that.setState({
                        optionData: queryData,
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
            // // 关闭加载效果
            this.setState({
                visible: false
            })
            // // 错误提示信息
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
        })
    }

    render() {
        return (
            <View style={{flex: 1}}>
                <View style={{position: 'absolute',top: 0,width: "100%",height: "100%",backgroundColor: '#fff'}}>
                </View>
                <SafeAreaView style={{flex: 1}}>
                    <Navbars
                        name={'历史查询'}
                        showHome={false}
                        showBack={true}
                        props={this.props}>
                    </Navbars>
                    {/* 内容区 */}
                    <View style={styleg.container10}>
                        <View style={styles.query_head}>
                            <View style={styles.flex}>
                                <Picker
                                    pickerType={1}
                                    date={this.state._date}
                                    precisionType={1}
                                    click={this.clickDate}
                                >
                                </Picker>
                            </View>
                            <Text style={styles.button} onPress={this.clickSearch}>查询</Text>
                            <Text style={[styles.button,styles.buttonC1]} onPress={this.preDate}>上一日</Text>
                            <Text style={styles.button} onPress={this.nextData}>下一日</Text>
                        </View>
                        
                        <ScrollView style={styles.echartsCon}>
                            {this.state.optionData.length == 0?
                                <Text style={styles.empty}>暂无漏电信息数据</Text> : ''
                            }
                            {this.state.optionData.map((item:any,index:number)=>{
                                return(
                                    <View style={styles.item} key={index}>
                                        <Text style={styles.name}>
                                            {item.name}
                                        </Text>
                                        <View style={styles.echarts}>
                                            <MyCanvas objData={item} name={item.name}></MyCanvas>
                                        </View>
                                    </View>
                                )
                            })}
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
    query_head:{
        position: 'relative',
        width: '100%',
        height: 50,
        paddingLeft: 10,
        paddingRight: 10,
        display: 'flex',
        flexDirection:'row',
        alignItems: 'center',
        backgroundColor: '#fff',
        overflow: 'hidden',
    },
    button:{
        position: 'relative',
        height: 30,
        lineHeight: 30,
        textAlignVertical: 'center',
        paddingLeft: 12,
        paddingRight: 12,
        fontSize: Fs/20,
        color: '#666666',
        borderStyle: 'solid',
        borderWidth: 1,
        borderColor: '#d9d9d9',
        borderRadius: 5,
        marginLeft: 7,
        overflow: 'hidden',
    },
    buttonC1:{
        backgroundColor: "#1890FF",
        color: '#fff',
    },
    flex:{
        flex: 1,
    },
    text:{
        position: 'relative',
        width: 'auto',
        height: 30,
        lineHeight: 30,
        paddingLeft: 10,
        paddingRight: 10,
        fontSize: Fs/20,
        color: '#666666',
        overflow: 'hidden',
    },
    ico:{
        position: 'absolute',
        top: 7,
        right: -100,
        width: 15,
        height: 15,
        overflow: 'hidden',
        backgroundColor: 'red'
    },
    echartsCon:{
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
    item2:{
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
        textAlignVertical: 'center',
        fontSize: Fs/18,
        fontWeight: '600',
        textAlign: 'center',
        borderStyle: 'solid',
        borderBottomWidth: 1,
        borderBottomColor: '#E5E5E5',
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
        paddingTop:25,
        paddingBottom:25,
        textAlign: 'center',
        fontSize: Fs/18,
        color: '#999999',
        overflow: 'hidden',
    },
})

export default History_leakage