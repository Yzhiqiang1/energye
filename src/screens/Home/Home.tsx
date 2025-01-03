import { Text, View, Dimensions, Image, ScrollView, Pressable, SafeAreaView, StyleSheet} from 'react-native'
import React, { Component } from 'react'
import Navbar from '../../component/navbar/navbar'
import { Register } from '../../utils/app'
import * as Icons from '../../assets/component/index';
import styleg from '../../indexCss';
const Fs = Dimensions.get('window').width*0.8//屏幕宽比 

export class Index extends Component<any,any> {
    
    constructor(props: any){
        super(props)
        this.state = {
            LoginStatus: 1,//登录状态
            objType:1,
            boxHeight: 0,
            visible: false,
        } 
    }
    componentDidMount(){
        // 验证登录
        Register.userSignIn(false).then(res => {      
            //校验登录成功后执行
            if (res == true) {
                //向自定义导航传递登录状态
                this.setState({
                    LoginStatus: 2
                })
            } else {
                //向自定义导航传递登录状态
                this.setState({
                    LoginStatus: 1
                })
            }
        })
    }
    boxH=(e:any)=>{
        const { height: newHeight } = e.nativeEvent.layout;
        this.setState({
            boxHeight: newHeight
        })
    }
    policy=(e: any)=>{
        this.setState({
            visible: false
        })
    }
    render() {
        return (
            <View style={{flex: 1}}>
                {/* <View style={{position: 'absolute',top: 0,width: "100%",height: "100%",backgroundColor: '#fff'}}>
                </View> */}
                <SafeAreaView 
                    style={{flex: 1}}
                    onLayout={(event) => this.boxH(event)}>
                    {/* 引入自定义导航栏 */}
                    <Navbar 
                        showBack={false} 
                        showHome={false}
                        pageName={'首页'}
                        LoginStatus={this.state.LoginStatus}  
                        props={this.props}
                    ></Navbar>
                    {/* 内容 */}
                    <ScrollView style={styles.containerMini}>
                        <View style={styles.indexMini}>
                            {/* 设备概括 */}
                            <View style={styles.indexUl}>
                                <View style={styles.back}>
                                    <Text allowFontScaling={false} style={styles.title}>
                                        设备概况
                                    </Text>
                                    <View style={[styles.con,{marginBottom: 10,marginTop: 10}]}>
                                        <View style={[styles.row,styles.row25]}>
                                            <Pressable style={({ pressed }) => [{backgroundColor: pressed ? '#ededed': '#fff'},styles.BR20]} 
                                                onPress={()=>this.props.navigation.navigate('PowerTest1')}>
                                                <View style={styles.box}>
                                                    <Icons.EnerRoughly style={styleg.svgCss2}/>
                                                    <Text allowFontScaling={false} style={styles.size22}>用能概况</Text>
                                                </View>
                                            </Pressable>
                                        </View>
                                        <View style={[styles.row,styles.row25]}>
                                            <Pressable style={({ pressed }) => [{backgroundColor: pressed ? '#ededed': '#fff'},styles.BR20]} 
                                                onPress={()=>this.props.navigation.navigate('PowerTest1')}>
                                                <View style={styles.box}>
                                                    <Icons.Scan style={styleg.svgCss2}/>
                                                    <Text allowFontScaling={false} style={styles.size22}>创建设备</Text>
                                                </View>
                                            </Pressable>
                                        </View>
                                        {/* <View style={[styles.listTop,styles.row48]}>
                                            <Pressable style={({ pressed }) => [{backgroundColor: pressed ? '#b5e3fd': '#76cffb'},styles.overview]}
                                                onPress={()=>this.props.navigation.navigate('Survey')}>
                                                <Text allowFontScaling={false} style={styles.size19}>用能概况</Text>
                                                <Image style={{width: 40}} resizeMode='contain' source={require('../../image/overview_1.png')} />
                                            </Pressable>
                                        </View>
                                        <View style={[styles.listTop,styles.row48]}>
                                            <Pressable style={({ pressed }) => [{backgroundColor: pressed ? '#abc7fb': '#588ff6'},styles.overview]}
                                                onPress={()=>this.props.navigation.navigate('Scanqr')}>
                                                <Text allowFontScaling={false} style={styles.size19}>创建设备</Text>
                                                <Image style={{width: 40}} resizeMode='contain' source={require('../../image/scanqr.png')} />
                                            </Pressable>
                                        </View> */}
                                    </View>
                                </View>
                            </View>
                            {/* 电力测试 */}
                            <View style={styles.indexUl}>
                                <View style={styles.back}>
                                    <Text allowFontScaling={false} style={styles.title}>
                                        电力测试
                                    </Text>
                                    <View style={[styles.con,styles.bac]}>
                                        <View style={[styles.list,styles.item]}>
                                            <View style={[styles.row,styles.row25]}>
                                                <Pressable style={({ pressed }) => [{backgroundColor: pressed ? '#ededed': '#fff'},styles.BR20]} 
                                                    onPress={()=>this.props.navigation.navigate('PowerTest1')}>
                                                    <View style={styles.box}>
                                                        <Icons.ElectricPowerDaily style={styleg.svgCss1}/>
                                                        <Text allowFontScaling={false} style={styles.size22}>日原数据</Text>
                                                    </View>
                                                </Pressable>
                                            </View>
                                            <View style={[styles.row,styles.row25]}>
                                                <Pressable style={({ pressed }) => [{backgroundColor: pressed ? '#ededed': '#fff'},styles.BR20]} 
                                                    onPress={()=>this.props.navigation.navigate('PowerTest2')}>
                                                    <View style={styles.box}>
                                                        <Icons.DailyExtremes style={styleg.svgCss1} />
                                                        <Text allowFontScaling={false} style={styles.size22}>逐日极值</Text>
                                                    </View>
                                                </Pressable>
                                            </View>
                                            <View style={[styles.row,styles.row25]}>
                                                <Pressable style={({ pressed }) => [{backgroundColor: pressed ? '#ededed': '#fff'},styles.BR20]} 
                                                    onPress={()=>this.props.navigation.navigate('PowerTest3')}>
                                                    <View style={styles.box}>
                                                        <Icons.ElectricityChart style={styleg.svgCss1}/>
                                                        <Text allowFontScaling={false} style={styles.size22}>电力报表</Text>
                                                    </View>
                                                </Pressable>
                                            </View>
                                            <View style={[styles.row,styles.row25]}>
                                                <Pressable style={({ pressed }) => [{backgroundColor: pressed ? '#ededed': '#fff'},styles.BR20]} 
                                                    onPress={()=>this.props.navigation.navigate('PowerTest4')}>
                                                    <View style={styles.box}>
                                                        <Icons.ExtremeValueReport style={styleg.svgCss1}/>
                                                        <Text allowFontScaling={false} style={styles.size22}>极值报表</Text>
                                                    </View>
                                                </Pressable>
                                            </View>
                                        </View>
                                        <View style={[styles.list,styles.item]}>
                                            <View style={[styles.row,styles.row25]}>
                                                <Pressable style={({ pressed }) => [{backgroundColor: pressed ? '#ededed': '#fff'},styles.BR20]} 
                                                    onPress={()=>this.props.navigation.navigate('PowerTest5')}>
                                                        <View style={styles.box}>
                                                            <Icons.PowerFactor style={styleg.svgCss1} />
                                                            <Text allowFontScaling={false} style={styles.size22}>功率因数</Text>
                                                        </View>
                                                </Pressable>
                                            </View>
                                            <View style={[styles.row,styles.row25]}>
                                                <Pressable style={({ pressed }) => [{backgroundColor: pressed ? '#ededed': '#fff'},styles.BR20]} 
                                                    onPress={()=>this.props.navigation.navigate('PowerTest6')}>
                                                        <View style={styles.box}>
                                                            <Icons.ElectricPowerDaily style={styleg.svgCss1} />
                                                            <Text allowFontScaling={false} style={styles.size22}>电力日报</Text>
                                                        </View>
                                                </Pressable>
                                            </View>
                                            <View style={[styles.row,styles.row25]}>
                                                <Pressable style={({ pressed }) => [{backgroundColor: pressed ? '#ededed': '#fff'},styles.BR20]} 
                                                    onPress={()=>this.props.navigation.navigate('PowerTest7')}>
                                                        <View style={styles.box}>
                                                            <Icons.HarmonicMonitoring style={styleg.svgCss1} />
                                                            <Text allowFontScaling={false} style={styles.size22}>谐波检测</Text>
                                                        </View>
                                                </Pressable>
                                            </View>
                                        </View>
                                    </View> 
                                </View>
                            </View>
                            {/* 用电分析 */}
                            <View style={styles.indexUl}>
                                <View style={styles.back}>
                                    <Text allowFontScaling={false} style={styles.title}>
                                        用电分析
                                    </Text>
                                    <View style={[styles.con,styles.bac]}>
                                        <View style={[styles.list,styles.item]}>
                                            <View style={[styles.row,styles.row25]}>
                                                <Pressable style={({ pressed }) => [{backgroundColor: pressed ? '#ededed': '#fff'},styles.BR20]} 
                                                    onPress={()=>this.props.navigation.navigate('powerAnalysis1')}>
                                                        <View style={styles.box}>
                                                            <Icons.EnergyChart style={styleg.svgCss} />
                                                            <Text allowFontScaling={false} style={styles.size22}>用能报表</Text>
                                                        </View>
                                                </Pressable>
                                            </View>
                                            <View style={[styles.row,styles.row25]}>
                                                <Pressable style={({ pressed }) => [{backgroundColor: pressed ? '#ededed': '#fff'},styles.BR20]} 
                                                    onPress={()=>this.props.navigation.navigate('powerAnalysis2')}>
                                                        <View style={styles.box}>
                                                            <Icons.YearOnYearAnalysis style={styleg.svgCss} />
                                                            <Text allowFontScaling={false} style={styles.size22}>同比分析</Text>
                                                        </View>
                                                </Pressable>
                                            </View>
                                            <View style={[styles.row,styles.row25]}>
                                                <Pressable style={({ pressed }) => [{backgroundColor: pressed ? '#ededed': '#fff'},styles.BR20]} 
                                                    onPress={()=>this.props.navigation.navigate('powerAnalysis3')}>
                                                        <View style={styles.box}>
                                                        <Icons.Qoq style={styleg.svgCss} />
                                                        <Text allowFontScaling={false} style={styles.size22}>环比分析</Text>
                                                    </View>
                                                </Pressable>
                                            </View>
                                            <View style={[styles.row,styles.row25]}>
                                                <Pressable style={({ pressed }) => [{backgroundColor: pressed ? '#ededed': '#fff'},styles.BR20]} 
                                                    onPress={()=>this.props.navigation.navigate('powerAnalysis4')}>
                                                    <View style={styles.box}>
                                                        <Icons.LossAnalysis style={styleg.svgCss} />
                                                        <Text allowFontScaling={false} style={styles.size22}>损耗分析</Text>
                                                    </View>
                                                </Pressable>
                                            </View>
                                        </View>
                                        <View style={[styles.list,styles.item]}>
                                            <View style={[styles.row,styles.row25]}>
                                            <Pressable style={({ pressed }) => [{backgroundColor: pressed ? '#ededed': '#fff'},styles.BR20]} 
                                                onPress={()=>this.props.navigation.navigate('powerAnalysis5')}>
                                                    <View style={styles.box}>
                                                        <Icons.ElectricEnergyCollection style={styleg.svgCss} />
                                                        <Text allowFontScaling={false} style={styles.size22}>电能集抄</Text>
                                                    </View>
                                                </Pressable>
                                            </View>
                                            <View style={[styles.row,styles.row25]}>
                                                <Pressable style={({ pressed }) => [{backgroundColor: pressed ? '#ededed': '#fff'},styles.BR20]} 
                                                    onPress={()=>this.props.navigation.navigate('powerAnalysis6')}>
                                                    <View style={styles.box}>
                                                        <Icons.SharpPeaksAndValleys style={styleg.svgCss} />
                                                        <Text allowFontScaling={false} style={styles.size22}>尖峰平谷</Text>
                                                    </View>
                                                </Pressable>
                                            </View>

                                            <View style={[styles.row,styles.row25]}>
                                                <Pressable style={({ pressed }) => [{backgroundColor: pressed ? '#ededed': '#fff'},styles.BR20]} 
                                                    onPress={()=>this.props.navigation.navigate('powerAnalysis7')}>
                                                    <View style={styles.box}>
                                                        <Icons.MaxDemand style={styleg.svgCss} />
                                                        <Text allowFontScaling={false} style={styles.size22}>最大需量</Text>
                                                    </View>
                                                </Pressable>
                                            </View>
                                        </View>
                                    </View>
                                </View>
                            </View>
                            {/* 用水分析 */}
                            <View style={styles.indexUl}>
                                <View style={styles.back}>
                                    <Text allowFontScaling={false} style={styles.title}>
                                        用水分析
                                    </Text>
                                    <View style={[styles.con,styles.bac]}>
                                        <View style={[styles.list,styles.item]}>
                                            <View style={[styles.row,styles.row25]}>
                                                <Pressable style={({ pressed }) => [{backgroundColor: pressed ? '#ededed': '#fff'},styles.BR20]} 
                                                    onPress={()=>this.props.navigation.navigate('waterAnalysis1')}>
                                                    <View style={styles.box}>
                                                        <Icons.EnergyChart style={styleg.svgCss} />
                                                        <Text allowFontScaling={false} style={styles.size22}>用水报表</Text>
                                                    </View>
                                                </Pressable>
                                            </View>
                                            <View style={[styles.row,styles.row25]}>
                                                <Pressable style={({ pressed }) => [{backgroundColor: pressed ? '#ededed': '#fff'},styles.BR20]} 
                                                    onPress={()=>this.props.navigation.navigate('waterAnalysis2')}>
                                                    <View style={styles.box}>
                                                        <Icons.YearOnYearAnalysis style={styleg.svgCss} />
                                                        <Text allowFontScaling={false} style={styles.size22}>同比分析</Text>
                                                    </View>
                                                </Pressable>
                                            </View>
                                            <View style={[styles.row,styles.row25]}>
                                                <Pressable style={({ pressed }) => [{backgroundColor: pressed ? '#ededed': '#fff'},styles.BR20]} 
                                                    onPress={()=>this.props.navigation.navigate('waterAnalysis3')}>
                                                    <View style={styles.box}>
                                                        <Icons.Qoq style={styleg.svgCss} />
                                                        <Text allowFontScaling={false} style={styles.size22}>环比分析</Text>
                                                    </View>
                                                </Pressable>
                                            </View>
                                            <View style={[styles.row,styles.row25]}>
                                                <Pressable style={({ pressed }) => [{backgroundColor: pressed ? '#ededed': '#fff'},styles.BR20]} 
                                                    onPress={()=>this.props.navigation.navigate('waterAnalysis4')}>
                                                    <View style={styles.box}>
                                                        <Icons.LossAnalysis style={styleg.svgCss} />
                                                        <Text allowFontScaling={false} style={styles.size22}>损耗分析</Text>
                                                    </View>
                                                </Pressable>
                                            </View>
                                        </View>
                                        <View style={[styles.list,styles.item]}>
                                            <View style={[styles.row,styles.row25]}>
                                                <Pressable style={({ pressed }) => [{backgroundColor: pressed ? '#ededed': '#fff'},styles.BR20]} 
                                                    onPress={()=>this.props.navigation.navigate('waterAnalysis5')}>
                                                    <View style={styles.box}>
                                                        <Icons.ElectricEnergyCollection style={styleg.svgCss} />
                                                        <Text allowFontScaling={false} style={styles.size22}>水能集抄</Text>
                                                    </View>
                                                </Pressable>
                                            </View>
                                            
                                        </View>
                                    </View>
                                </View>
                            </View>
                            {/* 用气分析 */}
                            <View style={styles.indexUl}>
                                <View style={styles.back}>
                                    <Text allowFontScaling={false} style={styles.title}>
                                        用气分析
                                    </Text>
                                    <View style={[styles.con,styles.bac]}>
                                        <View style={[styles.list,styles.item]}>
                                            <View style={[styles.row,styles.row25]}>
                                                <Pressable style={({ pressed }) => [{backgroundColor: pressed ? '#ededed': '#fff'},styles.BR20]} 
                                                    onPress={()=>this.props.navigation.navigate('gasAnalysis1')}>
                                                    <View style={styles.box}>
                                                        <Icons.EnergyChart style={styleg.svgCss} />
                                                        <Text allowFontScaling={false} style={styles.size22}>用气报表</Text>
                                                    </View>
                                                </Pressable>
                                            </View>
                                            <View style={[styles.row,styles.row25]}>
                                                <Pressable style={({ pressed }) => [{backgroundColor: pressed ? '#ededed': '#fff'},styles.BR20]} 
                                                    onPress={()=>this.props.navigation.navigate('gasAnalysis2')}>
                                                    <View style={styles.box}>
                                                        <Icons.YearOnYearAnalysis style={styleg.svgCss} />
                                                        <Text allowFontScaling={false} style={styles.size22}>同比分析</Text>
                                                    </View>
                                                </Pressable>
                                            </View>
                                            <View style={[styles.row,styles.row25]}>
                                                <Pressable style={({ pressed }) => [{backgroundColor: pressed ? '#ededed': '#fff'},styles.BR20]} 
                                                    onPress={()=>this.props.navigation.navigate('gasAnalysis3')}>
                                                    <View style={styles.box}>
                                                        <Icons.Qoq style={styleg.svgCss} />
                                                        <Text allowFontScaling={false} style={styles.size22}>环比分析</Text>
                                                    </View>
                                                </Pressable>
                                            </View>
                                            <View style={[styles.row,styles.row25]}>
                                                <Pressable style={({ pressed }) => [{backgroundColor: pressed ? '#ededed': '#fff'},styles.BR20]} 
                                                    onPress={()=>this.props.navigation.navigate('gasAnalysis4')}>
                                                    <View style={styles.box}>
                                                        <Icons.LossAnalysis style={styleg.svgCss} />
                                                        <Text allowFontScaling={false} style={styles.size22}>损耗分析</Text>
                                                    </View>
                                                </Pressable>
                                            </View>
                                        </View>
                                        <View style={[styles.list,styles.item]}>
                                            <View style={[styles.row,styles.row25]}>
                                                <Pressable style={({ pressed }) => [{backgroundColor: pressed ? '#ededed': '#fff'},styles.BR20]} 
                                                    onPress={()=>this.props.navigation.navigate('gasAnalysis5')}>
                                                    <View style={styles.box}>
                                                        <Icons.ElectricEnergyCollection style={styleg.svgCss} />
                                                        <Text allowFontScaling={false} style={styles.size22}>气能集抄</Text>
                                                    </View>
                                                </Pressable>
                                            </View>
                                        </View>
                                    </View>
                                </View>
                            </View>
                            {/* 安全分析 */}
                            <View style={styles.indexUl}>
                                <View style={styles.back}>
                                    <Text allowFontScaling={false} style={styles.title}>
                                        安全用电
                                    </Text>
                                    <View style={[styles.con,styles.bac]}>
                                        <View style={[styles.list,styles.item]}>
                                            <View style={[styles.row,styles.row27]}>
                                                <Pressable style={({ pressed }) => [{backgroundColor: pressed ? '#ededed': '#fff'},styles.BR20]} 
                                                    onPress={()=>this.props.navigation.navigate('security1')}>
                                                        <View style={styles.box}>
                                                            <Icons.Ltd style={styleg.svgCss}/>
                                                            <Text allowFontScaling={false} style={styles.size22}>漏电/温度监测</Text>
                                                        </View>
                                                </Pressable>
                                            </View>
                                            <View style={[styles.row,styles.row24]}>
                                                <Pressable style={({ pressed }) => [{backgroundColor: pressed ? '#ededed': '#fff'},styles.BR20]} 
                                                    onPress={()=>this.props.navigation.navigate('security2')}>
                                                    <View style={styles.box}>
                                                        <Icons.Switch style={styleg.svgCss}/>
                                                        <Text allowFontScaling={false} style={styles.size22}>开关控制</Text>
                                                    </View>
                                                </Pressable>
                                            </View>
                                            <View style={[styles.row,styles.row24]}>
                                                <Pressable style={({ pressed }) => [{backgroundColor: pressed ? '#ededed': '#fff'},styles.BR20]} 
                                                    onPress={()=>this.props.navigation.navigate('security5')}>
                                                    <View style={styles.box}>
                                                        <Icons.SwitchMonitoring style={styleg.svgCss}/>
                                                        <Text allowFontScaling={false} style={styles.size22}>开关监测</Text>
                                                    </View>
                                                </Pressable>
                                            </View>

                                            <View style={[styles.row,styles.row25]}>
                                                <Pressable style={({ pressed }) => [{backgroundColor: pressed ? '#ededed': '#fff'},styles.BR20]} 
                                                    onPress={()=>this.props.navigation.navigate('security3')}>
                                                    <View style={styles.box}>
                                                        <Icons.Camera style={styleg.svgCss}/>
                                                        <Text allowFontScaling={false} style={styles.size22}>摄像头</Text>
                                                    </View>
                                                </Pressable>
                                            </View>
                                        </View>
                                    </View>
                                </View>
                            </View>
                        </View>
                    </ScrollView >
                </SafeAreaView>
            </View>
        )
    }
}

// 样式定义
const styles = StyleSheet.create({
    containerMini: {
        flex: 1,
        width: '100%',
        backgroundColor: '#eeeeee',
        zIndex: 9,
        paddingLeft: 10,
        paddingRight: 10,
    },
    indexMini:{
        position: 'relative',
        width: '100%',
    },
    indexUl:{
        position: 'relative',
        width: '100%',
        overflow: 'hidden',
        paddingTop: 10,
        paddingBottom: 10,
    },
    back: {
        borderRadius: 10,
        backgroundColor: '#fff',
        paddingLeft: 5,
        paddingRight: 5,
    },
    title:{
        position: 'relative',
        width: '100%',
        height: 22,
        lineHeight: 22,
        textAlignVertical: 'center',
        fontSize: Fs/19,
        fontWeight: '700',
        color: '#333',
        paddingLeft: 15,
        marginTop: 20,
        overflow: 'hidden',
        borderLeftWidth: 3,
        borderLeftColor: '#1890ff',
    },
    con: {
        position: 'relative',
        width: '100%',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'row',
    },
    listTop: {
        position: 'relative',
        width: '100%',
        overflow: 'hidden',
        marginTop:20,
        marginBottom:15
    },
    list: {
        position: 'relative',
        width: '100%',
        overflow: 'hidden',
        marginTop: 10
    },
    row:{
        position: 'relative',
        overflow: 'hidden',
    },
    row48: {
        width: '48%',
    },
    row33: {
        width: '33.333333%',
    },
    row24: {
        width: '24%',
    },
    row25: {
        width: '25%',
    },
    row27: {
        width: '27%',
    },
    overview: {
        position: 'relative',
        width: '100%',
        height: 80,
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-around',
        overflow: 'hidden',
        borderRadius: 5,
    },
    item: {
        display: 'flex',
        flexDirection: 'row',
    },
    bac: {
        backgroundColor: '#fff',
        paddingBottom: 15,
        flexDirection: 'column',
        justifyContent:'space-evenly'
    },
    img: {
        width: 60
    },
    box: {
        display: 'flex',
        flexDirection: 'column',
        alignItems:'center',
        justifyContent:'flex-end'
    },
    imgMini: {
        width:45
    },
    size19: {
        fontSize: Fs/16,
        color: '#fff',
        textAlign: 'center'
    },
    size22: {
        fontSize: Fs/22,
        color: '#333',
        textAlign: 'center'
    },
    BR20: {
        borderRadius:20
    }

})
export default Index