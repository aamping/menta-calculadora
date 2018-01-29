import storage from 'redux-persist/es/storage';
import {  createStore } from 'redux';
//import { createFilter } from 'redux-persist-transform-filter';
import { persistReducer, persistStore } from 'redux-persist';
import rootReducer from './reducers';

export default () => {
  //const persistedFilter = createFilter('calc', ['fase', 'titulo', 'referencia', 'fecha', 'pesoTotal']);

  const reducer = persistReducer(
    {
      key: 'polls',
      storage,
      whitelist: ['calc'],
    },
    rootReducer,
  );

  const store = createStore(
    reducer
  );

  persistStore(store);
    // persistStore(store).purge();

  return store;
}
