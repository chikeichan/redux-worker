# redux-worker

Redux-Worker is a [middleware](http://redux.js.org/docs/advanced/Middleware.html) for [Redux](https://github.com/reactjs/redux).

It helps you build multi-threaded JavaScript applications by moving your reducer into a Web Worker. It also provides a simple [API](https://github.com/chikeichan/redux-worker/blob/master/API.md) for you to register tasks to be executed in the web worker outside of Redux.  

Check out the demo:  
![](http://g.recordit.co/dqxWhYDb1E.gif)
*(Right) Performing synchronous calculations on a separate worker thread, without blocking the main thread.*  


## Documentation
See the [API docs](https://github.com/chikeichan/redux-worker/blob/master/API.md).

## Inspiration

The [Web Workers API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Workers_API/Using_web_workers) has been around for several years now, but we have yet to see much adoption from the community. I think this is mostly due to setup complexity, asynchronous message passing, and the need to think in a different context (one can't share functions/references between Worker threads).
  
It used to be difficult to conceptualize how to harness the power of Web Workers in an MVC application due to the constraint above. However, Redux has changed the way we think about building applications in JavaScript. Its [three principles](https://github.com/reactjs/redux/blob/master/docs/introduction/ThreePrinciples.md) make it easy to move your app logic into a separate task.

If you are not familiar with web workers, I'd recommend starting with the following materials.
 - [How fast are web workers?](https://hacks.mozilla.org/2015/07/how-fast-are-web-workers/) - by Guillaume Cedric Marty
 - [Using Web Workers for more responsive apps](https://www.youtube.com/watch?v=Kz_zKXiNGSE) - by Jason Teplitz

## Limitations

`Redux-Worker` helps you use web workers in your Redux applications. It does so by enhancing your Redux store with:
  - A dispatcher that posts messages to a worker thread
  - A replacement reducer that listens to messages from a Web Worker and then updates state
  - A mechanism to register and execute tasks in a Web Worker using the dispatcher, which returns a promise that will resolve when the task completes. 
  
It spawns just one Web Worker instance, so don't give it more credit than it deserves. It does not provide an interface for spawning multiple workers and balancing work between them: this is a much more complicated problem that Redux-Worker is not attempting to solve. 

## Demos
  - [Solver for N-Queens](http://chikeichan.github.io/redux-worker/demo/nqueen/index.html)

To run a demo locally, cd into a folder in the demo directory, and then:
```bash
npm i
webpack-dev-server
```  
