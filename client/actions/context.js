export const CONTEXT_UPDATE = 'CONTEXT_UPDATE';

const update = (context, data) => {
  return {
    type: CONTEXT_UPDATE,
    context,
    data
  }
};

export const updateContext = (context, data) => (dispatch) => {
  dispatch(update(context, data));
};
