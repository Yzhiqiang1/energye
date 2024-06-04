import { Dimensions, StyleSheet, Text, StatusBar, View, Platform} from 'react-native'
import React, { Component } from 'react'
import { Dialog } from '@rneui/themed';
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
            <Dialog 
                overlayStyle={[
                    styles.Loading,
                    Platform.OS === 'ios' ? { transform: [{ translateY: 1 }] } : {},
                    {pointerEvents: 'box-none'}
                ]} 
                isVisible={this.props.visible}
                backdropStyle={{height: screenHeight}}
                >
                <Dialog.Loading />
                <Text style={styles.text}>{this.props.LoadingMsg}</Text>
            </Dialog>
            :
            <Dialog 
                overlayStyle={[styles.showLoading,Platform.OS === 'ios' ? { transform: [{ translateY: 1 }] } : {},]} 
                isVisible={this.props.visible}
                backdropStyle={{height: 0}}
                >
                <Text style={styles.showText}>{this.props.LoadingMsg}</Text>
            </Dialog>
        )
    }
}
const styles = StyleSheet.create({
    Loading: {
        position: 'absolute',
        zIndex: 99999999,
        display:'flex',
        alignItems:'center',
        width:'33%',
        borderRadius:10,
    },
    showLoading:{
        position: 'absolute',
        zIndex: 99999999,
        display:'flex',
        alignItems:'center',
        borderRadius:10,
        padding: 5,
        paddingLeft: 20,
        paddingRight: 20,
        backgroundColor:'#333',
        width:'auto'
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
})
export default Loading