import { DeviceEventEmitter, Image, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native'
import React, { Component } from 'react'
import Navbar from '../../../component/navbar/navbar'
import util from '../../../utils/util'
import styleg from '../../../indexCss'
import MyCanvas from '../../../component/my-canvas/MyCanvas'
import { Register } from '../../../utils/app'
import store from '../../../redux/store'
import { HttpService } from '../../../utils/http'
import DateTimePicker from '@react-native-community/datetimepicker';
import { getTransition } from '../../../utils/util';//时间戳转字符串
import Loading from '../../../component/Loading/Loading'//加载组件
import Picker from '../../../component/Picker/Picker'
const api = require('../../../utils/api')

export class PowerTest5 extends Component<any,any> {
    constructor(props:any){
        super(props)
        this.state={
            top: 0, //内容区与顶部距离
            LoginStatus: 1, //登录状态 默认未登录
    
            //日月切换
            dataSwitch: ["月报", "年报"],
            dataSwitchIn: 0,
            //日期选择
            _date: util.nowDate(1),
            //图标高度
            objHeight: 2000,
            //数据项
            optionData: [],

            dateShow: false,
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
    check_ok=()=>{
        let that = this;
        let parameterGrou = store.getState().userReducer.parameterGroup; //获取选中组和设备信息
        if (parameterGrou.radioGroup.selectKey) {
            that.avr_getTbaleData();
        } else {
            //信息提示
            this.setState({
                msgType: 2,
                visible: true,
                LoadingMsg:'获取参数失败！'
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
     handleSelect=(e: any)=>{
        //通知首页更新
        DeviceEventEmitter.emit('refresh')
        //平均功率因数 月报或年报
        this.avr_getTbaleData();
    }
    //年月切换
    clickDataSwitch=(e:any)=>{
        let that = this;
        let dataSwitchIn = that.state.dataSwitchIn;
        if (dataSwitchIn != e) {
            that.setState({
                _date: e == 1 ? util.nowDate(2) : util.nowDate(1),
                dataSwitchIn: Number(e)
            })
        }
    }
    //日期选择
    clickDate=(e:any)=>{
        let that = this;
        if(e.type == 'set'){
            let date = getTransition(e.nativeEvent.timestamp)
            that.setState({
                _date: date,
                dateShow: false
            })
        }else{
            that.setState({
                dateShow: false
            })
        }
    }
    //搜索
    clickSearch=()=>{
        //平均功率因数 月报或年报
        this.avr_getTbaleData();
    }
    //获取电力运行日报
    avr_getTbaleData=()=>{
        let that = this;
        let LoginStatus = that.state.LoginStatus; //登录状态
        if (LoginStatus == 1) {
             //错误提示信息
             this.setState({
                msgType: 2,
                visible: true,
                LoadingMsg:'您还未登录,无法查询数据！'
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
        //用户ID
        let userId = store.getState().userReducer.userId;
        //查询设备ID
        let deviceId = store.getState().userReducer.parameterGroup.radioGroup.selectKey;
        //处理月报 年报 接口切换
        let url = that.state.dataSwitchIn == 0 ? api.avr_getTbaleData : api.avr_getYearData;
        //查询日期
        let date = that.state._date;
        //定义图表数据
        console.log(that.state.dataSwitchIn);
        console.log(date);
        let queryData:any = [{
                name: "折线图",
                state: true,
                type: 1,
                title: "",
                legendData: ['平均功率因数', ],
                xAxisData: [],
                xAxisDataIs: false,
                yAxisName: [""],
                series: [{
                    name: '平均功率因数',
                    type: 'line',
                    connectNulls: true,
                    data: []
                }]
            },
            {
                name: "柱状图",
                state: true,
                type: 3,
                title: "",
                legendData: ['正向有功电度', '反向有功电度', '正向无功电度', '反向无功电度'],
                gridData: [],
                xAxisData: [],
                yAxisData: [],
                series: []
            }
        ];
        //查询数据
        HttpService.apiPost(url, {
            userId: userId,
            deviceId: deviceId,
            date: date,
        }).then((res:any) => {
            console.log(res, '返回的平均功率因数');
            if (res.flag == "00") {
                let listData = res.data;
                //校验数据是否为空
                if (listData.length > 0) {
                    let count = 0;
                    //处理组数据
                    let objSeries0 = [];
                    let objSeries:any = [];
                    for (let i = 0; i < listData.length; i++) {
                        //传感器数据
                        let objData = listData[i];
                        //图标名字
                        queryData[0].title = date + ' ' + objData.devicename;
                        queryData[1].title = date + ' ' + objData.devicename;
                        //处理grid位置
                        if (queryData[1].gridData[count] == undefined) {
                            let _top = count == 0 ? 70 : ((40 * count) + 70) + (120 * count);
                            queryData[1].gridData[count] = {
                                top: _top,
                                height: 120,
                                right: '3%'
                            }
                        }

                        //处理X轴
                        if (queryData[0].xAxisData == undefined) {
                            queryData[0].xAxisData = []
                        }
                        queryData[0].xAxisData.push(objData.date);
                    
                        if (queryData[1].xAxisData[count] == undefined) {
                            queryData[1].xAxisData[count] = {
                                type: 'category',
                                axisLine: {
                                    lineStyle: {
                                        color: '#389CEE'
                                    }
                                }, //坐标轴线线的颜色。
                                axisTick: {
                                    show: false
                                }, //是否显示坐标轴刻度。
                                axisLabel: {
                                    interval: 0,
                                    color: '#666666',
                                    fontSize: 11
                                }, //坐标轴刻度标签的相关设置。--坐标轴刻度标签的显示间隔;
                                gridIndex: count, //x 轴所在的 grid 的索引，默认位于第一个 grid。
                                data: []
                            }
                        }
                        queryData[1].xAxisData[count].data.push(objData.date);
                        //处理Y轴
                        if (queryData[0].yAxisData == undefined) {
                            queryData[0].yAxisData = []
                        }
                        queryData[0].series[0].data.push(objData.Pf_avg);
                        console.log(queryData,777);
                        if (queryData[1].yAxisData[count] == undefined) {
                            queryData[1].yAxisData[count] = {
                                type: 'value',
                                axisLine: {
                                    show: true,
                                    lineStyle: {
                                        color: '#389CEE'
                                    }
                                },
                                axisTick: {
                                    show: false,
                                },
                                axisLabel: {
                                    color: '#666666'
                                },
                                splitLine: {
                                    lineStyle: {
                                        color: ['#D8D8D8'],
                                        type: 'dashed'
                                    }
                                },
                                gridIndex: count
                            }
                        }

                        //处理数据
                        if (objSeries[0] == undefined) {
                            objSeries[0] = {
                                name: "正向有功电度",
                                type: 'bar',
                                barGap: 0, //不同系列的柱间距离
                                showBackground: true,
                                backgroundStyle: {
                                    color: "rgba(180, 180, 180, 0.05)"
                                },
                                label: {
                                    show: true,
                                    rotate: -90,
                                    align: 'right'
                                },
                                xAxisIndex: count,
                                yAxisIndex: count,
                                data: []
                            }
                        }
                        objSeries[0].data.push(objData.Epi_val); //正向有功电度

                        if (objSeries[1] == undefined) {
                            objSeries[1] = {
                                name: "反向有功电度",
                                type: 'bar',
                                barGap: 0,
                                showBackground: true,
                                backgroundStyle: {
                                    color: "rgba(180, 180, 180, 0.05)"
                                },
                                label: {
                                    show: true,
                                    rotate: -90,
                                    align: 'right'
                                },
                                xAxisIndex: count,
                                yAxisIndex: count,
                                data: []
                            }
                        }
                        objSeries[1].data.push(objData.Epe_val); //反向有功电度

                        if (objSeries[2] == undefined) {
                            objSeries[2] = {
                                name: "正向无功电度",
                                type: 'bar',
                                barGap: 0,
                                showBackground: true,
                                backgroundStyle: {
                                    color: "rgba(180, 180, 180, 0.05)"
                                },
                                label: {
                                    show: true,
                                    rotate: -90,
                                    align: 'right'
                                },
                                xAxisIndex: count,
                                yAxisIndex: count,
                                data: []
                            }
                        }
                        objSeries[2].data.push(objData.Eql_val); //正向无功电度

                        if (objSeries[3] == undefined) {
                            objSeries[3] = {
                                name: "反向无功电度",
                                type: 'bar',
                                barGap: 0,
                                showBackground: true,
                                backgroundStyle: {
                                    color: "rgba(180, 180, 180, 0.05)"
                                },
                                label: {
                                    show: true,
                                    rotate: -90,
                                    align: 'right'
                                },
                                xAxisIndex: count,
                                yAxisIndex: count,
                                data: []
                            }
                        }
                        objSeries[3].data.push(objData.Wqn_val); //反向无功电度
                        // console.log( objSeries,555);

                        // if (objSeries0[0] == undefined) {
                        //     objSerie0[0] = {
                        //         name: "平均功率因数",
                        //         type: 'bar',
                        //         barGap: 0,
                        //         showBackground: true,
                        //         backgroundStyle: {
                        //             color: "rgba(180, 180, 180, 0.05)"
                        //         },
                        //         label: { 
                        //             show: true,
                        //             rotate: -90,
                        //             align: 'right'
                        //         },
                        //         xAxisIndex: count, 
                        //         yAxisIndex: count,
                        //         data: []
                        //     }
                        // }
                        // objSeries0[0].data.push(objData.Pf_avg); //平均功率因数
                        // // console.log( objSeries0,555);

                        //每4个为一组
                        if ((i + 1) % 4 == 0) {
                            count = count + 1;
                            for (let a = 0; a < objSeries.length; a++) {
                                queryData[1].series.push(objSeries[a]);
                            }
                            objSeries = [];
                        } else {
                            if ((i + 1) == listData.length) {
                                for (let a = 0; a < objSeries.length; a++) {
                                    queryData[1].series.push(objSeries[a]);
                                }
                                objSeries = [];
                            }
                        }
                    }
                    // let objHeight = queryData[0].gridData[queryData[0].gridData.length - 1].top + queryData[0].gridData[queryData[0].gridData.length - 1].height + 50;
                    that.setState({
                        // objHeight: objHeight,
                        optionData: queryData,
                    }, () => {
                        console.log(queryData, '处理后的平均功率因数queryData');
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
            //错误提示信息
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
            pageName={'平均功率因数'}
            showBack={true}
            showHome={false}
            isCheck={2}
            LoginStatus={this.state.LoginStatus}
            props={this.props}
            handleSelect={this.handleSelect}
        >
        </Navbar>
        {/* 内容区 */}
        <View style={styleg.container}>
            <View style={styles.query_head}>
                <View style={styles.flex}>
                    <Picker
                        pickerType={4}
                        dataSwitch={this.state.dataSwitch}
                        dataSwitchIn={this.state.dataSwitchIn}
                        click={this.clickDataSwitch}
                        >
                    </Picker>
                </View>
               <View style={{flex:2}}>
                <Picker
                        pickerType={1}
                        date={this.state._date}
                        precisionType={this.state.dataSwitchIn==0 ? 2 : 4}
                        click={this.clickDate}
                    ></Picker>
               </View>
                <Text style={styles.button} onPress={this.clickSearch}>查询</Text>
            </View>
            <ScrollView style={styles.echarts_con}>
                {this.state.optionData.length == 0?
                    <Text style={styles.empty}>暂无数据</Text>:''
                }
                {this.state.optionData.map((data:any,index:any)=>{
                    return(
                        data.state == true?
                        <View style={styles.item} key={index}>
                            <Text style={styles.name}>
                                {data.name}
                            </Text>
                            <View style={styles.echarts}>
                                <MyCanvas objData={data} objType={data.type == 1 ? 1 : 3}></MyCanvas>
                            </View>
                        </View>:''
                    )
                })}
            </ScrollView>
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
        fontSize: 18,
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
        fontSize: 18,
        color: '#999999',
        overflow: 'hidden',
    },
})

export default PowerTest5