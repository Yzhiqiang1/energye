import { configureStore } from '@reduxjs/toolkit'
import reducer from "./reducers/counterSlice"//引入createSlice
import storage from '@react-native-async-storage/async-storage';//本地存储
import { persistReducer, persistStore } from 'redux-persist';//redux状态持久化

const persistConfig = {
    key: 'root',
    storage,
    whitelist: [
      'userId',
      'userName',
      'clientId',
      'secret',
      'websocket_key',
      'avatar',
      'firstApp',
      'privacy'
    ],//需要持续化存储字段
  };

const persistedReducer = persistReducer(persistConfig,reducer)//reducer绑定持久化状态

export const store = configureStore({
    reducer: persistedReducer,
    middleware: getDefaultMiddleware =>
      getDefaultMiddleware({
        serializableCheck: false, 
      }),
  });

export const persistor = persistStore(store)
