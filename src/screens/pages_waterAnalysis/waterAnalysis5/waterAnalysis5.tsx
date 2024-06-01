import { Dimensions, SafeAreaView, StyleSheet, Text, View } from 'react-native'
import React, { Component } from 'react'
import Navbar from '../../../component/navbar/navbar'
import styleg from '../../../indexCss'
import util from '../../../utils/util'
import { Register } from '../../../utils/app'
import store from '../../../redux/store'
import { HttpService } from '../../../utils/http'
import tool from '../../../utils/tool'
import Loading from '../../../component/Loading/Loading'
import Picker from '../../../component/Picker/Picker'
const api = require('../../../utils/api')
const Fs = Dimensions.get('window').width*0.8

export class WaterAnalysis5 extends Component<any,any> {
    _s = util.oneData(3) < 10 ? '0' + util.oneData(3) : util.oneData(3);
    _f = util.oneData(2) < 10 ? '0' + util.oneData(2) : util.oneData(2);
    constructor(props:any){
        super(props)
        this.state={
            LoginStatus: 1, //登录状态,默认未登录

            //开始时间弹出层
            startShow: false,
            start: util.nowDate() + " 00:00", //开始时间
            startDate: new Date(util.oneData(), util.oneData(5), util.oneData(4)).getTime(), //时间戳
    
            //结束时间弹出层
            endShow: false,
            end: util.nowDate() + ' ' + this._s + ':' + this._f, //结束日期
            endDate: new Date(util.oneData(), util.oneData(5), util.oneData(4), util.oneData(3), util.oneData(2)).getTime(), //时间戳
            //数据项
            optionData: [],

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
    //开始日期时间

    startConfirm=(e:any)=>{
        this.setState({
            start: e
        })
    }
    //结束日期时间
    endConfirm=(e:any)=>{
        this.setState({
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
                LoadingMsg: '开始日期不能大于结束日期！'
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
        //用户ID
        let userId = store.getState().userReducer.userId;
        //查询设备ID
        let ObjdeviceId = store.getState().userReducer.parameterGroup.multiGroup.selectKey;
        let strdeviceId = "";
        for (let i in ObjdeviceId) {
            strdeviceId += strdeviceId == "" ? ObjdeviceId[i] : ',' + ObjdeviceId[i];
        }
        let start = that.state.start + ':00' //开始日期
        let end = that.state.end + ':00'; //结束日期
        //定义数据
        let queryData = [];
        //查询数据
        HttpService.apiPost(api.snjc_water_getData, {
            userId: userId,
            deviceIds: strdeviceId,
            start: start,
            end: end,
        }).then((res:any) => {
            if (res.flag == "00") {
                let listData = res.data;
                //校验数据是否为空
                if (listData.length > 0) {
                    //循环数据
                    for (let i = 0; i < listData.length; i++) {
                        let objData = listData[i]; //传感器数据
                        objData.id = tool.randomNum(8);
                        queryData.push(objData);
                    }
                    that.setState({
                        optionData: queryData,
                    }, () => {
                        //关闭加载效果
                        this.setState({
                            visible: false,
                        });
                    })
                } else {
                    that.setState({
                        optionData: [],
                    }, () => {
                        //关闭加载效果
                        this.setState({
                            visible: false,
                        });
                    })
                }
            } else {
                //关闭加载效果
                this.setState({
                    visible: false,
                });
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
            });
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
                        pageName={'水能集抄'}
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
                                    precisionType={5}
                                    click={this.startConfirm}
                                ></Picker>
                            </View>
                            <Text style={styles.text}>
                                至
                            </Text>
                            <View style={styles.flex}>
                                <Picker
                                    pickerType={1}
                                    date={this.state.end}
                                    precisionType={5}
                                    click={this.endConfirm}
                                ></Picker>
                            </View>
                            <Text style={styles.button} onPress={this.clickSearch}>查询</Text>
                        </View>
                        
                        <View style={styles.echarts_con}>
                            {this.state.optionData.length == 0?
                                <Text style={styles.empty}>暂无数据</Text>:
                                <View style={styles.item}>
                                    <Text style={styles.name}>
                                        <Text style={styles.nameText}>电能集抄统计数据</Text>
                                    </Text>
                                    <View style={styles.table}>
                                        <View style={styles.row}>
                                            <Text style={styles.th}>回柜名称</Text>
                                            <Text style={styles.th}>起始数据</Text>
                                            <Text style={styles.th}>截止数据</Text>
                                            <Text style={styles.th}>差值</Text>
                                        </View>
                                        {this.state.optionData.map((item:any,index:number)=>{
                                            return(
                                                <View key={index} style={[styles.row,index%2 == 0? styles.b1 : null]}>
                                                    <Text style={[styles.td,styles.c1]}>{item.deviceName}</Text>
                                                    <Text style={styles.td}>{item.startVal}</Text>
                                                    <Text style={styles.td}>{item.endVal}</Text>
                                                    <Text style={styles.td}>{item.cha}</Text>
                                                </View>
                                            )
                                        })}
                                    </View>
                                </View>
                            }
                        </View>
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
    tab:{
        position: 'relative',
        width: 120,
        height:30,
        paddingLeft:10,
        paddingRight:10,
        display: 'flex',
        flexDirection:'row',
        alignItems: 'center',
        overflow: 'hidden',
        borderStyle:'solid',
        borderColor:'#d9d9d9',
        borderWidth:1,
        borderRadius: 5,
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
        fontSize: Fs/18,
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
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: '100%',
        borderColor: '#E5E5E5',
        borderBottomWidth: 1,
        borderStyle: 'solid',
        overflow: 'hidden',
        paddingRight: 10,
        paddingLeft: 15
    },
    nameText:{
        height: 40,
        lineHeight: 40,
        textAlignVertical: 'center',
        fontSize: Fs/18,
        textAlign: 'center',
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
        fontSize: Fs/18,
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
        fontSize: Fs/18,
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
        fontSize: Fs/20,
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
    text:{
        position: 'relative',
        height: 30,
        lineHeight: 30,
        textAlignVertical: 'center',
        paddingRight: 5,
        fontSize: Fs/20,
        color: '#666666',
        overflow: 'hidden',
    }
})

export default WaterAnalysis5