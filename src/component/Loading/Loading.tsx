import { Dimensions, StyleSheet, Text, StatusBar, View, ActivityIndicator, Modal} from 'react-native'
import React, { Component } from 'react'
import { t } from 'i18next'

const Fs = Dimensions.get('window').width*0.8
const screenHeight = Dimensions.get('screen').height

export class Loading extends Component<any,any> {
    static defaultProps = {
        type: 1,
        LoadingMsg: t('Loading'),
        visible: false
    }
    render() {
        return (
            this.props.type == 1 ?
                this.props.visible?
                    <View style={styles.modalBox}>
                        <View style={styles.modal}>
                            <ActivityIndicator size="large" color="#fff"/>
                            <Text allowFontScaling={false} style={styles.text}>{this.props.LoadingMsg}</Text>
                        </View>
                    </View>:''
                :
            this.props.visible?
                <View style={styles.modalBox}>
                    <View style={styles.showLoading}>
                        <Text allowFontScaling={false} style={styles.showText}>{this.props.LoadingMsg}</Text>
                    </View>
                </View>:''
        )
    }
}
const styles = StyleSheet.create({
    Loading: {
        position: 'absolute',
        zIndex: 999999,
        display:'flex',
        alignItems:'center',
        width:'33%',
        borderRadius:10,
        backgroundColor: '#fff'
    },
    showLoading:{
        display:'flex',
        alignItems:'center',
        justifyContent: 'center',
        borderRadius:10,
        padding: 5,
        paddingLeft: 20,
        paddingRight: 20,
        margin: 50,
        backgroundColor:'#333',
    },
    text: {
        fontSize: Fs/22,
        color: '#fff',
    },
    showText: {
        maxWidth: 200,
        fontSize: Fs/22,
        color: '#fff',
    },
    modalBox: {
        position: 'absolute',
        zIndex: 99999999,
        height: screenHeight,
        width: '100%',
        justifyContent: 'center', 
        alignItems: 'center',
    },
    modal: {
        position: 'absolute',
        left: '50%',
        marginLeft: -Dimensions.get('screen').width/3/2,
        display:'flex',
        alignItems:'center',
        justifyContent: 'space-evenly',
        width: Dimensions.get('screen').width/3,
        height: Dimensions.get('screen').width/3,
        borderRadius:10,
        backgroundColor: '#666666',
    },
})
export default Loading