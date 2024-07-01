import { store } from "../redux/storer";
export class HttpService {
    /* *************
    * 
    * 封装请求函数
    * 
    * ************/
    static Post(url: string | URL | Request, params: {}) {
        if (!params) {
            var params = {};
        }
        return new Promise((resolve, reject) => {
            fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(params), //提交的参数
            }).then(response => response.json()) //数据解析的方式，json解析
            .then(response => {
                resolve(response);
            }).catch((error) => {
                reject(error)
            })
        });
    } 
     /* *************
    * 
    * 封装请求函数-需要Token验证
    * 
    * ************/
    static apiPost(url: string | URL | Request, params: {}) {   
        if (!params) {
            var params = {};
        }
        return new Promise((resolve, reject) => {
            fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'authorization': 'Bearer ' +  store.getState().accessToken,
                    'tlinkAppId': store.getState().clientId,
                },
                body: JSON.stringify(params), //提交的参数
            }).then(response => response.json()) //数据解析的方式，json解析
            .then(response => {
                resolve(response);
            }).catch((error) => {
                reject(error)
            })
        });
    } 

    static apiGET(url: string | URL | Request, params: {}) {
        if (params) {
        } else {
            var params = {};
        }
        return new Promise((resolve, reject) => {
            fetch(url, {
                method: 'GET', 
                headers: {
                    'Content-Type': 'application/json',
                    'authorization': 'Bearer '+  store.getState().accessToken,
                    'tlinkAppId': store.getState().clientId,
                },
                body: JSON.stringify(params), //提交的参数
            }).then(response => response.json()) //数据解析的方式，json解析
                .then(response => {
                    resolve(response);
                }).catch((error) => {
                console.log(error);
            })
        });
    }
}
