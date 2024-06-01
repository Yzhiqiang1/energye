import { Dimensions, SafeAreaView, ScrollView, StyleSheet, Text, View } from 'react-native'
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
const Fs = Dimensions.get('window').width*0.8

export class PowerAnalysis7 extends Component<any,any> {
    constructor(props:any){
        super(props)
        this.state = {
            LoginStatus: 1, //登录状态,默认未登录

            start: util.nowDate(2) + '-01', //查询日期
            end: util.nowDate(1), //结束日期
            //数据项
            optionData: [],

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
        if (parameterGrou.multiGroup.selectKey != '') {
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
    //开始日期
    clickStart=(e:any)=>{
        let that = this;
        that.setState({
            start: e
        })
    }
    //结束日期
    clickEnd=(e:any)=>{
        let that = this;
        that.setState({
            end: e
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
            that.getData();
        }
    }
    //查询数据
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
        //查询设备ID
        let ObjdeviceId = store.getState().userReducer.parameterGroup.multiGroup.selectKey;
        let strdeviceId = "";
        for (let i in ObjdeviceId) {
            strdeviceId += strdeviceId == "" ? ObjdeviceId[i] : ',' + ObjdeviceId[i];
        }
        let start = that.state.start //开始日期
        let end = that.state.end; //结束日期

        //查询数据
        HttpService.apiPost(api.zdxl_getData, {
            userId: userId,
            deviceIds: strdeviceId,
            start: start,
            end: end,
        }).then((res:any) => {
            // console.log(res, '返回最大需量数据')
            if (res.flag == "00") {
                let listData = res.data;
                //定义图表数据
                let queryData = [];

                //校验数据是否为空
                if (listData.length > 0) {
                    //循环数据
                    for (let i = 0; i < listData.length; i++) {
                        let objData = listData[i];
                        queryData.push(objData);
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
            <View style={{flex: 1}}>
                <View style={{position: 'absolute',top: 0,width: "100%",height: "100%",backgroundColor: '#fff'}}>
                </View>
                <SafeAreaView style={{flex: 1}}>
                    {/* 引入自定义导航栏 */}
                    <Navbar 
                        pageName={'最大需量'}
                        showBack={true}
                        showHome={false}
                        isCheck={3}
                        LoginStatus={this.state.LoginStatus}
                        props={this.props}
                        handleSelect={this.handleSelect}>
                    </Navbar>
                    {/* 内容区 */}
                    <View style={styleg.container}>
                        <View style={styles.query_head}>
                            <View style={styles.flex}>
                                <Picker
                                    pickerType={1}
                                    date={this.state.start}
                                    precisionType={2}
                                    click={this.clickStart}
                                ></Picker>
                            </View>
                            <Text style={styles.text}>
                                至
                            </Text>
                            <View style={styles.flex}>
                                <Picker
                                    pickerType={1}
                                    date={this.state.end}
                                    precisionType={2}
                                    click={this.clickEnd}
                                ></Picker>
                            </View>
                            <Text style={styles.button} onPress={this.clickSearch}>查询</Text>
                        </View>
                        
                        <ScrollView style={styles.echarts_con}>
                            {this.state.optionData.length == 0?
                                <Text style={styles.empty}>暂无数据</Text>:
                                <View style={styles.item}>
                                    <Text style={styles.name}>
                                        最大需量数据统计
                                        <View style={styles.down}>
                                        </View>
                                    </Text>
                                    <View style={styles.table}>
                                        {this.state.optionData.map((top_item: any,top_index: number)=>{
                                            return(
                                                <View key={top_index}>
                                                {/* // 标题 1行 */}
                                                <View style={[styles.cell,top_index == 0?styles.cellLinTo : null]}>
                                                    <Text style={styles.title}>
                                                        {top_item.deviceName}
                                                    </Text>
                                                </View>
                                                {/* //  数值，时间标题 2行 */}
                                                <View style={styles.cell}>
                                                    <View style={styles.label}></View>
                                                    <View style={styles.cellflex}>
                                                        <View style={styles.cellCen}>
                                                            <Text style={styles.value}>数值</Text>
                                                        </View>
                                                    </View>
                                                    <View style={styles.cellflex}>
                                                        <View style={styles.cellCen}>
                                                            <Text style={styles.value}>时间</Text>
                                                        </View>
                                                    </View>
                                                </View>
                                                {/* // 循环行 */}
                                                {top_item.dataList.map((top_item2:any,top_index2:number)=>{
                                                    return(
                                                        <View key={top_index2}>
                                                            <View style={styles.cell}>
                                                                <View style={styles.label}>
                                                                    <View style={styles.cellCen}>
                                                                        <Text style={styles.value}>{top_item2.month+'月'}</Text>
                                                                    </View>
                                                                </View>
                                                                <View style={styles.cellflex}>
                                                                    <View style={styles.cellCen}>
                                                                        <Text style={styles.value}>{top_item2.val}</Text>
                                                                    </View>
                                                                </View>
                                                                <View style={styles.cellflex}>
                                                                    <View style={styles.cellCen}>
                                                                        <Text style={styles.value}>{top_item2.date}</Text>
                                                                    </View>
                                                                </View>
                                                            </View>
                                                        </View>
                                                    )
                                                })}
                                                </View>
                                            )
                                        })}
                                    </View>
                                </View>
                            }
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
        borderWidth: 1,
        borderColor: '#d9d9d9',
        borderStyle: 'solid',
        borderRadius: 5,
        marginLeft: 7,
        overflow: 'hidden',
    },
    flex:{
        flex: 1,
    },
    text:{
        position: 'relative',
        height: 30,
        lineHeight: 30,
        textAlignVertical: 'center',
        paddingRight: 5,
        fontSize: Fs/20,
        color: '#666666',
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
        overflow: 'hidden',
    },
    name:{
        position: 'relative',
        width: '100%',
        height: 40,
        lineHeight: 35,
        fontSize: Fs/18,
        paddingLeft: 10,
        paddingRight: 10,
        borderBottomWidth:1,
        borderStyle:'solid',
        borderBottomColor:'#E5E5E5',
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
    img:{
        width: 15,
        height: 15,
        verticalAlign: 'middle',
    },
    table:{
        position: 'relative',
        width: '100%',
        padding: 10,
        overflow: 'hidden',
    },
    cell:{
        position: 'relative',
        width: '100%',
        display: 'flex',
        flexDirection:'row',
        borderStyle: 'solid',
        borderLeftWidth: 1,
        borderLeftColor: '#f2f2f2',
        borderRightWidth: 1,
        borderRightColor: '#f2f2f2',
        borderBottomWidth: 1,
        borderBottomColor: '#f2f2f2',
        overflow: 'hidden',
    },
    cellLinTo:{
        borderStyle: 'solid',
        borderTopColor: '#f2f2f2',
        borderTopWidth: 1,
    },
    title:{
        position: 'relative',
        width: '100%',
        height: 40,
        lineHeight: 40,
        fontSize: Fs/18,
        color: '#333',
        textAlign: 'center',
        overflow: 'hidden',
    },
    cellflex:{
        position: 'relative',
        width: 0,
        flex: 1,
        borderStyle:'solid',
        borderLeftWidth: 1,
        borderLeftColor: '#f2f2f2',
        paddingBottom: 7,
        paddingTop: 7,
        paddingLeft: 3,
        paddingRight:3,
        overflow: 'hidden',
    },
    label:{
        position: 'relative',
        width: 50,
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: Fs/22,
    },
    value:{
        position: 'relative',
        width: '100%',
        fontSize: Fs/22,
        color: '#333',
        textAlign: 'center',
        overflow: 'hidden',
    },
    cellCen:{
        position: 'relative',
        width: '100%',
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: Fs/22,
        overflow: 'hidden',
    },
    empty:{
        position: 'relative',
        width: '100%',
        paddingTop: 25,
        paddingBottom: 25,
        textAlign: 'center',
        fontSize: Fs/18,
        color: '#999999',
        overflow: 'hidden',
    },
})

export default PowerAnalysis7
