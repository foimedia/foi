import { combineReducers } from 'redux';
import { serviceList } from 'services/feathers';
import { routerReducer } from 'react-router-redux';

export default function (services) {
  const reducers = {};
  serviceList.forEach(service => {
    reducers[service] = services[service].reducer
  });
  return combineReducers({
    ...reducers,
    auth: services.auth.reducer,
    router: routerReducer,
  });
}
