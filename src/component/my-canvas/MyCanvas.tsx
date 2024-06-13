
import * as React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import RNEChartsPro from "react-native-echarts-pro";//echarts图

export class MyCanvas extends React.Component<any,any> {
  constructor(props:any){
    super(props)
    this.state={
      //折线图
      ecLine: true,
      option: {}
    }
  }
  componentDidMount(): void {
      this.ecLine(this.props.objData)
  }   

  componentDidUpdate(prevProps: Readonly<any>): void {
    if(prevProps.objData !== this.props.objData){
      this.setState({
        ecLine: false,
      },()=>{
        this.setState({
          ecLine: true,
        })
      })
      this.ecLine(this.props.objData)
    }
  }
  ecLine=(res: any)=>{
    let that = this;
    let objType = that.props.objType;
    if(objType == 1){
      // 1折线图
      let option = {
        backgroundColor: '#ffffff',
        color:["#1890FF","#17BBB8","#F1A910","#E86B78","#02848B","#FF0096","#FF6803","6CAB06","#8485F6","#476CB2"],
        title: {
            text: res.title,
            padding: [0,10],
            textStyle: {
                color: '#666666',
                fontWeight: 'normal',
                fontSize: 14,
                height: 40,
                lineHeight: 40,
            }
        },
        legend:{
            type: 'scroll',
            top: 29,
            right: 10,
            data: res.legendData,
        },
        tooltip: {
            show: true,
            trigger: 'axis',
            axisPointer: {
                type: 'cross',
                label: {
                    backgroundColor: '#6a7985'
                }
            }
        },
        grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            containLabel: true
        },
        xAxis: {
            type: 'category',
            boundaryGap: false,
            axisLine:{lineStyle:{color:'#389CEE'}},
            axisTick:{show: false},
            axisLabel:{
                color: '#666666',
            },
            data: res.xAxisData,
        },
        yAxis: {
            type: 'value',
            name: res.yAxisName,
            nameLocation:'end',
            nameGap: 12,
            boundaryGap: ['0%', '30%'],
            nameTextStyle:{color: '#666666'},
            axisLine:{show: true,lineStyle:{color:'#389CEE'}},
            axisTick:{show: false,},
            axisLabel:{color: '#666666'},
            splitLine:{lineStyle:{color:['#D8D8D8'],type:'dashed'}},
        },
        series: res.series
      }
      this.setState({
        option: option
      })
    }else if(objType == 2){ //2,3柱状图---普通的柱形图
        this.setState({
          option: {
            backgroundColor: '#ffffff',
            color:["#1890FF","#17BBB8","#F1A910","#E86B78","#02848B","#FF0096","#FF6803","6CAB06","#8485F6","#476CB2"],
            title: {
                text: res.title,
                padding: [0,10],
                textStyle: {color: '#666666',fontWeight: 'normal',fontSize: 14,height: 40,lineHeight: 40}
            },
            legend:{
                type: 'scroll',
                top: 29,
                right: 10,
                data: res.legendData,
            },
            tooltip: {
                show: true,
                trigger: 'axis',
                axisPointer: {type: 'cross',label: {backgroundColor: '#6a7985'}}
            },
            grid: {left: '3%',right: '4%',bottom: '3%',containLabel: true},
            xAxis: {
                type: 'category',
                axisLine:{lineStyle:{color:'#389CEE'}},
                axisTick:{show: false},
                axisLabel:{interval:0,color: '#666666', fontSize: 11},
                data: res.xAxisData,
            },
            yAxis: {
                type: 'value',
                axisLine:{show: true,lineStyle:{color:'#389CEE'}},
                axisTick:{show: false},
                axisLabel:{color: '#666666'},
                splitLine:{lineStyle:{color:['#D8D8D8'],type:'dashed'}},
            },
            series: res.series
          }
        })
    //适合柱状图 
    }else if(objType == 3){ //2,3柱状图-3为可换行，每组多个柱形结构的图形
        this.setState({
          option: {
            color:["#1890FF","#17BBB8","#F1A910","#E86B78","#02848B","#FF0096","#FF6803","6CAB06","#8485F6","#476CB2"],
            backgroundColor: '#ffffff',
            title: {
                text: res.title,
                padding: [0,10],
                textStyle: {
                    color: '#666666',
                    fontWeight: 'normal',
                    fontSize: 14,
                    height: 40,
                    lineHeight: 40,
                }
            },
            legend:{
                type: 'scroll',
                top: 29,
                right: 10,
                data: res.legendData,
            },
            tooltip: {
                show: true,
                trigger: 'axis',
                axisPointer: {
                    type: 'cross',
                    label: {
                        backgroundColor: '#6a7985'
                    }
                }
            }, 
            grid: res.gridData,
            xAxis: res.xAxisData,
            yAxis: res.yAxisData,
            series: res.series
        }
        })
    }else if(objType == 4){ //饼图
        this.setState({
          option: {
            color:["#1890FF","#17BBB8","#F1A910","#E86B78","#02848B","#FF0096","#FF6803","6CAB06","#8485F6","#476CB2"],
            backgroundColor: '#ffffff',
            title: {
                text: res.title,
                padding: [0,10],
                textStyle: {
                    color: '#666666',
                    fontWeight: 'normal',
                    fontSize: 14,
                    height: 40,
                    lineHeight: 40,
                }
            },
            tooltip: {
                trigger: 'item',
            }, 
            legend:{
                type: 'scroll',
                top: 29,
                right: 10,
                data: res.legendData,
            },
            series: res.series
          }
        })
    }
  }
  static defaultProps = {
    objData: {},
    objType: 1,
    objHeight:700,
  };
  render() {
    return (
        <View style = {[styles.my_canvas,this.props.objType == 3?{height:this.props.objHeight}:null]}>
            {this.state.ecLine?
              <RNEChartsPro
              webViewSettings={ this.state.option }
               option={ this.state.option }
               height={ this.props.objType == 3?this.props.objHeight: 300 }
             ></RNEChartsPro>:''
            }
        </View>
    )
  }
}

const styles = StyleSheet.create({
  my_canvas:{
    width: '100%',
    marginBottom: 10,
    backgroundColor: "white",

    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5
  },
})

export default MyCanvas
 