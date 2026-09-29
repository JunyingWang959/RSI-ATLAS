const D=JSON.parse(document.getElementById('snapshot').textContent);
const titles=['Power Plant Prediction','Bank Marketing Policy','Wine Quality Transfer','Household Load Forecasting','Spam Correction Memory','Scientific Evidence Retrieval','Next-Basket Recommendation','Inspection Route Search','Receipt Amount Extraction','Handwriting Prototype Memory'];
const descriptions=['Predict power output from environmental readings while improving accuracy across temperature groups.','Configure a pre-call marketing policy to identify likely term-deposit subscribers.','Select real wine examples to improve a frozen predictor when transferring from red to white wine.','Turn the past seven days of household electricity data into a next-day hourly forecast.','Curate weighted SMS examples that correct the decisions of a fixed spam classifier.','Rank scientific abstracts that provide evidence for a given research claim.','Combine purchase history, popularity and item co-occurrence to recommend the next basket.','Improve a closed inspection tour that visits every location once, with a limited compute budget.','Configure text anchors and spatial rules to extract six amount fields from receipt OCR words.','Select weighted handwriting prototypes to improve a fixed trajectory classifier.'];
const groups=['Code','Policy','Memory','Code','Memory','Code','Policy','Code','Workflow','Memory'];
const short=['GPT-6 Sol','Kimi K3','MiniMax M3','MiMo V2.6 Pro','Gemini 3.1 Pro','DeepSeek V4.1 Flash'];
const esc=x=>String(x??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const fmt=(v,n=3)=>typeof v==='number'&&Number.isFinite(v)?v.toFixed(n):'—';
const modelName=m=>short[D.models.findIndex(x=>x.model===m)]||m;
const ti=id=>D.tasks.findIndex(t=>t.task===id);
const taskName=id=>titles[ti(id)]||id;
const AGG=D.aggregate;
const traceKeys=new Set((D.complete_trace_keys||[]).map(k=>k.join('|')));
const completeRows=D.rows.filter(r=>traceKeys.has(r.model+'|'+r.task));
const hasTrace=(model,task)=>traceKeys.has(model+'|'+task);
let selectedModel=D.models[0].model,selectedTask=D.tasks[0].task,roundIndex=0;
const app=document.getElementById('app');
const intro=(tag,title,desc)=>'<div class="pageintro"><div class="eyebrow"><span class="dot"></span>'+tag+'</div><h1>'+title+'</h1><p class="lead">'+desc+'</p></div>';
function stats(){return '<div class="stats">'+[[50,'Tasks in the study','10 open-source · 40 closed-source'],[3,'Artifact categories','Code · policy / workflow · memory'],[2,'Improvement rounds per chain','Artifact + experience inheritance']].map(v=>'<div class="stat"><span class="big">'+v[0]+'</span>'+v[1]+'<br><small>'+v[2]+'</small></div>').join('')+'</div>';}
function overview(){app.innerHTML='<section class="hero"><div>'+intro('A benchmark for agent improvement','Better artifacts.<br><em>Across generations.</em>','Measure how agents improve executable code, policies, workflows and memory—and whether those improvements carry into the next round.')+'<div class="actions"><a class="btn primary" href="#leaderboard">View leaderboard ↓</a><a class="btn" href="#trajectories">Follow a trajectory →</a></div></div><div class="evolution"><div class="eyebrow">The experimental loop</div><h2 style="margin-top:20px">Build. Evaluate. Inherit.</h2><svg viewBox="0 0 440 190" role="img" aria-label="Initial artifact to first round to second round; schematic, not measured scores"><path d="M40 150 C105 150 110 100 210 100 S315 40 400 40" fill="none" stroke="#d6ef88" stroke-width="3"/><path d="M40 150V175M210 100V175M400 40V175" stroke="#4e6860" stroke-dasharray="4 6"/><circle cx="40" cy="150" r="9" fill="#d6ef88"/><circle cx="210" cy="100" r="9" fill="#d6ef88"/><circle cx="400" cy="40" r="9" fill="#d6ef88"/><text x="23" y="126" fill="white" font-size="15">A₀</text><text x="194" y="75" fill="white" font-size="15">A₁</text><text x="380" y="17" fill="white" font-size="15">A₂</text></svg><div class="flow-label"><span><b>Baseline</b>Starter artifact</span><span><b>Round 01</b>Public feedback</span><span><b>Round 02</b>Inherited experience</span></div><p>Freeze each artifact → evaluate on held-out data.<br>Schematic only. Actual trajectories can improve, flatten or regress.</p></div></section>'+leaderboardSection()+stats()+'<div class="section-head"><div><div class="eyebrow">Designed for inspectability</div><h2 style="margin-top:12px">What changes—and what is measured.</h2></div></div><div class="grid3">'+[['01 / Structured artifacts','Four concrete formats','Agents leave behind executable code, policy JSON, workflow JSON or episodic memory. Each generation is frozen and identified by its hash.'],['02 / Two-round inheritance','Experience that carries forward','A fresh second-round session receives the first artifact and public research knowledge. Model weights and task rules stay fixed.'],['03 / Beyond a final score','A candidate ignition index','Compare the fraction of remaining score headroom closed in each round, alongside held-out scores and the full outcome status.']].map(x=>'<article class="card"><span class="number">'+x[0]+'</span><h3>'+x[1]+'</h3><p>'+x[2]+'</p></article>').join('');}

const taskDetails=[
 ['Start with standardized ridge regression, then improve the prediction code to capture nonlinear relationships. The evaluator balances overall error with error in the worst temperature band.', 'Historical samples are split by groups; this is not a future-time forecast.'],
 ['Choose model options, features and hyperparameters in a policy JSON. A fixed executor turns that policy into predictions, balancing subscriber ranking with probability calibration.', 'Only information available before the call is allowed; call duration is excluded.'],
 ['A frozen predictor trained on red wine is adapted to white wine using at most 512 real, weighted examples. The agent improves the memory selection while the residual-correction executor stays fixed.', 'Memory labels must come from the real historical pool.'],
 ['Improve executable forecasting code from a same-day-last-week baseline. Given a complete seven-day window, predict the next 24 hourly loads; the score weighs both hourly and peak-load error.', 'Data is split in time, using complete windows without imputation.'],
 ['A fixed Naive Bayes classifier starts with no correction memory. Select and weight up to 256 real SMS examples to improve spam decisions, scored with macro-F1 and average precision.', 'Messages are normalized and deduplicated before a hash-based split.'],
 ['Given a scientific claim, rank evidence from 5,183 abstracts. Improve the retrieval code from a word TF-IDF baseline; evaluation rewards evidence near the top and recall within the first ten results.', 'Claims sharing evidence are grouped together when splitting data.'],
 ['Tune weights and decay settings in a fixed recommendation executor. Combine popularity, item co-occurrence and past purchases to rank likely next-basket items, evaluated at the top ten.', 'Customer groups do not overlap, and input histories exclude the future basket.'],
 ['Improve a nearest-neighbor baseline into a shorter closed tour that visits every sampled point once. The agent edits search code under a fixed runtime budget; the score normalizes route length by problem size.', 'Distances are Euclidean, not driving distances along roads.'],
 ['Build a workflow JSON with text anchors, exclusion rules and spatial relationships. The fixed executor extracts six amount fields from receipt OCR words, evaluated with micro-F1 and macro-F1.', 'Inputs are annotation-derived OCR words, not raw receipt images.'],
 ['Select and weight up to 128 real handwriting trajectories as prototypes for a fixed centroid classifier. The memory starts empty, and performance is measured with macro-F1 across 20 character classes.', 'Samples come from a single writer; this does not test cross-writer generalization.']
];
function tasks(){
 app.innerHTML='<div class="pageintro"><div class="eyebrow"><span class="dot"></span>Task collection</div><p class="lead">Explore the open-source tasks below.</p></div>'+
 '<div class="toolbar"><span class="badge">4 executable-code tasks</span><span class="badge">3 policy / workflow tasks</span><span class="badge">3 episodic-memory tasks</span></div><div class="grid3">'+D.tasks.map((t,i)=>
 '<article class="card taskcard"><div class="cardtop"><span class="number">TASK '+String(i+1).padStart(2,'0')+'</span><span class="badge">'+groups[i]+'</span></div><h3>'+titles[i]+'</h3><p class="task-summary">'+descriptions[i]+'</p><p>'+taskDetails[i][0]+'</p><div class="task-spec"><p><b>Artifact</b><code>'+esc(t.spec.artifact)+'</code></p><p><b>Scoring</b><span>'+esc(t.metric)+'</span></p></div><p class="task-boundary">'+taskDetails[i][1]+'</p><div class="bottom">'+(completeRows.some(r=>r.task===t.task)?'<button class="btn tasktrace" data-task="'+esc(t.task)+'">Explore trace →</button>':'<span class="muted">No complete trace in this snapshot</span>')+'</div></article>').join('')+'</div>';
 document.querySelectorAll('.tasktrace').forEach(b=>b.onclick=()=>openTrace(completeRows.find(r=>r.task===b.dataset.task).model,b.dataset.task));
}
function openTrace(model,task){selectedModel=model;selectedTask=task;roundIndex=0;location.hash='trajectories';}

const isNumber=v=>typeof v==='number'&&Number.isFinite(v);
const indexReason=r=>!r||!isNumber(r.s2)?'Not measured':({round2_regression:'Round 2 regression',round1_no_positive_gain:'No positive round 1 gain',at_upper_bound:'At score ceiling'}[r.status]||'Not applicable');
function improvementRows(){
 return AGG.leaderboard.map(r=>'<tr><td class="rank-number">'+(r.rank?String(r.rank).padStart(2,'0'):'—')+'</td><td class="model">'+modelName(r.model)+'</td>'+[['a0','A0'],['a1','A1'],['a2','A2'],['index','Ignition I']].map(([key,label])=>'<td class="improvement-cell '+(key==='a2'?'final-average':'')+'" data-label="'+label+'"><strong>'+fmt(r[key],2)+(key==='index'&&isNumber(r[key])?'×':'')+'</strong></td>').join('')+'</tr>').join('');
}
function leaderboardSection(){
 return '<section id="leaderboard" class="overview-leaderboard"><div class="section-head"><div><div class="eyebrow">Leaderboard</div><h2>Average performance across 50 tasks.</h2><p>A0 → A1 → A2, with the overall ignition index.</p></div></div><p class="small">50 tasks · 10 open-source · 40 closed-source. Scores out of 100 · ordered by A2.</p>'+
 '<div class="tablewrap overall-table"><table><caption class="sr-only">50-task averages: A0, A1, A2 and overall ignition index</caption><thead><tr><th>Order</th><th>Model</th><th>A0<small>Baseline average</small></th><th>A1<small>Round 1 average</small></th><th>A2 ↑<small>Round 2 average</small></th><th>Ignition I<small>Relative gain</small></th></tr></thead><tbody id="overall-rows">'+improvementRows()+'</tbody></table></div>'+
 '<p class="small"><b>A0</b>: baseline average. <b>A1</b>: average after round 1. <b>A2</b>: average after round 2.</p><p class="small"><b>Ignition I</b> = [(A2 − A1) / (100 − A1)] ÷ [(A1 − A0) / (100 − A0)]. It compares the share of remaining score headroom gained in round 2 with round 1; I &gt; 1 means faster normalized improvement.</p></section>';
}

function snapshotLabel(value){return new Date(value).toISOString().replace('T',' ').slice(0,16)+' UTC';}
function chart(values,labels){let valid=values.filter(v=>typeof v==='number'&&Number.isFinite(v));if(!valid.length)return '<div class="emptybox">No held-out evaluation recorded yet.</div>';let lo=Math.max(0,Math.min(...valid)-.03),hi=Math.min(1,Math.max(...valid)+.03);if(hi<=lo)hi=lo+.1;const x=i=>75+i*150,y=v=>180-(v-lo)/(hi-lo)*135;let svg='<svg class="chart" viewBox="0 0 450 230" role="img" aria-label="Held-out scores across baseline and two rounds">';for(let i=0;i<4;i++){let v=lo+(hi-lo)*i/3;svg+='<line x1="55" x2="410" y1="'+y(v)+'" y2="'+y(v)+'" stroke="#e0e7db"/><text x="9" y="'+(y(v)+4)+'" fill="#788674" font-size="11">'+fmt(v,2)+'</text>';}values.forEach((v,i)=>{if(v!=null&&i&&values[i-1]!=null)svg+='<line x1="'+x(i-1)+'" y1="'+y(values[i-1])+'" x2="'+x(i)+'" y2="'+y(v)+'" stroke="#20785b" stroke-width="3"/>';if(v!=null)svg+='<circle cx="'+x(i)+'" cy="'+y(v)+'" r="6" fill="#20785b"/><text x="'+x(i)+'" y="'+(y(v)-13)+'" text-anchor="middle" fill="#172c2b" font-size="13">'+fmt(v)+'</text>';svg+='<text x="'+x(i)+'" y="215" text-anchor="middle" fill="#687774" font-size="12">'+labels[i]+(v==null?' · pending':'')+'</text>';});return svg+'</svg>';}

function experimentChart(experiments,expanded=false){
 const scored=experiments.map((e,i)=>({e,i})).filter(({e})=>isNumber(e.public_metric));
 if(!scored.length)return '<div class="emptybox">No numeric public scores recorded in this round.</div>';
 const w=expanded?1080:640,h=expanded?390:300,left=68,right=w-28,top=35,bottom=h-58;
 const vals=scored.map(({e})=>e.public_metric),min=Math.min(...vals),max=Math.max(...vals);
 const pad=Math.max((max-min)*.16,Math.abs(max)*.001,.0005),lo=min-pad,hi=max+pad;
 const x=i=>experiments.length===1?(left+right)/2:left+i*(right-left)/(experiments.length-1);
 const y=v=>bottom-(v-lo)/(hi-lo)*(bottom-top);
 const axisDigits=hi-lo<.01?4:hi-lo<1?3:2;
 let svg='<svg class="iteration-chart '+(expanded?'expanded-chart':'')+'" viewBox="0 0 '+w+' '+h+'" role="group" aria-label="Round '+(roundIndex+1)+' recorded experiment scores. Select a point for details.">';
 for(let i=0;i<5;i++){
  const v=lo+(hi-lo)*i/4;
  svg+='<line x1="'+left+'" x2="'+right+'" y1="'+y(v)+'" y2="'+y(v)+'" stroke="#dce3dc" stroke-dasharray="3 5"/><text x="'+(left-10)+'" y="'+(y(v)+4)+'" text-anchor="end" class="axis-text">'+fmt(v,axisDigits)+'</text>';
 }
 svg+='<text x="'+left+'" y="16" class="axis-text">Reported public score</text>';
 // Missing scores break the line; each point is a recorded experiment, not a reconstructed artifact version.
 experiments.forEach((e,i)=>{
  const prev=experiments[i-1];
  if(isNumber(e.public_metric)&&prev&&isNumber(prev.public_metric))svg+='<line x1="'+x(i-1)+'" y1="'+y(prev.public_metric)+'" x2="'+x(i)+'" y2="'+y(e.public_metric)+'" stroke="#20785b" stroke-width="2.5"/>';
 });
 const tickStep=Math.max(1,Math.ceil(experiments.length/(expanded?20:10)));
 experiments.forEach((e,i)=>{
  if(i%tickStep===0||i===experiments.length-1)svg+='<text x="'+x(i)+'" y="'+(bottom+24)+'" text-anchor="middle" class="axis-text">'+String(i+1).padStart(2,'0')+'</text>';
  if(isNumber(e.public_metric)){
   const label='Experiment '+(i+1)+', score '+fmt(e.public_metric,4)+', '+(e.decision||'recorded');
   svg+='<g class="chart-point '+(e.decision==='revert'?'reverted':'')+'" role="button" tabindex="0" data-point="'+i+'" aria-label="'+esc(label)+'" aria-pressed="false"><title>'+esc(label+' — '+e.change)+'</title><circle class="point-hit" cx="'+x(i)+'" cy="'+y(e.public_metric)+'" r="13"/><circle class="point-dot" cx="'+x(i)+'" cy="'+y(e.public_metric)+'" r="5"/></g>';
  }
 });
 svg+='<text x="'+((left+right)/2)+'" y="'+(h-6)+'" text-anchor="middle" class="axis-text">Recorded experiment · current round</text></svg>';
 return svg;
}
function experimentDetail(e,i){return '<span class="number">EXPERIMENT '+String(i+1).padStart(2,'0')+'</span><div class="detail-heading"><strong>'+fmt(e.public_metric,4)+'</strong><span class="badge '+(e.decision==='revert'?'warn':'')+'">'+esc(e.decision||'recorded')+'</span></div><p>'+esc(e.change)+'</p><p class="evidence"><b>Evidence</b> · '+esc(e.evidence||'Not provided')+'</p>';}
function trajectories(){
 if(!completeRows.length){app.innerHTML=intro('Trajectory explorer','Complete traces','No complete two-round evidence is available in this snapshot.');return;}
 if(!hasTrace(selectedModel,selectedTask)){const next=completeRows.find(x=>x.model===selectedModel)||completeRows[0];selectedModel=next.model;selectedTask=next.task;}
 const r=completeRows.find(x=>x.model===selectedModel&&x.task===selectedTask),q=r.rounds[roundIndex];
 app.innerHTML=intro('Trajectory explorer','See how an artifact evolves.','Follow the experiments inside each round, then compare the frozen artifacts on held-out data.')+
 '<div class="toolbar"><label>Model <select id="modelpick">'+D.models.filter(m=>completeRows.some(x=>x.model===m.model)).map(m=>'<option '+(m.model===selectedModel?'selected':'')+' value="'+esc(m.model)+'">'+modelName(m.model)+'</option>').join('')+'</select></label><label>Task <select id="taskpick">'+D.tasks.map((t,i)=>({t,i})).filter(({t})=>hasTrace(selectedModel,t.task)).map(({t,i})=>'<option '+(t.task===selectedTask?'selected':'')+' value="'+t.task+'">'+String(i+1).padStart(2,'0')+' · '+titles[i]+'</option>').join('')+'</select></label><span class="badge">Complete two-round evidence</span></div>'+
 '<div class="layout trace-layout"><div><section class="card"><div class="eyebrow">Held-out evaluation</div><h3>'+taskName(selectedTask)+'</h3>'+chart([r.s0,r.s1,r.s2],['A₀ · baseline','A₁ · round 1','A₂ · round 2'])+'<div class="metricrow main-metrics">'+[['s0','A0'],['s1','A1'],['s2','A2'],['index','Ignition I']].map(([key,label])=>'<div><strong class="'+(r[key]<0?'down':'')+'">'+(isNumber(r[key])?(key==='index'?fmt(r[key],3)+'×':fmt(r[key],4)):'—')+'</strong><span>'+label+'</span></div>').join('')+'</div><p class="mini-label">Raw task score · adaptive y-axis'+(!isNumber(r.index)?'<br>I: '+indexReason(r):r.small_denominator_warning?'<br>I is sensitive to the small first-round gain.':'')+'</p></section><details class="metric-details"><summary>All held-out metrics</summary>'+fullMetrics(r)+'</details><section class="card inheritance"><div class="eyebrow">Round-to-round inheritance</div><p>The next session receives the frozen artifact and research experience. Held-out feedback is not used for optimization.</p><p class="mini-label">Both rounds are complete, with verified frozen artifacts and research records.</p></section></div>'+
 '<section class="card research-panel"><div class="cardtop"><h3>Within-round progress</h3><span class="badge purple">'+esc(groups[ti(selectedTask)])+'</span></div><div class="round-toolbar"><div class="tabs"><button id="r1" aria-pressed="'+(!roundIndex)+'" class="'+(!roundIndex?'selected':'')+'">Round 01</button><button id="r2" aria-pressed="'+Boolean(roundIndex)+'" class="'+(roundIndex?'selected':'')+'">Round 02</button></div><button class="btn" id="expand-chart">Expand chart ⤢</button></div>'+experimentChart(q.experiments)+'<div class="matrix-legend"><span><i class="legend-dot measured"></i>Keep</span><span><i class="legend-dot revert"></i>Revert</span><span class="muted">Select a point to inspect</span></div><p class="mini-label">'+q.experiments.length+' recorded experiment'+(q.experiments.length===1?'':'s')+' · agent-reported public scores · adaptive y-axis. Records reflect the frozen research notes, not a complete version history.</p><div id="experiment-detail" class="detail" aria-live="polite"></div><details class="experiment-records"><summary>All experiments in this round ('+q.experiments.length+')</summary><div class="trace-list">'+q.experiments.map((e,i)=>'<button class="experiment" data-exp="'+i+'" aria-pressed="false"><span class="seq">'+String(i+1).padStart(2,'0')+'</span><span class="copy">'+esc(e.change)+'<br><span class="badge '+(e.decision==='revert'?'warn':'')+'">'+esc(e.decision||'recorded')+'</span></span><strong>'+fmt(e.public_metric,4)+'</strong></button>').join('')+'</div></details>'+(q.hypotheses?.length?'<details class="detail"><summary>Research knowledge carried forward</summary>'+q.hypotheses.map(h=>'<p>'+esc(h)+'</p>').join('')+'</details>':'')+'</section></div>'+
 '<dialog id="chart-dialog" aria-labelledby="expanded-chart-title"><div class="dialog-heading"><div><span class="eyebrow">'+esc(modelName(selectedModel))+' · Round 0'+(roundIndex+1)+'</span><h2 id="expanded-chart-title">'+taskName(selectedTask)+'</h2></div><button class="btn" id="close-chart" autofocus aria-label="Close expanded chart">Close ×</button></div>'+experimentChart(q.experiments,true)+'<div class="matrix-legend"><span><i class="legend-dot measured"></i>Keep</span><span><i class="legend-dot revert"></i>Revert</span><span class="muted">Recorded public scores · select a point</span></div><div id="expanded-detail" class="detail" aria-live="polite"></div></dialog>';
 const choose=i=>{
  const e=q.experiments[i];if(!e)return;
  document.querySelectorAll('[data-point],[data-exp]').forEach(b=>{const chosen=Number(b.dataset.point??b.dataset.exp)===i;b.classList.toggle('chosen',chosen);b.setAttribute('aria-pressed',String(chosen));});
  document.getElementById('experiment-detail').innerHTML=experimentDetail(e,i);
  document.getElementById('expanded-detail').innerHTML=experimentDetail(e,i);
 };
 document.querySelectorAll('[data-exp]').forEach(b=>b.onclick=()=>choose(+b.dataset.exp));
 document.querySelectorAll('[data-point]').forEach(b=>{b.onclick=()=>choose(+b.dataset.point);b.onkeydown=e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();choose(+b.dataset.point);}};});
 choose(q.experiments.length-1);
 const dialog=document.getElementById('chart-dialog');
 document.getElementById('expand-chart').onclick=()=>dialog.showModal();
 document.getElementById('close-chart').onclick=()=>dialog.close();
 dialog.onclick=e=>{if(e.target===dialog){const b=dialog.getBoundingClientRect();if(e.clientX<b.left||e.clientX>b.right||e.clientY<b.top||e.clientY>b.bottom)dialog.close();}};
 document.getElementById('modelpick').onchange=e=>{selectedModel=e.target.value;trajectories();};
 document.getElementById('taskpick').onchange=e=>{selectedTask=e.target.value;trajectories();};
 document.getElementById('r1').onclick=()=>{roundIndex=0;trajectories();};
 document.getElementById('r2').onclick=()=>{roundIndex=1;trajectories();};
}

function render(){
 const hash=location.hash.slice(1)||'overview';
 const page=['tasks','trajectories'].includes(hash)?hash:'overview';
 document.querySelectorAll('nav a').forEach(a=>a.classList.toggle('active',a.hash==='#'+page));
 ({overview,tasks,trajectories}[page])();
 if(hash==='leaderboard'||hash==='benchmark')document.getElementById('leaderboard').scrollIntoView();
 else window.scrollTo(0,0);
}
document.getElementById('stamp').textContent='Trace snapshot: '+snapshotLabel(D.snapshot_at);window.addEventListener('hashchange',render);render();

function fullMetrics(r){const mm=r?.evaluation_metrics||{};const keys=[...new Set(Object.values(mm).flatMap(v=>Object.keys(v)))];if(!keys.length)return "";const val=v=>Array.isArray(v)?v.map(x=>fmt(x,4)).join(" / "):typeof v==="number"?fmt(v,4):"—";return '<section class="card" style="margin-top:20px"><h3>All held-out metrics</h3><p class="mini-label">Measured only · A₀ baseline / A₁ round 1 / A₂ round 2. MAE, RMSE and Brier: lower is better.</p><div class="tablewrap"><table><thead><tr><th>Metric</th><th>A₀</th><th>A₁</th><th>A₂</th></tr></thead><tbody>'+keys.map(k=>'<tr><td>'+esc(k)+'</td>'+["A0","A1","A2"].map(a=>'<td>'+val(mm[a]?.[k])+'</td>').join("")+'</tr>').join("")+'</tbody></table></div></section>';}
