
export const CHANGE_BASE_PROP = '@@calc/CHANGE_BASE_PROP';
export const CHANGE_FASE_PROP = '@@calc/CHANGE_FASE_PROP';
export const CHANGE_ING_PROP = '@@calc/CHANGE_ING_PROP';

export const changeBaseProp = ({ prop, value }) => {
  return {
    type: CHANGE_BASE_PROP,
    payload: { prop, value },
  };
};

export const changeFaseProp = ({ fase, prop, value }) => {
  return {
    type: CHANGE_FASE_PROP,
    payload: { fase, prop, value },
  };
};

export const changeIngProp = ({ fase, ingrediente, prop, value }) => {
  return {
    type: CHANGE_ING_PROP,
    payload: { fase, ingrediente, prop, value },
  };
};
