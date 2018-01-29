import { combineReducers } from 'redux';
import calc from './calcReducer.js';
import purge from './purgeReducer.js';

export default combineReducers({
  calc,
  purge,
});
