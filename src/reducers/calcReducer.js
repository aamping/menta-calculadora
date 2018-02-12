import { PURGE } from 'redux-persist';
import _ from 'lodash';
import * as calc from '../actions/calcActions';


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
  porcentajeTotal: 0,
  gramosTotal: 0,
  ts: 0,
  enableGramos: false,
};

export default (state = initialState, action) => {
  console.log(action);
  switch (action.type) {
    case calc.CHANGE_BASE_PROP:
      let res = {};
      if (action.payload.prop === 'pesoTotal') {
        res = handlePesoTotal(state.fase, action.payload.value);
        return {
          ...state,
          ts: new Date(),
          fase: res.newFase,
          gramosTotal: res.gramosTotal,
          pesoTotal: action.payload.value,
        };
      }
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
      const { fase, ingrediente, prop, value } = action.payload;
      res = {};
      if (prop === 'gramos') {
        res = handleGramos(state.fase, value, ingrediente, fase)
        return {
          ...state,
          ts: new Date(),
          gramosTotal: res.gramosTotal,
          pesoTotal: res.gramosTotal,
          porcentajeTotal: (res.gramosTotal /res.gramosTotal)*100,
          fase: {
            ...res.newFase
          },
        };
      }
      if (prop === 'porcentaje') {
        res = handlePorcentaje(state.fase, value, ingrediente, fase);
        return {
          ...state,
          ts: new Date(),
          pesoTotal: state.pesoTotal ? state.pesoTotal : 100,
          gramosTotal: (res.porcentajeTotal /100) * (state.pesoTotal ? state.pesoTotal : 100),
          porcentajeTotal: res.porcentajeTotal,
          fase: {
            ...state.fase,
            [fase]: {
              ...state.fase[fase],
              porcentajeFase: res.porcentajeFase,
              gramosFase: (res.porcentajeFase /100) * (state.pesoTotal ? state.pesoTotal : 100),
              ingrediente: {
                ...state.fase[fase].ingrediente,
                [ingrediente]: {
                  ...state.fase[fase].ingrediente[ingrediente],
                  porcentaje: value,
                  gramos: (value/100)*(state.pesoTotal ? state.pesoTotal : 100)
                },
              },
            },
          },
        };
      }
      return {
        ...state,
        ts: new Date(),
        fase: {
          ...state.fase,
          [fase]: {
            ...state.fase[fase],
            ingrediente: {
              ...state.fase[fase].ingrediente,
              [ingrediente]: {
                ...state.fase[fase].ingrediente[ingrediente],
                [prop]: [value],
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

export const handlePesoTotal = (stateFase, pesoTotal) => {
  const newFase = {};
  const gramosFase = [];
  let gramosTotal = 0;
  _.map(stateFase, (valFase, key) => {
    const newIngrediente = {}
    _.map(valFase.ingrediente, (val, keyId) => {
      const gramos = (val.porcentaje/100)*pesoTotal;
      newIngrediente[keyId] = { ...val, gramos };
      gramosFase[key] = (gramosFase[key] ? gramosFase[key] : 0) + parseInt(gramos, 10);
    });
    newFase[key] = { ...valFase, ingrediente: { ...newIngrediente }, gramosFase: gramosFase[key] };
    gramosTotal = gramosTotal + gramosFase[key];
  });
  return { newFase, gramosTotal };
}

export const handleGramos = (stateFase, gramosVal, ingredienteIndex, faseIndex) => {
  const newFase = {};
  const gramosFase = [];
  let gramosTotal = 0;
  _.map(stateFase, (val, index) => {
    _.map(val.ingrediente, (valIng, ind) => {
      if (parseInt(ind, 10) === ingredienteIndex && parseInt(index, 10) === faseIndex) {
        gramosFase[index] = (gramosFase[index] ? gramosFase[index] : 0) + parseInt(gramosVal, 10);
      } else {
        gramosFase[index] = (gramosFase[index] ? gramosFase[index] : 0)  + parseInt(valIng.gramos, 10);
      }
    });
    gramosTotal = gramosTotal + gramosFase[index];
  });
  _.map(stateFase, (valFase, key) => {
    const newIngrediente = {}
    _.map(valFase.ingrediente, (val, keyId) => {
        newIngrediente[keyId] = { ...val, porcentaje: (val.gramos/gramosTotal)*100 };
        if (parseInt(keyId, 10) === ingredienteIndex && parseInt(key, 10) === faseIndex) {
          newIngrediente[keyId] = { ...newIngrediente[keyId], porcentaje: (gramosVal/gramosTotal)*100, gramos: gramosVal }
        }
    });
    newFase[key] = { ...valFase, ingrediente: { ...newIngrediente }, gramosFase: gramosFase[key], porcentajeFase: (gramosFase[key]/gramosTotal)*100 }
  });
  return { newFase, gramosTotal };
}
export const handlePorcentaje = (stateFase, porcentajeVal, ingredienteIndex, faseIndex) => {
  const porcentajeFase = [];
  let porcentajeTotal = 0;
  _.map(stateFase, (val, index) => {
    _.map(val.ingrediente, (valIng, ind) => {
      if (parseInt(ind, 10) === ingredienteIndex && parseInt(index, 10) === faseIndex) {
        porcentajeFase[index] = (porcentajeFase[index] ? porcentajeFase[index] : 0) + parseFloat(porcentajeVal);
      } else {
        porcentajeFase[index] = (porcentajeFase[index] ? porcentajeFase[index] : 0)  + parseFloat(valIng.porcentaje);
      }
    });
    porcentajeTotal = porcentajeTotal + porcentajeFase[index];
  });
  return { porcentajeFase: porcentajeFase[faseIndex], porcentajeTotal };
}
