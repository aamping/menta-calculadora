import React, { Component } from "react";
import { PURGE } from 'redux-persist';
import { connect } from 'react-redux';

import { Button } from 'react-bootstrap';

// Generate <TestComponent /> with a button that will purge the persisted store
class ResetCom extends Component {

      onPurgeStoredState(e) {

             const { dispatch } = this.props;   // Grab a ref to the mapped dispatch method
             // Create and dispatch the action which will cause redux-persist to purge
             dispatch({
                  type: PURGE,
                  key: "myStorageKey",    // Whatever you chose for the "key" value when initialising redux-persist in the **persistCombineReducers** method - e.g. "root"
                 result: () => null              // Func expected on the submitted action.
              });
       }

       render() {
             return(<Button onClick={this.onPurgeStoredState.bind(this)}>Borrar</Button>);
        }
}

function mapStateToProps(
    state,
    ownProps
) {
    return state;
}

function mapDispatchToProps(
    dispatch
) {
   return { dispatch };     // Map dispatch method to this.props.dispatch
}

export default connect(mapStateToProps, mapDispatchToProps)(ResetCom);
