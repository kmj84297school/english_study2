/* ───────── 응원 문구 60개 (날짜 기반 로테이션) ───────── */
const CHEERS = [
  "오늘 읽은 한 지문이 시험장에서 너를 구한다!",
  "빈칸은 흐름을 잡은 사람이 이긴다. 천천히 가자!",
  "밥 한 술, 지문 한 컷. 가볍게 쌓아가자!",
  "어휘 하나가 1점을 만든다. 오늘도 한 개 더!",
  "독해는 속도가 아니라 이해다. 꼭꼭 씹자!",
  "모르는 문장은 적이 아니라 다음 레벨로 가는 문이다!",
  "어제의 너보다 한 지문만큼 더 똑똑해졌다!",
  "지문 구조가 보이면 정답도 보인다!",
  "밑줄 함축은 결국 글의 큰 그림. 멀리서 보자!",
  "오늘의 5지문이 모여 시험날의 자신감이 된다!",
  "헷갈리는 문장일수록 주어·동사부터 찾자!",
  "포기하지 않는 사람만 빈칸을 채운다!",
  "한 입 먹고 한 문장. 그게 쌓이면 실력!",
  "순서·삽입은 연결어가 길을 알려준다!",
  "단어를 외우는 게 아니라 친해지는 거다!",
  "오답도 데이터다. 왜 틀렸는지가 보물이다!",
  "지문은 작가와의 대화. 무슨 말 하나 들어보자!",
  "꾸준함이 재능을 이긴다. 오늘도 출석!",
  "어려운 41·42번도 한 컷씩 보면 쉬워진다!",
  "주제문 한 줄만 잡아도 절반은 푼 거다!",
  "긴장될 땐 심호흡, 그리고 첫 문장부터!",
  "today의 너는 어제보다 분명히 강하다!",
  "감정 단어 vs 이성 단어, 대조를 즐기자!",
  "밥은 든든하게, 공부는 가볍게!",
  "한 지문을 끝까지 이해하면 열 지문이 보인다!",
  "어휘 문제는 반의어 함정만 피하면 OK!",
  "글의 반전(however)을 찾으면 출제 포인트가 보인다!",
  "느려도 괜찮아, 멈추지만 않으면 도착한다!",
  "오늘 만난 표현, 시험에서 반갑게 만나자!",
  "독해 근육도 매일 써야 자란다!",
  "복습은 미래의 나에게 주는 선물이다!",
  "지문 속 'this/that'이 가리키는 걸 찾자!",
  "5지문이면 충분해. 욕심보다 꾸준함!",
  "어려웠다면, 그만큼 성장한 거다!",
  "정답은 항상 지문 안에 있다. 근거를 찾자!",
  "오늘도 한 컷 한 컷, 만화 보듯 가볍게!",
  "빈칸 앞뒤 문장이 정답의 힌트다!",
  "긴 문장은 끊어 읽기. 한 덩이씩!",
  "모의고사는 연습. 틀려도 괜찮은 무대다!",
  "지문의 마지막 문장에 주제가 숨어 있다!",
  "한 술 더 뜨듯, 지문 하나 더!",
  "영어는 매일 조금씩이 정답이다!",
  "오늘의 집중이 시험날 1등급을 만든다!",
  "어휘·구조·흐름, 셋만 잡으면 끝!",
  "막히면 한국어 해석부터, 그다음 영어로!",
  "작은 진전도 진전이다. 박수!",
  "독해는 추리 게임. 단서를 모으자!",
  "오늘 배운 10초 복습 문장, 꼭 떠올리자!",
  "꾸준한 한 끼 공부가 너를 바꾼다!",
  "지문이 길어도 핵심은 한 문장이다!",
  "어제 헷갈린 지문, 오늘은 친구가 됐다!",
  "시험은 결국 평소 실력의 거울이다!",
  "한 지문의 깊은 이해 > 열 지문 대충!",
  "오늘도 밥상 앞에서 1점씩 모으자!",
  "글쓴이가 진짜 하고 싶은 말을 찾자!",
  "반복되는 단어가 곧 주제어다!",
  "천천히 읽어도 정확히 읽으면 이긴다!",
  "오늘의 다섯 지문, 내일의 든든함!",
  "할 수 있다. 이미 하고 있으니까!",
  "마지막 한 지문까지, 가볍게 끝내자!"
];
function todayKey(){const d=new Date();return d.getFullYear()+"-"+String(d.getMonth()+1).padStart(2,"0")+"-"+String(d.getDate()).padStart(2,"0");}
function dayOfYear(){const d=new Date();const s=new Date(d.getFullYear(),0,0);return Math.floor((d-s)/86400000);}
(function setCheer(){
  document.getElementById("cheerMsg").textContent = CHEERS[dayOfYear()%CHEERS.length];
  const k=todayKey();
  document.getElementById("cheerLbl").textContent = "📌 오늘의 응원 · "+k.slice(5).replace("-","/");
})();

/* ───────── 시험 동적 로딩 ───────── */
// 시험 목록은 data/index.js의 EXAM_INDEX (본문 없음). 본문은 선택 시 파일에서 로드.
const EXAM_LIST = window.EXAM_INDEX || [];
const loadedExams = {};   // id → 시험 데이터(본문 포함) 캐시

function loadScript(src){
  return new Promise((resolve,reject)=>{
    const s=document.createElement("script");
    s.src=src; s.onload=resolve; s.onerror=()=>reject(new Error("로드 실패: "+src));
    document.head.appendChild(s);
  });
}

async function loadExam(id){
  if(loadedExams[id]) return loadedExams[id];
  const info = EXAM_LIST.find(e=>e.id===id);
  if(!info) throw new Error("시험 데이터를 찾을 수 없습니다: "+id);
  await loadScript(`./data/exams/${info.file}`);
  const data = window.EXAM_DATA && window.EXAM_DATA[id];
  if(!data) throw new Error("시험 파일은 불러왔지만 데이터가 없습니다: "+id);
  loadedExams[id]=data;
  return data;
}

// 총복습 등 전체가 필요할 때: 모든 시험을 한 번에 로드
async function loadAllExams(){
  await Promise.all(EXAM_LIST.map(e=>loadExam(e.id)));
}

/* ───────── 상태 ───────── */
const MODES=[{id:"basic",l:"기본"},{id:"exam",l:"실전(수능형)"},{id:"easy",l:"더 쉽게"},{id:"short",l:"더 짧게"},{id:"quiz",l:"문제 중심"},{id:"vocab",l:"단어 중심"},{id:"final",l:"시험 직전용"}];
// examId: 현재 선택된 시험 id (없으면 첫 시험). 인덱스 대신 id로 식별.
let state={tab:"study",examId:(EXAM_LIST[0]&&EXAM_LIST[0].id)||null,passage:null,mode:"basic"};
const app=document.getElementById("app");
const esc=s=>(s==null?"":String(s)).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;");

// 현재 선택된 시험의 (로드된) 데이터. 아직 로드 전이면 null.
function currentExam(){ return state.examId ? loadedExams[state.examId] : null; }

/* ───────── 렌더 ───────── */
function render(){
  if(state.tab==="review") return renderReview();
  if(state.passage!=null) return renderPassage();
  renderList();
}

function renderList(){
  // 칩은 EXAM_LIST(목록)로 그림 — 본문 없이도 가능
  const examChips=EXAM_LIST.map(e=>`<button class="chip ${e.id===state.examId?'on':''}" data-ex="${e.id}">${esc(e.name)}</button>`).join("");
  const exam=currentExam();   // 선택된 시험이 이미 로드됐으면 본문 표시
  let cells="";
  if(exam){
    cells=exam.passages.map((p,i)=>`
      <button class="pcell done" data-p="${i}">${esc(p.num)}번 ✓
        <span class="tp">${esc(p.topic||"")}</span>
      </button>`).join("");
  } else if(state.examId){
    cells='<div class="empty">불러오는 중…</div>';
  }
  app.innerHTML=`
    <h2 class="sec"><span class="mark">1. 모의고사 고르기</span></h2>
    <div class="chips">${examChips}</div>
    <h2 class="sec"><span class="mark">2. 지문 고르기</span><span class="hint">✓ 분석 완료 · 탭하면 바로 학습</span></h2>
    <div class="grid">${cells||'<div class="empty">아직 지문이 없어요.</div>'}</div>
  `;
  app.querySelectorAll("[data-ex]").forEach(b=>b.onclick=()=>selectExam(b.dataset.ex));
  app.querySelectorAll("[data-p]").forEach(b=>b.onclick=()=>{state.passage=+b.dataset.p;state.mode="basic";render();window.scrollTo(0,0);});

  // 선택된 시험이 아직 로드 안 됐으면 로드 후 다시 렌더
  if(state.examId && !exam){
    loadExam(state.examId).then(render).catch(err=>{
      app.querySelector(".grid").innerHTML='<div class="empty">'+esc(err.message)+'</div>';
    });
  }
}

// 시험 칩 클릭: id 저장 후 (필요시 로드) 렌더
function selectExam(id){
  state.examId=id; state.passage=null;
  render();
}

function modeData(p,mode){
  // 모드별 가공: 데이터는 basic 1벌, 나머지는 클라이언트에서 변형
  if(mode==="short"){
    return {...p, comic:p.comic.slice(0,3), easy:p.easy.split(/(?<=[.!?。])\s/).slice(0,2).join(" "),
      vocab:p.vocab.slice(0,4), sentences:p.sentences.slice(0,1)};
  }
  if(mode==="quiz"){
    return {...p, comic:[], easy:"", structure:null, vocab:[], sentences:[]};
  }
  if(mode==="vocab"){
    return {...p, comic:[], structure:null, sentences:[], examPoints:"", _vocabFocus:true};
  }
  if(mode==="final"){
    return {...p, comic:[], easy:"", structure:null, sentences:[], quiz:[], vocab:p.vocab.slice(0,5)};
  }
  if(mode==="easy"){
    return {...p, _easyNote:true};
  }
  return p;
}

function renderPassage(){
  const exam=currentExam();
  if(!exam){ // 안전장치: 본문이 아직 없으면 로드 후 재렌더
    loadExam(state.examId).then(render);
    app.innerHTML='<div class="empty">불러오는 중…</div>'; return;
  }
  const base=exam.passages[state.passage];
  const p=modeData(base,state.mode);
  const has=v=>v&&(Array.isArray(v)?v.length:(typeof v==="object"?Object.values(v).some(x=>x):String(v).trim()));

  const modeBtns=MODES.map(m=>`<button class="mbtn ${m.id===state.mode?'on':''}" data-m="${m.id}">${m.l}</button>`).join("");

  let html=`<a class="back" id="back">← 지문 목록으로</a>
    <div class="ptitle">${esc(exam.name)} <span class="n">${esc(base.num)}번</span></div>
    <div class="ptopic">${esc(base.topic||"")}</div>
    <div class="modes">${modeBtns}</div>`;

  if(state.mode==="exam"){
    const hasExam = base.examTheme||base.examPoint||base.examTitle||has(base.grammarQ)||has(base.orderABC)||has(base.insertPrep);
    if(!hasExam){
      html+=`<div class="card"><div class="exam-empty">📝 이 지문은 아직 <b>실전(수능형)</b> 분석이 준비되지 않았어요.<br>‘기본’ 모드로 보거나, 다음 업데이트를 기다려 주세요!</div></div>`;
    } else {
      if(base.examTheme) html+=card("①","예상 주제 (Topic)",`<div class="en-line">${esc(base.examTheme)}</div>`);
      if(base.examPoint) html+=card("②","예상 요지 (요지)",`<div class="lead">${esc(base.examPoint)}</div>`);
      if(base.examTitle) html+=card("③","예상 제목 (Title)",`<div class="txt">${esc(base.examTitle)}</div>`);
      if(has(base.easy)) html+=card("④","쉬운 설명",`<div class="txt">${esc(base.easy)}</div>`);
      if(has(base.vocab)) html+=card("⑤","주요 어휘",base.vocab.map(v=>
        `<div class="voc"><b>${esc(v.word)}</b> — ${esc(v.mean)}<span class="role">↳ ${esc(v.role)}</span></div>`).join(""));
      if(has(base.grammarQ)) html+=card("⑥","예상 문법 문제",`<div class="gqlist">${base.grammarQ.map(g=>`<div class="gq">▸ ${esc(g)}</div>`).join("")}</div>`);
      if(has(base.orderABC)) html+=card("⑦","순서 대비 (A·B·C)",
        base.orderABC.blocks.map(b=>`<div class="strow"><span class="stag abc">${esc(b.tag)}</span><span>${esc(b.text)}</span></div>`).join("")
        + (base.orderABC.clue?`<div class="clue">🔗 연결 단서: ${esc(base.orderABC.clue)}</div>`:""));
      if(has(base.insertPrep)) html+=card("⑧","삽입 대비",`<div class="inslist">${base.insertPrep.map(s=>
        `<div class="ins"><div class="ins-sent">"${esc(s.sent)}"</div><div class="ins-clue">👉 ${esc(s.clue)}</div></div>`).join("")}</div>`);
      html+=card("⑨","10초 복습",`<div class="reviewline">⏱️ <span class="mark">${esc(base.review)}</span></div>`);
      if(has(base.quiz)) html+=card("⑩","확인 질문",quizHtml(base.quiz));
    }
  } else if(state.mode==="vocab"){
    html+=card("⑤","핵심 단어·표현 (집중)", base.vocab.map(v=>
      `<div class="voc"><b>${esc(v.word)}</b> — ${esc(v.mean)}<span class="role">↳ ${esc(v.role)}</span></div>`).join(""));
    html+=card("⑧","10초 복습",`<div class="reviewline">⏱️ <span class="mark">${esc(base.review)}</span></div>`);
  } else if(state.mode==="final"){
    html+=card("①","한 줄 요약",`<div class="lead">${esc(base.summary)}</div>`);
    html+=card("⑤","핵심 단어 5",p.vocab.map(v=>`<div class="voc"><b>${esc(v.word)}</b> — ${esc(v.mean)}</div>`).join(""));
    html+=card("⑦","시험 포인트",`<div class="exambox txt">${esc(base.examPoints)}</div>`);
    html+=card("⑧","10초 복습",`<div class="reviewline">⏱️ <span class="mark">${esc(base.review)}</span></div>`);
  } else if(state.mode==="quiz"){
    html+=card("⑦","시험 포인트",`<div class="exambox txt">${esc(base.examPoints)}</div>`);
    html+=card("⑨","확인 질문",quizHtml(base.quiz));
    html+=card("⑧","10초 복습",`<div class="reviewline">⏱️ <span class="mark">${esc(base.review)}</span></div>`);
  } else {
    html+=card("①","한 줄 핵심 요약",`<div class="lead">${esc(p.summary)}</div>`);
    if(has(p.comic)) html+=card("②","만화처럼 이해하기",`<div class="comic">${p.comic.map(c=>{
      const m=String(c).match(/^(\d+컷)\s*[:：]?\s*([\s\S]*)$/);
      return `<div class="cut"><b>${m?esc(m[1]):''}</b>${esc(m?m[2]:c)}</div>`;}).join("")}</div>`);
    if(has(p.easy)) html+=card("③","쉬운 설명",`<div class="txt">${esc(p.easy)}</div>`);
    if(has(p.structure)) html+=card("④","지문 구조",Object.entries(p.structure).map(([k,v])=>
      `<div class="strow"><span class="stag">${esc(k)}</span><span>${esc(v)}</span></div>`).join(""));
    if(has(p.vocab)) html+=card("⑤","핵심 단어·표현",p.vocab.map(v=>
      `<div class="voc"><b>${esc(v.word)}</b> — ${esc(v.mean)}<span class="role">↳ ${esc(v.role)}</span></div>`).join(""));
    if(has(p.sentences)) html+=card("⑥","헷갈리는 문장 풀기",p.sentences.map(s=>
      `<div class="sent"><div class="en">"${esc(s.sent)}"</div><div class="ko">👉 ${esc(s.explain)}</div></div>`).join(""));
    if(has(base.examPoints)) html+=card("⑦","시험 포인트",`<div class="exambox txt">${esc(base.examPoints)}</div>`);
    html+=card("⑧","10초 복습",`<div class="reviewline">⏱️ <span class="mark">${esc(base.review)}</span></div>`);
    if(has(base.quiz)) html+=card("⑨","확인 질문",quizHtml(base.quiz));
  }

  app.innerHTML=html;
  document.getElementById("back").onclick=()=>{state.passage=null;render();window.scrollTo(0,0);};
  app.querySelectorAll("[data-m]").forEach(b=>b.onclick=()=>{state.mode=b.dataset.m;render();});
  bindQuiz();
}

function card(no,title,inner){
  return `<div class="card"><div class="stitle"><span class="no">${no}</span><h3>${esc(title)}</h3></div>${inner}</div>`;
}
function quizHtml(qz){
  return (qz||[]).map((q,i)=>`<div class="qz"><div class="q"><b>Q${i+1}.</b> ${esc(q.q)}</div>
    <button class="qbtn" data-a="${esc(q.a)}">정답 보기 👆</button></div>`).join("");
}
function bindQuiz(){
  app.querySelectorAll(".qbtn").forEach(b=>{
    b.onclick=()=>{
      if(b.classList.contains("open")){b.classList.remove("open");b.textContent="정답 보기 👆";}
      else{b.classList.add("open");b.textContent=b.dataset.a;}
    };
  });
}

function renderReview(){
  // 총복습은 모든 시험 본문이 필요 → 먼저 다 로드
  const allLoaded = EXAM_LIST.every(e=>loadedExams[e.id]);
  if(!allLoaded){
    app.innerHTML='<h2 class="sec"><span class="mark">⏱️ 10초 복습 모아보기</span></h2><div class="empty">불러오는 중…</div>';
    loadAllExams().then(render).catch(err=>{ app.innerHTML='<div class="empty">'+esc(err.message)+'</div>'; });
    return;
  }
  let items=[];
  EXAM_LIST.forEach(info=>{
    const e=loadedExams[info.id];
    e.passages.forEach((p,pi)=>items.push({eid:info.id,pi,exam:e.name,num:p.num,review:p.review,summary:p.summary}));
  });
  app.innerHTML=`<h2 class="sec"><span class="mark">⏱️ 10초 복습 모아보기</span><span class="hint">${items.length}개 지문</span></h2>`
    + items.map(it=>`<div class="rv" data-eid="${it.eid}" data-pi="${it.pi}">
        <div class="meta">${esc(it.exam)} · ${esc(it.num)}번</div>
        <div class="rl">${esc(it.review)}</div>
        <div class="sm">${esc(it.summary)}</div></div>`).join("");
  app.querySelectorAll(".rv").forEach(b=>b.onclick=()=>{
    state.tab="study";state.examId=b.dataset.eid;state.passage=+b.dataset.pi;state.mode="basic";
    document.getElementById("tabStudy").classList.add("on");
    document.getElementById("tabReview").classList.remove("on");
    render();window.scrollTo(0,0);
  });
}

/* ───────── 탭 ───────── */
document.getElementById("tabStudy").onclick=function(){
  state.tab="study";this.classList.add("on");document.getElementById("tabReview").classList.remove("on");render();window.scrollTo(0,0);
};
document.getElementById("tabReview").onclick=function(){
  state.tab="review";this.classList.add("on");document.getElementById("tabStudy").classList.remove("on");render();window.scrollTo(0,0);
};

render();

// (위 render(); 가 첫 화면을 그리고 첫 시험을 자동 로드합니다)
