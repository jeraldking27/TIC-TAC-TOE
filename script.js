document.addEventListener("DOMContentLoaded", function() {
  const homeScreen = document.getElementById('homeScreen');
  const startGameBtn = document.getElementById('startGameBtn');
  const gameContainer = document.getElementById('game');
  const boardEl = document.getElementById('board');
  const statusEl = document.getElementById('status');
  const resetBtn = document.getElementById('reset');
  const undoBtn = document.getElementById('undo');
  const resultScreen = document.getElementById('resultScreen');
  const resultMessage = document.getElementById('resultMessage');
  const newGameBtn = document.getElementById('newGameBtn');
  const goHomeBtn = document.getElementById('goHomeBtn');

  let board, xIsNext, history, gameOver;
  const lines = [
    [0,1,2],[3,4,5],[6,7,8],
    [0,3,6],[1,4,7],[2,5,8],
    [0,4,8],[2,4,6]
  ];
  const cells = [];

  // Create cells
  for(let i=0;i<9;i++){
    const btn = document.createElement('button');
    btn.className='cell';
    btn.dataset.index=i;
    btn.addEventListener('click', onCellClick);
    boardEl.appendChild(btn);
    cells.push(btn);
  }

  function initGame(){
    board = Array(9).fill(null);
    xIsNext = true;
    history = [];
    gameOver = false;
    cells.forEach(c => {
      c.textContent='';
      c.classList.remove('x','o','win');
    });
    updateStatus();
  }

  function onCellClick(){
    const i = Number(this.dataset.index);
    if(gameOver || board[i]) return;
    const mark = xIsNext ? 'X':'O';
    board[i] = mark;
    history.push(i);
    render();
    const winner = checkWinner(board);
    if(winner) handleWin(winner);
    else if(board.every(Boolean)) handleDraw();
    else { xIsNext = !xIsNext; updateStatus(); }
  }

  function checkWinner(s){
    for(const [a,b,c] of lines){
      if(s[a] && s[a]===s[b] && s[a]===s[c]){
        return {player:s[a], line:[a,b,c]};
      }
    }
    return null;
  }

  function handleWin({player,line}){
    gameOver = true;
    line.forEach(idx => cells[idx].classList.add('win'));
    showResult(`🎉 Player ${player} Wins!`, true);
  }

  function handleDraw(){
    gameOver = true;
    showResult("😢 It's a Draw", false);
  }

  function showResult(text, win){
    gameContainer.classList.add('hidden');
    resultScreen.classList.remove('hidden');
    resultMessage.textContent = text;
    resultMessage.className = 'result-message ' + (win ? 'celebrate' : 'sad');
  }

  function updateStatus(){
    statusEl.innerHTML = `Player <strong>${xIsNext?'X':'O'}</strong>'s turn`;
  }

  function render(){
    cells.forEach((c,i)=>{
      c.textContent = board[i] || '';
      c.classList.toggle('x', board[i]==='X');
      c.classList.toggle('o', board[i]==='O');
    });
  }

  function undo(){
    if(history.length===0) return;
    const last = history.pop();
    board[last] = null;
    gameOver = false;
    xIsNext = !xIsNext;
    render();
    updateStatus();
  }

  // Buttons
  resetBtn.addEventListener('click', initGame);
  undoBtn.addEventListener('click', undo);

  startGameBtn.addEventListener('click', ()=>{
    homeScreen.classList.add('hidden');
    resultScreen.classList.add('hidden');
    gameContainer.classList.remove('hidden');
    initGame();
  });

  newGameBtn.addEventListener('click', ()=>{
    resultScreen.classList.add('hidden');
    gameContainer.classList.remove('hidden');
    initGame();
  });

  goHomeBtn.addEventListener('click', ()=>{
    resultScreen.classList.add('hidden');
    gameContainer.classList.add('hidden');
    homeScreen.classList.remove('hidden');
  });
});