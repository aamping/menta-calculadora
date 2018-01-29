import { PURGE, REHYDRATE } from 'redux-persist';

export default (state = {}, action) => {
     switch(action.type) {
          // [....Your other reducer actions...]
           case REHYDRATE:    // This added just to show that this action type also exists, can be omitted.
                  console.log("REHYDRATING!!!!");
                  return state;
           case PURGE:
                  console.log("PURGING!!!!");
                  return { tss: new Date() };    // Return the initial state of this reducer to 'reset' the app
           default:
              return state;
     }
}
