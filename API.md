# API

## createWorker
This helper function should be called within your worker. It will return an instance of `ReduxWorker`, which provides the following methods for you to set up your web worker:

- registerReducer(reducer)
- registerTask(taskName, taskCallback)

Example:
```js
import reducer from '../reducers'
import solve from '../solver'
import { createWorker } from 'redux-worker'

// Instantiate ReduxWorker
let worker = createWorker();

// Registering your reducer. 
worker.registerReducer(reducer);

// Register tasks to be executable on web worker, if needed
worker.registerTask('NQUEEN_TASK', function(a) {
	let n = a.number;
	return +n < 16 ? solve(+n).length : 'N is too large...';
});
```

## applyWorker
This helper function is a store enhancer that decorates the Redux store. It is intended to be applied to your store configuration as a middleware. If an invalid web worker is provided here, the middleware will fall back to creating a regular redux store.

Example:
```js
import React from 'react'
import { render } from 'react-dom'
import { Provider } from 'react-redux'
import { createStore, applyMiddleware, compose } from 'redux'
import thunk from 'redux-thunk'
import rootReducer from './reducers'
import App from './components/App'
import { applyWorker } from 'redux-worker'

// Spinning up the web worker.
// worker.bundle.js comes from a build process that I set up to compile and serve worker.js
// created using createWorker. 
// If you do not want to have a separate build process for this, look into the following:
// - webworker-loader for Web Pack (https://github.com/bjyoungblood/webworker-loader)
// - webworkify for browerify (https://github.com/substack/webworkify)

const worker = window.Worker ? new Worker('./dist/worker.bundle.js') || null;

// Apply worker middleware
const enhancerWithWorker = compose(
	applyMiddleware(thunk),
	applyWorker(worker)
);

const store = createStore(rootReducer, {}, enhancerWithWorker);

render(
	<Provider store={store}>
		<App />
	</Provider>,
	document.getElementById('app')
)
```

## dispatch
The new dispatcher will have the following flow:
	1. Post a message to redux-worker
	2. Redux-worker uses the reducer to change the state of the store  
	3. Redux-worker posts a message back to main thread
	4. Main thread updates the new state
	5. All subscribed components are rendered

You can now also dispatch a task to be executed in `redux-worker` outside the context of Redux: useful for tasks like encryption/decryption, rich text formatting, etc.

Task Creator
```js
// This is basically the same as your action creators, except that instead of 'type', it
// expects 'task'. This 'task' attribute must equal to what's provided to registerTask
const calcNqueenTask = (n) => {
	return {
		task: 'NQUEEN_TASK',
		number: n
	};
}
```

Usage
```js
// When dispatching a task, the dispatcher will return a promise that 
// will be resolved when the task is completed. 
this.props.actions
	.calcNqueenTask(this.state.inputValue)
	.then(function(returnObj) {
		// The returnObj contains _taskId and response
		// response is whatever the return value is based on 
		// the callback provided to registerTask
		alert(
			`
			This task is run directly on the web worker without going thru Redux.\n
			The taskId is ${returnObj._taskId}.\n
			The answer is ${returnObj.response}.
			`
		);
	});
```


