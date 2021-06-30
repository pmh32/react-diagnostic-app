import initialState from 'store/globalState/initialState';

// action type
import {
  GET_NODES,
  INIT_NODES,
} from './types';

// reducer functions
export default function diagnosisReducer(state = initialState.diagnosis, action) {
  switch (action.type) {
    case INIT_NODES:
      return {
        nodes: [],
      };
    case GET_NODES:
      return {
        nodes: action.payload,
      };
    default:
      return state;
  }
}
