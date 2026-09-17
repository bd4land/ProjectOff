const html = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>Connector — ProjectOff</title>
<style>
body{font-family:system-ui,sans-serif;margin:0;background:#111;color:#eee}
main{max-width:980px;margin:auto;padding:24px}
header{display:flex;justify-content:space-between;align-items:center;gap:16px;flex-wrap:wrap}
nav{display:flex;gap:8px;flex-wrap:wrap}
button,.btn{padding:10px 14px;border:1px solid #444;background:#1d1d1d;color:#fff;border-radius:8px;cursor:pointer}
button:hover{background:#292929}
.grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(240px,1fr));gap:14px}
.card{border:1px solid #333;border-radius:12px;padding:18px;background:#171717}
.muted{color:#aaa}
input,select{width:100%;box-sizing:border-box;padding:11px;margin:6px 0 12px;background:#0d0d0d;color:#fff;border:1px solid #444;border-radius:8px}
.row{display:flex;gap:10px;flex-wrap:wrap}.row input{flex:1;min-width:220px}
.hidden{display:none}.hero{padding:34px 0}.pill{display:inline-block;padding:4px 8px;border-radius:999px;background:#282828;font-size:12px}
.drop{border:2px dashed #444;padding:28px;text-align:center;border-radius:12px;cursor:pointer}
</style>
</head>
<body>
<main>
<header><h2>🔌 Connector</h2><nav>
<button type="button" data-page="home">Explore</button>
<button type="button" data-page="publish">Publish</button>
<button type="button" data-page="node">My Node</button>
</nav></header>

<section id="home" class="page">
<div class="hero"><h1>A content network powered by users.</h1>
<p class="muted">Discover published content, connect to an available peer, and stream or download without putting the media itself in the central directory.</p>
<div class="row"><input id="search" placeholder="Search content…"><button type="button" id="searchBtn">Search</button></div></div>
<div class="grid" id="results"></div>
</section>

<section id="publish" class="page hidden">
<h1>Publish content</h1><p class="muted">This live MVP publishes metadata. The actual file remains on the user's node.</p>
<label for="title">Title</label><input id="title">
<label for="category">Category</label><select id="category"><option>Video</option><option>Audio</option><option>Files</option></select>
<label for="description">Description</label><input id="description">
<label for="contentRef">Content URL / peer reference</label><input id="contentRef" placeholder="peer/content reference for this MVP">
<button type="button" id="publishBtn">Publish</button><p id="publishMsg"></p>
</section>

<section id="node" class="page hidden">
<h1>My Node</h1><p>Your browser can act as a temporary node while this tab is open.</p>
<div class="card"><div>Node ID</div><h2 id="nodeId">…</h2><div class="muted">Share this ID with another user for direct connection.</div></div>
<h3>Connect to peer</h3><input id="peerId" placeholder="Peer ID"><button type="button" id="connectBtn">Connect</button><p id="connMsg"></p>
<div class="drop" id="drop">Choose a file to prepare a local share<input type="file" id="file" hidden></div>
<p class="muted">Direct WebRTC transport will be added as the next layer. This first live slice does not pretend that a browser provides durable hosting after its tab closes.</p>
</section>

<script>
(function(){
  'use strict';
  const pages = Array.from(document.querySelectorAll('.page'));
  document.querySelectorAll('nav button').forEach(function(button){
    button.addEventListener('click', function(){
      pages.forEach(function(page){ page.classList.toggle('hidden', page.id !== button.dataset.page); });
    });
  });

  const key = 'projectoff-node-id';
  let nodeId = localStorage.getItem(key);
  if (!nodeId) {
    nodeId = 'node-' + crypto.randomUUID();
    localStorage.setItem(key, nodeId);
  }
  document.querySelector('#nodeId').textContent = nodeId;

  async function api(path, options){
    const response = await fetch(path, options);
    if (!response.ok) throw new Error(await response.text());
    return response.json();
  }

  function escapeHtml(value){
    return String(value == null ? '' : value).replace(/[&<>\"']/g, function(char){
      const map = {'&':'&amp;','<':'&lt;','>':'&gt;','\"':'&quot;',"'":'&#39;'};
      return map[char] || char;
    });
  }

  function render(items){
    const results = document.querySelector('#results');
    results.textContent = '';
    if (!items.length) {
      const empty = document.createElement('p');
      empty.className = 'muted';
      empty.textContent = 'No published content yet.';
      results.appendChild(empty);
      return;
    }
    items.forEach(function(item){
      const card = document.createElement('div');
      card.className = 'card';
      const pill = document.createElement('span'); pill.className = 'pill'; pill.textContent = item.category || 'Other';
      const title = document.createElement('h3'); title.textContent = item.title || 'Untitled';
      const desc = document.createElement('p'); desc.className = 'muted'; desc.textContent = item.description || '';
      const provider = document.createElement('div'); provider.className = 'muted'; provider.textContent = 'Provider: ' + (item.nodeId || 'unknown');
      const open = document.createElement('button'); open.type='button'; open.textContent='Open';
      open.addEventListener('click', function(){
        const ref = String(item.ref || '');
        if (/^https?:\\/\\//i.test(ref)) window.open(ref, '_blank', 'noopener,noreferrer');
        else alert('Connector found: ' + (item.title || 'content') + '\\nPeer reference: ' + ref + '\\n\\nThe P2P transport layer will resolve this reference on the provider node.');
      });
      card.append(pill,title,desc,provider,open); results.appendChild(card);
    });
  }

  async function search(){
    try {
      const q = document.querySelector('#search').value.trim();
      const data = await api('/api/content?q=' + encodeURIComponent(q));
      render(data.items || []);
    } catch(error) {
      const results = document.querySelector('#results');
      results.textContent = 'Search failed: ' + error.message;
    }
  }

  document.querySelector('#searchBtn').addEventListener('click', search);
  document.querySelector('#search').addEventListener('keydown', function(event){ if(event.key === 'Enter') search(); });

  document.querySelector('#publishBtn').addEventListener('click', async function(){
    const payload = {
      title: document.querySelector('#title').value.trim(),
      category: document.querySelector('#category').value,
      description: document.querySelector('#description').value.trim(),
      ref: document.querySelector('#contentRef').value.trim(),
      nodeId: nodeId
    };
    const message = document.querySelector('#publishMsg');
    if (!payload.title || !payload.ref) { message.textContent='Title and peer reference are required.'; return; }
    try {
      await api('/api/content', {method:'POST', headers:{'content-type':'application/json'}, body:JSON.stringify(payload)});
      message.textContent='Published to the directory.';
      document.querySelector('#title').value=''; document.querySelector('#description').value=''; document.querySelector('#contentRef').value='';
      await search();
    } catch(error) { message.textContent='Publish failed: ' + error.message; }
  });

  document.querySelector('#connectBtn').addEventListener('click', function(){
    const peer = document.querySelector('#peerId').value.trim();
    document.querySelector('#connMsg').textContent = peer ? 'Peer reference saved for transport handshake: ' + peer : 'Enter a peer ID.';
  });

  const drop = document.querySelector('#drop');
  const file = document.querySelector('#file');
  drop.addEventListener('click', function(){ file.click(); });
  file.addEventListener('change', function(event){
    const selected = event.target.files && event.target.files[0];
    if (selected) document.querySelector('#connMsg').textContent='Selected ' + selected.name + ' (' + selected.size + ' bytes).';
  });

  search();
})();
</script>
</main>
</body>
</html>`;

const mem = [];

export default {
  async fetch(request) {
    const url = new URL(request.url);

    if (request.method === 'GET' && url.pathname === '/api/content') {
      const query = (url.searchParams.get('q') || '').toLowerCase();
      const items = mem
        .filter(function(item){ return (item.title + ' ' + item.description + ' ' + item.category).toLowerCase().includes(query); })
        .slice(-100).reverse();
      return Response.json({items});
    }

    if (request.method === 'POST' && url.pathname === '/api/content') {
      try {
        const item = await request.json();
        if (!item || !item.title || !item.ref) return Response.json({error:'title and ref required'}, {status:400});
        mem.push({id:crypto.randomUUID(), createdAt:new Date().toISOString(), ...item});
        return Response.json({ok:true});
      } catch (error) {
        return Response.json({error:'invalid json'}, {status:400});
      }
    }

    if (request.method === 'GET' && (url.pathname === '/' || url.pathname === '/index.html')) {
      return new Response(html, {headers:{'content-type':'text/html; charset=UTF-8','cache-control':'no-store'}});
    }

    return new Response('Not found', {status:404});
  }
};
