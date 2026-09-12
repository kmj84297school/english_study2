const fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
const root=path.resolve(__dirname,'..'),ctx=vm.createContext({window:{}});
const known=['claim','inference','grammar','vocabulary','coherence','sequence'];
const files=fs.readdirSync(path.join(root,'data/exams')).filter(f=>f.endsWith('.js')).sort((a,b)=>{const ia=known.indexOf(a.slice(0,-3)),ib=known.indexOf(b.slice(0,-3));return (ia<0?100:ia)-(ib<0?100:ib)||a.localeCompare(b)});
const index=files.map(f=>{const id=f.slice(0,-3);vm.runInContext(fs.readFileSync(path.join(root,'data/exams',f),'utf8'),ctx,{filename:f,timeout:1000});const data=ctx.window.EXAM_DATA?.[id];if(!Array.isArray(data)||!data.length)throw Error(f+': 자료 배열이 없거나 비었습니다.');return {id,name:data[0].type,file:'data/exams/'+f,passages:data.map(p=>({id:p.id,num:p.num,title:p.title,source:p.source,central:p.central,count:p.sentences.length}))}});
fs.writeFileSync(path.join(root,'data/index.js'),'// 목록만 보관합니다. 본문은 유형별 파일에서 필요할 때 불러옵니다.\nwindow.EXAM_INDEX = '+JSON.stringify(index,null,2)+';\n');
console.log('Updated index:',index.reduce((n,g)=>n+g.passages.length,0),'passages');
