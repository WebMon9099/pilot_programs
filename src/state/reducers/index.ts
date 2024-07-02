import { combineReducers } from 'redux';
import activityStateReducer from './activityStateReducer';

const reducers = combineReducers({
  activityState: activityStateReducer,
});

export default reducers;
