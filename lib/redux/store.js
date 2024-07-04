import storage from "@/storage"
import persistReducer from "redux-persist/es/persistReducer"
import rootReducer from "./slices/rootReducer"
import { configureStore } from "@reduxjs/toolkit"
import { FLUSH, PAUSE, PERSIST, PURGE, REGISTER, REHYDRATE } from "redux-persist"
const persistConfig={
  key:'root',
  version:1,
  storage,
  blacklist:[]
}

const persistReducers=persistReducer(persistConfig,rootReducer)

export const store=configureStore({
  reducer:persistReducers,
  middleware:(getDefaultMiddleware)=>getDefaultMiddleware({
    serializableCheck:{
      ignoreActions:[FLUSH,REHYDRATE,PAUSE,PERSIST,PURGE,REGISTER]
    }
  }),
  // devTools:process.env.
})