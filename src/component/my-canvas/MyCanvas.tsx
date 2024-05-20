
import * as React from 'react';
import { View, StyleSheet, Text, } from 'react-native';
import RNEChartsPro from "react-native-echarts-pro";//echarts图
import ViewShot, { captureRef } from 'react-native-view-shot';//截图组件
import { CameraRoll } from '@react-native-camera-roll/camera-roll';

let echarts: any
export class MyCanvas extends React.Component<any,any> {
  constructor(props:any){
    super(props)
    this.state={
       //折线图
       ecLine: {
        lazyLoad: true,
      },
      option:{}
    }
  }
  componentDidMount(): void {
    this.ecLine(this.props.objData)
  }

  componentDidUpdate(prevProps: Readonly<any>): void {
    if(prevProps.objData !== this.props.objData){
      this.ecLine(this.props.objData)
    }
  }
  _downImg=()=>{
    console.log(1);
  }
  ecLine=(res: any)=>{
    let that = this;
    let objType = that.props.objType;
    if(objType == 1){ // 1折线图
      this.setState({
        option: {
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
                    // interval: 0, // 设置数据间隔
                    // rotate: -38, // 标题倾斜
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
      },()=>echarts.setNewOption(this.state.option, {
        notMerge: true,
        lazyUpdate: true,
        }))
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
      <View style={[styles.my_canvas,this.props.objType == 3?{height:this.props.objHeight}:null]}>
            <View style={styles.chart}>
                <RNEChartsPro 
                ref={(ref: any) => (echarts = ref)}
                option={this.state.option} 
                height={this.props.objType== 3?this.props.objHeight:300} 
                ></RNEChartsPro>
            </View>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  my_canvas:{
    position: 'relative',
    width: '100%',
    height: 300,
  },
  chart:{
    position: 'relative',
    width: '100%',
    height: '100%',
    zIndex: 99,
    overflow: 'hidden'
  },
  img:{
    position: 'absolute',
    top: 5,
    right: 10,
    width: 15,
    height: 15,
    zIndex: 999999
  }
})

export default MyCanvas

// import { View, Text } from 'react-native'
// import React, { useEffect, useRef, useState } from 'react'
// import * as echarts from 'echarts/core';
// import { LineChart } from 'echarts/charts';
// import { GridComponent } from 'echarts/components';
// import { SVGRenderer, SkiaChart } from '@wuba/react-native-echarts';

// echarts.use([SVGRenderer, LineChart, GridComponent]);
// // ECharts实例
// export default function MyCanvas(props:any) {
//     let chart: any;
//     const skiaRef = useRef<any>(null);
//     useEffect(() => {
//         let option:any;
//         let objType = props.objType? props.objType :1
//         // 1折线图 2,3柱状图样式有所不同） 4饼状图
//         if(objType == 1){ // 1折线图
//             option = {
//                 backgroundColor: '#ffffff',
//                 color:["#1890FF","#17BBB8","#F1A910","#E86B78","#02848B","#FF0096","#FF6803","6CAB06","#8485F6","#476CB2"],
//                 title: {
//                     text: props.objData.title,
//                     padding: [0,10],
//                     textStyle: {
//                         color: '#666666',
//                         fontWeight: 'normal',
//                         fontSize: 14,
//                         height: 40,
//                         lineHeight: 40,
//                     }
//                 },
//                 legend:{
//                     type: 'scroll',
//                     top: 29,
//                     right: 10,
//                     data: props.objData.legendData,
//                 },
//                 tooltip: {
//                     show: true,
//                     trigger: 'axis',
//                     axisPointer: {
//                         type: 'cross',
//                         label: {
//                             backgroundColor: '#6a7985'
//                         }
//                     }
//                 },
//                 toolbox: {
//                     showTitle: false,
//                     itemSize: 12,
//                     iconStyle:{
//                         color:'#999999',
//                     },
//                     feature: {
//                         myTool1: {
//                             show: true,
//                             title: '导出图片',
//                             icon: 'path://M987.428571 621.714286h-73.142857v292.571428h-804.571428v-292.571428h-73.142857v365.714285h950.857142v-365.714285z M475.428571 731.428571h73.142858V36.571429h-73.142858V731.428571z M497.371429 753.371429l51.2-51.2-204.8-204.8-51.2 51.2 204.8 204.8z M512 768l226.742857-219.428571-51.2-51.2-226.742857 219.428571 51.2 51.2z',
//                             onclick: function (){
//                                 //导出图片
//                                 // this._downImg();
//                             }
//                         }
//                     }
//                 },
//                 grid: {
//                     left: '3%',
//                     right: '4%',
//                     bottom: '3%',
//                     containLabel: true
//                 },
//                 xAxis: {
//                     type: 'category',
//                     boundaryGap: false,
//                     axisLine:{lineStyle:{color:'#389CEE'}},
//                     axisTick:{show: false},
//                     axisLabel:{
//                         color: '#666666',
//                         // interval: 0, // 设置数据间隔
//                         // rotate: -38, // 标题倾斜
//                     },
//                     data: props.objData.xAxisData,
//                 },
//                 yAxis: {
//                     type: 'value',
//                     name: props.objData.yAxisName,
//                     nameLocation:'end',
//                     nameGap: 12,
//                     boundaryGap: ['0%', '30%'],
//                     nameTextStyle:{color: '#666666'},
//                     axisLine:{show: true,lineStyle:{color:'#389CEE'}},
//                     axisTick:{show: false,},
//                     axisLabel:{color: '#666666'},
//                     splitLine:{lineStyle:{color:['#D8D8D8'],type:'dashed'}},
//                 },
//                 series: props.objData.series
//             };
//         }else if(objType == 2){ //2,3柱状图---普通的柱形图
//             option = {
//                 backgroundColor: '#ffffff',
//                 color:["#1890FF","#17BBB8","#F1A910","#E86B78","#02848B","#FF0096","#FF6803","6CAB06","#8485F6","#476CB2"],
//                 title: {
//                     text: props.objData.title,
//                     padding: [0,10],
//                     textStyle: {color: '#666666',fontWeight: 'normal',fontSize: 14,height: 40,lineHeight: 40}
//                 },
//                 legend:{
//                     type: 'scroll',
//                     top: 29,
//                     right: 10,
//                     data: props.objData.legendData,
//                 },
//                 tooltip: {
//                     show: true,
//                     trigger: 'axis',
//                     axisPointer: {type: 'cross',label: {backgroundColor: '#6a7985'}}
//                 },
//                 toolbox: {
//                     showTitle: false,
//                     itemSize: 12,
//                     iconStyle:{color:'#999999'},
//                     feature: {
//                         myTool1: {
//                             show: true,
//                             title: '导出图片',
//                             icon: 'path://M987.428571 621.714286h-73.142857v292.571428h-804.571428v-292.571428h-73.142857v365.714285h950.857142v-365.714285z M475.428571 731.428571h73.142858V36.571429h-73.142858V731.428571z M497.371429 753.371429l51.2-51.2-204.8-204.8-51.2 51.2 204.8 204.8z M512 768l226.742857-219.428571-51.2-51.2-226.742857 219.428571 51.2 51.2z',
//                             onclick: function (){
//                                 //导出图片
//                                 // that._downImg();
//                             }
//                         }
//                     }
//                 },
//                 grid: {left: '3%',right: '4%',bottom: '3%',containLabel: true},
//                 xAxis: {
//                     type: 'category',
//                     axisLine:{lineStyle:{color:'#389CEE'}},
//                     axisTick:{show: false},
//                     axisLabel:{interval:0,color: '#666666', fontSize: 11},
//                     data: props.objData.xAxisData,
//                 },
//                 yAxis: {
//                     type: 'value',
//                     axisLine:{show: true,lineStyle:{color:'#389CEE'}},
//                     axisTick:{show: false},
//                     axisLabel:{color: '#666666'},
//                     splitLine:{lineStyle:{color:['#D8D8D8'],type:'dashed'}},
//                 },
//                 series: props.objData.series
//             };
//         //适合柱状图 
//         }else if(objType == 3){ //2,3柱状图-3为可换行，每组多个柱形结构的图形
//             option = {
//                 color:["#1890FF","#17BBB8","#F1A910","#E86B78","#02848B","#FF0096","#FF6803","6CAB06","#8485F6","#476CB2"],
//                 backgroundColor: '#ffffff',
//                 title: {
//                     text: props.objData.title,
//                     padding: [0,10],
//                     textStyle: {
//                         color: '#666666',
//                         fontWeight: 'normal',
//                         fontSize: 14,
//                         height: 40,
//                         lineHeight: 40,
//                     }
//                 },
//                 legend:{
//                     type: 'scroll',
//                     top: 29,
//                     right: 10,
//                     data: props.objData.legendData,
//                 },
//                 tooltip: {
//                     show: true,
//                     trigger: 'axis',
//                     axisPointer: {
//                         type: 'cross',
//                         label: {
//                             backgroundColor: '#6a7985'
//                         }
//                     }
//                 }, 
//                 toolbox: {
//                     showTitle: false,
//                     itemSize: 12,
//                     iconStyle:{
//                         color:'#999999',
//                     },
//                     feature: {
//                         myTool1: {
//                             show: true,
//                             title: '导出图片',
//                             icon: 'path://M987.428571 621.714286h-73.142857v292.571428h-804.571428v-292.571428h-73.142857v365.714285h950.857142v-365.714285z M475.428571 731.428571h73.142858V36.571429h-73.142858V731.428571z M497.371429 753.371429l51.2-51.2-204.8-204.8-51.2 51.2 204.8 204.8z M512 768l226.742857-219.428571-51.2-51.2-226.742857 219.428571 51.2 51.2z',
//                             onclick: function (){
//                                 //导出图片
//                                 // that._downImg();
//                             }
//                         }
//                     }
//                 },
//                 grid: props.objData.gridData,
//                 xAxis: props.objData.xAxisData,
//                 yAxis: props.objData.yAxisData,
//                 series: props.objData.series
//             };
//         }else if(objType == 4){ //饼图
            
//             option = {
//                 color:["#1890FF","#17BBB8","#F1A910","#E86B78","#02848B","#FF0096","#FF6803","6CAB06","#8485F6","#476CB2"],
//                 backgroundColor: '#ffffff',
//                 title: {
//                     text: props.objData.title,
//                     padding: [0,10],
//                     textStyle: {
//                         color: '#666666',
//                         fontWeight: 'normal',
//                         fontSize: 14,
//                         height: 40,
//                         lineHeight: 40,
//                     }
//                 },
//                 tooltip: {
//                     trigger: 'item',
//                 }, 
//                 toolbox: {
//                     showTitle: false,
//                     itemSize: 12,
//                     iconStyle:{
//                         color:'#999999',
//                     },
//                     feature: {
//                         myTool1: {
//                             show: true,
//                             title: '导出图片',
//                             icon: 'path://M987.428571 621.714286h-73.142857v292.571428h-804.571428v-292.571428h-73.142857v365.714285h950.857142v-365.714285z M475.428571 731.428571h73.142858V36.571429h-73.142858V731.428571z M497.371429 753.371429l51.2-51.2-204.8-204.8-51.2 51.2 204.8 204.8z M512 768l226.742857-219.428571-51.2-51.2-226.742857 219.428571 51.2 51.2z',
//                             onclick: function (){
//                                 //导出图片
//                                 // that._downImg();
//                             }
//                         }
//                     }
//                 },
//                 legend:{
//                     type: 'scroll',
//                     top: 29,
//                     right: 10,
//                     data: props.objData.legendData,
//                 },
//                 series: props.objData.series
//             };
//         }
//         // const option = {
//         //     xAxis: {
//         //       type: 'category',
//         //       data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
//         //     },
//         //     yAxis: {
//         //       type: 'value',
//         //     },
//         //     series: [
//         //       {
//         //         data: [150, 230, 224, 218, 135, 147, 260],
//         //         type: 'line',
//         //       },
//         //     ],
//         // };
//         if (skiaRef.current) {
//             chart = echarts.init(skiaRef.current, 'light', {
//                 renderer: 'svg',
//                 width: 400,
//                 height: 400,
//             });
//             chart.setOption(option);
//         }
//             return () =>chart?.dispose()//卸载时释放图表。
//     }, [props.objType,props.objData]);


//     return <View>
//         <SkiaChart ref={skiaRef} />
//         <Text>{props.objType}</Text>
//     </View>
// }
