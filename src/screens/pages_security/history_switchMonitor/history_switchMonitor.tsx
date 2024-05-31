import { Dimensions, PixelRatio, SafeAreaView, ScrollView, ScrollViewBase, StyleSheet, Text, View } from 'react-native'
import React, { Component } from 'react'
import styleg from '../../../indexCss'
import MyCanvas from '../../../component/my-canvas/MyCanvas'
import util, { plusReduceData } from '../../../utils/util'
import store from '../../../redux/store'
import { HttpService } from '../../../utils/http'
import Loading from '../../../component/Loading/Loading'
import Navbars from '../../../component/Navbars/Navbars'
import Picker from '../../../component/Picker/Picker'
const api = require('../../../utils/api')
const Fs = Dimensions.get('window').width*PixelRatio.getFontScale()

export class History_switchMonitor extends Component<any,any> {
    constructor(props:any){
        super(props)
        this.state={
            start: plusReduceData(util.nowDate(), 1, 5), //查询日期
            end: util.nowDate(), //结束日期
            //数据项
            optionData: [],
            sids: '',

            msgType: 1,
            visible: false,
            LoadingMsg: ''
        }
    }
    componentDidMount(): void {
        let sids = this.props.route.params.sids ? this.props.route.params.sids : "获取参数失败";
        console.log(sids,'sids');
        this.setState({
            sids: sids
        }, () => {
            this.getHistory();
        })
    }
    /************************************
     *     校验登录通过
     * *****************************/
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
            that.getHistory();
        }
    }
    //获取逐日极值数据
    getHistory=()=>{
        let that = this;
        let userId = store.getState().userReducer.userId; //用户ID
        let start = that.state.start //开始日期
        let end = that.state.end; //结束日期
        let sids = that.state.sids; //获取传感器数据
        let sidn:any = {};
        let sensorId = sids.map((item: { id: string | number; name: any }, index: any) => {
            sidn[item.id] = item.name;
            return item.id;
        });

        //定义图表数据
        let queryData = [];
        this.setState({
            msgType: 1,
            visible: true,
            LoadingMsg: '加载中...'
        }); //加载效果
        HttpService.apiPost(api.kgjc_getHistory, {
            userId: userId,
            sensorId: sensorId.join(','),
            start: start,
            end: end
        }).then((res:any) => {
            if (res.code === 200) {
                let listData = JSON.parse(res.msg);
                console.log(listData, 78787);
                if (listData.length > 0) { //有数据
                    for (let i = 0; i < listData.length; i++) {
                        let objData = listData[i]
                        queryData.push({
                            state: true,
                            title: sidn[objData.sensorId] ? sidn[objData.sensorId] : '',
                            xAxisData: objData.times,
                            series: [{
                                type: 'line',
                                data: objData.values
                            }]
                        });
                    }
                    //更新数据
                    that.setState({
                        optionData: queryData,
                    }, () => {
                        //关闭加载效果
                        this.setState({
                            visible: false,
                        })
                    })
                } else { //数据为空
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
        })
    }
    render() {
        return (
            <SafeAreaView style={{flex: 1}}>
                <Navbars
                name={'历史记录'}
                showBack={true}
                showHome={false}
                props={this.props}
                ></Navbars>
                {/* 内容区 */}
                <View style={styleg.container10}>
                    <View style={styles.query_head}>
                        <View style={styles.flex}>
                            <Picker
                                pickerType={1}
                                date={this.state.start}
                                precisionType={1}
                                click={this.clickStart}
                            >
                            </Picker>
                        </View>
                        <Text style={styles.text}>
                            至
                        </Text>
                        <View style={styles.flex}>
                            <Picker
                                pickerType={1}
                                date={this.state.end}
                                precisionType={1}
                                click={this.clickEnd}
                            >
                            </Picker>
                        </View>
                        <Text style={styles.button} onPress={this.clickSearch}>查询</Text>
                    </View>
                    
                    <ScrollView style={styles.echartsCon}>
                        {this.state.optionData.length == 0?
                            <Text style={styles.empty}>暂无数据</Text>:''
                        }
                        {this.state.optionData.map((item:any,index:number)=>{
                            return(
                                item.state == true?
                                <View style={styles.item} key={index}>
                                    <Text style={styles.name}>
                                        {item.name}
                                    </Text>
                                    <View style={styles.echarts}>
                                        <MyCanvas objData={item}></MyCanvas>
                                    </View>
                                </View>:''
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
        width: 'auto',
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
        right: 5,
        width: 15,
        height: 15,
        overflow: 'hidden',
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

export default History_switchMonitor