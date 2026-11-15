(()=>{'use strict';
const PROBLEMS=window.PUZZLE_PROBLEMS;
const $=id=>document.getElementById(id);
const MODES=[
 ['Understand the prompt','Put the requirements in a useful order before writing code.'],
 ['Plan the approach','Put the strategy into logical order without viewing Python.'],
 ['Arrange logical blocks','Reconstruct the algorithm using a few meaningful Python blocks.'],
 ['Arrange Python lines','You get every code line, but none of the correct positions.'],
 ['Arrange fine fragments','Some conditions are split into two pieces. Keep their logic together.'],
 ['Write missing lines','Complete selected lines inside a nearly finished function.'],
 ['Code from scratch','No puzzle pieces. Solve the problem yourself in an empty Python editor.']
];
const STORAGE='dsa-puzzle-lab-v1';
let saved={wins:{}};
try{const s=JSON.parse(localStorage.getItem(STORAGE));if(s&&s.wins&&typeof s.wins==='object')saved=s}catch(_){}
const state={problem:PROBLEMS[0],mode:2,pieces:[],pool:[],placed:[],attempts:0,hint:0,solved:false,editor:'',request:0,busy:false};
const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
function save(){try{localStorage.setItem(STORAGE,JSON.stringify(saved))}catch(_){}}
function solvedKey(){return state.problem.id+':'+state.mode}
function shuffle(arr){const a=[...arr];for(let i=a.length-1;i>0;i--){let j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]]}return a}
function rescrambleArray(items,previous){if(items.length<2)return [...items];let a=shuffle(items);let tries=0;while(a.join('|')===previous.join('|')&&tries++<12)a=shuffle(items);return a}
function makePieces(){
 let lines=state.problem.code.split('\n').slice(1);
 let parts;
 if(state.mode===0)parts=state.problem.understand.map(t=>({text:t,glue:false}));
 else if(state.mode===1)parts=state.problem.plan.map(t=>({text:t,glue:false}));
 else if(state.mode===2)parts=state.problem.blocks.map(t=>({text:t,glue:false}));
 else if(state.mode===3)parts=lines.map(t=>({text:t,glue:false}));
 else{
  let count=0;parts=[];
  for(let line of lines){
   const match=/^(\s*)(if|while|for) (.+)$/.exec(line);
   if(match && count<3){parts.push({text:match[1]+match[2]+' ',glue:false});parts.push({text:match[3],glue:true});count++}
   else parts.push({text:line,glue:false});
  }
 }
 return parts.map((p,i)=>({...p,id:'piece-'+i}));
}
function initialize(){
 state.pieces=state.mode<5?makePieces():[];
 state.pool=rescrambleArray(state.pieces.map(p=>p.id),state.pieces.map(p=>p.id));
 state.placed=[];state.attempts=0;state.hint=0;state.solved=false;state.busy=false;
 state.editor=state.mode===5?makeStarter():state.problem.signature+'\n    pass';
 $('results').innerHTML='<div class="empty-feedback"><span class="feedback-graphic">⌁</span><strong>Your next discovery starts here</strong><p>Arrange the pieces and run your first test. You will learn what works and where to investigate.</p></div>';
 $('coach-message').textContent='If you get stuck, ask for a hint. I will point to the underlying idea, not the correct order.';
 render();
}
function makeStarter(){
 const lines=state.problem.code.split('\n');
 for(const index of state.problem.mask){const line=lines[index];if(line!==undefined){const ind=(line.match(/^\s*/)||[''])[0];lines[index]=ind+'# TODO: replace this line with your Python code'}}
 return lines.join('\n');
}
function composed(){
 if(state.mode>=5)return state.editor;
 if(state.mode<2)return '# Concept puzzle. Arrange the cards to check your reasoning.';
 let body='';
 for(const id of state.placed){
  const p=state.pieces.find(x=>x.id===id);
  if(!p)continue;
  body+=(p.glue?'':(body?'\n':''))+p.text;
 }
 return state.problem.signature+(body?'\n'+body:'\n    # Add your pieces above');
}
function setupProblem(){
 const p=state.problem;
 $('problem-select').value=p.id;$('problem-topic').textContent=p.topic;$('problem-difficulty').textContent=p.difficulty;
 $('problem-difficulty').className='tag '+(p.difficulty==='Easy'?'tag-green':'');
 $('problem-title').textContent=p.title;$('problem-statement').innerHTML='<p>'+p.statement+'</p>';$('problem-example').textContent=p.example;
 updateStats();
}
function updateStats(){
 const n=Object.keys(saved.wins).length;
 $('metric-problems').innerHTML=String(PROBLEMS.length).padStart(2,'0')+' <span class="metric-small">problems</span>';
 $('metric-completed').innerHTML=String(n).padStart(2,'0')+' <span class="metric-small">/ '+(PROBLEMS.length*7)+'</span>';
 const masters=PROBLEMS.filter(p=>saved.wins[p.id+':6']).length;
 $('metric-mastered').innerHTML=String(masters).padStart(2,'0')+' <span class="metric-small">mastered</span>';
 const count=Array.from({length:7},(_,i)=>!!saved.wins[state.problem.id+':'+i]).filter(Boolean).length;
 $('progress-number').textContent=count+' / 7';
 $('progress-fill').style.width=(count/7*100)+'%';
}
function render(){
 setupProblem();
 $('mode-select').value=String(state.mode);
 $('mode-count').textContent='MODE '+(state.mode+1)+' / 7';
 $('mode-description').textContent=MODES[state.mode][1];
 const editing=state.mode>=5;
 $('pieces-view').hidden=editing;$('editor-view').hidden=!editing;
 $('code-preview').parentElement.hidden=state.mode<2||editing;
 $('scramble-btn').disabled=editing;
 if(editing){$('code-editor').value=state.editor}
 else {
  $('bank-count').textContent=state.pool.length;
  $('placed-count').textContent=state.placed.length+' / '+state.pieces.length;
  const pieceById=id=>state.pieces.find(p=>p.id===id);
  $('piece-bank').innerHTML=state.pool.length?state.pool.map(id=>'<button class="piece" type="button" data-add="'+esc(id)+'"><span class="piece-handle">＋</span>'+esc(pieceById(id).text)+'</button>').join(''):'<div class="piece-placeholder">All pieces moved to your assembly.</div>';
  $('assembly').innerHTML=state.placed.length?state.placed.map((id,i)=>'<div class="placed-piece" draggable="true" data-position="'+i+'"><button type="button" class="piece" data-remove="'+esc(id)+'" title="Return this piece to the bank"><span class="piece-handle">⠿</span>'+esc(pieceById(id).text)+'</button><div class="piece-controls"><button class="mini-btn" data-move="'+i+':-1" title="Move up" aria-label="Move piece up">↑</button><button class="mini-btn" data-move="'+i+':1" title="Move down" aria-label="Move piece down">↓</button><button class="mini-btn" data-remove="'+esc(id)+'" title="Return to bank" aria-label="Remove piece">×</button></div></div>').join(''):'<div class="piece-placeholder">Your workspace is waiting. Click any piece above to start.</div>';
 }
 $('code-preview').textContent=composed();
 $('session-status').textContent=state.solved?'✓ COMPLETED':'● IN PROGRESS';
 $('session-status').style.color=state.solved?'#a3f4d0':'';
 $('run-btn').disabled=state.busy;
 $('run-btn').innerHTML=state.busy?'◌ Running Python…':'<span>▶</span> '+(state.mode<2?'Check my reasoning':'Run Python tests');
 $('next-mode-btn').disabled=state.mode===6;
 updateStats();
}
function resetFeedback(){
 state.solved=false;
 $('session-status').textContent='● IN PROGRESS';
}
function touch(){
 if(state.solved)resetFeedback();
 if(state.mode<5)$('code-preview').textContent=composed();
 $('placed-count').textContent=state.placed.length+' / '+state.pieces.length;
}
function add(id){if(!state.pool.includes(id))return;state.pool=state.pool.filter(p=>p!==id);state.placed.push(id);touch();render()}
function remove(id){if(!state.placed.includes(id))return;state.placed=state.placed.filter(p=>p!==id);state.pool.push(id);touch();render()}
function move(i,delta){const j=i+delta;if(i<0||j<0||j>=state.placed.length)return;[state.placed[i],state.placed[j]]=[state.placed[j],state.placed[i]];touch();render()}
function checkConcept(){
 const correct=state.pieces.map(p=>p.id).join('|')===state.placed.join('|');
 state.attempts++;if(correct){win('Concepts in a logical order','You reconstructed the meaning and flow. Ready for a code puzzle?')}
 else fail('Not quite yet','At least one relationship is out of order. Ask: what information must be understood before the next idea?');
}
function fail(title,description,details=[]){
 const detailHtml=details.slice(0,4).map((t,i)=>'<div class="test-item"><div class="test-head"><span>Test '+(i+1)+'</span><span class="'+(t.ok?'test-pass':'test-fail')+'">'+(t.ok?'PASS':'FAIL')+'</span></div>'+(!t.ok?'<div class="test-detail">'+esc(t.detail)+'</div>':'')+'</div>').join('');
 $('results').innerHTML='<div class="result-summary fail"><div class="result-title">✕ '+esc(title)+'</div><p>'+esc(description)+'</p></div>'+(detailHtml?'<div class="test-list">'+detailHtml+'</div>':'');
 state.solved=false;render();
}
function win(title,desc){
 state.solved=true;saved.wins[solvedKey()]=true;save();
 $('results').innerHTML='<div class="result-summary success"><div class="result-title">✓ '+esc(title)+'</div><p>'+esc(desc)+'</p></div>';
 $('coach-message').textContent=state.mode===6?'You solved this one from scratch. Try a new, similar problem to test transfer.':'Great reconstruction. Can you explain why each step must happen where it does? Try a finer cut, or solve the next mode without pieces.';
 render();
}
function run(){
 if(state.busy)return;
 if(state.mode<5&&state.placed.length!==state.pieces.length){fail('Puzzle not assembled','Move every piece into the assembly first.');return}
 if(state.mode<2){checkConcept();return}
 state.busy=true;state.attempts++;render();
 $('results').innerHTML='<div class="empty-feedback"><strong>Running your solution…</strong><p>First run downloads a Python runtime. Later runs are faster.</p></div>';
 const tests=state.problem.tests.map(t=>({args:t.args}));
 const worker=new Worker('./game/py-worker.js');
 const id=++state.request;
 let settled=false;
 const finish=()=>{if(settled)return false;settled=true;clearTimeout(timer);worker.terminate();state.busy=false;return true};
 const timer=setTimeout(()=>{if(!finish())return;fail('Execution timed out','This code took too long. Look for a loop whose stopping condition never changes. The first Python download also requires an internet connection.');},45000);
 worker.onerror=()=>{if(!finish())return;fail('Python runtime error','The Python runtime could not start. Check your network connection and try again.');};
 worker.onmessage=e=>{
  if(e.data.id!==id||!finish())return;
  if(!e.data.ok){fail('Python runtime unavailable',e.data.error+' — Check your connection and retry.');return}
  const data=e.data.output;
  if(data.error){fail('Python could not run your code',data.error);$('coach-message').textContent='Check syntax, indentation, and function name. The error tells you which rule Python cannot execute.';return}
  let cases=state.problem.tests.map((t,i)=>{
   const got=data.results[i]||{value:null,error:'Missing result'};
   const ok=!got.error&&JSON.stringify(got.value)===JSON.stringify(t.expected);
   return {ok,detail:'Input: '+JSON.stringify(t.args)+'\nExpected: '+JSON.stringify(t.expected)+'\nGot: '+(got.error||JSON.stringify(got.value))};
  });
  const passed=cases.filter(t=>t.ok).length;
  if(passed===cases.length){win('All '+cases.length+' tests passed!','Your code works on the practice tests. Next: explain it, then try less scaffolding.')}
  else {const first=cases.find(t=>!t.ok);const shown=[first,...cases.filter(t=>t.ok).slice(0,2)];fail(passed+' / '+cases.length+' tests passed','Something differs from the expected behavior. Inspect the failing case, then adjust one idea.',shown);$('coach-message').textContent='A specific input exposes a mismatch. Trace your variables for that input instead of changing lines at random.'}
 };
 worker.postMessage({id,code:composed(),fn:state.problem.fn,tests});
}
function hint(){
 const hints=state.problem.hints;const current=Math.min(state.hint,hints.length-1);
 $('coach-message').textContent=hints[current];state.hint++;
 if(state.hint>=hints.length)$('hint-btn').textContent='✦ Review a hint';
}
function changeMode(next){state.mode=Math.min(6,Math.max(0,next));$('hint-btn').textContent='✦ Give me a hint';initialize()}
function newProblem(id){const p=PROBLEMS.find(x=>x.id===id);if(!p)return;state.problem=p;changeMode(state.mode)}
$('problem-select').innerHTML=PROBLEMS.map(p=>'<option value="'+esc(p.id)+'">'+esc(p.title)+'</option>').join('');
$('problem-select').addEventListener('change',e=>newProblem(e.target.value));
$('mode-select').addEventListener('change',e=>changeMode(Number(e.target.value)));
$('scramble-btn').addEventListener('click',()=>{
 const all=state.pieces.map(p=>p.id);
 const old=state.pool.concat(state.placed);
 state.pool=rescrambleArray(all,old);state.placed=[];state.solved=false;state.hint=0;
 $('coach-message').textContent='Fresh scramble, same underlying problem. Think about dependencies, not the previous positions.';
 render();
});
$('run-btn').addEventListener('click',run);
$('hint-btn').addEventListener('click',hint);
$('next-mode-btn').addEventListener('click',()=>changeMode(state.mode+1));
$('piece-bank').addEventListener('click',e=>{const el=e.target.closest('[data-add]');if(el)add(el.dataset.add)});
$('assembly').addEventListener('click',e=>{
 const rm=e.target.closest('[data-remove]');if(rm){remove(rm.dataset.remove);return}
 const mv=e.target.closest('[data-move]');if(mv){const [i,d]=mv.dataset.move.split(':').map(Number);move(i,d)}
});
let dragIndex=null;
$('assembly').addEventListener('dragstart',e=>{const el=e.target.closest('[data-position]');if(!el)return;dragIndex=Number(el.dataset.position);e.dataTransfer.effectAllowed='move';e.dataTransfer.setData('text/plain',String(dragIndex))});
$('assembly').addEventListener('dragover',e=>{if(e.target.closest('[data-position]'))e.preventDefault()});
$('assembly').addEventListener('drop',e=>{const el=e.target.closest('[data-position]');if(!el||dragIndex===null)return;e.preventDefault();const at=Number(el.dataset.position);const [id]=state.placed.splice(dragIndex,1);state.placed.splice(at,0,id);dragIndex=null;touch();render()});
$('assembly').addEventListener('dragend',()=>dragIndex=null);
$('code-editor').addEventListener('input',e=>state.editor=e.target.value);
$('code-editor').addEventListener('keydown',e=>{if(e.key==='Tab'){e.preventDefault();let el=e.target,pos=el.selectionStart;el.value=el.value.slice(0,pos)+'    '+el.value.slice(el.selectionEnd);el.selectionStart=el.selectionEnd=pos+4;state.editor=el.value}});
initialize();
})();