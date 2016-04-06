import applyWorker from '../src/applyWorker';
import 'babel-polyfill';

const blob = new Blob([ 'console.log(\'I am a worker!\');'], { type: 'text/javascript' });
const url = window.URL.createObjectURL(blob);

describe('applyWorker', () => {
	const retState = {};
	const reducer = () => retState;
	it('should return a function', () => {
		let result = applyWorker();
		expect(typeof result).toBe('function');
	});

	it('should fallback to regular createStore method if worker is not passed in', () => {
		let makeStoreCreator = applyWorker();
		let intState = {};
		let enhancer = {};
		let createStore = makeStoreCreator((reducer, intState, enhancer) => { 
			return {
				reducer,
				intState,
				enhancer
			};
		});
		let store = createStore(reducer, intState, enhancer);
		expect(store.reducer).toBe(reducer);
		expect(store.intState).toBe(intState);
		expect(store.enhancer).toBe(enhancer);
	});

	it('should replace reducer and intialState when worker is passed in', () => {
		let worker = new Worker(url);
		let makeStoreCreator = applyWorker(worker);
		let intState = {};
		let enhancer = {};
		let createStore = makeStoreCreator((reducer, intState, enhancer) => { 
			return {
				reducer,
				intState,
				enhancer
			};
		});
		let store = createStore(reducer, intState, enhancer);
		expect(store.reducer).not.toBe(reducer);
		expect(store.intState).toBe(retState);
		expect(store.enhancer).toBe(enhancer);
		expect(typeof store.dispatch).toBe('function');
	});

	describe('behavior of stubbed dispatch', () => {
		let store, worker;

		beforeEach(function() {
			worker = new Worker(url);

			let makeStoreCreator = applyWorker(worker);
			let intState = {};
			let enhancer = {};
			let createStore = makeStoreCreator((reducer, intState, enhancer) => { 
				return {
					reducer,
					intState,
					enhancer
				};
			});

			store = createStore(reducer, intState, enhancer);
			spyOn(worker, 'postMessage').and.callThrough();
		});

		it('should postMessage when dispatching an action', () => {
			const action = {
				type: 'ACTION',
				data: 'DATA'
			};

			store.dispatch(action);
			expect(worker.postMessage).toHaveBeenCalledWith(action);
		});

		it('should return a promise when dispatching a task', function() {
			const task = {
				task: 'TASK',
				data: 'DATA'
			};

			store.dispatch(task);
			expect(worker.postMessage).toHaveBeenCalledWith({
				task: 'TASK',
				data: 'DATA',
				_taskId: jasmine.any(Number)
			});
		});
	})
});