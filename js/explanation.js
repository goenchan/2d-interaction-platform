*** PART 1 : DRAW ANIMATION EVERY 0.1 SECOND ***


// initialize draw, when next time redraw, use this function: "step"

// Requestanimation will be called depends on the performance of terminals. Setting "step" will prevent it and make every terminal will redraw the animation based on time set between the steps, which will be more than 0.1 second. (assume it cannot be slower than this.)

draw();
window.requestAnimationFrame(step(0));


// I think t1 and t2 are time index.
// If 0.1 second is past, since the last time when step was called back to redraw (i.e. stepped at t1), redraw the animation using next time index, t2 while also changing "state."


const step = t1 => t2 => {
  if (t2 - t1 > 100) {
    state = next(state);
    draw();
    window.requestAnimationFrame(step(t2));
  } else {
    window.requestAnimationFrame(step(t1));
  }
}

// So, step make sure new graphic is not rendering based on the computer performance, but at least more than 0.1 second, and set up a new standard of indexing the time. when one time unit passed, "step" function make sure "state" also changes accordingly. Else, regenerate the same animation we already have.

let state = initialState();

// initialState() is defined in core.js which precedes the load of this graphic js script. It sets initial state in object (coordinates)

const initialState = () => ({
  cols:  20,
  rows:  20,
});


// Note that state is a variable set to global scope intentially to pass on to step function to continuously modify global funcion which will affect throughout whole set of functions.




*** PART 2 : USER CAN CHANGE ANIMATION INDEPENDENT OF AUTO DRAWING ***


window.addEventListener('clicked', e => {
  switch (e.key) {
    case 'ArrowUp':    state = enqueue(state, NORTH); break
    case 'ArrowLeft':  state = enqueue(state, WEST);  break
    case 'ArrowDown':  state = enqueue(state, SOUTH); break
    case 'ArrowRight': state = enqueue(state, EAST);  break
  }
})

// By eventlistners, users can move forward to next "state" independent from automatic draw. Event listeners will trigger enqueue function that will merge our input to append the "move" into "moves" key in "state" object."

const enqueue = (state, move) =>  merge(state)({ moves: state.moves.concat([move]) })

// merge function merges two object with assign method.

const merge     = o1 => o2 => Object.assign({}, o1, o2)

//Note that we passed only one arg, state but call back function written in arrow will inherit the arg, so it's just appending new move in to current "moves" of "state"

// Constants for [move]
const NORTH = { x: 0, y:-1 }
const SOUTH = { x: 0, y: 1 }
const EAST  = { x: 1, y: 0 }
const WEST  = { x:-1, y: 0 }
const NONE  = { x: 0, y: 0 }

// to rewrite the initial state with "moves" and our avatar "snake",

const initialState = () => ({
  cols:  20,
  rows:  20,
  moves: [NONE],
  snake: [],
});




*** PART 3 : HOW WE DRAW ON CANVAS ***

const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

// Above two lines of command will get the canvas tag from html and get the 2d context within that canvas.

// First, we clear the canvas by filling dark color in entire canvas. And then draw a green snake!

const draw = () => {
  // clear
  ctx.fillStyle = '#232323'
  ctx.fillRect(0, 0, canvas.width, canvas.height)

  // draw snake
  ctx.fillStyle = 'rgb(0,200,50)'
  state.snake.map(p => ctx.fillRect(x(p.x), y(p.y), x(1), y(1)))
}

// state initialize snake with empty value, []. As we move on and snake make its move, we will fill the rectangular according to the newly appended move (recorded with x, y coordinates)

// While fillRect is built-in method for canvas tag, we set x, y as const to produce number argument relevant to our canvas setting. It's simply because we want to draw a snake inside our canvas, so we locate them relative to the canvas."


// Checkout below url for canvas.getContext() and ctx.fillRect()
// https://www.w3schools.com/tags/canvas_fillrect.asp

// Format is  " context.fillRect(x,y,width,height); "


const x = c => Math.round(c * canvas.width / state.cols)
const y = r => Math.round(r * canvas.height / state.rows)

// This is no more than rescaling pixels into x and y units based on row/col of canvas we initially set.


*** PART 4 HOW TO MAKE SNAKE LOOKS LIKE MOVING ***

// We have to set next move it will take (vector) and coordinates of next snake head according to the last move.

// Next values are based on state.

const nextMoves = state => state.moves.length > 1 ? dropFirst(state.moves) : state.moves
const nextHead  = state => state.snake.length == 0
//initially gened at (2,2)
  ? { x: 2, y: 2 }
  : {
// mode function allows two polars are actually connected to each other.(Just think of the Earth is round )
  x: mod(state.cols)(state.snake[0].x + state.moves[0].x),
  y: mod(state.rows)(state.snake[0].y + state.moves[0].y)
}

// snake consists of next head and drop the last head, moving forward by generate something on the next coordinates while erasing something on the previous coordinates.

const nextSnake = state => ([nextHead(state)].concat(dropLast(state.snake)))

// Think snake of the array, which consists of head that moves forward and then last of following array is dropped off for every movement.

// Note every function accepts "state" argument which is automatically drawn by step function OR user intrigued events. state is defined by state = next(state) when it's automatically drawn.


const next = spec({
  rows:  prop('rows'),
  cols:  prop('cols'),
  moves: nextMoves,
  snake: nextSnake,
})

// Next function "specs" on objects and use value to merge with previous value of objects. It uses map to create a new one exactly the same as before to merge.


*** PART5 HOW MODULES ARE LINKED TOGETHER ***

// base => core => graphic
//
// base provides customized function often used in other OOP.
//
// core includes back end functions to set algorithm for next state and according values, and constants used inside the function as arguments.


Object.getOwnPropertyNames(base).map(p => global[p] = base[p])


// At the beginning of the core js, above code makes sure that all the basic functions from base is on the global scope, make it possible to freely use throughout core js.
