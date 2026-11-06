const fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
const root=path.resolve(__dirname,'..'),ctx=vm.createContext({window:{}});
for(const f of ['data/index.js','data/word-meanings.js'])vm.runInContext(fs.readFileSync(path.join(root,f),'utf8'),ctx);
new vm.Script(fs.readFileSync(path.join(root,'word-lookup.js'),'utf8'));
let total=0;const missing=[];
for(const group of ctx.window.EXAM_INDEX){
 vm.runInContext(fs.readFileSync(path.join(root,group.file),'utf8'),ctx);
 for(const p of ctx.window.EXAM_DATA[group.id])for(const s of p.sentences){
  for(const match of s.en.matchAll(/[A-Za-z]+(?:['’][A-Za-z]+)*/g)){
   const key=match[0].toLowerCase(),normalized=key.replace(/’/g,"'");total++;
   const meaning=ctx.window.WORD_MEANINGS[normalized]||ctx.window.WORD_MEANINGS[key];
   if(!meaning||!/[가-힣]/.test(meaning))missing.push(`${p.id} S${s.n}: ${key}`);
  }
 }
}
if(missing.length){console.error(missing.join('\n'));process.exitCode=1}
else console.log(`PASS: ${total} passage word occurrences have Korean meanings; lookup script parses.`);
