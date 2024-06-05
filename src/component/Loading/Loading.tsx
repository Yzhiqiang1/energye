import { Dimensions, StyleSheet, Text, StatusBar, View, Platform, ActivityIndicator} from 'react-native'
import React, { Component } from 'react'
import { Dialog } from '@rneui/themed';
import Modal from "react-native-modal";
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
                    <Text style={styles.text}>{this.props.LoadingMsg}</Text>
                </Dialog> */}

                <Modal
                    isVisible={this.props.visible}
                    backdropOpacity={0.4}
                    animationIn={'fadeIn'}
                    animationOut={'fadeOut'}
                    deviceHeight={Dimensions.get('screen').height}
                    animationInTiming={100}
                    animationOutTiming={100}
                    >
                        <View style={styles.modal}>
                            <ActivityIndicator size="large" color="#2da2fe"/>
                            <Text style={styles.text}>{this.props.LoadingMsg}</Text>
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
                    <Text style={styles.showText}>{this.props.LoadingMsg}</Text>
                </Dialog> */}
                 <Modal
                    isVisible={this.props.visible}
                    animationIn={'fadeIn'}
                    animationOut={'fadeOut'}
                    customBackdrop={<View style={{display: 'flex'}}/>}
                    animationInTiming={100}
                    animationOutTiming={100}
                    >
                        <View style={styles.showLoading}>
                            <Text style={styles.showText}>{this.props.LoadingMsg}</Text>
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
        fontSize: Fs/18,
        color: '#333',
    },
    showText: {
        maxWidth: 200,
        fontSize: Fs/18,
        color: '#fff',
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