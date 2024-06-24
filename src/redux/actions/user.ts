export const Set_accessToken = (data: any) => {
    return {
        type: 'Set_accessToken',
        data: data,
    }
}

export const Set_State = (data: any) => {
    return {
        type: 'Set_State',
        data: data,
    }
}

export const Log_Out = () => {
    return {
        type: 'Log_Out',
        data: ''
    }
}

export const parameter_Group = (data: any) =>{
    return {
        type: 'parameter_Group',
        data: data
    }
}

export const localSocket = (data: any) =>{
    return {
        type: 'localSocket',
        data: data
    }
}


export const scene = (data: any) =>{
    return {
        type: 'scene',
        data: data
    }
}

