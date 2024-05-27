import { DeviceEventEmitter, StyleSheet, Text, View } from 'react-native'
import React, { Component } from 'react'
import Navbar from '../../../component/navbar/navbar'
import styleg from '../../../indexCss'
import MyCanvas from '../../../component/my-canvas/MyCanvas'
import util from '../../../utils/util'
import { Register } from '../../../utils/app'
import store from '../../../redux/store'
import { HttpService } from '../../../utils/http'
import Loading from '../../../component/Loading/Loading'
import Picker from '../../../component/Picker/Picker'
const api = require('../../../utils/api')

export class WaterAnalysis2 extends Component<any,any> {
    constructor(psopr:any){
        super(psopr)
        this.state={
            LoginStatus: 1, //登录状态默认未登录

            _date: util.nowDate(2), //查询日期
            //数据项
            optionData: [],
            optionData2:[],

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
        if (parameterGrou.radioGroup.selectKey) {
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
        //通知首页更新
        DeviceEventEmitter.emit('refresh')
        //查询日原数据
        this.getData();
    }
    //日期选择
    clickDate=(e:any)=>{
        let that = this;
        that.setState({
            _date: e
        })
    }
    //上一年
    preDate=()=>{
        let that = this;
        that.setState({
            _date: this.state._date - 1
        }, () => {
            //查询日原数据
            that.getData();
        })
    }
    //下一年
    nextData=()=>{
        let that = this;
        that.setState({
            _date: this.state._date + 1
        }, () => {
            //查询日原数据
            that.getData();
        })
    }
    //搜索
    clickSearch=()=>{
        //查询日原数据
        this.getData();
    }
    //获取日原数据
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
        let userId = store.getState().userReducer.userId; //用户ID
        let deviceId =store.getState().userReducer.parameterGroup.radioGroup.selectKey;; //获取设备ID
        let date = that.state._date; //查询日期

        //定义图表数据
        let queryData:any = [
        {
            name: "柱状图",
            state: true,
            type: 2,
            title: date + "年",
            legendData: ['本期', '同期'],
            xAxisData: [],
            xAxisDataIs: false,
            yAxisName: [""],
            series: [{
                name: '本期',
                type: 'bar',
                data: []
            }, {
                name: '同期',
                type: 'bar',
                data: []
            }]
        }
    ];
        //查询数据
        HttpService.apiPost(api.tbfx_water_getData, {
            userId: userId,
            deviceId: deviceId,
            date: date,
        }).then((res:any) => {
            if (res.flag == "00") {
                let listData = res.data;
                //校验数据是否为空
                if (listData.length > 0) {
                    //循环数据
                    for (let i = 0; i < 12; i++) {
                        let objData = listData[i];
                        if (objData != undefined) {
                            //柱状图
                            queryData[0].xAxisData.push(objData.month);
                            // 本期
                            queryData[0].series[0].data.push(objData.cha1);
                            // 同期
                            queryData[0].series[1].data.push(objData.cha2);
                        }
                       
                    }
                    that.setState({
                        optionData: queryData,
                        optionData2:listData
                    }, () => {
                        // //关闭加载效果
                        this.setState({
                            visible: false,
                        })
                    })
                } else {
                    that.setState({
                        optionData: [],
                    }, () => {
                        // //关闭加载效果
                        this.setState({
                            visible: false,
                        })
                    })
                }
            } else {
                // //关闭加载效果
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
                    pageName={'同比分析'}
                    showBack={true}
                    showHome={false}
                    isCheck={2}
                    props={this.props}
                    LoginStatus={this.state.LoginStatus}
                    handleSelect={this.handleSelect}>
                </Navbar>
                {/* 内容区 */}
                <View style={styleg.container}>
                    <View style={styles.query_head}>

                        <View style={styles.flex}>
                            <Picker
                                pickerType={1}
                                date={this.state._date}
                                precisionType={4}
                                click={this.clickDate}
                            ></Picker>
                        </View>
                        <Text style={styles.button} onPress={this.clickSearch}>查询</Text>
                        <Text style={[styles.button,styles.buttonC1]} onPress={this.preDate}>上一年</Text>
                        <Text style={styles.button} onPress={this.nextData}>下一年</Text>
                    </View>
                    <View style={styles.echarts_con}>
                        {this.state.optionData.length == 0?
                            <Text style={styles.empty}>暂无数据</Text>:''
                        }
                        {/* 柱形图 */}
                        {this.state.optionData.map((item:any,index:number)=>{
                            return(
                                item.state == true?
                                <View style={styles.item} key={index}>
                                    <View style={styles.name}>
                                        {item.name}
                                    </View>
                                    <View style={styles.echarts}>
                                        <MyCanvas objData={item} objType={item.type == 1 ? 1 : 2}></MyCanvas>
                                    </View>
                                </View>:''
                            )
                        })}
                        {/* 列表 */}
                        {this.state.optionData.map((item:any,index:number)=>{
                            return(
                                <View style={styles.item} key={index}>
                                    <Text style={styles.name}>
                                        列表
                                    </Text>
                                    <View style={styles.echarts}>
                                        <View style={styles.table}>
                                            <View style={styles.row}>
                                                <Text style={styles.th}>月份</Text>
                                                <Text style={styles.th}>本期</Text>
                                                <Text style={styles.th}>同期</Text>
                                                <Text style={styles.th}>同比(%)</Text>
                                                <Text style={styles.th}>累计同比(%)</Text>
                                            </View>
                                            {this.state.optionData2.map((item:any,index1:Number)=>{
                                                return(
                                                    <View style={[styles.row,index%2 == 0? styles.b1 : null]}>
                                                        <Text style={[styles.td,styles.c1]}>{item.month}</Text>
                                                        <Text style={styles.td}>{item.cha1}</Text>
                                                        <Text style={styles.td}>{item.cha2}</Text>
                                                        <Text style={styles.td}>{item.tb1}</Text>
                                                        <Text style={styles.td}>{item.tb2}</Text>
                                                    </View>
                                                )
                                            })}
                                            
                                        </View>
                                    </View>
                                </View>
                            )
                        })}
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
    tab:{
        position: 'relative',
        width: '100%',
        paddingLeft:10,
        paddingRight:10,
        display: 'flex',
        flexDirection:'row',
        alignItems: 'center',
        backgroundColor: '#fff',
        zIndex: 9,
        overflow: 'hidden',
        borderBottomColor: '#f4f4f4',
        borderStyle:'solid',
        borderBottomWidth:1,
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
    tabflex:{
        flex: 1,
        fontSize: 18,
        textAlign:'center',
        lineHeight:40,
        height: 40,
        textAlignVertical: 'center',
    },
    flex:{
        flex: 1,
        fontSize: 18,
        textAlign:'center',
    },
    button:{
        position: 'relative',
        width: 'auto',
        height: 30,
        lineHeight: 30,
        textAlignVertical: 'center',
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
    buttonC1:{
        backgroundColor: '#1890FF',
        color: '#fff',
    },
    text:{},
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
    table:{
        position: 'relative',
        width: '100%',
        // padding: 20rpx 10rpx,
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
    }
})

export default WaterAnalysis2