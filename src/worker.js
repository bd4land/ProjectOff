const html = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>Connector — ProjectOff</title>
<style>
:root{color-scheme:dark;--bg:#0b1020;--panel:#121a2b;--panel2:#182238;--line:#2b3955;--text:#eef3ff;--muted:#9aa8c3;--accent:#7c9cff;--good:#4ade80;--danger:#fb7185}
*{box-sizing:border-box}body{margin:0;font-family:Inter,system-ui,-apple-system,Segoe UI,sans-serif;background:linear-gradient(180deg,#0b1020,#0e1526);color:var(--text)}
main{max-width:1080px;margin:auto;padding:18px}.top{position:sticky;top:0;z-index:5;background:rgba(11,16,32,.92);backdrop-filter:blur(12px);padding:10px 0 14px;border-bottom:1px solid var(--line)}
header{display:flex;align-items:center;justify-content:space-between;gap:12px}.brand{display:flex;align-items:center;gap:10px}.logo{width:40px;height:40px;display:grid;place-items:center;border-radius:12px;background:#1d2a48;font-size:22px}.brand h2{margin:0;font-size:20px}.brand small{display:block;color:var(--muted)}
nav{display:flex;gap:7px;flex-wrap:wrap}button,.btn{border:1px solid var(--line);background:#182238;color:var(--text);padding:10px 14px;border-radius:10px;cursor:pointer;font-weight:600}button:hover{background:#22304d}button.primary{background:#3155b7;border-color:#466bd0}button.primary:hover{background:#3b64d2}button:disabled{opacity:.55;cursor:not-allowed}
.page{padding:26px 0}.hidden{display:none}.hero{padding:20px 0 28px}.hero h1{font-size:clamp(30px,6vw,52px);line-height:1.04;margin:10px 0}.hero p{max-width:760px}.muted{color:var(--muted)}.grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(250px,1fr));gap:14px}.card{background:linear-gradient(180deg,var(--panel2),var(--panel));border:1px solid var(--line);border-radius:16px;padding:18px}.row{display:flex;gap:10px;flex-wrap:wrap}.row>*{min-width:0}.row input{flex:1}
input,select,textarea{width:100%;padding:12px;border:1px solid var(--line);border-radius:10px;background:#0c1322;color:var(--text);outline:none}input:focus,select:focus,textarea:focus{border-color:#6687e5}.field{margin:12px 0}.field label{display:block;margin-bottom:6px;font-weight:650}.two{display:grid;grid-template-columns:1fr 1fr;gap:12px}@media(max-width:650px){.two{grid-template-columns:1fr}header{align-items:flex-start;flex-direction:column}}
.status{padding:11px 13px;border-radius:10px;background:#111a2d;border:1px solid var(--line);margin:12px 0}.success{color:var(--good)}.error{color:var(--danger)}.pill{display:inline-block;padding:4px 9px;border-radius:999px;background:#253353;color:#cdd9ff;font-size:12px}.bigcode{font-size:32px;letter-spacing:4px;font-weight:800;margin:10px 0}.drop{border:2px dashed #425172;border-radius:16px;padding:34px 20px;text-align:center;cursor:pointer;background:#10182a}.drop.drag{border-color:#7c9cff;background:#162342}.filebox{margin-top:14px}.progress{height:10px;border-radius:99px;background:#0a1020;overflow:hidden;border:1px solid var(--line)}.bar{height:100%;width:0%;background:#6f8ff0;transition:width .15s}.preview{width:100%;max-height:420px;border-radius:12px;margin-top:14px;background:#000}.empty{padding:30px;text-align:center;border:1px dashed var(--line);border-radius:14px}.small{font-size:13px}.check{display:flex;gap:9px;align-items:center}.check input{width:auto}.actions{display:flex;gap:9px;flex-wrap:wrap;margin-top:14px}.node-id{font-family:ui-monospace,SFMono-Regular,Menlo,monospace;word-break:break-all;background:#0a1020;padding:12px;border-radius:10px}
</style>
</head>
<body>
<main>
<div class="top"><header><div class="brand"><div class="logo">🔌</div><div><h2>Connector</h2><small>ProjectOff • peer-to-peer sharing</small></div></div><nav><button data-page="home">Explore</button><button data-page="share">Share</button><button data-page="receive">Receive</button><button data-page="publish">Publish</button><button data-page="node">My Node</button></nav></header></div>

<section id="home" class="page">
<div class="hero"><span class="pill">Browser node</span><h1>Share files directly between people.</h1><p class="muted">No file is uploaded to Connector for direct sharing. Pick a file, create a short share code, and send that code to the person who should receive it.</p><div class="actions"><button class="primary" data-page="share">Start sharing</button><button data-page="receive">Receive a file</button></div></div>
<div class="card"><h3>Explore published items</h3><div class="row"><input id="search" placeholder="Search title, category or description"><button id="searchBtn">Search</button></div><div id="results" class="grid" style="margin-top:14px"></div></div>
</section>

<section id="share" class="page hidden">
<h1>Share a file</h1><p class="muted">Keep this tab open while the other person downloads. Your browser is the temporary host.</p>
<div class="card"><div class="drop" id="drop"><strong>Choose a file</strong><br><span class="muted">or drag and drop it here</span><input id="file" type="file" hidden></div><div id="fileInfo" class="filebox"></div><div class="actions"><button class="primary" id="startShare" disabled>Create share code</button><button id="stopShare" disabled>Stop sharing</button></div><div id="shareStatus" class="status hidden"></div><div id="shareCodeBox" class="card hidden" style="margin-top:14px;text-align:center"><div class="muted">Send this code to the receiver</div><div id="shareCode" class="bigcode"></div><div class="muted small">The receiver enters this code on the Receive page.</div></div></div>
</section>

<section id="receive" class="page hidden">
<h1>Receive a file</h1><p class="muted">Enter the share code from the sender. Both browsers need to stay open during transfer.</p>
<div class="card"><div class="field"><label for="remoteCode">Share code</label><input id="remoteCode" maxlength="12" placeholder="Example: 7K4P9Q"></div><button class="primary" id="connectPeer">Connect & receive</button><div id="receiveStatus" class="status hidden"></div><div id="transferBox" class="hidden" style="margin-top:16px"><div id="transferText" class="small"></div><div class="progress" style="margin-top:8px"><div id="progressBar" class="bar"></div></div><div id="receivedFile"></div></div></div>
</section>

<section id="publish" class="page hidden">
<h1>Publish to Explore</h1><p class="muted">Publishing adds a directory entry. The actual file still stays on your node; use the Share page to create a live peer connection.</p>
<div class="card"><div class="field"><label>Title</label><input id="title" placeholder="My video"></div><div class="two"><div class="field"><label>Category</label><select id="category"><option>Video</option><option>Audio</option><option>Files</option></select></div><div class="field"><label>Share code (optional)</label><input id="publishCode" placeholder="Create one on Share first"></div></div><div class="field"><label>Description</label><textarea id="description" rows="3" placeholder="What is this content?"></textarea></div><button class="primary" id="publishBtn">Publish</button><div id="publishMsg" class="status hidden"></div></div>
</section>

<section id="node" class="page hidden">
<h1>My Node</h1><div class="card"><span class="pill">Local identity</span><h3>This browser's Node ID</h3><div id="nodeId" class="node-id">Creating…</div><p class="muted small">This ID identifies this browser while you use Connector. It is not a password.</p><button id="copyNode">Copy Node ID</button></div><div class="card" style="margin-top:14px"><h3>How it works</h3><ol class="muted"><li>Your browser creates a temporary peer connection.</li><li>Files move directly between the two browsers when WebRTC can connect.</li><li>Keep the sender tab open until the transfer finishes.</li><li>For difficult networks, a TURN relay may be needed in a production deployment.</li></ol></div></section>

<script src="https://cdn.jsdelivr.net/npm/peerjs@1.5.4/dist/peerjs.min.js"></script>
<script>
(function(){
'use strict';
const $=s=>document.querySelector(s), $$=s=>Array.from(document.querySelectorAll(s));
const pages=$$('.page');
function showPage(id){pages.forEach(p=>p.classList.toggle('hidden',p.id!==id)); window.scrollTo({top:0,behavior:'smooth'});}
$$('[data-page]').forEach(b=>b.addEventListener('click',()=>showPage(b.dataset.page)));
const nodeKey='projectoff-node-id';
let nodeId=localStorage.getItem(nodeKey); if(!nodeId){nodeId='node-'+crypto.randomUUID();localStorage.setItem(nodeKey,nodeId)} $('#nodeId').textContent=nodeId;
$('#copyNode').addEventListener('click',async()=>{try{await navigator.clipboard.writeText(nodeId);$('#copyNode').textContent='Copied ✓';setTimeout(()=>$('#copyNode').textContent='Copy Node ID',1200)}catch(e){}});
function msg(el,text,type){el.className='status '+(type||'');el.textContent=text;el.classList.remove('hidden')}
function bytes(n){if(n<1024)return n+' B';if(n<1048576)return (n/1024).toFixed(1)+' KB';if(n<1073741824)return (n/1048576).toFixed(1)+' MB';return (n/1073741824).toFixed(2)+' GB'}
function code(){const a='ABCDEFGHJKLMNPQRSTUVWXYZ23456789';let x='';for(let i=0;i<6;i++)x+=a[Math.floor(Math.random()*a.length)];return x}

let peer=null,conn=null,selectedFile=null,shareCode=null,sending=false;
function initPeer(){return new Promise((resolve,reject)=>{if(peer)return resolve(peer);const id='conn-'+code()+'-'+Math.random().toString(36).slice(2,6);peer=new Peer(id,{debug:0});peer.on('open',()=>resolve(peer));peer.on('error',e=>{peer=null;reject(e)});peer.on('connection',c=>handleIncoming(c));});}
async function handleIncoming(c){conn=c; c.on('open',()=>{c.send({type:'offer',code:shareCode,file:{name:selectedFile.name,size:selectedFile.size,type:selectedFile.type}});msg($('#shareStatus'),'Receiver connected. Waiting for acceptance…','success')});c.on('data',d=>{if(d&&d.type==='accept'&&selectedFile&&!sending)sendFile()});c.on('close',()=>{sending=false;msg($('#shareStatus'),'Receiver disconnected.','error')});}
$('#drop').addEventListener('click',()=>$('#file').click());
$('#file').addEventListener('change',e=>chooseFile(e.target.files[0]));
$('#drop').addEventListener('dragover',e=>{e.preventDefault();$('#drop').classList.add('drag')});
$('#drop').addEventListener('dragleave',()=>$('#drop').classList.remove('drag'));
$('#drop').addEventListener('drop',e=>{e.preventDefault();$('#drop').classList.remove('drag');chooseFile(e.dataTransfer.files[0])});
function chooseFile(f){if(!f)return;selectedFile=f;$('#fileInfo').innerHTML='<div class="card"><strong>'+esc(f.name)+'</strong><div class="muted">'+bytes(f.size)+' • '+esc(f.type||'unknown')+'</div></div>';$('#startShare').disabled=false}
async function startShare(){if(!selectedFile)return;try{await initPeer();shareCode=code();$('#shareCode').textContent=shareCode;$('#shareCodeBox').classList.remove('hidden');$('#startShare').disabled=true;$('#stopShare').disabled=false;msg($('#shareStatus'),'Share ready. Send the code above to the receiver.','success')}catch(e){msg($('#shareStatus'),'Could not start peer service: '+e.message,'error')}}
$('#startShare').addEventListener('click',startShare);
$('#stopShare').addEventListener('click',()=>{if(conn)conn.close();if(peer){peer.destroy();peer=null}shareCode=null;sending=false;$('#shareCodeBox').classList.add('hidden');$('#startShare').disabled=!selectedFile;$('#stopShare').disabled=true;msg($('#shareStatus'),'Sharing stopped.','')});
async function sendFile(){if(!conn||!selectedFile||sending)return;sending=true;const chunk=64*1024,total=Math.ceil(selectedFile.size/chunk);let sent=0;conn.send({type:'file-start',name:selectedFile.name,size:selectedFile.size,mime:selectedFile.type||'application/octet-stream',chunks:total});for(let i=0;i<total;i++){while(conn.dataChannel&&conn.dataChannel.bufferedAmount>4*1024*1024)await new Promise(r=>setTimeout(r,20));const buf=await selectedFile.slice(i*chunk,Math.min(selectedFile.size,(i+1)*chunk)).arrayBuffer();conn.send(buf);sent+=buf.byteLength;msg($('#shareStatus'),'Sending '+bytes(sent)+' / '+bytes(selectedFile.size)+' ('+Math.round(sent/selectedFile.size*100)+'%)','success')}conn.send({type:'file-end'});sending=false;msg($('#shareStatus'),'Transfer complete. You can share again with another receiver.','success')}

let receivePeer=null,receiveConn=null,parts=[],received=0,meta=null;
$('#connectPeer').addEventListener('click',async()=>{const c=$('#remoteCode').value.trim().toUpperCase();if(c.length!==6){msg($('#receiveStatus'),'Enter the 6-character share code.','error');return}msg($('#receiveStatus'),'Looking for sender…');try{const list=await api('/api/share/lookup?code='+encodeURIComponent(c));if(!list.peerId)throw new Error('Share code not found. Ask the sender to create a new code and keep the Share tab open.');receivePeer=new Peer('recv-'+code()+'-'+Math.random().toString(36).slice(2,6));receivePeer.on('open',()=>{receiveConn=receivePeer.connect(list.peerId,{reliable:true});receiveConn.on('open',()=>{receiveConn.send({type:'accept'});msg($('#receiveStatus'),'Connected. Waiting for file…','success')});receiveConn.on('data',handleReceiveData);receiveConn.on('close',()=>msg($('#receiveStatus'),'Connection closed.','error'));receiveConn.on('error',e=>msg($('#receiveStatus'),'Transfer connection error: '+e.message,'error'))});receivePeer.on('error',e=>msg($('#receiveStatus'),'Peer connection failed: '+e.message,'error'))}catch(e){msg($('#receiveStatus'),e.message,'error')}});
function handleReceiveData(d){if(d&&d.type==='offer'){if(d.code!==$('#remoteCode').value.trim().toUpperCase())return;msg($('#receiveStatus'),'Sender found: '+d.file.name+' ('+bytes(d.file.size)+')','success');return}if(d&&d.type==='file-start'){meta=d;parts=[];received=0;$('#transferBox').classList.remove('hidden');$('#receivedFile').textContent='';return}if(d&&d.type==='file-end'){const blob=new Blob(parts,{type:meta.mime});const url=URL.createObjectURL(blob);const a=document.createElement('a');a.href=url;a.download=meta.name;a.textContent='Download '+meta.name;a.className='btn';$('#receivedFile').appendChild(a);if(/^video\\//.test(meta.mime)||/^audio\\//.test(meta.mime)){const media=document.createElement(/^video\\//.test(meta.mime)?'video':'audio');media.src=url;media.controls=true;media.className='preview';$('#receivedFile').appendChild(media)}msg($('#receiveStatus'),'File received successfully.','success');return}if(d instanceof ArrayBuffer){parts.push(d);received+=d.byteLength;const pct=meta?Math.round(received/meta.size*100):0;$('#progressBar').style.width=pct+'%';$('#transferText').textContent='Receiving '+bytes(received)+' / '+bytes(meta.size)+' ('+pct+'%)'}}

function esc(v){return String(v??'').replace(/[&<>\"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','\"':'&quot;',"'":'&#39;'}[c]))}
async function api(path,options){const r=await fetch(path,options);if(!r.ok)throw new Error(await r.text()||('HTTP '+r.status));return r.json()}
async function registerShare(){if(!shareCode||!peer)return;await api('/api/share',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({code:shareCode,peerId:peer.id,nodeId})})}
const oldStart=startShare; // keep a small wrapper so share registration happens after peer creation
$('#startShare').removeEventListener('click',startShare);$('#startShare').addEventListener('click',async()=>{await oldStart();try{await registerShare()}catch(e){msg($('#shareStatus'),'Share code created, but directory registration failed. Receiver may not find it yet.','error')}});

async function search(){try{const q=$('#search').value.trim();const data=await api('/api/content?q='+encodeURIComponent(q));const box=$('#results');box.textContent='';if(!data.items.length){box.innerHTML='<div class="empty muted">No published items yet. Use Publish to add one.</div>';return}data.items.forEach(i=>{const c=document.createElement('div');c.className='card';c.innerHTML='<span class="pill">'+esc(i.category||'Other')+'</span><h3>'+esc(i.title||'Untitled')+'</h3><p class="muted">'+esc(i.description||'')+'</p><div class="muted small">Provider: '+esc(i.nodeId||'unknown')+'</div><div class="actions"><button class="open">Open</button></div>';c.querySelector('.open').addEventListener('click',()=>{if(i.shareCode){$('#remoteCode').value=i.shareCode;showPage('receive');$('#connectPeer').click()}else alert('This item has no live share code. Ask the publisher to create a fresh share code.')});box.appendChild(c)})}catch(e){$('#results').textContent='Search failed: '+e.message}}
$('#searchBtn').addEventListener('click',search);$('#search').addEventListener('keydown',e=>{if(e.key==='Enter')search()});
$('#publishBtn').addEventListener('click',async()=>{const p={title:$('#title').value.trim(),category:$('#category').value,description:$('#description').value.trim(),shareCode:$('#publishCode').value.trim().toUpperCase(),nodeId};if(!p.title||!p.shareCode){msg($('#publishMsg'),'Title and Share Code are required. Create a share code first, then publish it.','error');return}try{await api('/api/content',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify(p)});msg($('#publishMsg'),'Published. It will appear in Explore while the directory entry is available.','success');await search()}catch(e){msg($('#publishMsg'),'Publish failed: '+e.message,'error')}});
search();
})();
</script></main></body></html>`;

const mem=[];
const shares=new Map();

export default {async fetch(request){const url=new URL(request.url);
if(request.method==='GET'&&url.pathname==='/api/content'){const q=(url.searchParams.get('q')||'').toLowerCase();const items=mem.filter(i=>(i.title+' '+i.description+' '+i.category).toLowerCase().includes(q)).slice(-100).reverse();return Response.json({items})}
if(request.method==='POST'&&url.pathname==='/api/content'){try{const item=await request.json();if(!item?.title||!item?.shareCode)return Response.json({error:'title and shareCode required'},{status:400});mem.push({id:crypto.randomUUID(),createdAt:new Date().toISOString(),...item});return Response.json({ok:true})}catch(e){return Response.json({error:'invalid json'},{status:400})}}
if(request.method==='POST'&&url.pathname==='/api/share'){try{const x=await request.json();if(!x?.code||!x?.peerId)return Response.json({error:'code and peerId required'},{status:400});shares.set(String(x.code).toUpperCase(),{peerId:x.peerId,nodeId:x.nodeId,createdAt:Date.now()});return Response.json({ok:true})}catch(e){return Response.json({error:'invalid json'},{status:400})}}
if(request.method==='GET'&&url.pathname==='/api/share/lookup'){const code=(url.searchParams.get('code')||'').toUpperCase();const x=shares.get(code);if(!x||Date.now()-x.createdAt>1000*60*30)return Response.json({error:'share code not found'},{status:404});return Response.json({peerId:x.peerId,nodeId:x.nodeId})}
if(request.method==='GET'&&(url.pathname==='/'||url.pathname==='/index.html'))return new Response(html,{headers:{'content-type':'text/html; charset=UTF-8','cache-control':'no-store'}});
return new Response('Not found',{status:404})}}
