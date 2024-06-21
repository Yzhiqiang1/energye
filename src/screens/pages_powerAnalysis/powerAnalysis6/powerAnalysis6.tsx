import { Dimensions, Image, Pressable, SafeAreaView, ScrollView, StyleSheet, Text, View } from 'react-native'
import React, { Component } from 'react'
import Navbar from '../../../component/navbar/navbar'
import styleg from '../../../indexCss'
import util, { plusReduceData } from '../../../utils/util'
import { Register } from '../../../utils/app'
import store from '../../../redux/store'
import { HttpService } from '../../../utils/http'
import Loading from '../../../component/Loading/Loading'
import Picker from '../../../component/Picker/Picker'
import PickerBut from '../../../component/PickerBut/PickerBut'
const api = require('../../../utils/api')
const Fs = Dimensions.get('window').width*0.8

export class PowerAnalysis6 extends Component<any,any> {
    constructor(props:any){
        super(props)
        this.state = {
            LoginStatus: 1, //登录状态,默认未登录

            start: plusReduceData(util.nowDate(), 1, 5), //查询日期
            end: util.nowDate(), //结束日期
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
                LoadingMsg: '您还未登录,无法查询数据!'
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
        //定义图表数据
        let queryData = [];
        //查询数据
        HttpService.apiPost(api.jfpg_getData, {
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
                        queryData.push(objData);
                    }
                    console.log(queryData, "jianfengpinggu");
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
                        pageName={'尖峰平谷'}
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
                            <View style={styles.flex1}>
                                {/* <Picker
                                    pickerType={1}
                                    date={this.state.start}
                                    precisionType={1}
                                    click={this.clickStart}
                                ></Picker> */}
                                <Pressable style={styleg.button} onPress={()=>this.setState({open: true,typePk: 1})}>
                                    <Text allowFontScaling={false} style={styleg.TextButton}>{this.state.start}</Text>
                                    <Image style={styleg.ico} source={require('../../../image/down.png')}></Image>
                                </Pressable>
                            </View>
                            <Text allowFontScaling={false} style={styles.text}>
                                至
                            </Text>
                            <View style={styles.flex1}>
                                {/* <Picker
                                    pickerType={1}
                                    date={this.state.end}
                                    precisionType={1}
                                    click={this.clickEnd}
                                ></Picker> */}
                                <Pressable style={styleg.button} onPress={()=>this.setState({open: true,typePk: 2})}>
                                    <Text allowFontScaling={false} style={styleg.TextButton}>{this.state.end}</Text>
                                    <Image style={styleg.ico} source={require('../../../image/down.png')}></Image>
                                </Pressable>
                            </View>
                            <Text allowFontScaling={false} style={styles.button} onPress={this.clickSearch}>查询</Text>
                        </View>
                        
                        <View style={styles.echarts_con}>
                            {this.state.optionData.length == 0?
                                <Text allowFontScaling={false} style={styles.empty}>暂无数据</Text>:
                                <ScrollView style={styles.item}>
                                    <View style={styles.name}>
                                        <Text allowFontScaling={false} style={styles.nameText}>尖峰平谷数据统计</Text>
                                    </View>
                                    <View style={styles.table}>
                                        {this.state.optionData.map((item:any,index:number)=>{
                                            return(
                                                
                                                <View key={index}>
                                                    <View style={[styles.cell,index == 0?styles.cellLinTo:null]} >
                                                        <Text allowFontScaling={false} style={styles.title}>
                                                            {item.name}
                                                        </Text>
                                                    </View>

                                                    <View style={styles.cell}>
                                                        <View style={styles.label}></View>
                                                        <View style={styles.flex}>
                                                            <View style={styles.cellCen}>
                                                                <Text allowFontScaling={false} style={styles.value}>尖</Text>
                                                            </View>
                                                        </View>
                                                        <View style={styles.flex}>
                                                            <View style={styles.cellCen}>
                                                                <Text allowFontScaling={false} style={styles.value}>峰</Text>
                                                            </View>
                                                        </View>
                                                        <View style={styles.flex}>
                                                            <View style={styles.cellCen}>
                                                                <Text allowFontScaling={false} style={styles.value}>平</Text>
                                                            </View>
                                                        </View>
                                                        <View style={styles.flex}>
                                                            <View style={styles.cellCen}>
                                                                <Text allowFontScaling={false} style={styles.value}>谷</Text>
                                                            </View>
                                                        </View>
                                                    </View>

                                                    <View style={styles.cell}>
                                                        <View style={styles.label}>
                                                            <View style={styles.cellCen}>
                                                                <Text allowFontScaling={false} style={styles.value}>电量</Text>
                                                            </View>
                                                        </View>
                                                        <View style={styles.flex}>
                                                            <View style={styles.cellCen}>
                                                                <Text allowFontScaling={false} style={styles.value}>{item.sharp}</Text>
                                                            </View>
                                                        </View>
                                                        <View style={styles.flex}>
                                                            <View style={styles.cellCen}>
                                                                <Text allowFontScaling={false} style={styles.value}>{item.peak}</Text>
                                                            </View>
                                                        </View>
                                                        <View style={styles.flex}>
                                                            <View style={styles.cellCen}>
                                                                <Text allowFontScaling={false} style={styles.value}>{item.flat}</Text>
                                                            </View>
                                                        </View>
                                                        <View style={styles.flex}>
                                                            <View style={styles.cellCen}>
                                                                <Text allowFontScaling={false} style={styles.value}>{item.valley}</Text>
                                                            </View>
                                                        </View>
                                                    </View>

                                                    <View style={styles.cell}>
                                                    
                                                        <View style={styles.label}>
                                                            <View style={styles.cellCen}>
                                                                <Text allowFontScaling={false} style={styles.value}>单价</Text>
                                                            </View>
                                                        </View>
                                                        <View style={styles.flex}>
                                                            <View style={styles.cellCen}>
                                                                <Text allowFontScaling={false} style={styles.value}>{item.sharpDJ}</Text>
                                                            </View>
                                                        </View>
                                                        <View style={styles.flex}>
                                                            <View style={styles.cellCen}>
                                                                <Text allowFontScaling={false} style={styles.value}>{item.peakDJ}</Text>
                                                            </View>
                                                        </View>
                                                        <View style={styles.flex}>
                                                            <View style={styles.cellCen}>
                                                                <Text allowFontScaling={false} style={styles.value}>{item.flatDJ}</Text>
                                                            </View>
                                                        </View>
                                                        <View style={styles.flex}>
                                                            <View style={styles.cellCen}>
                                                                <Text allowFontScaling={false} style={styles.value}>{item.valleyDJ}</Text>
                                                            </View>
                                                        </View>
                                                    </View>

                                                    <View style={styles.cell}>
                                                        <View style={styles.label}>
                                                            <View style={styles.cellCen}>
                                                                <Text allowFontScaling={false} style={styles.value}>金额</Text>
                                                            </View>
                                                        </View>
                                                        <View style={styles.flex}>
                                                            <View style={styles.cellCen}>
                                                                <Text allowFontScaling={false} style={styles.value}>{item.sharpJE}</Text>
                                                            </View>
                                                        </View>
                                                        <View style={styles.flex}>
                                                            <View style={styles.cellCen}>
                                                                <Text allowFontScaling={false} style={styles.value}>{item.peakJE}</Text>
                                                            </View>
                                                        </View>
                                                        <View style={styles.flex}>
                                                            <View style={styles.cellCen}>
                                                                <Text allowFontScaling={false} style={styles.value}>{item.flatJE}</Text>
                                                            </View>
                                                        </View>
                                                        <View style={styles.flex}>
                                                            <View style={styles.cellCen}>
                                                                <Text allowFontScaling={false} style={styles.value}>{item.valleyJE}</Text>
                                                            </View>
                                                        </View>
                                                    </View>

                                                    <View style={styles.cell}>
                                                        <View style={styles.label}>
                                                            <View style={styles.cellCen}>
                                                                <Text allowFontScaling={false} style={styles.value}>合计</Text>
                                                            </View>
                                                        </View>
                                                        <View style={styles.flex}>
                                                            <View style={styles.cellCen}>
                                                            <Text allowFontScaling={false} style={styles.value}>电量:{item.DL}  金额:{item.ZJE}</Text>
                                                            </View>
                                                        </View>
                                                    </View>
                                                </View>
                                            )
                                        })}
                                    </View>
                                </ScrollView>
                            }
                        </View>
                    </View>
                    {/* 日期选择 */}
                    {this.state.open ? 
                        this.state.typePk==1?
                            <PickerBut
                                pickerType={1}
                                date={this.state.start}
                                precisionType={1}
                                click={this.clickStart}
                                cancel={()=>this.setState({open: false})}
                            ></PickerBut>:
                            <PickerBut
                                pickerType={1}
                                date={this.state.end}
                                precisionType={1}
                                click={this.clickEnd}
                                cancel={()=>this.setState({open: false})}
                            ></PickerBut>
                    :''}
                </SafeAreaView>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    ico:{
        position: 'absolute',
        top: 7,
        right: 5,
        width: 15,
        height: 15,
        overflow: 'hidden',
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
    flex1: {
        flex: 1, 
    },
    flex:{
        position: 'relative',
        width: 0,
        flex: 1,
        borderStyle:'solid',
        borderLeftColor: '#f2f2f2',
        borderLeftWidth: 1,
        paddingBottom: 7,
        paddingTop: 7,
        paddingRight: 3,
        paddingLeft: 3,
        overflow: 'hidden',
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
        fontSize: Fs/22,
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
        fontSize: Fs/22,
        color: '#999999',
        overflow: 'hidden',
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
    text:{
        position: 'relative',
        height: 30,
        lineHeight: 30,
        textAlignVertical: 'center',
        paddingRight: 5,
        fontSize: Fs/24,
        color: '#666666',
        overflow: 'hidden',
    },
    cell:{
        position: 'relative',
        width: '100%',
        display: 'flex',
        flexDirection:'row',
        borderLeftWidth:1,
        borderRightWidth:1,
        borderBottomWidth:1,
        borderLeftColor: '#f2f2f2',
        borderRightColor: '#f2f2f2',
        borderBottomColor: '#f2f2f2',
        borderStyle: 'solid',
        overflow: 'hidden',
    },
    cellLinTo:{
        borderTopColor: '#f2f2f2',
        borderTopWidth: 1,
        borderStyle:'solid'
    },
    title:{
        position: 'relative',
        width: '100%',
        height: 40,
        lineHeight: 40,
        fontSize: Fs/22,
        color: '#333',
        textAlign: 'center',
        overflow: 'hidden',
    },
    label:{
        position: 'relative',
        width: 50,
        overflow: 'hidden'
    },
    cellCen:{
        position: 'relative',
        width: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: Fs/24,
        overflow: 'hidden',
    },
    value:{
        position: 'relative',
        width: '100%',
        fontSize: Fs/24,
        color: '#333',
        textAlign: 'center',
        overflow: 'hidden',
    },
})
export default PowerAnalysis6