// BASIC VARIABLES ===============================
let canvas = document.getElementById("canvas");
let ctx = canvas.getContext("2d");
let btn = document.querySelector('.button');
let btnState = false;
let positionX = document.querySelector('.positionX');
let positionY = document.querySelector('.positionY');
//================================================

// SETUP VARIABLES ===============================

let cols, rows;
let w = 10;
let grid = [];
let current;
let stack = [];
let r = Math.floor(Math.random()*255);
let g = Math.floor(Math.random()*255);
let b = Math.floor(Math.random()*255);
console.log('R= ' + r);
console.log('G= ' + g);
console.log('B= ' + b);
//================================================
// FUNCTION THAT GENERATES ARRAY OF CELL OBJECTS DEPENDING OF HOW MUCH COLS AND ROWS ARE THERE
function draw() {
  cols = Math.floor(canvas.width / w);
  rows = Math.floor(canvas.height / w);

  for (let j = 0; j < rows; j++) {
    for (let i = 0; i < cols; i++) {
      let cell = new Cell(i, j);
      grid.push(cell);
    }
  }
  current = grid[0];
  console.log();
  animate();
}

//==================================================


function index(i,j){
  if(i < 0 || j < 0 || i > cols-1 || j > rows-1){
    return undefined;
  }
  return i + j*cols;
}
// CELL CLASS ======================================
class Cell {
  constructor(i, j) {
    this.i = i;
    this.j = j;
    this.walls = [true, true, true, true];
    this.visited = false;
  }
  highlight(){
    let x = this.i * w;
    let y = this.j * w;
  positionX.textContent = x/10;
  positionY.textContent = y/10;
    ctx.fillStyle = 'rgb(0,200,100)';
    ctx.fillRect(x, y, w, w);
  }
  
  show() {
    let x = this.i * w;
    let y = this.j * w;
    ctx.strokeStyle = "rgb(0,0,0";
    if (this.walls[0]) {
      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.lineTo(x + w, y);
      ctx.stroke();
    }
    if (this.walls[1]) {
      ctx.beginPath();
      ctx.moveTo(x + w, y);
      ctx.lineTo(x + w, y + w);
      ctx.stroke();
    }
    if (this.walls[2]) {
      ctx.beginPath();
      ctx.moveTo(x + w, y + w);
      ctx.lineTo(x, y + w);
      ctx.stroke();
    }
    if (this.walls[3]) {
      ctx.beginPath();
      ctx.moveTo(x, y + w);
      ctx.lineTo(x, y);
      ctx.stroke();
    }

    if (this.visited) {
      ctx.fillStyle = 'rgb('+r+','+g+','+b+')';
      ctx.fillRect(x, y, w, w);
    }
  }
  
  checkNeighbors(){
    let neighbors = [];

    let top = grid[index(this.i, this.j-1)];
    let right = grid[index(this.i+1, this.j)];
    let bottom = grid[index(this.i,this.j+1)];
    let left = grid[index(this.i-1,this.j)];

    if(top && !top.visited){
      neighbors.push(top);
    }
    if(right && !right.visited){
      neighbors.push(right);
    }
    if(bottom && !bottom.visited){
      neighbors.push(bottom);
    }
    if(left && !left.visited){
      neighbors.push(left);
    }

    if(neighbors.length > 0){
      let r = Math.floor(Math.random()*neighbors.length);
      return neighbors[r];
    }else{
      return undefined;
    }
  }
}
//==============================================
// FUNCTION THAT DISPLAY EVERYTHING ON CANVAS

function animate() {
  ctx.clearRect(0, 0, innerWidth, innerHeight);
  for (let i = 0; i < grid.length; i++) {
    grid[i].show();
  }
  current.visited = true;
  current.highlight();
  let next = current.checkNeighbors();
  if(next){
    next.visited = true;

    stack.push(current);

    removeWalls(current, next);
    current = next;
  }else if(stack.length > 0){
    current = stack.pop();
  }
    requestAnimationFrame(animate);
}

//=============================================
// FUNCTION THAT REMOVES WALLS ================

function removeWalls(a, b){
  let x = a.i - b.i;
  let y = a.j - b.j;
  if(x === 1){
    a.walls[3] = false;
    b.walls[1] = false;
  }else if( x === -1){
    a.walls[1] = false;
    b.walls[3] = false;
  }
  if(y === 1){
    a.walls[0] = false;
    b.walls[2] = false;
  }else if(y === -1){
    a.walls[2] = false;
    b.walls[0] = false;
  }

}

//=============================================
// CLICK ON BUTTON ACTIVATED MAZE GENERATOR
//=============================================
btn.addEventListener('click', ()=>{
  if(btnState === false){
  draw();
  btnState = true;
  }else{
  alert('You are already amazed! Refresh the page ;)');
  }
});
