import { StyleSheet, Text, View, Image, Pressable, Dimensions } from 'react-native'
import React, { Component } from 'react'
import { CheckBox } from '@rneui/themed';//复选框
const Fs = Dimensions.get('window').width*0.8

export class Tree extends Component<any,any> {
    constructor(props:any){
        super(props)
        this.state={
            tree: []
        }
    }
    componentDidMount(): void {
        if(this.props.dataTree.length > 0){
            //是否全部展开以及选中处理
            let data:Array<any> = []
            this.props.dataTree.forEach((v: { open: any; }) => {
              v.open = this.props.isOpenAll;
              data.push(v)
            })
            //更新数据
            this.setState({
              tree: data
            })
        }
    }
    componentDidUpdate(prevProps: Readonly<any>): void {
         //监听属性变动
        if(prevProps.dataTree != this.props.dataTree){
            if(this.props.dataTree.length > 0){
                //是否全部展开以及选中处理
                let data:Array<any> = []
                this.props.dataTree.forEach((v: { open: any; }) => {
                  v.open = this.props.isOpenAll;
                  data.push(v)
                })
                //更新数据
                this.setState({
                  tree: data
                })
            }
        }
    }
    //展开关闭树
    isOpen = (e:number)=>{
        let newTree = [...this.state.tree]
        newTree[e].open = !this.state.tree[e].open
        this.setState({
            tree: newTree
        })
    }
    // 选择树
    select = (e:number) =>{
        let item = this.state.tree[e];
        this.props.handleSelect(item)
    }
  render() {
    return (
        <View>
            {this.props.dataTree.map((data:any, index:any) => {
                return(
                    <View key={index} style={styles.tree}>
                        <View style={styles.treeItem}>
                            {/*  节点操作图标  */}
                            {data.children && data.children.length > 0?
                                 <Pressable style={styles.treeItemOnOff} onPress={()=>this.isOpen(index)}>
                                    {data.open?
                                        <Image style={styles.img} source={require('../../image/jian.png')}></Image>:
                                        <Image style={styles.img} source={require('../../image/jia.png')}></Image>
                                    }
                                </Pressable>
                                :
                                <View style={styles.treeItemOnOff}>
                                    <Image style={styles.img} source={require('../../image/kong.png')}></Image>
                                </View>
                            }

                            {/* <!-- 节点状态图标 --> */}
                            <View  style={styles.node}>
                                {/* <block wx:if="{{item.children && item.children.length > 0}}"> */}
                                {data.children && data.children.length > 0?
                                    <View>
                                        {data.open?
                                            <Image style={styles.img} source={require('../../image/node_y2.png')}></Image>:
                                            <Image style={styles.img} source={require('../../image/node_y1.png')}></Image>
                                        }
                                    </View>
                                    :
                                    <Image style={styles.img} source={require('../../image/node_n.png')}></Image>
                                }
                            </View>
                            
                            {/*  单选 复选 状态  */}
                            <Pressable style={styles.ul} onPress={()=>this.select(index)} >
                                <View style={styles.checkbox}>
                                    {this.props.isChecks == 1 || this.props.isChecks == 2?
                                        <CheckBox
                                            onPress={()=>this.select(index)}
                                            checked={this.props.selectKey == data.id ? true : false}
                                            checkedIcon="dot-circle-o"
                                            uncheckedIcon="circle-o"
                                            size={14}
                                            containerStyle={styles.container}
                                        />
                                        :
                                        this.props.isChecks == 3 || this.props.isChecks == 6?
                                        <CheckBox
                                            onPress={()=>this.select(index)}
                                            checked={this.props.selectKey[data.id] != undefined ? true : false}
                                            iconType="material-community"
                                            checkedIcon="checkbox-marked"
                                            uncheckedIcon="checkbox-blank-outline"
                                            size={14}
                                            containerStyle={styles.container}
                                        />:this.props.isChecks == 5?
                                        <CheckBox
                                            onPress={()=>this.select(index)}
                                            checked={this.props.selectKey[data.id] != undefined ? true : false}
                                            checkedIcon="dot-circle-o"
                                            uncheckedIcon="circle-o"
                                            size={14}
                                            containerStyle={styles.container}
                                        />:''
                                    }
                                </View>
                                <View style={styles.treeItemName}>
                                    {/*  内容  */}
                                    <Text allowFontScaling={false} style={styles.name}>
                                        {data.title}{this.props.isOpenAll}
                                    </Text>
                                </View>
                            </Pressable>
                        </View>
                        {data.children && data.children.length > 0 && data.open?
                            <Tree
                                dataTree={data.children}
                                selectKey={this.props.selectKey}
                                isOpenAll={this.props.isOpenAll}
                                isChecks={this.props.isChecks}
                                handleSelect={this.props.handleSelect}
                            ></Tree>
                            :''
                        }
                    </View>
                )
            })}
        </View>
    )
  }
}

const styles = StyleSheet.create({
    tree:{
        position: 'relative',
        paddingLeft: 20,
    },
    treeItem:{
        display:'flex',
        flexDirection:'row',
        width: 'auto',
        height: 26,
        zIndex: 99,
    },
    treeItemOnOff:{
        width: 20,
        height: 16,
        paddingTop:4,
        paddingRight:2,
        paddingBottom:4,
        paddingLeft:2,
    },
    img:{
        width: 14,
        height: 14,
    },
    node:{
        width: 20,
        height: 16,
        paddingTop: 4,
        paddingRight: 2,
        paddingBottom: 4,
        paddingLeft: 2,
    },
    ul:{
        display:'flex',
        flexDirection:'row',
        alignItems:'center',
    },
    checkbox:{
        width: 20,
        height: 26,
    },
    container:{
        padding:0,
        marginTop:5,
        marginLeft:5
    },

    treeItemName:{
        height: 26,
    },
    name:{
        fontSize: Fs/25,
        paddingRight: 5,
        paddingLeft: 5,
        color: '#333',
        lineHeight: 26,
        height: 26,
        textAlignVertical: 'center'
    },

})

export default Tree