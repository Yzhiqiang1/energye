import { DeviceEventEmitter, Dimensions, Image, Pressable, SafeAreaView, ScrollView, StyleSheet, Text, View } from 'react-native'
import React, { Component } from 'react'
import Navbar from '../../../component/navbar/navbar'
import util from '../../../utils/util'
import styleg from '../../../indexCss'
import MyCanvas from '../../../component/my-canvas/MyCanvas'
import { Register } from '../../../utils/app'
import { store } from '../../../redux/storer'
import { HttpService } from '../../../utils/http'
import Loading from '../../../component/Loading/Loading'//加载组件
import PickerBut from '../../../component/PickerBut/PickerBut'
import { t } from 'i18next'

const api = require('../../../utils/api')
const Fs = Dimensions.get('window').width*0.8

export class PowerTest5 extends Component<any,any> {
    constructor(props:any){
        super(props)
        this.state={
            top: 0, //内容区与顶部距离
            LoginStatus: 1, //登录状态 默认未登录
    
            //日月切换
            dataSwitch: [t('monthlyReport'), t('annualReport')],
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
        let parameterGrou = store.getState().parameterGroup; //获取选中组和设备信息
        if (parameterGrou.radioGroup.selectKey) {
            that.avr_getTbaleData();
        } else {
            //信息提示
            this.setState({
                msgType: 2,
                visible: true,
                LoadingMsg: t('getNotData')
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
        this.setState({
            _date: e,
            dateShow: false
        })
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
                LoadingMsg: t('YANLI')
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
            LoadingMsg: t('Loading')
        }); //加载效果
        //用户ID
        let userId = store.getState().userId;
        //查询设备ID
        let deviceId = store.getState().parameterGroup.radioGroup.selectKey;
        //处理月报 年报 接口切换
        let url = that.state.dataSwitchIn == 0 ? api.avr_getTbaleData : api.avr_getYearData;
        //查询日期
        let date = that.state._date;
        //定义图表数据
        let queryData:any = [{
                name: t('lineChart'),
                state: true,
                type: 1,
                title: "",
                legendData: [t('averagePowerFactor')],
                xAxisData: [],
                xAxisDataIs: false,
                yAxisName: [""],
                series: [{
                    name: t('averagePowerFactor'),
                    type: 'line',
                    connectNulls: true,
                    data: []
                }]
            },
            {
                name:t('barChart'),
                state: true,
                type: 3,
                title: "",
                legendData: [t('Positive'), t('ReverseD'), t('Forward'), t('Reverse')],
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
                                name: t('Positive'),
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
                                name: t('ReverseD'),
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
                                name: t('Forward'),
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
                                name: t('Reverse'),
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
                        console.log(queryData, '处理后的平均功率因数');
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
        <View style={{flex: 1}}>
            <View style={{position: 'absolute',top: 0,width: "100%",height: "100%",backgroundColor: '#fff'}}>
            </View>
            {/* 弹窗效果 */}
            <Loading 
                type={this.state.msgType} 
                visible={this.state.visible} 
                LoadingMsg={this.state.LoadingMsg}>
            </Loading>
            <SafeAreaView style={{flex: 1}}>
                {/* 引入自定义导航栏 */}
                <Navbar
                    pageName={t('averagePowerFactor')}
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
                            {/* <Picker
                                pickerType={4}
                                dataSwitch={this.state.dataSwitch}
                                dataSwitchIn={this.state.dataSwitchIn}
                                click={this.clickDataSwitch}
                                >
                            </Picker> */}
                            <Pressable style={styleg.button} onPress={()=>this.setState({open: true, typePk: 1})}>
                                <Text allowFontScaling={false} style={styleg.TextButton}>{this.state.dataSwitch[this.state.dataSwitchIn]}</Text>
                                <Image style={styleg.ico} source={require('../../../image/down.png')}></Image>
                            </Pressable>
                        </View>
                    <View style={{flex:2}}>
                            {/* <Picker
                                pickerType={1}
                                date={this.state._date}
                                precisionType={this.state.dataSwitchIn==0 ? 2 : 4}
                                click={this.clickDate}
                            ></Picker> */}
                            <Pressable style={styleg.button} onPress={()=>this.setState({open: true, typePk: 2})}>
                                <Text allowFontScaling={false} style={styleg.TextButton}>{this.state._date}</Text>
                                <Image style={styleg.ico} source={require('../../../image/down.png')}></Image>
                            </Pressable>
                    </View>
                        <Text allowFontScaling={false} style={styles.button} onPress={this.clickSearch}>{t('inquire')}</Text>
                    </View>
                    <ScrollView style={styles.echarts_con}>
                        {this.state.optionData.length == 0?
                            <Text allowFontScaling={false} style={styles.empty}>{t('noData')}</Text>:''
                        }
                        {this.state.optionData.map((data:any,index:any)=>{
                            return(
                                data.state == true?
                                <View style={styles.item} key={index}>
                                    <Text allowFontScaling={false} style={styles.name}>
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
                {/* 日期选择 */}
                {this.state.open?
                    this.state.typePk==1?
                        <PickerBut
                            pickerType={4}
                            dataSwitch={this.state.dataSwitch}
                            dataSwitchIn={this.state.dataSwitchIn}
                            click={this.clickDataSwitch}
                            cancel={()=>this.setState({open: false})}
                        ></PickerBut>:
                        <PickerBut
                            pickerType={1}
                            date={this.state._date}
                            precisionType={this.state.dataSwitchIn==0 ? 2 : 4}
                            click={this.clickDate}
                            cancel={()=>this.setState({open: false})}
                        ></PickerBut>
                    :''
                }
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
        height: 35,
        lineHeight: 35,
        textAlignVertical: 'center',
        paddingLeft: 12,
        paddingRight: 12,
        fontSize: Fs/22,
        color: '#666666',
        borderStyle:'solid',
        borderWidth: 1,
        borderColor: '#d9d9d9',
        borderRadius: 2,
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
})

export default PowerTest5