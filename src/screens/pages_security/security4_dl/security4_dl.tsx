import { StyleSheet, Text, View } from 'react-native'
import React, { Component } from 'react'
import styleg from '../../../indexCss'
import util from '../../../utils/util'
import { Register } from '../../../utils/app'
import store from '../../../redux/store'
import { HttpService } from '../../../utils/http'
import Loading from '../../../component/Loading/Loading'
const api = require('../../../utils/api')

export class Security4_dl extends Component<any,any> {
    constructor(props:any){
        super(props)
        this.state={
            start: util.nowDate(), //查询日期
            end: util.nowDate(), //结束日期
            deviceId: '', //设备ID
            deviceName: '', //设备名称
            //折线图
            ecLine: {
                lazyLoad: true,
            },

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
                if (this.props.route.params.deviceId) {
                    this.setState({
                        deviceId:this.props.route.params.deviceId,
                        deviceName: this.props.route.params.deviceName
                    }, () => {
                        //校验通过后调用方法
                        this.check_ok();
                    })
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
        });
    }

    check_ok=()=>{
        // this.ecLine();
    }
    //开始日期
    clickStart=(e:any)=>{
        let that = this;
        that.setState({
            start: e.detail.value
        })
    }
    //结束日期
    clickEnd=(e:any)=>{
        let that = this;
        that.setState({
            end: e.detail.value
        })
    }
    //搜索
    clickSearch=()=>{
        let that = this;
        let start = new Date(that.state.start).getTime();
        let end = new Date(that.state.end).getTime(); //结束日期
        if (start > end) {
            //错误提示信息
            this.setState({
                msgType: 2,
                visible: true,
                LoadingMsg: '开始日期不能大于结束日期!'
            },()=>{
                setTimeout(()=>{
                    this.setState({
                        visible: false,
                    })
                },2000)
            })
        } else {
            //查询数据
            that.getCharData();
        }
    }
    //初始化折线图
    // ecLine=()=>{
    //     let that = this;
    //     that.oneComponent = that.selectComponent('#mychart_line');
    //     that.oneComponent.init((canvas, width, height, dpr) => {
    //         const _lineChart = echarts.init(canvas, null, {
    //             width: width,
    //             height: height,
    //             devicePixelRatio: dpr
    //         });
    //         canvas.setChart(_lineChart);
    //         that.chart = _lineChart; //将图表实例绑定到 this 上
    //         that.getCharData(); //线初始化折线图 在查询数据
    //         const option = {
    //             color: ['#0099d9', '#d2012b', '#004591'],
    //             tooltip: {
    //                 show: true,
    //                 trigger: 'axis',
    //                 axisPointer: {
    //                     type: 'cross',
    //                     label: {
    //                         backgroundColor: '#6a7985'
    //                     }
    //                 }
    //             },
    //             legend: {
    //                 type: 'scroll',
    //                 data: [],
    //                 right: '5%',
    //                 left: '5%',
    //             },
    //             grid: {
    //                 left: '20px',
    //                 right: '20px',
    //                 bottom: '20px',
    //                 top: "40px",
    //                 containLabel: true
    //             },
    //             xAxis: {
    //                 type: 'category',
    //                 boundaryGap: false,
    //                 axisLine: {
    //                     align: 'right'
    //                 },
    //                 min: 'dataMin',
    //                 max: 'dataMax',
    //                 data: [],
    //             },
    //             yAxis: {
    //                 type: 'value',
    //                 min: 'dataMin',
    //                 max: 'dataMax',
    //             },
    //             series: []
    //         };
    //         _lineChart.setOption(option);
    //         return _lineChart;
    //     })
    // }
    //获取日原数据
    getCharData=()=>{
        let that = this;
        this.setState({
            msgType: 1,
            visible: true,
            LoadingMsg: '加载中...'
        }); //加载效果
        let userId = store.getState().userReducer.userId; //用户ID
        let deviceId = that.state.deviceId; //获取设备ID
        let start = that.state.start; //开始日期
        let end = that.state.end; //结束日期
        //查询数据
        HttpService.apiPost(api.xdl_getChart, {
            userId: userId,
            deviceId: deviceId,
            date: start + ' 00:00:00' + ' - ' + end + ' 23:59:59',
        }).then((res:any) => {
            console.log(res)
            let legendArr = [];
            let xAxisArr = [];
            let seriesArr = [];
            if (res.flag == "00") {
                if (res.data.length > 0) {
                    for (let a = 0; a < res.data.length; a++) {
                        xAxisArr = res.data[a].times;
                        legendArr.push(res.data[a].sensorname);
                        seriesArr.push({
                            name: res.data[a].sensorname,
                            type: 'line',
                            smooth: true,
                            areaStyle: {
                                origin: 'start'
                            },
                            data: res.data[a].values
                        })
                    }
                }
                /*更新图表*/
                // that.chart.setOption({
                //     legend: {
                //         data: legendArr,
                //     },
                //     xAxis: {
                //         data: xAxisArr
                //     },
                //     series: seriesArr
                // }, {
                //     replaceMerge: 'series'
                // });
                //关闭加载效果
                this.setState({
                    visible: false
                })
            } else {
                //关闭加载效果
                this.setState({
                    visible: false
                })
                //错误提示信息
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
                <View style={styleg.container}>
                    <View style={styles.query_head}>
                        <View style={styles.flex}>
                            {/* <picker mode="date" value="{{start}}" bindchange="clickStart">
                                <View class="choice_date">
                                    {{start}}
                                    <image class="ico" src="../../image/down.png"></image>
                                </View>
                            </picker> */}
                        </View>
                        <Text style={styles.text}>
                            至
                        </Text>
                        <View style={styles.flex}>
                            {/* <picker mode="date" value="{{end}}" bindchange="clickEnd">
                                <View class="choice_date">
                                    {{end}}
                                    <image class="ico" src="../../image/down.png"></image>
                                </View>
                            </picker> */}
                        </View>
                        <Text style={styles.button}>查询</Text>
                    </View>

                    <View style={styles.echarts_con}>
                        <View style={styles.item}>
                            <Text style={styles.name}>{this.state.deviceName}</Text>
                            <View style={styles.echarts}>
                                {/* <ec-canvas id="mychart_line" canvas-id="mychart-line" ec="{{ ecLine }}"></ec-canvas> */}
                            </View>
                        </View>
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
    query_head:{
        position: 'relative',
        width: '100%',
        height: 50,
        paddingLeft: 10,
        paddingRight: 10,
        display: 'flex',
        alignItems: 'center',
        backgroundColor: '#fff',
        overflow: 'hidden',
    },
    button:{
        position: 'relative',
        width: 'auto',
        height: 30,
        // lineHeight: calc(60rpx - 2rpx),
        // padding: 0 25rpx,
        fontSize: 16,
        color: "#666666",
        // border: 1px solid #d9d9d9,
        borderRadius: 5,
        marginLeft: 7,
        overflow: 'hidden',
    },
    buttonC1:{
        backgroundColor: '#1890FF',
        color: '#fff',
    },
    flex:{
        flex: 1,
    },
    choice_date:{
        position: 'relative',
        width: '100%',
        height: 30,
        // lineHeight: calc(60rpx - 2rpx),
        // padding: 0 20rpx,
        fontSize: 16,
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
    echarts:{
        position: 'relative',
        width: '100%',
        height: 300,
        marginTop: 10,
    },
    text:{
        position: 'relative',
        width: 'auto',
        height: 30,
        lineHeight: 30,
        // padding: 0 20rpx,
        fontSize: 16,
        color: '#666666',
        overflow: 'hidden',
    },
    name:{
        position: 'relative',
        width: '100%',
        height: 40,
        lineHeight: 40,
        fontSize: 18,
        textAlign: 'center',
        // border-bottom: 1px solid #E5E5E5,
        borderBottomWidth: 1,
        borderBottomColor: '#E5E5E5',
        borderStyle: 'solid',
        overflow: 'hidden',
    },
}) 

export default Security4_dl