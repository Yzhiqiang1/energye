import { Dimensions, PixelRatio, StyleSheet } from 'react-native'
const ht = Dimensions.get('window').height*PixelRatio.getFontScale()//屏幕高度
const height = Dimensions.get('window').height-ht/9//屏幕显示区域高度
const styleg = StyleSheet.create({
    containerMax:{
        flex:1,
        backgroundColor: '#f4f4f4',
        zIndex: 9,
        overflow: 'scroll',
    },
    containerMini:{
        position: 'absolute',
        top: ht/10+10,
        left: 0,
        width: '100%',
        backgroundColor: '#f4f4f4',
        zIndex: 9,
        overflow: 'scroll',
    },
    container:{
        position: 'absolute',
        top: ht/9,
        width: '100%',
        height: height,
        backgroundColor: '#f4f4f4',
        zIndex: 9,
    },
    container10:{
        position: 'absolute',
        top: ht/10,
        width: '100%',
        height: height,
        backgroundColor: '#f4f4f4',
        zIndex: 9,
    },
    button:{
        display:'flex',
        flexDirection:'row',
        alignItems: 'center',
        justifyContent: 'space-between', 
        height: 30,
        paddingLeft: 10,
        paddingRight: 10,
        borderStyle:'solid',
        borderWidth: 1,
        borderColor: '#d9d9d9',
        borderRadius: 5,
        marginRight: 5,
        overflow: 'hidden',
    },
    TextButton:{
        fontSize: 16,
        color: '#666666',
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