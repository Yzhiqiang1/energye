import { StyleSheet} from 'react-native'
const styles = StyleSheet.create({
    containerMini: { 
        position: 'absolute',
        top: 70,
        bottom:75,
        left: 0,
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
        fontSize: 22,
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
    }
})
export default styles