/* One correct-answer expression per type. No quizzes or distractors. */
window.ExamPrep = {render(p){
 const e=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
 return '<p class="eyebrow">01 / BIG PICTURE</p><h2>주제 · 요지 · 제목</h2><p class="muted">정답 선지로 표현할 수 있는 예시입니다.</p>'+[['주제 · 무엇에 관한 글인가',p.topicEN],['요지 · 저자가 말하려는 바',p.gistEN],['제목 · 글 전체를 포괄하는 표현',p.titleEN]].map(([label,text])=>`<article class="answer-card"><span>${e(label)}</span><h3 lang="en">${e(text)}</h3></article>`).join('');
}};
