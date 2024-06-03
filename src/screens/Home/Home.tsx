import { Text, View, Dimensions, Image, ScrollView, Pressable, SafeAreaView} from 'react-native'
import React, { Component } from 'react'
import styles from './HomeCss'
import Navbar from '../../component/navbar/navbar'
import { Register } from '../../utils/app'
const ht = Dimensions.get('window').height*0.8
export class Index extends Component<any,any> {
    constructor(props: any){
        super(props)
        this.state = {
            LoginStatus: 1,//登录状态
            objType:1,
            boxHeight: 0
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
                    pageName={'首页'}
                    LoginStatus={this.state.LoginStatus}  
                    props={this.props}
                    ></Navbar>
                    {/* 内容 */}
                    <ScrollView style={[styles.containerMini,{height:this.state.boxHeight-ht/9}]}>
                        <View style={styles.indexMini}>
                            {/* 设备概括 */}
                            <View style={styles.indexUl}>
                                <Text style={styles.title}>
                                    设备概况
                                </Text>
                                <View style={styles.con}>
                                    <View style={[styles.list,styles.row33]}>
                                        <Pressable style={({ pressed }) => [{backgroundColor: pressed ? '#ededed': '#fff'},styles.overview]}
                                            onPress={()=>this.props.navigation.navigate('Survey')}>
                                            <Image style={styles.img} resizeMode='contain' source={require('../../image/overview_1.png')} />
                                            <Text style={styles.size17}>用能概况</Text>
                                        </Pressable>
                                    </View>
                                    <View style={[styles.list,styles.row33]}>
                                        <Pressable style={({ pressed }) => [{backgroundColor: pressed ? '#ededed': '#fff'},styles.overview]}
                                            onPress={()=>this.props.navigation.navigate('Scanqr')}>
                                            <Image style={styles.img} resizeMode='contain' source={require('../../image/scanqr.png')} />
                                            <Text style={styles.size17}>创建设备</Text>
                                        </Pressable>
                                    </View>
                                </View>
                            </View>
                            {/* 电力测试 */}
                            <View style={styles.indexUl}>
                                <Text style={styles.title}>
                                    电力测试
                                </Text>
                            <View style={[styles.con,styles.bac]}>
                                    <View style={[styles.list,styles.item]}>
                                        <View style={[styles.row,styles.row33]}>
                                            <Pressable style={({ pressed }) => [{backgroundColor: pressed ? '#ededed': '#fff'}]} 
                                                onPress={()=>this.props.navigation.navigate('PowerTest1')}>
                                                <View style={styles.box}>
                                                    <Image style={styles.img} resizeMode='contain' source={require('../../image/dl_1.png')}></Image>
                                                    <Text style={styles.size19}>日原数据</Text>
                                                </View>
                                            </Pressable>
                                        </View>
                                        <View style={[styles.row,styles.row33]}>
                                            <Pressable style={({ pressed }) => [{backgroundColor: pressed ? '#ededed': '#fff'}]} 
                                                onPress={()=>this.props.navigation.navigate('PowerTest2')}>
                                                <View style={styles.box}>
                                                    <Image style={styles.img} resizeMode='contain' source={require('../../image/dl_2.png')}></Image>
                                                    <Text style={styles.size19}>逐日极值数据</Text>
                                                </View>
                                            </Pressable>
                                        </View>
                                        <View style={[styles.row,styles.row33]}>
                                            <Pressable style={({ pressed }) => [{backgroundColor: pressed ? '#ededed': '#fff'}]} 
                                                onPress={()=>this.props.navigation.navigate('PowerTest3')}>
                                                <View style={styles.box}>
                                                    <Image style={styles.img} resizeMode='contain' source={require('../../image/dl_3.png')}></Image>
                                                    <Text style={styles.size19}>电力运行报表</Text>
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
                                                    <Text style={styles.size19}>电力极值报表</Text>
                                                </View>
                                            </Pressable>
                                        </View>
                                        <View style={[styles.row,styles.row33]}>
                                            
                                            <Pressable style={({ pressed }) => [{backgroundColor: pressed ? '#ededed': '#fff'}]} 
                                                onPress={()=>this.props.navigation.navigate('PowerTest5')}>
                                                    <View style={styles.box}>
                                                        <Image style={styles.img} resizeMode='contain' source={require('../../image/dl_5.png')}></Image>
                                                        <Text style={styles.size19}>平均功率因数</Text>
                                                    </View>
                                            </Pressable>
                                        </View>
                                        <View style={[styles.row,styles.row33]}>
                                            <Pressable style={({ pressed }) => [{backgroundColor: pressed ? '#ededed': '#fff'}]} 
                                                onPress={()=>this.props.navigation.navigate('PowerTest6')}>
                                                    <View style={styles.box}>
                                                        <Image style={styles.img} resizeMode='contain' source={require('../../image/dl_6.png')} ></Image>
                                                        <Text style={styles.size19}>电力运行日报</Text>
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
                                                        <Text style={styles.size19}>谐波检测</Text>
                                                    </View>
                                            </Pressable>
                                        </View>
                                    </View>
                                </View> 
                            </View>
                            {/* 用电分析 */}
                            <View style={styles.indexUl}>
                                <Text style={styles.title}>
                                    用电分析
                                </Text>
                                <View style={[styles.con,styles.bac]}>
                                    <View style={[styles.list,styles.item]}>
                                        <View style={[styles.row,styles.row25]}>
                                            <Pressable style={({ pressed }) => [{backgroundColor: pressed ? '#ededed': '#fff'}]} 
                                                onPress={()=>this.props.navigation.navigate('powerAnalysis1')}>
                                                    <View style={styles.box}>
                                                        <Image style={styles.imgMini} resizeMode='contain' source={require('../../image/yd_1.png')}></Image>
                                                        <Text style={styles.size19}>用能报表</Text>
                                                    </View>
                                            </Pressable>
                                        </View>
                                        <View style={[styles.row,styles.row25]}>
                                            <Pressable style={({ pressed }) => [{backgroundColor: pressed ? '#ededed': '#fff'}]} 
                                                onPress={()=>this.props.navigation.navigate('powerAnalysis2')}>
                                                    <View style={styles.box}>
                                                        <Image style={styles.imgMini} resizeMode='contain' source={require('../../image/yd_2.png')}></Image>
                                                        <Text style={styles.size19}>同比分析</Text>
                                                    </View>
                                            </Pressable>
                                        </View>
                                        <View style={[styles.row,styles.row25]}>
                                            <Pressable style={({ pressed }) => [{backgroundColor: pressed ? '#ededed': '#fff'}]} 
                                                onPress={()=>this.props.navigation.navigate('powerAnalysis3')}>
                                                <View style={styles.box}>
                                                    <Image style={styles.imgMini} resizeMode='contain' source={require('../../image/yd_3.png')}></Image>
                                                    <Text style={styles.size19}>环比分析</Text>
                                                </View>
                                            </Pressable>
                                        </View>
                                        <View style={[styles.row,styles.row25]}>
                                            <Pressable style={({ pressed }) => [{backgroundColor: pressed ? '#ededed': '#fff'}]} 
                                                onPress={()=>this.props.navigation.navigate('powerAnalysis4')}>
                                                <View style={styles.box}>
                                                    <Image style={styles.imgMini} resizeMode='contain' source={require('../../image/yd_4.png')}></Image>
                                                    <Text style={styles.size19}>损耗分析</Text>
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
                                                    <Text style={styles.size19}>电能集抄</Text>
                                                </View>
                                            </Pressable>
                                        </View>
                                        <View style={[styles.row,styles.row25]}>
                                            <Pressable style={({ pressed }) => [{backgroundColor: pressed ? '#ededed': '#fff'}]} 
                                                onPress={()=>this.props.navigation.navigate('powerAnalysis6')}>
                                                <View style={styles.box}>
                                                    <Image style={styles.imgMini} resizeMode='contain' source={require('../../image/yd_6.png')}></Image>
                                                    <Text style={styles.size19}>尖峰平谷</Text>
                                                </View>
                                            </Pressable>
                                        </View>

                                        <View style={[styles.row,styles.row25]}>
                                            <Pressable style={({ pressed }) => [{backgroundColor: pressed ? '#ededed': '#fff'}]} 
                                                onPress={()=>this.props.navigation.navigate('powerAnalysis7')}>
                                                <View style={styles.box}>
                                                    <Image style={styles.imgMini} resizeMode='contain' source={require('../../image/yd_8.png')}></Image>
                                                    <Text style={styles.size19}>最大需量</Text>
                                                </View>
                                            </Pressable>
                                        </View>
                                    </View>
                                </View>
                            </View>
                            {/* 用水分析 */}
                            <View style={styles.indexUl}>
                                <Text style={styles.title}>
                                    用水分析
                                </Text>
                                <View style={[styles.con,styles.bac]}>
                                    <View style={[styles.list,styles.item]}>
                                        <View style={[styles.row,styles.row25]}>
                                            <Pressable style={({ pressed }) => [{backgroundColor: pressed ? '#ededed': '#fff'}]} 
                                                onPress={()=>this.props.navigation.navigate('waterAnalysis1')}>
                                                <View style={styles.box}>
                                                    <Image style={styles.imgMini} resizeMode='contain' source={require('../../image/yd_1.png')}></Image>
                                                    <Text style={styles.size19}>用水报表</Text>
                                                </View>
                                            </Pressable>
                                        </View>
                                        <View style={[styles.row,styles.row25]}>
                                            <Pressable style={({ pressed }) => [{backgroundColor: pressed ? '#ededed': '#fff'}]} 
                                                onPress={()=>this.props.navigation.navigate('waterAnalysis2')}>
                                                <View style={styles.box}>
                                                    <Image style={styles.imgMini} resizeMode='contain' source={require('../../image/yd_2.png')}></Image>
                                                    <Text style={styles.size19}>同比分析</Text>
                                                </View>
                                            </Pressable>
                                        </View>
                                        <View style={[styles.row,styles.row25]}>
                                            <Pressable style={({ pressed }) => [{backgroundColor: pressed ? '#ededed': '#fff'}]} 
                                                onPress={()=>this.props.navigation.navigate('waterAnalysis3')}>
                                                <View style={styles.box}>
                                                    <Image style={styles.imgMini} resizeMode='contain' source={require('../../image/yd_3.png')}></Image>
                                                    <Text style={styles.size19}>环比分析</Text>
                                                </View>
                                            </Pressable>
                                        </View>
                                        <View style={[styles.row,styles.row25]}>
                                            <Pressable style={({ pressed }) => [{backgroundColor: pressed ? '#ededed': '#fff'}]} 
                                                onPress={()=>this.props.navigation.navigate('waterAnalysis4')}>
                                                <View style={styles.box}>
                                                    <Image style={styles.imgMini} resizeMode='contain' source={require('../../image/yd_4.png')}></Image>
                                                    <Text style={styles.size19}>损耗分析</Text>
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
                                                    <Text style={styles.size19}>水能集抄</Text>
                                                </View>
                                            </Pressable>
                                        </View>
                                        
                                    </View>
                                </View>
                            </View>
                            {/* 用气分析 */}
                            <View style={styles.indexUl}>
                                <Text style={styles.title}>
                                    用气分析
                                </Text>
                                <View style={[styles.con,styles.bac]}>
                                    <View style={[styles.list,styles.item]}>
                                        <View style={[styles.row,styles.row25]}>
                                            <Pressable style={({ pressed }) => [{backgroundColor: pressed ? '#ededed': '#fff'}]} 
                                                onPress={()=>this.props.navigation.navigate('gasAnalysis1')}>
                                                <View style={styles.box}>
                                                    <Image style={styles.imgMini} resizeMode='contain' source={require('../../image/yd_1.png')}></Image>
                                                    <Text style={styles.size19}>用气报表</Text>
                                                </View>
                                            </Pressable>
                                        </View>
                                        <View style={[styles.row,styles.row25]}>
                                            <Pressable style={({ pressed }) => [{backgroundColor: pressed ? '#ededed': '#fff'}]} 
                                                onPress={()=>this.props.navigation.navigate('gasAnalysis2')}>
                                                <View style={styles.box}>
                                                    <Image style={styles.imgMini} resizeMode='contain' source={require('../../image/yd_2.png')}></Image>
                                                    <Text style={styles.size19}>同比分析</Text>
                                                </View>
                                            </Pressable>
                                        </View>
                                        <View style={[styles.row,styles.row25]}>
                                            <Pressable style={({ pressed }) => [{backgroundColor: pressed ? '#ededed': '#fff'}]} 
                                                onPress={()=>this.props.navigation.navigate('gasAnalysis3')}>
                                                <View style={styles.box}>
                                                    <Image style={styles.imgMini} resizeMode='contain' source={require('../../image/yd_3.png')}></Image>
                                                    <Text style={styles.size19}>环比分析</Text>
                                                </View>
                                            </Pressable>
                                        </View>
                                        <View style={[styles.row,styles.row25]}>
                                            <Pressable style={({ pressed }) => [{backgroundColor: pressed ? '#ededed': '#fff'}]} 
                                                onPress={()=>this.props.navigation.navigate('gasAnalysis4')}>
                                                <View style={styles.box}>
                                                    <Image style={styles.imgMini} resizeMode='contain' source={require('../../image/yd_4.png')}></Image>
                                                    <Text style={styles.size19}>损耗分析</Text>
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
                                                    <Text style={styles.size19}>气能集抄</Text>
                                                </View>
                                            </Pressable>
                                        </View>
                                    </View>
                                </View>
                            </View>
                            {/* 安全分析 */}
                            <View style={styles.indexUl}>
                                <Text style={styles.title}>
                                    安全用电
                                </Text>
                                <View style={[styles.con,styles.bac]}>
                                    <View style={[styles.list,styles.item]}>
                                        <View style={[styles.row,styles.row25]}>
                                            <Pressable style={({ pressed }) => [{backgroundColor: pressed ? '#ededed': '#fff'}]} 
                                                onPress={()=>this.props.navigation.navigate('security1')}>
                                                    <View style={styles.box}>
                                                        <Image style={styles.imgMini}  resizeMode='contain' source={require('../../image/aq1.png')}></Image>
                                                        <Text style={styles.size19}>漏电/温度监测</Text>
                                                    </View>
                                            </Pressable>
                                        </View>
                                        <View style={[styles.row,styles.row25]}>
                                            <Pressable style={({ pressed }) => [{backgroundColor: pressed ? '#ededed': '#fff'}]} 
                                                onPress={()=>this.props.navigation.navigate('security2')}>
                                                <View style={styles.box}>
                                                    <Image style={styles.imgMini} resizeMode='contain' source={require('../../image/aq2.png')} ></Image>
                                                    <Text style={styles.size19}>开关控制</Text>
                                                </View>
                                            </Pressable>
                                        </View>
                                        <View style={[styles.row,styles.row25]}>
                                            <Pressable style={({ pressed }) => [{backgroundColor: pressed ? '#ededed': '#fff'}]} 
                                                onPress={()=>this.props.navigation.navigate('security5')}>
                                                <View style={styles.box}>
                                                    <Image style={styles.imgMini} resizeMode='contain' source={require('../../image/switch-monitor.png')} ></Image>
                                                    <Text style={styles.size19}>开关监测</Text>
                                                </View>
                                            </Pressable>
                                        </View>

                                        <View style={[styles.row,styles.row25]}>
                                            <Pressable style={({ pressed }) => [{backgroundColor: pressed ? '#ededed': '#fff'}]} 
                                                onPress={()=>this.props.navigation.navigate('security3')}>
                                                <View style={styles.box}>
                                                    <Image style={styles.imgMini} resizeMode='contain' source={require('../../image/aq3.png')}></Image>
                                                    <Text style={styles.size19}>摄像头</Text>
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
export default Index