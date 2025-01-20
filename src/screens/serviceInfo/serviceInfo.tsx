import { Dimensions, SafeAreaView, ScrollView, StyleSheet, Text, View } from 'react-native'
import React, { Component } from 'react'
import Navbar from '../../component/navbar/navbar'
import { t } from 'i18next'

const Fs = Dimensions.get('window').width*0.8
const ht = Dimensions.get('window').height*0.8

export class ServiceInfo extends Component<any,any> {
    constructor(props: {}){
        super(props)
        this.state={
            need:false
        }
    }
  render() {
    return (
        <View style={{flex: 1}}>
            <View style={{position: 'absolute',top: 0,width: "100%",height: "100%",backgroundColor: '#fff'}}>
            </View>
            <SafeAreaView style={{flex: 1}}>
                {/* 引入自定义导航栏 */}
                <Navbar
                    pageName={t('TLINK')}
                    showBack={true}
                    showHome={false}
                    props={this.props}
                ></Navbar>
                <View style={styles.box}>
                    <ScrollView style={styles.container}>
                        <Text allowFontScaling={false} style={[styles.title1,{textAlign:'center',lineHeight: 25,}]}>{t('TOSFPEM')}</Text>
                        <Text allowFontScaling={false} style={styles.title1}>{t('importantNote')}</Text>
                        <View>
                        <Text allowFontScaling={false}> &emsp;&emsp;{t('SATC')}</Text>
                            <Text allowFontScaling={false}>&emsp;&emsp;{t('TTMBAAT')}</Text>
                        </View>
                        <View>
                            <Text allowFontScaling={false} style={styles.title2}>&ensp;{t('definition')}</Text>
                            <Text allowFontScaling={false}>&emsp;&emsp;{t('UOS')}</Text>
                            <View>
                                <Text allowFontScaling={false}>
                                    &emsp;&emsp;&emsp;● 1.1 {t('S1.1')}
                                </Text>
                                <Text allowFontScaling={false}>
                                    &emsp;&emsp;&emsp;● 1.2 {t('S1.2')}
                                </Text>
                                <Text allowFontScaling={false}>
                                    &emsp;&emsp;&emsp;● 1.3 {t('S1.3')}
                                </Text>
                            </View>
                        </View>

                        <Text allowFontScaling={false} style={styles.title1}>{t('DURA')}</Text>
                        <View>
                            <Text allowFontScaling={false} style={styles.title2} > &ensp;2.1 {t('Registration')}</Text>
                            <Text allowFontScaling={false} >&emsp;&emsp;{t('S2.1.1')}</Text>
                            <Text allowFontScaling={false} >&emsp;&emsp;{t('S2.1.2')}</Text>
                            <Text allowFontScaling={false} >&emsp;&emsp;{t('S2.1.3')}</Text>
                        </View>

                        <View>
                            <Text allowFontScaling={false} style={styles.title2} > &ensp;2.2 {t('S2.2')}</Text>
                            <Text allowFontScaling={false} >&emsp;&emsp;{t('S2.2.1')}</Text>
                        </View>

                        <View>
                            <Text allowFontScaling={false} style={styles.title2} > &ensp;2.3 {t('S2.3')}</Text>
                            <Text allowFontScaling={false} >&emsp;&emsp;{t('S2.3.1')}</Text>
                        </View>

                        <View>
                            <Text allowFontScaling={false} style={styles.title2} > &ensp;2.4 {t('S2.4')}</Text>
                            <Text allowFontScaling={false} >&emsp;&emsp;{t('S2.4.1')}</Text>
                            <Text allowFontScaling={false} >&emsp;&emsp;（1）{t('S2.4.11')}</Text>
                            <Text allowFontScaling={false} >&emsp;&emsp;（2）{t('S2.4.12')}</Text>
                            <Text allowFontScaling={false} >&emsp;&emsp;（3）{t('S2.4.13')}</Text>
                            <Text allowFontScaling={false} >&emsp;&emsp;（4）{t('S2.4.14')}</Text>
                            <Text allowFontScaling={false} >&emsp;&emsp;（5）{t('S2.4.15')}</Text>
                            <Text allowFontScaling={false} >&emsp;&emsp;（6）{t('S2.4.16')}</Text>   
                        </View>

                        <Text allowFontScaling={false} style={styles.title1}>{t('S3')}</Text>
                        <View>
                            <Text allowFontScaling={false} >&emsp;&emsp;3.1 {t('S3.1')}</Text>
                            <Text allowFontScaling={false} >&emsp;&emsp;3.2 {t('S3.2')}</Text>
                            <Text allowFontScaling={false} >&emsp;&emsp;3.3 {t('S3.3')}</Text>
                            <Text allowFontScaling={false} >&emsp;&emsp;3.4 {t('S3.4')}</Text>
                            <Text allowFontScaling={false} >&emsp;&emsp;3.5 {t('S3.5')}</Text>
                            <Text allowFontScaling={false} >&emsp;&emsp;3.6 {t('S3.6')}</Text>
                            <Text allowFontScaling={false} >&emsp;&emsp;3.7 {t('S3.7')}</Text>
                            <Text allowFontScaling={false} >&emsp;&emsp;（1）{t('S3.7.1')}</Text>
                            <Text allowFontScaling={false} >&emsp;&emsp;（2）{t('S3.7.2')}</Text>
                            <Text allowFontScaling={false} >&emsp;&emsp;3.8 {t('S3.8')}</Text>
                            <Text allowFontScaling={false} >&emsp;&emsp;3.9 {t('S3.9')}</Text>
                            <Text allowFontScaling={false} >&emsp;&emsp;3.10 {t('S3.10')}</Text>  
                        </View>

                        <Text allowFontScaling={false} style={styles.title1}>{t('S4')}</Text>
                        <View>
                            <Text allowFontScaling={false} >&emsp;&emsp;4.1 {t('S4.1')}</Text>
                            <Text allowFontScaling={false} >&emsp;&emsp;4.2 {t('S4.2')}</Text>
                        </View>

                        <Text allowFontScaling={false} style={styles.title1}>{t('S5')}</Text>
                        <View>
                            <Text allowFontScaling={false} >&emsp;&emsp; 5.1 {t('S5.1')}</Text>
                            <Text allowFontScaling={false} >&emsp;&emsp;（1）{t('S5.1.1')}</Text>
                            <Text allowFontScaling={false} >&emsp;&emsp;（2）{t('S5.1.2')}</Text>
                            <Text allowFontScaling={false} >&emsp;&emsp;（3）{t('S5.1.3')}</Text>
                            <Text allowFontScaling={false} >&emsp;&emsp;（4）{t('S5.1.4')}</Text> 
                        </View>

                        <Text allowFontScaling={false} style={styles.title1}>{t('S6')}</Text>
                        <View>
                            <Text allowFontScaling={false} >&emsp;&emsp;6.1 {t('S6.1')}</Text>
                            <Text allowFontScaling={false} >&emsp;&emsp;6.2 {t('S6.2')}</Text>
                            <Text allowFontScaling={false} >&emsp;&emsp;6.3 {t('S6.3')}</Text>
                            <Text allowFontScaling={false} >&emsp;&emsp;6.4 {t('S6.4')}</Text>
                            <Text allowFontScaling={false} >&emsp;&emsp;6.5 {t('S6.5')}</Text>
                            <Text allowFontScaling={false} >&emsp;&emsp;6.6 {t('S6.6')}</Text>
                            <Text allowFontScaling={false} >&emsp;&emsp;6.7 {t('S6.7')}</Text>  
                        </View>

                        <Text allowFontScaling={false} style={styles.title1}>{t('S7')}</Text>
                        <View>
                            <Text allowFontScaling={false} >&emsp;&emsp;7.1 {t('S7.1')}</Text>
                            <Text allowFontScaling={false} >&emsp;&emsp;7.2 {t('S7.2')}</Text>
                        </View>
                        <Text allowFontScaling={false} style={styles.title1}>{t('S8')}</Text>
                        <View>
                            <Text allowFontScaling={false} >&emsp;&emsp;8.1 {t('S8.1')}</Text>
                            <Text allowFontScaling={false} >&emsp;&emsp;8.2 {t('S8.2')}</Text>
                            <Text allowFontScaling={false} >&emsp;&emsp;8.3 {t('S8.3')}</Text>
                            <Text allowFontScaling={false} >&emsp;&emsp;（1）{t('S8.3.1')}</Text>
                            <Text allowFontScaling={false} >&emsp;&emsp;（2）{t('S8.3.2')}</Text>
                            <Text allowFontScaling={false} >&emsp;&emsp;（3）{t('S8.3.3')}</Text>
                            <Text allowFontScaling={false} >&emsp;&emsp;（4）{t('S8.3.4')}</Text>
                            <Text allowFontScaling={false} >&emsp;&emsp;（5）{t('S8.3.5')}</Text>
                            <Text allowFontScaling={false} >&emsp;&emsp;（6）{t('S8.3.6')}</Text>   
                        </View>

                        <Text allowFontScaling={false} style={styles.title1}>{t('S9')}</Text>
                        <View>
                            <Text allowFontScaling={false} >&emsp;&emsp;9.1 {t('S9.1')}</Text>
                            <Text allowFontScaling={false} >&emsp;&emsp;9.2 {t('S9.2')}</Text>
                        </View>
                        { this.state.need ?
                            <View>
                                <Text allowFontScaling={false} style={styles.deny} >{t('reject')}</Text>
                                <Text allowFontScaling={false} style={styles.accept}>{t('Agree')}</Text>
                            </View>:''
                        }
                    </ScrollView>
                </View>
            </SafeAreaView>
        </View>
    )
  }
}
const styles = StyleSheet.create({
    box:{
        width: '100%',
        display:'flex',
        alignItems: 'center',
        backgroundColor: '#fff',
    },
    container:{
        position: 'relative',
        width: '90%',
        height: Dimensions.get('window').height-ht/6,
    },
    title1:{
        color: '#333',
        fontWeight: '700',
        fontSize: Fs/20,
        marginTop: 10,
        marginBottom: 10,
    },
    text:{
        height: 25,
    },
    title2:{
        color: '#333',
        fontWeight: '700',
        fontSize: Fs/22 ,
        marginTop: 7,
        marginBottom: 7,
    },
    
    floor :{
      paddingTop: 15,
      paddingBottom:15,
      paddingRight: 10,
      paddingLeft: 10,
      display: 'flex',
      alignItems: 'center',
    },
    deny:{
      fontSize: Fs/20,
      width: 120,
    },
    accept:{
        width: 120,
        height: 40,
        lineHeight: 40,
        textAlign: 'center',
        fontSize: Fs/22,
        color: '#fff',
        backgroundColor: '#2EA4FF',
        borderRadius: 5,
        padding: 0,
        verticalAlign: 'middle',
    },
})
export default ServiceInfo