const fs=require('fs'),vm=require('vm'),path=require('path'),assert=require('assert');
const root=path.resolve(__dirname,'..'),c={window:{}};
for(const f of ['data/index.js','data/exam-prep.js',...fs.readdirSync(path.join(root,'data/exams')).filter(f=>f.endsWith('.js')).map(f=>'data/exams/'+f)])vm.runInNewContext(fs.readFileSync(path.join(root,f),'utf8'),c);
const ids=c.window.EXAM_INDEX.flatMap(g=>g.passages.map(p=>p.id));assert.equal(ids.length,105);assert.equal(Object.keys(c.window.EXAM_PREP).length,105);
const ps=Object.values(c.window.EXAM_DATA).flat();
for(const id of ids){const d=c.window.EXAM_PREP[id],p=ps.find(p=>p.id===id);assert(d&&p,id);for(const k of ['topicEN','gistEN','titleEN'])assert(typeof d[k]==='string'&&d[k].length>12,id+k);assert(!d.bigPicture&&!d.choices,id);if(d.insert)assert(p.sentences.some(s=>s.n===d.insert[0]),id);if(d.blank)assert(p.sentences.find(s=>s.n===d.blank[0]).en.includes(d.blank[1]),id+' exact blank');}
console.log('PASS: all 105 compact sets and source references');
