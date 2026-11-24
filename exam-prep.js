/* Authored practice based on the observed midterm; not official predictions. */
(() => {
const e=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
function render(p,section,range,quote){
 const d=window.EXAM_PREP?.[p.id];if(!d)return null;
 const card=(title,body)=>`<article class="content-card"><h3>${e(title)}</h3>${body}</article>`;
 const evidence=ns=>ns.map(n=>range(n)).join(' ');
 const quiz=(q,key)=>`<form class="prep-quiz" data-quiz="${key}"><fieldset><legend>${e(q.title)}</legend>${q.choices.map((c,i)=>`<label class="prep-choice"><input type="radio" name="${key}" value="${i}" required><span lang="en">${'①②③④⑤'[i]} ${e(c[0])}</span></label>`).join('')}</fieldset><button class="primary" type="submit">선택한 답 확인</button><div class="prep-feedback" role="status" aria-live="polite"></div><div class="prep-solutions" hidden><p><b>연습 정답 ${'①②③④⑤'[q.correct]}</b> · 근거 ${evidence(q.evidence)}</p>${q.choices.map((c,i)=>`<p><b>${'①②③④⑤'[i]} ${i===q.correct?'정답 방향':e(c[1])}</b><br>${e(c[2])}</p>`).join('')}</div></form>`;
 let html=`<div class="exam-practice"><p class="prep-badge">중간고사 출제 방식 반영 · 지문별 변형 연습</p><p class="muted">지난 시험의 변형 방식을 적용한 자체 제작 자료입니다. 실제 출제나 공식 정답을 예고하지 않습니다.</p>`;
 if(section==='answers')html+=card('이 지문에서 구별할 논리',`<p>${e(d.focus)}</p><p class="muted">${e(d.basis)}</p>`)+d.bigPicture.map((q,i)=>quiz(q,'big-'+i)).join('');
 if(section==='order')html+=card('순서로 바뀌면 잡아야 할 연결',`<p>${e(d.order.strategy)}</p>`)+d.order.blocks.map((b,i)=>card(`${i+1}. ${b[2]}`,`${range(b[0],b[1])}<p lang="en">${e(p.sentences.filter(s=>s.n>=b[0]&&s.n<=b[1]).map(s=>s.en).join(' '))}</p>`)).join('')+d.order.links.map(l=>card(l[0],`<p>${e(l[1])}</p><p><b>순서를 바꾸면</b> ${e(l[2])}</p>`)).join('');
 if(section==='positions')html+=card('삽입 후보 문장',`${range(d.insert.n)}${quote(p,d.insert.n)}<p><b>앞 연결</b> ${e(d.insert.before)}</p><p><b>뒤 연결</b> ${e(d.insert.after)}</p><p><b>헷갈리는 위치</b> ${e(d.insert.trap)}</p>`)+card('빈칸 변형',`${range(d.blank.n)}<p lang="en">${e(p.sentences.find(s=>s.n===d.blank.n).en).replace(e(d.blank.phrase),'[ ______ ]')}</p>`)+quiz(d.blank,'blank');
 if(section==='words')html+=d.grammar.map(g=>card('어법 변형 · '+g.type,`${range(g.n)}${quote(p,g.n)}<p><b>원문</b> <span lang="en">${e(g.right)}</span> → <b>오류로 바꾸면</b> <span lang="en">${e(g.wrong)}</span></p><details><summary>왜 틀리는지 확인</summary><p>${e(g.reason)}</p></details>`)).join('')+d.vocab.map(v=>card('문맥 어휘 · '+v.right,`${range(v.n)}<p><b>맞는 방향</b> ${e(v.right)} / <b>반대로 바꾼 함정</b> ${e(v.wrong)}</p><p>${e(v.reason)}</p>`)).join('');
 if(section==='coherence')html+=card('같은 소재, 다른 논점',`<p><b>가상 추가 문장</b></p><p lang="en">${e(d.coherence.sentence)}</p><p><b>끼워 넣는 위치</b> S${d.coherence.after} 뒤</p><details><summary>무관한 이유와 원래 연결 확인</summary><p>${e(d.coherence.reason)}</p><p><b>제거하면 회복되는 흐름</b> ${e(d.coherence.restore)}</p>${evidence(d.coherence.evidence)}</details>`);
 return html+'</div>';
}
function bind(root,p){root.querySelectorAll('.prep-quiz').forEach(form=>form.addEventListener('submit',ev=>{ev.preventDefault();const selected=form.querySelector('input:checked');if(!selected)return;const key=form.dataset.quiz,d=window.EXAM_PREP[p.id],q=key==='blank'?d.blank:d.bigPicture[Number(key.split('-')[1])];form.querySelector('.prep-feedback').textContent=Number(selected.value)===q.correct?'맞았습니다. 각 선지의 근거도 확인해 보세요.':'다시 비교해 보세요. 아래에서 선택지별 차이를 확인할 수 있습니다.';form.querySelector('.prep-solutions').hidden=false;}));}
window.ExamPrep={render,bind};
})();
