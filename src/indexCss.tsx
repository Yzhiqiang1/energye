import { Dimensions, StatusBar, StyleSheet, Platform, NativeModules } from 'react-native'
const { StatusBarManager } = NativeModules;
const STATUS_BAR_HEIGHT = Platform.OS === 'ios' ? StatusBar.currentHeight : StatusBarManager.HEIGHT;//状态栏高度
const Fs = Dimensions.get('window').width*0.8
const styleg = StyleSheet.create({
    statusBar: {
        top: STATUS_BAR_HEIGHT,
        marginBottom: STATUS_BAR_HEIGHT
    },
    containerMax:{
        flex:1,
        backgroundColor: '#f4f4f4',
        zIndex: 9,
        overflow: 'visible',
    },
    containerMini:{
        flex: 1,
        width: '100%',
        backgroundColor: '#f4f4f4',
        zIndex: 9,
        overflow: 'scroll',
    },
    container:{
        flex: 1,
        width: '100%',
        backgroundColor: '#f4f4f4',
        zIndex: 9,
    },
    container10:{
        flex: 1,
        width: '100%',
        backgroundColor: '#f4f4f4',
        zIndex: 9,
    },
    button:{
        display:'flex',
        flexDirection:'row',
        alignItems: 'center',
        justifyContent: 'space-between', 
        height: 35,
        lineHeight: 35,
        paddingLeft: 10,
        paddingRight: 10,
        borderStyle:'solid',
        borderWidth: 1,
        borderColor: '#d9d9d9',
        borderRadius: 2,
        marginRight: 5,
        overflow: 'hidden',
    },
    TextButton:{
        fontSize: Fs/22,
        color: '#666666',
        overflow: 'hidden',
        lineHeight: 30,
    },
    ico:{
        width: 15,
        height: 15,
        overflow: 'hidden',
    },
    picker:{
        position: 'relative',
        width:100,
        height:30,
        display:'flex',
        flexDirection: 'row',
        alignItems: 'center',
        borderStyle:'solid',
        borderWidth: 1,
        borderColor: '#d9d9d9',
        borderRadius: 5,
        marginLeft: 5,
        overflow: 'hidden',
    },
    pickerIco:{
        position: 'absolute',
        top: 7,
        right: 10,
        width: 15,
        height: 15,
        overflow: 'hidden',
    }
})
export default styleg