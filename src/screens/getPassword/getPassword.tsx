import { Text, View } from 'react-native'
import React, { Component } from 'react'

export class GetPassword extends Component {
    constructor(props:any){
        super(props)
        this.state={
            visible: true
        }
    }
    render() {
        return (
        <View>
            <Text>getPassword</Text>
        </View>
        )
    }
}

export default GetPassword