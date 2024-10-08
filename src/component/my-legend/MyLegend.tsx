import { Dimensions, Image, Pressable, StyleSheet, Text, View, Modal } from 'react-native'
import * as React from 'react';
import styleg from '../../indexCss'
import { CheckBox } from '@rneui/base';
const Fs = Dimensions.get('window').width*0.8

export class MyLegend extends React.Component<any,any> {
    constructor(props:any){
        super(props)
        this.state={
            result: [],
            result2: [],
            result2for: [],
            n: '',
            show: false,
            show2: false,
            contentSel: [],
            actions: [{
                    name: '选项1'
                },
                {
                    name: '选项2'
                },
                {
                    name: '选项3'
                },
            ],
            allCheck: '0', // 取消0  全选1
            checkItem: true, //单项默认选中状态
        }
    }
    componentDidMount(): void {
        let data = []
        for(let i = 0; i < 31; i++){
            let j = i
            if(j != 0){
                j++
            }
            data.push(String(j))
        }
        this.setState({
            result: this.props.objData.categorys,
            result2: this.props.objData.harmonics,
            n: this.props.objData.harmonics.length,
            result2for: data
        })
    }
    componentDidUpdate(prevProps: Readonly<any>): void {
        if(this.props.objData !== prevProps.objData){
            this.setState({
                result: this.props.objData.categorys,
                result2: this.props.objData.harmonics,
                n: this.props.objData.harmonics.length,
            })
        }
    }
    // abc相-标题页-点击复选框
    onChange=(e:any)=> {
        let result = this.state.result
        if(!result.includes(e)){
            result.push(e)
        }else {
            result.splice(result.indexOf(e), 1)
        }
        this.setState({
            result: result
        })
        this.props.myevent([result,this.props.dataIndex])
    }
    // 谐波弹窗页-点击单个复选框 pop-checkbox
    onChange2=(e:any)=> {
        let data = this.state.result2
        if(data.includes(e)){
            data.splice(data.indexOf(e), 1)
        }else{
            data.push(e)
        }
        this.setState({
            result2: data,
        })
        this.setState({})
    }
    //弹窗页-点击全选复选框
    setAllCheck=(e:any)=> {
        let that = this
        if(e != 31){//非全选 --》全选
            that.setState({
                allCheck: 1,
                result2:['0', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23', '24', '25', '26', '27', '28', '29', '30', '31']
            })
        }else{
            that.setState({
                allCheck: 0,
                result2:[]
            })
        }
    }
    // 弹窗确定按钮
    onTap=(e:any)=> {
        var harmArr = this.state.result2
        this.setState({
            contentSel: harmArr,
            n:this.state.result2.length
        })
        this.onClose()
        this.props.myevent2([harmArr,this.props.dataIndex])
    }
    // 弹窗pop
    showPopup=()=> {
        this.setState({
            show: true
        });
    }
    onClose=()=> {
        this.setState({
            show: false
        });
    }
    render=()=> {
        const { t } = this.props
        return (
        <View>
            <View style={styles.query_head}>
                {/* 复选框 */}
                <View style={styles.flex}>
                    <CheckBox
                    checked={this.state.result.includes('a')}
                    onPress={()=>this.onChange('a')}
                    iconType="material-community"
                    checkedIcon="checkbox-marked"
                    uncheckedIcon="checkbox-blank-outline"
                    title='A相'
                    containerStyle={styles.CheckBox}
                    />
                    <CheckBox
                    checked={this.state.result.includes('b')}
                    onPress={()=>this.onChange('b')}
                    iconType="material-community"
                    checkedIcon="checkbox-marked"
                    uncheckedIcon="checkbox-blank-outline"
                    title='B相'
                    containerStyle={styles.CheckBox}
                    />
                    <CheckBox
                    checked={this.state.result.includes('c')}
                    onPress={()=>this.onChange('c')}
                    iconType="material-community"
                    checkedIcon="checkbox-marked"
                    uncheckedIcon="checkbox-blank-outline"
                    title='C相'
                    containerStyle={styles.CheckBox}
                    />
                </View>
                {/* 弹出框按钮  contentSel.length*/}
                <Pressable style={styles.dial} onPress={this.showPopup}>
                    <Text allowFontScaling={false} style={styles.dialText}>已选中{this.state.n}种谐波含量</Text>
                    <Image style={styleg.ico} source={require('../../image/down.png')}></Image>
                </Pressable>
                <Modal 
                    transparent={true}
                    visible={this.state.show}
                    presentationStyle={'overFullScreen'}
                >
                    <View style={styles.modalBox}>
                        <View style={styles.dialogBox}>
                            <View style={styles.dialogCont}>
                                <View style={[styles.tr,styles.bgG]}>
                                    {this.state.result2for.map((data:any,index:number)=>{
                                        return(
                                            <View style={styles.Box} key={index}>
                                                {index==0?
                                                    <CheckBox
                                                    checked={this.state.result2.includes(data)}
                                                    onPress={()=>this.onChange2(data)}
                                                    iconType="material-community"
                                                    checkedIcon="checkbox-marked"
                                                    uncheckedIcon="checkbox-blank-outline"
                                                    title="总谐波"
                                                    containerStyle={styles.CheckBox}
                                                    size={20}
                                                    />:
                                                    <CheckBox
                                                    checked={this.state.result2.includes(data)}
                                                    onPress={()=>this.onChange2(data)}
                                                    iconType="material-community"
                                                    checkedIcon="checkbox-marked"
                                                    uncheckedIcon="checkbox-blank-outline"
                                                    title={`${data}`+ "次谐波"}
                                                    containerStyle={styles.CheckBox}
                                                    size={20}
                                                    />
                                                }
                                            </View>
                                        )
                                    })}
                                    <View style={styles.dialogBottom}>
                                        <CheckBox
                                        checked={this.state.result2.length == 31}
                                        onPress={()=>this.setAllCheck(this.state.result2.length)}
                                        title="全选"
                                        containerStyle={styles.CheckBox}
                                        iconType="material-community"
                                        checkedIcon="checkbox-marked"
                                        uncheckedIcon="checkbox-blank-outline"
                                        size={20}
                                        />
                                        <View style={styles.dialBottom}>
                                            <Text allowFontScaling={false} style={styles.button} onPress={this.onTap}>确定</Text>
                                        </View>
                                    </View>
                                </View>
                            </View>
                        </View>
                    </View>
                </Modal>
            </View>
        </View>
        )
    }
}

const styles = StyleSheet.create({
    query_head :{
        position: 'relative',
        width: '100%',
        height: 50,
        paddingLeft: 10,
        paddingRight: 10,
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff',
        overflow: 'hidden',
        fontSize: Fs/24,
    },
    
    dial :{
        position: 'relative',
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        width: 'auto',
        height: 30,
        paddingLeft: 12,
        paddingRight: 12,
        borderWidth: 1,
        borderColor: '#d9d9d9',
        borderStyle: 'solid',
        borderRadius: 5,
        marginLeft: 7,
        overflow: 'hidden',
        flex: 2.2,
    },
    dialText:{
        fontSize: Fs/24,
        color: '#666666',
        marginRight: 5,
    },
    
    checkboxs :{
        marginLeft: 7,
    },
    
    flex :{
        flex: 3,
        display:'flex',
        flexDirection:'row'
    },
    
    /* 弹框 */
    popContainer :{
        fontSize: Fs/20,
    },
    
    dialogCont :{
        margin: 10,
    },
    
    dialogBottom :{
        width: '100%',
    },
    
    dialSelectAll :{
        height: 15,
        textAlign: 'left',
    },
    
    dialBottom :{
        width: '100%',
        display: 'flex',
        alignItems:'center',
        marginBottom: 10,
    },
    button:{
        width: 70,
        height: 30,
        lineHeight: 30,
        textAlignVertical: 'center',
        color: '#fff',
        backgroundColor: '#1890FF',
        borderRadius: 5,
        fontSize: Fs/20,
        textAlign: 'center',
    },
    checkbox:{
        fontWeight: 'bold',
    },
    tr :{
        display: 'flex',
        width: '100%',
    },
    
    td :{
        width: '40%',
    },
    
    bgG:{
        display: 'flex',
        flexDirection:'row',
        flexWrap: 'wrap',
        width: '100%'
    },
    Box:{
        width: '25%',
    },
    wxCheckboxInput :{
        borderWidth: 0,
    },
    CheckBox:{
        padding: 0,
        paddingTop: 2,
        paddingBottom: 2,
        marginRight: 0,
        marginLeft: 0
    },
    dialogBox:{
        position: 'absolute',
        bottom: -20,
        width: '100%',
        height: 400,
        borderRadius: 10,
        backgroundColor:'#fff'
    },
    modalBox: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.4)',
        justifyContent: "center",
        alignItems: "center",
    },
})

export default MyLegend