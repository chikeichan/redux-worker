import React, { createClass } from 'react'

export default createClass({
  getDefaultProps() {
    return {
      numberOfSquares: 1,
      answer: null,
      actions: {
        calculateNQueen: function() {}
      }
    };
  },

  getInitialState() {
      return {
      inputValue: 1
      };
  },

  toggleWebWorker() {
    var disableWebWorker = window.disableWebWorker;
    window.disableWebWorker = !disableWebWorker;
    this.forceUpdate();
  },

  onChange(e) {
    this.setState({
      inputValue: e.target.value
    });
  },

  onClick() {
    if (this.props.isCalculating) {
      return;
    }
    this.props.actions.calculateNQueen(this.state.inputValue);
  },

  runTask() {
    this.props.actions.testWorker(this.state.inputValue)
      .then(function(e) {
        alert(
          `This task is run directly on the web worker without going thru Redux.\nThe taskId is ${e._taskId}.\nThe answer is ${e.response}.`
        );
      });
  },

  render() {
    const { numberOfSquares, answer, isCalculating } = this.props

    let ans, bgColor

    if (isCalculating) {
      ans = 'calculating...'
      bgColor = 'rgba(255, 0, 0, 0.2)'
    } else {
      ans = 'Answer is ' + answer;
      bgColor = 'rgba(0, 255, 0, 0.2)'
    }

    return (
      <div style={{
            height: '200px',
            textAlign: 'center',
            display: 'inline-block',
            boxShadow: '0 0 1px 1px rgba(0, 0, 0, 0.2)',
            borderRadius: '2px',
            padding: '8px 12px',
            backgroundColor: bgColor,
            margin: '4px',
            position: 'relative'
        }}>
        <h2>N-Queen Solver</h2>
        <div style={{
          position: 'absolute',
          top: 8,
          right: 8,
          backgroundColor: 'rgba(0, 0, 0, 0.8)',
          color: 'white',
          padding: '4px 8px',
          borderRadius: 3,
          display: 'flex',
          cursor: 'pointer',
          alignItems: 'center'
          }}
          onClick={this.toggleWebWorker}>
          <div style={{ fontSize: 12 }}>Web Worker</div>
          <div style={{
            fontWeight: 'bold',
            marginLeft: 8,
            color: window.disableWebWorker ? 'red' : 'green'
          }}>{ window.disableWebWorker ? 'OFF' : 'ON'}</div>
        </div>
        <h3>{ 'N = ' + numberOfSquares}</h3>
        <div>{ ans }</div>
        <input type='number'
             onChange={ this.onChange }
             style={{
                padding: '4px 8px',
                outline: 'none',
                border: 'none',
                borderRadius: '2px',
                margin: '4px',
                fontSize: '16px'
             }}
             placeholder='Enter number...'/>
        <button onClick={ this.onClick }
            style={{
                padding: '4px 8px',
                outline: 'none',
                border: 'none',
                borderRadius: '2px',
                margin: '4px',
                cursor: 'pointer'
             }}>
            Calc
        </button>
        <button onClick={ this.runTask }
            style={{
                padding: '4px 8px',
                outline: 'none',
                border: 'none',
                borderRadius: '2px',
                margin: '4px',
                cursor: 'pointer'
             }}>Run without Redux</button>
      </div>
    )
  }
})