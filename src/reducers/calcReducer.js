import * as calc from '../actions/calcActions';
import { PURGE } from 'redux-persist';

const initialIngrediente = {
  id: 0,
  nombre: '',
  inci: '',
  funcion: '',
  porcentaje: 0,
  gramos: 0,
};
const initialFase = {
  id: 0,
  ingrediente: { 0: initialIngrediente },
  porcentajeFase: 0,
  gramosFase: 0,
}

const initialState = {
  fase: { 0: initialFase },
  titulo: '',
  referencia: '',
  fecha: '',
  pesoTotal: '',
  ts: 0,
};

export default (state = initialState, action) => {
  console.log(action);
  switch (action.type) {
    case calc.CHANGE_BASE_PROP:
      return {
        ...state,
        ts: new Date(),
        [action.payload.prop]: action.payload.value,
      };
    case calc.CHANGE_FASE_PROP:
      return {
        ...state,
        ts: new Date(),
        fase: {
          ...state.fase,
          [action.payload.fase]: {
            ...state.fase[action.payload.fase],
            [action.payload.prop]: action.payload.value
          },
        },
      };
    case calc.CHANGE_ING_PROP:
      return {
        ...state,
        ts: new Date(),
        fase: {
          ...state.fase,
          [action.payload.fase]: {
            ...state.fase[action.payload.fase],
            ingrediente: {
              ...state.fase[action.payload.fase].ingrediente,
              [action.payload.ingrediente]: {
                ...state.fase[action.payload.fase].ingrediente[action.payload.ingrediente],
                [action.payload.prop]: action.payload.value,
              },
            },
          },
        },
      };
    case PURGE:
      return { ...initialState };
    default:
      return state;
  }
};
