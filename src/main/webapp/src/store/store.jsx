import { configureStore } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import loginReducer from './loginSlice';
import optionReducer from './optionSlice';



   // persist 설정
    const persistConfig = {
    key: 'root',
    storage,
  };

  const rootReducer = {
    Login: persistReducer(persistConfig, loginReducer),
    Option: optionReducer,
  };

 

const store = configureStore({
    reducer:rootReducer ,
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
          serializableCheck: false,
        }),

});
const persistor = persistStore(store);
export {store,persistor};