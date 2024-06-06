import { Dimensions, SafeAreaView, StyleSheet, View} from 'react-native'
import React, { Component } from 'react'
import { WebView } from 'react-native-webview'
import LoginNavbar from '../../component/loginNavbar/loginNavbar'
const ht = Dimensions.get('window').height*0.8

export class ConfigurationDetails extends Component<any,any> {
    constructor(props:any){
        super(props)
        this.state = {
            url: props.url 
        }
    }
    render() {        
        return (
            <View style={{flex: 1}}>
                <View style={{position: 'absolute',top: 0,width: "100%",height: "100%",backgroundColor: '#2da2fe'}}>
                </View>
                <SafeAreaView style={{ flex: 1 }}>
                    <View style={{height:ht/10,backgroundColor:'#2ea4ff'}}>
                        <LoginNavbar 
                            props={this.props}
                            name={this.props.route.params.name}
                            showBack={true}
                            showHome={false}
                        >
                        </LoginNavbar>
                    </View>
                    <WebView style={styles.WebView}
                        source={{ uri: this.props.route.params.url }}
                    ></WebView>
                </SafeAreaView>
            </View>
        )
    }
}
const styles = StyleSheet.create({
    WebView:{   
        flex: 1,
    }
})
export default ConfigurationDetails