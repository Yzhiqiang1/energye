import { Dimensions, StyleSheet, Text, StatusBar, View, ActivityIndicator, Modal} from 'react-native'
import React, { Component } from 'react'
const Fs = Dimensions.get('window').width*0.8
const screenHeight = Dimensions.get('screen').height-Number(StatusBar.currentHeight);

export class Loading extends Component<any,any> {
    static defaultProps = {
        type: 1,
        LoadingMsg: '加载中...',
        visible: false
    }
    
    render() {
        return (
            this.props.type == 1 ?
            <View>
                {/* <Dialog 
                    overlayStyle={[
                        styles.Loading,
                        Platform.OS === 'ios' ? { transform: [{ translateY: 1 }] } : {},
                        {pointerEvents: 'none'}
                    ]} 
                    isVisible={this.props.visible}
                    backdropStyle={{position: 'absolute',height: screenHeight}}
                    >
                    <Dialog.Loading />
                    <Text allowFontScaling={false} style={styles.text}>{this.props.LoadingMsg}</Text>
                </Dialog> */}
                <Modal
                animationType="fade"
                transparent={true}
                visible={this.props.visible}
                presentationStyle={'overFullScreen'}
                >
                    <View style={styles.modalBox}>
                        <View style={styles.modal}>
                            <ActivityIndicator size="large" color="#2da2fe"/>
                            <Text allowFontScaling={false} style={styles.text}>{this.props.LoadingMsg}</Text>
                        </View>
                    </View>
                </Modal>
            </View>
            :
            <View>
                {/* <Dialog 
                    overlayStyle={[styles.showLoading,Platform.OS === 'ios' ? { transform: [{ translateY: 1 }] } : {},]} 
                    isVisible={this.props.visible}
                    backdropStyle={{height: 0}}
                    >
                    <Text allowFontScaling={false} style={styles.showText}>{this.props.LoadingMsg}</Text>
                </Dialog> */}
                 <Modal
                    animationType="fade"
                    transparent={true}
                    visible={this.props.visible}
                    presentationStyle={'overFullScreen'}
                    >
                        <View style={{flex: 1,alignItems:'center',justifyContent:'center'}}>
                            <View style={styles.showLoading}>
                                <Text allowFontScaling={false} style={styles.showText}>{this.props.LoadingMsg}</Text>
                            </View>
                        </View>
                </Modal>
            </View>
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
        borderRadius:10,
        padding: 5,
        paddingLeft: 20,
        paddingRight: 20,
        margin: 50,
        backgroundColor:'#333',
    },
    text: {
        fontSize: Fs/22,
        color: '#333',
    },
    showText: {
        maxWidth: 200,
        fontSize: Fs/22,
        color: '#fff',
    },
    modalBox: {
        height: screenHeight,
        width: '100%',
        justifyContent: 'center', 
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)'
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
        backgroundColor: '#fff',
    }
})
export default Loading