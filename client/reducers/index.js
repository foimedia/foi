import { combineReducers } from 'redux';
import { serviceMap } from 'services/feathers';
import { routerReducer } from 'react-router-redux';

export default function (services) {
  const reducers = {};
  for(var key in serviceMap) {
    reducers[key] = services[serviceMap[key]].reducer
  }
  return combineReducers({
    ...reducers,
    auth: services.auth.reducer,
    router: routerReducer,
  });
}
