import { Text, View, Dimensions, Image, ScrollView, Pressable, SafeAreaView, StyleSheet, Modal} from 'react-native'
import React, { Component } from 'react'
import Navbar from '../../component/navbar/navbar'
import { Register } from '../../utils/app'
import { withTranslation  } from 'react-i18next';//语言包内容
import i18n from 'i18next';//中英文切换
import { store } from '../../redux/storer';
const Fs = Dimensions.get('window').width*0.8//屏幕宽比 
export class Index extends Component<any,any> {
    constructor(props: any){
        super(props)
        this.state = {
            LoginStatus: 1,//登录状态
            objType:1,
            boxHeight: 0,

            visible: false
        } 
    }
    componentDidMount(){
        console.log(store.getState().firstApp);
        
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
    bot=()=>{
        console.log(this.props.i18n.language); 
        let language = this.props.i18n.language == 'zh'? 'en':'zh'
        i18n.changeLanguage(language).then(() => {
            console.log('中英文切换');
        });
    }
    policy=(e: any)=>{
        this.setState({
            visible: false
        })
    }
    render() {
        return (
            <View style={{flex: 1}}>
                <View style={{position: 'absolute',top: 0,width: "100%",height: "100%",backgroundColor: '#fff'}}>
                </View>
                <SafeAreaView 
                    style={{flex: 1}}
                    onLayout={(event) => this.boxH(event)}>
                    {/* 引入自定义导航栏 */}
                    <Navbar 
                    showBack={false} 
                    showHome={false}
                    pageName={this.props.t('home')}
                    LoginStatus={this.state.LoginStatus}  
                    props={this.props}
                    ></Navbar>
                    {/* 内容 */}
                    <ScrollView style={styles.containerMini}>
                        <View style={styles.indexMini}>
                            {/* 设备概括 */}
                            <View style={styles.indexUl}>
                                <Text allowFontScaling={false} style={styles.title}>
                                    {this.props.t('equipmentProfile')} {/* 设备概况 */}
                                </Text>
                                <View style={styles.con}>
                                    <View style={[styles.list,styles.row33]}>
                                        <Pressable style={({ pressed }) => [{backgroundColor: pressed ? '#ededed': '#fff'},styles.overview]}
                                            onPress={()=>this.props.navigation.navigate('Survey')}>
                                            <Image style={styles.img} resizeMode='contain' source={require('../../image/overview_1.png')} />
                                            <Text allowFontScaling={false} style={styles.size19}>{this.props.t('overviewOfEnergy')}</Text>{/*用能概况*/}
                                        </Pressable>
                                    </View>
                                    <View style={[styles.list,styles.row33]}>
                                        <Pressable style={({ pressed }) => [{backgroundColor: pressed ? '#ededed': '#fff'},styles.overview]}
                                            onPress={()=>this.props.navigation.navigate('Scanqr')}>
                                            <Image style={styles.img} resizeMode='contain' source={require('../../image/scanqr.png')} />
                                            <Text allowFontScaling={false} style={styles.size19}>{this.props.t('createDevice')}</Text>{/*创建设备*/}
                                        </Pressable>
                                    </View>
                                </View>
                            </View>
                            {/* 电力测试 */}
                            <View style={styles.indexUl}>
                                <Text allowFontScaling={false} style={styles.title}>
                                    {this.props.t('electricPowerTest')}{/*电力测试*/}
                                </Text>
                            <View style={[styles.con,styles.bac]}>
                                    <View style={[styles.list,styles.item]}>
                                        <View style={[styles.row,styles.row33]}>
                                            <Pressable style={({ pressed }) => [{backgroundColor: pressed ? '#ededed': '#fff'}]} 
                                                onPress={()=>this.props.navigation.navigate('PowerTest1')}>
                                                <View style={styles.box}>
                                                    <Image style={styles.img} resizeMode='contain' source={require('../../image/dl_1.png')}></Image>
                                                    <Text allowFontScaling={false} style={styles.size22}>{this.props.t('hiharaData')}</Text>{/*日原数据*/}
                                                </View>
                                            </Pressable>
                                        </View>
                                        <View style={[styles.row,styles.row33]}>
                                            <Pressable style={({ pressed }) => [{backgroundColor: pressed ? '#ededed': '#fff'}]} 
                                                onPress={()=>this.props.navigation.navigate('PowerTest2')}>
                                                <View style={styles.box}>
                                                    <Image style={styles.img} resizeMode='contain' source={require('../../image/dl_2.png')}></Image>
                                                    <Text allowFontScaling={false} style={styles.size22}>{this.props.t('Devd')}</Text>{/* 逐日极值数据*/}
                                                </View>
                                            </Pressable>
                                        </View>
                                        <View style={[styles.row,styles.row33]}>
                                            <Pressable style={({ pressed }) => [{backgroundColor: pressed ? '#ededed': '#fff'}]} 
                                                onPress={()=>this.props.navigation.navigate('PowerTest3')}>
                                                <View style={styles.box}>
                                                    <Image style={styles.img} resizeMode='contain' source={require('../../image/dl_3.png')}></Image>
                                                    <Text allowFontScaling={false} style={styles.size22}>{this.props.t('powerOperationreport')}</Text>{/*电力运行报表*/}
                                                </View>
                                            </Pressable>
                                        </View>
                                    </View>
                                    <View style={[styles.list,styles.item]}>
                                        <View style={[styles.row,styles.row33]}>
                                            <Pressable style={({ pressed }) => [{backgroundColor: pressed ? '#ededed': '#fff'}]} 
                                                onPress={()=>this.props.navigation.navigate('PowerTest4')}>
                                                <View style={styles.box}>
                                                    <Image style={styles.img} resizeMode='contain' source={require('../../image/dl_4.png')}></Image>
                                                    <Text allowFontScaling={false} style={styles.size22}>{this.props.t('powerExtremeReport')}</Text>{/*电力极值报表*/}
                                                </View>
                                            </Pressable>
                                        </View>
                                        <View style={[styles.row,styles.row33]}>
                                            
                                            <Pressable style={({ pressed }) => [{backgroundColor: pressed ? '#ededed': '#fff'}]} 
                                                onPress={()=>this.props.navigation.navigate('PowerTest5')}>
                                                    <View style={styles.box}>
                                                        <Image style={styles.img} resizeMode='contain' source={require('../../image/dl_5.png')}></Image>
                                                        <Text allowFontScaling={false} style={styles.size22}>{this.props.t('averagePowerFactor')}</Text>{/*平均功率因数*/}
                                                    </View>
                                            </Pressable>
                                        </View>
                                        <View style={[styles.row,styles.row33]}>
                                            <Pressable style={({ pressed }) => [{backgroundColor: pressed ? '#ededed': '#fff'}]} 
                                                onPress={()=>this.props.navigation.navigate('PowerTest6')}>
                                                    <View style={styles.box}>
                                                        <Image style={styles.img} resizeMode='contain' source={require('../../image/dl_6.png')} ></Image>
                                                        <Text allowFontScaling={false} style={styles.size22}>{this.props.t('Dropo')}</Text>{/*电力运行日报*/}
                                                    </View>
                                            </Pressable>
                                        </View>
                                    </View>
                                    <View style={styles.list}>
                                        <View style={[styles.row,styles.row33]}>
                                            <Pressable style={({ pressed }) => [{backgroundColor: pressed ? '#ededed': '#fff'}]} 
                                                onPress={()=>this.props.navigation.navigate('PowerTest7')}>
                                                    <View style={styles.box}>
                                                        <Image style={styles.img} resizeMode='contain' source={require('../../image/dl_7.png')}></Image>
                                                        <Text allowFontScaling={false} style={styles.size22}>{this.props.t('harmonicDetection')}</Text>{/*谐波检测*/}
                                                    </View>
                                            </Pressable>
                                        </View>
                                    </View>
                                </View> 
                            </View>
                            {/* 用电分析 */}
                            <View style={styles.indexUl}>
                                <Text allowFontScaling={false} style={styles.title}>
                                    {this.props.t('electricityAnalysis')}{/*用电分析*/}
                                </Text>
                                <View style={[styles.con,styles.bac]}>
                                    <View style={[styles.list,styles.item]}>
                                        <View style={[styles.row,styles.row25]}>
                                            <Pressable style={({ pressed }) => [{backgroundColor: pressed ? '#ededed': '#fff'}]} 
                                                onPress={()=>this.props.navigation.navigate('powerAnalysis1')}>
                                                    <View style={styles.box}>
                                                        <Image style={styles.imgMini} resizeMode='contain' source={require('../../image/yd_1.png')}></Image>
                                                        <Text allowFontScaling={false} style={styles.size22}>{this.props.t('energyConsumptionReport')}</Text>{/*用能报表*/}
                                                    </View>
                                            </Pressable>
                                        </View>
                                        <View style={[styles.row,styles.row25]}>
                                            <Pressable style={({ pressed }) => [{backgroundColor: pressed ? '#ededed': '#fff'}]} 
                                                onPress={()=>this.props.navigation.navigate('powerAnalysis2')}>
                                                    <View style={styles.box}>
                                                        <Image style={styles.imgMini} resizeMode='contain' source={require('../../image/yd_2.png')}></Image>
                                                        <Text allowFontScaling={false} style={styles.size22}>{this.props.t('yearyearAnalysis')}</Text>{/*同比分析*/}
                                                    </View>
                                            </Pressable>
                                        </View>
                                        <View style={[styles.row,styles.row25]}>
                                            <Pressable style={({ pressed }) => [{backgroundColor: pressed ? '#ededed': '#fff'}]} 
                                                onPress={()=>this.props.navigation.navigate('powerAnalysis3')}>
                                                <View style={styles.box}>
                                                    <Image style={styles.imgMini} resizeMode='contain' source={require('../../image/yd_3.png')}></Image>
                                                    <Text allowFontScaling={false} style={styles.size22}>{this.props.t('sequentialAnalysis')}</Text>{/*环比分析*/}
                                                </View>
                                            </Pressable>
                                        </View>
                                        <View style={[styles.row,styles.row25]}>
                                            <Pressable style={({ pressed }) => [{backgroundColor: pressed ? '#ededed': '#fff'}]} 
                                                onPress={()=>this.props.navigation.navigate('powerAnalysis4')}>
                                                <View style={styles.box}>
                                                    <Image style={styles.imgMini} resizeMode='contain' source={require('../../image/yd_4.png')}></Image>
                                                    <Text allowFontScaling={false} style={styles.size22}>{this.props.t('lossAnalysis')}</Text>{/*损耗分析*/}
                                                </View>
                                            </Pressable>
                                        </View>
                                    </View>
                                    <View style={[styles.list,styles.item]}>
                                        <View style={[styles.row,styles.row25]}>
                                        <Pressable style={({ pressed }) => [{backgroundColor: pressed ? '#ededed': '#fff'}]} 
                                            onPress={()=>this.props.navigation.navigate('powerAnalysis5')}>
                                                <View style={styles.box}>
                                                    <Image style={styles.imgMini} resizeMode='contain' source={require('../../image/yd_5.png')}></Image>
                                                    <Text allowFontScaling={false} style={styles.size22}>{this.props.t('energyPooling')}</Text>{/*电能集抄*/}
                                                </View>
                                            </Pressable>
                                        </View>
                                        <View style={[styles.row,styles.row25]}>
                                            <Pressable style={({ pressed }) => [{backgroundColor: pressed ? '#ededed': '#fff'}]} 
                                                onPress={()=>this.props.navigation.navigate('powerAnalysis6')}>
                                                <View style={styles.box}>
                                                    <Image style={styles.imgMini} resizeMode='contain' source={require('../../image/yd_6.png')}></Image>
                                                    <Text allowFontScaling={false} style={styles.size22}>{this.props.t('PeaksValleys')}</Text>{/*尖峰平谷*/}
                                                </View>
                                            </Pressable>
                                        </View>

                                        <View style={[styles.row,styles.row25]}>
                                            <Pressable style={({ pressed }) => [{backgroundColor: pressed ? '#ededed': '#fff'}]} 
                                                onPress={()=>this.props.navigation.navigate('powerAnalysis7')}>
                                                <View style={styles.box}>
                                                    <Image style={styles.imgMini} resizeMode='contain' source={require('../../image/yd_8.png')}></Image>
                                                    <Text allowFontScaling={false} style={styles.size22}>{this.props.t('maximumDemand')}</Text>{/*最大需量*/}
                                                </View>
                                            </Pressable>
                                        </View>
                                    </View>
                                </View>
                            </View>
                            {/* 用水分析 */}
                            <View style={styles.indexUl}>
                                <Text allowFontScaling={false} style={styles.title}>
                                    {this.props.t('waterUseAnalysis')}{/*用水分析*/}
                                </Text>
                                <View style={[styles.con,styles.bac]}>
                                    <View style={[styles.list,styles.item]}>
                                        <View style={[styles.row,styles.row25]}>
                                            <Pressable style={({ pressed }) => [{backgroundColor: pressed ? '#ededed': '#fff'}]} 
                                                onPress={()=>this.props.navigation.navigate('waterAnalysis1')}>
                                                <View style={styles.box}>
                                                    <Image style={styles.imgMini} resizeMode='contain' source={require('../../image/yd_1.png')}></Image>
                                                    <Text allowFontScaling={false} style={styles.size22}>{this.props.t('waterConsumptionEeport')}</Text>{/*用水报表*/}
                                                </View>
                                            </Pressable>
                                        </View>
                                        <View style={[styles.row,styles.row25]}>
                                            <Pressable style={({ pressed }) => [{backgroundColor: pressed ? '#ededed': '#fff'}]} 
                                                onPress={()=>this.props.navigation.navigate('waterAnalysis2')}>
                                                <View style={styles.box}>
                                                    <Image style={styles.imgMini} resizeMode='contain' source={require('../../image/yd_2.png')}></Image>
                                                    <Text allowFontScaling={false} style={styles.size22}>{this.props.t('yearyearAnalysis')}</Text>{/*同比分析*/}
                                                </View>
                                            </Pressable>
                                        </View>
                                        <View style={[styles.row,styles.row25]}>
                                            <Pressable style={({ pressed }) => [{backgroundColor: pressed ? '#ededed': '#fff'}]} 
                                                onPress={()=>this.props.navigation.navigate('waterAnalysis3')}>
                                                <View style={styles.box}>
                                                    <Image style={styles.imgMini} resizeMode='contain' source={require('../../image/yd_3.png')}></Image>
                                                    <Text allowFontScaling={false} style={styles.size22}>{this.props.t('sequentialAnalysis')}</Text>{/*环比分析*/}
                                                </View>
                                            </Pressable>
                                        </View>
                                        <View style={[styles.row,styles.row25]}>
                                            <Pressable style={({ pressed }) => [{backgroundColor: pressed ? '#ededed': '#fff'}]} 
                                                onPress={()=>this.props.navigation.navigate('waterAnalysis4')}>
                                                <View style={styles.box}>
                                                    <Image style={styles.imgMini} resizeMode='contain' source={require('../../image/yd_4.png')}></Image>
                                                    <Text allowFontScaling={false} style={styles.size22}>{this.props.t('lossAnalysis')}</Text>{/*损耗分析*/}
                                                </View>
                                            </Pressable>
                                        </View>
                                    </View>
                                    <View style={[styles.list,styles.item]}>
                                        <View style={[styles.row,styles.row25]}>
                                            <Pressable style={({ pressed }) => [{backgroundColor: pressed ? '#ededed': '#fff'}]} 
                                                onPress={()=>this.props.navigation.navigate('waterAnalysis5')}>
                                                <View style={styles.box}>
                                                    <Image style={styles.imgMini} resizeMode='contain' source={require('../../image/yd_5.png')}></Image>
                                                    <Text allowFontScaling={false} style={styles.size22}>{this.props.t('WaterEnergyCollection')}</Text>{/*水能集抄*/}
                                                </View>
                                            </Pressable>
                                        </View>
                                        
                                    </View>
                                </View>
                            </View>
                            {/* 用气分析 */}
                            <View style={styles.indexUl}>
                                <Text allowFontScaling={false} style={styles.title}>
                                    {this.props.t('gasAnalysis')}{/*用气分析*/}
                                </Text>
                                <View style={[styles.con,styles.bac]}>
                                    <View style={[styles.list,styles.item]}>
                                        <View style={[styles.row,styles.row25]}>
                                            <Pressable style={({ pressed }) => [{backgroundColor: pressed ? '#ededed': '#fff'}]} 
                                                onPress={()=>this.props.navigation.navigate('gasAnalysis1')}>
                                                <View style={styles.box}>
                                                    <Image style={styles.imgMini} resizeMode='contain' source={require('../../image/yd_1.png')}></Image>
                                                    <Text allowFontScaling={false} style={styles.size22}>{this.props.t('gasReport')}</Text>{/*用气报表*/}
                                                </View>
                                            </Pressable>
                                        </View>
                                        <View style={[styles.row,styles.row25]}>
                                            <Pressable style={({ pressed }) => [{backgroundColor: pressed ? '#ededed': '#fff'}]} 
                                                onPress={()=>this.props.navigation.navigate('gasAnalysis2')}>
                                                <View style={styles.box}>
                                                    <Image style={styles.imgMini} resizeMode='contain' source={require('../../image/yd_2.png')}></Image>
                                                    <Text allowFontScaling={false} style={styles.size22}>{this.props.t('yearyearAnalysis')}</Text>{/*同比分析*/}
                                                </View>
                                            </Pressable>
                                        </View>
                                        <View style={[styles.row,styles.row25]}>
                                            <Pressable style={({ pressed }) => [{backgroundColor: pressed ? '#ededed': '#fff'}]} 
                                                onPress={()=>this.props.navigation.navigate('gasAnalysis3')}>
                                                <View style={styles.box}>
                                                    <Image style={styles.imgMini} resizeMode='contain' source={require('../../image/yd_3.png')}></Image>
                                                    <Text allowFontScaling={false} style={styles.size22}>{this.props.t('sequentialAnalysis')}</Text>{/*环比分析*/}
                                                </View>
                                            </Pressable>
                                        </View>
                                        <View style={[styles.row,styles.row25]}>
                                            <Pressable style={({ pressed }) => [{backgroundColor: pressed ? '#ededed': '#fff'}]} 
                                                onPress={()=>this.props.navigation.navigate('gasAnalysis4')}>
                                                <View style={styles.box}>
                                                    <Image style={styles.imgMini} resizeMode='contain' source={require('../../image/yd_4.png')}></Image>
                                                    <Text allowFontScaling={false} style={styles.size22}>{this.props.t('lossAnalysis')}</Text>{/*损耗分析*/}
                                                </View>
                                            </Pressable>
                                        </View>
                                    </View>
                                    <View style={[styles.list,styles.item]}>
                                        <View style={[styles.row,styles.row25]}>
                                            <Pressable style={({ pressed }) => [{backgroundColor: pressed ? '#ededed': '#fff'}]} 
                                                onPress={()=>this.props.navigation.navigate('gasAnalysis5')}>
                                                <View style={styles.box}>
                                                    <Image style={styles.imgMini} resizeMode='contain' source={require('../../image/yd_5.png')}></Image>
                                                    <Text allowFontScaling={false} style={styles.size22}>{this.props.t('gasEnergyCollection')}</Text>{/*气能集抄*/}
                                                </View>
                                            </Pressable>
                                        </View>
                                    </View>
                                </View>
                            </View>
                            {/* 安全分析 */}
                            <View style={styles.indexUl}>
                                <Text allowFontScaling={false} style={styles.title}>
                                {this.props.t('SUOE')}{/*安全用电*/}
                                </Text>
                                <View style={[styles.con,styles.bac]}>
                                    <View style={[styles.list,styles.item]}>
                                        <View style={[styles.row,styles.row25]}>
                                            <Pressable style={({ pressed }) => [{backgroundColor: pressed ? '#ededed': '#fff'}]} 
                                                onPress={()=>this.props.navigation.navigate('security1')}>
                                                    <View style={styles.box}>
                                                        <Image style={styles.imgMini}  resizeMode='contain' source={require('../../image/aq1.png')}></Image>
                                                        <Text allowFontScaling={false} style={styles.size22}>{this.props.t('Leakage')}</Text>{/*漏电/温度监测*/}
                                                    </View>
                                            </Pressable>
                                        </View>
                                        <View style={[styles.row,styles.row25]}>
                                            <Pressable style={({ pressed }) => [{backgroundColor: pressed ? '#ededed': '#fff'}]} 
                                                onPress={()=>this.props.navigation.navigate('security2')}>
                                                <View style={styles.box}>
                                                    <Image style={styles.imgMini} resizeMode='contain' source={require('../../image/aq2.png')} ></Image>
                                                    <Text allowFontScaling={false} style={styles.size22}>{this.props.t('onoffControl')}</Text>{/*开关控制*/}
                                                </View>
                                            </Pressable>
                                        </View>
                                        <View style={[styles.row,styles.row25]}>
                                            <Pressable style={({ pressed }) => [{backgroundColor: pressed ? '#ededed': '#fff'}]} 
                                                onPress={()=>this.props.navigation.navigate('security5')}>
                                                <View style={styles.box}>
                                                    <Image style={styles.imgMini} resizeMode='contain' source={require('../../image/switch-monitor.png')} ></Image>
                                                    <Text allowFontScaling={false} style={styles.size22}>{this.props.t('SwitchMonitoring')}</Text>{/*开关监测*/}
                                                </View>
                                            </Pressable>
                                        </View>

                                        <View style={[styles.row,styles.row25]}>
                                            <Pressable style={({ pressed }) => [{backgroundColor: pressed ? '#ededed': '#fff'}]} 
                                                onPress={()=>this.props.navigation.navigate('security3')}>
                                                <View style={styles.box}>
                                                    <Image style={styles.imgMini} resizeMode='contain' source={require('../../image/aq3.png')}></Image>
                                                    <Text allowFontScaling={false} style={styles.size22}>{this.props.t('camera')}</Text>{/*摄像头*/}
                                                </View>
                                            </Pressable>
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
const styles = StyleSheet.create({
    containerMini: {
        flex: 1,
        width: '100%',
        backgroundColor: '#f4f4f4',
        zIndex: 9,
        paddingLeft:8,
        paddingRight:8,
    },
    indexMini:{
        position: 'relative',
        width: '100%',
    },
    indexUl:{
        position: 'relative',
        width: '100%',
        overflow: 'hidden',
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
        marginTop: 30,
        marginBottom: 20,
        overflow: 'hidden',
        borderLeftWidth: 3,
        borderLeftColor: '#333',
    },
    con: {
        position: 'relative',
        width: '100%',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'row',
    },
    list: {
        position: 'relative',
        width: '100%',
        overflow: 'hidden',
        marginRight:5,
        marginTop:25,
        marginBottom:15
    },
    row:{
        position: 'relative',
        overflow: 'hidden',
    },
    row33: {
        width: '33.333333%',
    },
    row25: {
        width: '25%',
    },
    overview: {
        position: 'relative',
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding:15,
        paddingTop: 20,
        paddingBottom: 10,
        overflow: 'hidden',
    },
    item: {
        display: 'flex',
        flexDirection: 'row',
    },
    bac: {
        backgroundColor: '#fff',
        borderRadius: 15,
        paddingBottom: 15,
        flexDirection: 'column',
        justifyContent:'space-evenly'
    },
    img: {
        width:55
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
        fontSize: Fs/19,
        color: '#333',
        textAlign: 'center'
    },
    size22: {
        fontSize: Fs/22,
        color: '#333',
        textAlign: 'center'
    },

})
export default withTranslation()(Index)