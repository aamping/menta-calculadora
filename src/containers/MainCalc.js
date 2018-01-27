import React, { Component } from 'react';
import FormData from '../components/FormData';

const styles = {
  root: {
    padding: 50
  }
}

class MainCalc extends Component {
  render() {
    return (
      <div style={styles.root}>
        <FormData />
      </div>
    );
  }
}

export default MainCalc;
