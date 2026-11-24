const fs=require('fs'),vm=require('vm'),path=require('path'),assert=require('assert');
const root=path.resolve(__dirname,'..'),c={window:{}};
vm.runInNewContext(fs.readFileSync(path.join(root,'data/exam-prep.js'),'utf8'),c);
for(const f of fs.readdirSync(path.join(root,'data/exams')))if(f.endsWith('.js'))vm.runInNewContext(fs.readFileSync(path.join(root,'data/exams',f),'utf8'),c);
const passages=Object.values(c.window.EXAM_DATA).flat();
for(const [id,d] of Object.entries(c.window.EXAM_PREP)){
 const p=passages.find(x=>x.id===id);assert(p,id);const ns=new Set(p.sentences.map(s=>s.n));
 assert.equal(d.bigPicture.length,3,id);assert(d.focus&&d.basis,id);
 for(const q of [...d.bigPicture,d.blank]){assert.equal(q.choices.length,5,id);assert(Number.isInteger(q.correct)&&q.correct>=0&&q.correct<5,id);assert.equal(new Set(q.choices.map(c=>c[0])).size,5,id);for(const v of q.choices)assert(v.length===3&&v.every(x=>typeof x==='string'&&x.length),id);assert(q.evidence.length&&q.evidence.every(n=>ns.has(n)),id);}
 assert(p.sentences.find(s=>s.n===d.blank.n)?.en.includes(d.blank.phrase),id+' blank missing');assert.equal(d.blank.choices[d.blank.correct][0],d.blank.phrase,id+' blank answer mismatch');
 assert(ns.has(d.insert.n)&&d.insert.before&&d.insert.after&&d.insert.trap,id);
 assert(d.grammar.length>=2&&d.vocab.length>=2,id);for(const g of [...d.grammar,...d.vocab])assert(ns.has(g.n)&&g.right&&g.wrong&&g.reason,id);
 const covered=d.order.blocks.flatMap(b=>Array.from({length:b[1]-b[0]+1},(_,i)=>b[0]+i));assert.deepEqual(covered,p.sentences.map(s=>s.n),id+' order coverage');assert(d.order.links.length>=2,id);
 assert(ns.has(d.coherence.after)&&d.coherence.evidence.every(n=>ns.has(n)),id);
}
console.log('PASS:',Object.keys(c.window.EXAM_PREP).length,'authored passages; choices, answer keys, exact blanks, evidence and block coverage');
