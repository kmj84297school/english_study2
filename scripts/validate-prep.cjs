const fs=require('fs'),vm=require('vm'),path=require('path'),assert=require('assert');
const root=path.resolve(__dirname,'..'),c={window:{}};
for(const f of ['data/index.js','data/exam-prep.js','exam-prep.js',...fs.readdirSync(path.join(root,'data/exams')).filter(f=>f.endsWith('.js')).map(f=>'data/exams/'+f)])vm.runInNewContext(fs.readFileSync(path.join(root,f),'utf8'),c);
const ids=c.window.EXAM_INDEX.flatMap(g=>g.passages.map(p=>p.id));assert.equal(ids.length,98);assert.equal(Object.keys(c.window.EXAM_PREP).length,98);
const ps=Object.values(c.window.EXAM_DATA).flat(),inserts={},blanks={};let penultimate=0,last=0;
for(const id of ids){
 const d=c.window.EXAM_PREP[id],p=ps.find(p=>p.id===id);assert(d&&p,id);
 for(const k of ['topicEN','gistEN','titleEN','topicKO','gistKO','titleKO'])assert(typeof d[k]==='string'&&d[k].trim().length>=4,id+k);
 assert(!d.bigPicture&&!d.choices,id);assert(d.insert&&d.blank,id+' predictions required');
 const n=d.insert[0],bn=d.blank[0],target=p.sentences.find(s=>s.n===bn),phrase=d.blank[1];
 assert(n>1&&n<p.sentences.length,id+' internal insertion');
 assert(n!==p.irrelevant&&bn!==p.irrelevant,id+' irrelevant source sentence');
 assert(target&&target.en.includes(phrase),id+' exact blank');
 assert(phrase.length<target.en.length&&phrase.trim()!==target.en.replace(/[.!?]$/,''),id+' no whole-sentence blank');
 assert(!/[.!?;]$/.test(phrase)&&phrase.split(/\s+/).length<=18,id+' word or phrase blank');
 assert(d.insert[1].length>=35&&d.blank[2].length>=35,id+' source-specific reasoning');
 let corrected=target.en;for(const [at,before,after] of p.edits||[])if(at===bn)corrected=corrected.replace(before,after);
 assert(corrected.includes(phrase),id+' blank survives source error correction');
 const html=c.window.ExamPrep.render({...p,...d});assert.equal((html.match(/class="prep-translation"/g)||[]).length,3,id+' three translations');
 inserts[n]=(inserts[n]||0)+1;blanks[bn]=(blanks[bn]||0)+1;penultimate+=Number(n===p.sentences.length-1);last+=Number(bn===p.sentences.length);
}
for(let n=1;n<=7;n++)assert(!ids.includes('final-18-0'+n));
assert(penultimate<ids.length/2,'insertion reverted to fixed penultimate rule');assert(last<ids.length/2,'blank reverted to fixed last-sentence rule');
console.log('PASS: 98 reviewed predictions, exact phrase blanks, bilingual answers, excluded scope.');
console.log(JSON.stringify({insertionPositions:inserts,blankPositions:blanks,penultimateInsertions:penultimate,finalSentenceBlanks:last}));
