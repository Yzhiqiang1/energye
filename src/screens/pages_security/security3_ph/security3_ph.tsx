import { StyleSheet, Text, View } from 'react-native'
import React, { Component } from 'react'
import styleg from '../../../indexCss'
import MyCanvas from '../../../component/my-canvas/MyCanvas'
import util from '../../../utils/util'
import { Register } from '../../../utils/app'
import store from '../../../redux/store'
import { HttpService } from '../../../utils/http'
import Loading from '../../../component/Loading/Loading'
const api = require('../../../utils/api')

export class Security3_ph extends Component<any,any> {
    constructor(props:any){
        super(props)
        this.state={
            _date: util.nowDate(), //查询日期
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
        Register.userSignIn(false).then(res => {
            //校验登录成功后执行
            if (res == true) {
                if (this.props.route.params.deviceId) {
                    this.setState({
                        deviceId: this.props.route.params.deviceId,
                        deviceName: this.props.route.params.deviceName
                    }, () => {
                        //校验通过后调用方法
                        this.check_ok();
                    })
                } else {
                    // //信息提示
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
        this.ecLine();
    }
    //日期选择
    clickDate=(e:any)=>{
        let that = this;
        that.setState({
            _date: e.detail.value
        })
    }
    //上一日
    preDate=()=>{
        let that = this;
        that.setState({
            _date: util.plusReduceData(this.state._date, 1)
        }, () => {
            //查询日原数据
            that.getCharData();
        })
    }
    //下一日
    nextData=()=>{
        let that = this;
        that.setState({
            _date: util.plusReduceData(this.state._date, 2)
        }, () => {
            //查询日原数据
            that.getCharData();
        })
    }
    //搜索
    clickSearch=()=>{
        //查询日原数据
        this.getCharData();
    }
    //初始化折线图
    ecLine=()=>{
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
    //                 data: [that.data.deviceName],
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
    //             series: [{
    //                 name: that.data.deviceName,
    //                 type: 'line',
    //                 smooth: true,
    //                 areaStyle: {
    //                     origin: 'start'
    //                 },
    //                 data: []
    //             }]
    //         };
    //         _lineChart.setOption(option);
    //         return _lineChart;
    //     })
    }
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
        let date = that.state._date; //查询日期
        //查询数据
        HttpService.apiPost(api.ph_getChart, {
            userId: userId,
            deviceId: deviceId,
            date: date,
        }).then((res:any) => {
            if (res.flag == "00") {
                let times = res.data.times ? res.data.times : [];
                let values = res.data.values ? res.data.values : [];
                //更新图表
                // that.chart.setOption({
                //     xAxis: {
                //         data: res.data.times
                //     },
                //     series: [{
                //         data: res.data.values
                //     }]
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
            <View>
                <View style={styleg.container}>
                    <View style={styles.query_head}>
                        <View style={styles.flex}>
                            {/* <picker mode="date" value="{{_date}}" bindchange="clickDate">
                                <View class="choice_date">
                                    {{_date}}
                                    <image class="ico" src="../../image/down.png"></image>
                                </View>
                            </picker> */}
                        </View>
                        <View style={styles.button}>查询</View>
                        <View style={[styles.button,styles.buttonC1]}>上一日</View>
                        <View style={styles.button}>下一日</View>
                    </View>
                    <View style={styles.echarts_con}>
                        <View style={styles.item}>
                            <View style={styles.echarts}>
                                {/* <ec-canvas id="mychart_line" canvas-id="mychart-line" ec="{{ ecLine }}"></ec-canvas> */}
                                <MyCanvas></MyCanvas>
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
        // padding: 0 20rpx,
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
})

export default Security3_ph