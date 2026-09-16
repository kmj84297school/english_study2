// 실행: node scripts/validate.cjs — 추가한 자료도 같은 규칙으로 검사합니다.
const fs=require('node:fs'), path=require('node:path'),vm=require('node:vm');
const root=path.resolve(__dirname,'..'),context=vm.createContext({window:{}}),errors=[];
const check=(ok,msg)=>{if(!ok)errors.push(msg)}, read=f=>vm.runInContext(fs.readFileSync(path.join(root,f),'utf8'),context,{filename:f,timeout:1000});
let total=0,sentences=0;
try{
 new vm.Script(fs.readFileSync(path.join(root,'script.js'),'utf8'));
 read('data/index.js');const index=context.window.EXAM_INDEX;const ids=new Set();
 for(const group of index){
  check(fs.existsSync(path.join(root,group.file)),`${group.id}: missing file`);read(group.file);const data=context.window.EXAM_DATA[group.id];
  check(data.length===group.passages.length,`${group.id}: index length`);
  for(const p of data){total++;const tag=p.id;check(!ids.has(tag),`${tag}: duplicate ID`);ids.add(tag);const n=p.sentences.length;sentences+=n;
   const valid=i=>Number.isInteger(i)&&i>=1&&i<=n;
   for(const key of ['title','source','central','tip','topicEN','titleEN','answer'])check(typeof p[key]==='string'&&p[key].trim(),`${tag}: ${key}`);
   const meta=group.passages.find(m=>m.id===p.id);check(meta&&meta.title===p.title&&meta.count===n,`${tag}: index metadata`);
   p.sentences.forEach((s,i)=>{check(s.n===i+1,`${tag}: sentence number`);for(const key of ['en','ko','literal','role','why'])check(typeof s[key]==='string'&&s[key].trim(),`${tag} S${i+1}: ${key}`)});
   check(Array.isArray(p.easy)&&p.easy.length>=2&&p.easy.every(x=>typeof x==='string'&&x.trim()),`${tag}: easy explanation`);
   check(p.turns.length>0&&p.turns.every(valid),`${tag}: turning points`);
   check(p.flow.length>=4&&p.flow.length<=7,`${tag}: 4–7 flow steps`);
   for(const f of p.flow)check(valid(f[1])&&valid(f[2])&&f[1]<=f[2]&&f[3],`${tag}: flow range`);
   for(const key of ['connectors','refs','syntax']){check(p[key].length>0,`${tag}: ${key} missing`);for(const item of p[key])check(valid(item[0]),`${tag}: ${key} reference`)}
   check(p.compare.length>0&&p.vocab.length>0,`${tag}: comparison/vocab missing`);
   check(valid(p.insert[0])&&p.insert[1],`${tag}: insertion`);check(valid(p.blank[0])&&p.sentences[p.blank[0]-1].en.includes(p.blank[1]),`${tag}: blank quote mismatch`);
   for(const e of p.edits||[])check(valid(e[0])&&p.sentences[e[0]-1].en.includes(e[1])&&e[2]&&e[3],`${tag}: edit quote mismatch`);
   if(p.irrelevant)check(valid(p.irrelevant),`${tag}: irrelevant`);
   const covered=[];for(const o of p.order){check(valid(o[0])&&valid(o[1])&&o[0]<=o[1],`${tag}: order range`);for(let i=o[0];i<=o[1];i++)if(i!==p.irrelevant)covered.push(i)}
   const expected=p.sentences.filter(s=>s.n>(p.introCount||0)&&s.n!==p.irrelevant).map(s=>s.n);check(JSON.stringify(covered)===JSON.stringify(expected),`${tag}: order coverage ${covered} != ${expected}`);
   if(p.sequence)check(p.sequence.split(' → ').sort().join('')==='ABC'&&p.introCount>0,`${tag}: source sequence`);
   for(const photo of p.photos)check(fs.existsSync(path.join(root,`assets/sources/${String(photo).padStart(2,'0')}.jpg`)),`${tag}: source photo ${photo}`);
  }
 }
}catch(e){errors.push(e.stack)}
if(errors.length){console.error(errors.join('\n'));process.exitCode=1}else console.log(`PASS: ${total} passages, ${sentences} sentences; index, references, quotations, block coverage and source photos verified.`);
