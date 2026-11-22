const crypto = require("crypto");

// ===== Edit if needed =====
const LN_USER = "iamraju069";
const LN_DOMAIN = "blink.sv";
// ==========================

const U = process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL;
const T = process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN;
const PW = process.env.ADMIN_PASSWORD || "";
const SEC = process.env.SESSION_SECRET || PW;

async function db(cmd) {
  const r = await fetch(U, { method: "POST", headers: { Authorization: "Bearer " + T }, body: JSON.stringify(cmd) });
  const j = await r.json();
  if (j.error) throw new Error(j.error);
  return j.result;
}
const sign = (v) => crypto.createHmac("sha256", SEC).update(v).digest("hex");
function authed(req) {
  const m = /(?:^|; )adm=([^;]+)/.exec(req.headers.cookie || "");
  if (!m || !PW) return false;
  const p = m[1].split(".");
  if (!p[0] || !p[1] || Date.now() > +p[0]) return false;
  const a = Buffer.from(p[1]), b = Buffer.from(sign(p[0]));
  return a.length === b.length && crypto.timingSafeEqual(a, b);
}
const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
const rand = (n) => crypto.randomBytes(8).toString("hex").slice(0, n);
const COLORS = ["#00D64F", "#FFB300", "#4FC3F7", "#FF80AB", "#B39DDB", "#F2F2F2"];

const CSS = `:root{--bg:#070d0a;--ink:#edf6f0;--mu:#8ea399;--ln:#25352c;--fd:#101914;--ac:#1ed760;--er:#ff7b72;--gd:#d9b45a}*{box-sizing:border-box}body{margin:0;background:radial-gradient(900px 520px at 50% -8%,#10301e,var(--bg));background-color:var(--bg);color:var(--ink);font:16px/1.5 "Avenir Next","Segoe UI",system-ui,sans-serif;padding:18px 14px 48px;display:flex;justify-content:center;min-height:100vh}main{width:100%;max-width:460px}main.w{max-width:900px}h1{font-size:1.7rem;line-height:1.2;margin:0 0 6px;overflow-wrap:anywhere}h2{font-size:1.05rem;margin:26px 0 8px}.mu{color:var(--mu);overflow-wrap:anywhere;font-size:.85rem}p.mu{font-size:1rem}input,select{width:100%;font:inherit;font-size:1.1rem;font-weight:600;padding:12px 14px;border:1.5px solid var(--ln);border-radius:14px;background:#0b130f;color:var(--ink)}select{font-size:1rem;margin-bottom:10px}input:focus{outline:2px solid var(--ac)}button{font:inherit;font-weight:700;border-radius:12px;padding:12px;cursor:pointer;border:1.5px solid var(--ln);background:transparent;color:var(--ink)}button:focus-visible{outline:2px solid var(--ac);outline-offset:2px}.pri{width:100%;background:var(--ac);border:0;color:#04130a;margin-top:14px;padding:16px;font-size:1.1rem;border-radius:18px}.pri:disabled{background:#2a4434;color:#6f8a7a;cursor:default}.sec{width:100%;margin-top:10px;border-radius:16px;padding:14px;border-color:#2f4a3a}.er{color:var(--er);font-weight:600}.c{text-align:center}.panel{background:linear-gradient(180deg,#121d17,#0d1511);border:1px solid var(--ln);border-radius:28px;padding:22px 16px;box-shadow:0 24px 70px rgba(0,0,0,.55)}.pill{display:inline-block;border:1px solid #1f5a37;background:#0f2a1b;color:#5fe39a;border-radius:99px;padding:6px 18px;font-weight:700}.meth{background:#131f18;border:1px solid var(--ln);border-radius:22px;padding:20px;text-align:center;margin:16px 0}.ico{width:68px;height:68px;border-radius:20px;background:#00c853;color:#04130a;font:800 2.4rem/68px Georgia,serif;margin:0 auto 10px;box-shadow:0 0 44px #00c85345}.big{font-size:3.6rem;font-weight:800;text-align:center;line-height:1.1;overflow-wrap:anywhere}.usd{text-align:center;letter-spacing:.2em;color:var(--mu);font-weight:700;margin-bottom:16px}.kp{display:grid;grid-template-columns:repeat(3,1fr);gap:10px}.kp button{height:60px;font-size:1.6rem;padding:0;border-radius:18px;background:#131f18}.kp button:active{background:#1d3226}.kp svg{pointer-events:none}.qr{background:#fff;padding:14px;border-radius:18px;width:max-content;max-width:100%;margin:16px auto}.facts{text-align:center}.cd{display:inline-block;border:1px solid var(--ln);background:#0b130f;border-radius:99px;padding:4px 16px;font-weight:800;font-variant-numeric:tabular-nums}.steps{background:#0d1611;border:1px solid var(--ln);border-radius:18px;padding:14px 16px 14px 34px;margin:6px 0}.steps li{margin:6px 0}textarea{width:100%;height:80px;font:.78rem monospace;word-break:break-all;background:#0b130f;color:var(--ink);border:1.5px solid var(--ln);border-radius:12px;padding:10px}table{width:100%;border-collapse:collapse;font-size:.9rem}td,th{text-align:left;padding:9px 6px;border-bottom:1px solid var(--ln);vertical-align:top}th{color:var(--mu);font-weight:600}td button{padding:5px 10px;font-size:.85rem}.card{background:var(--fd);border:1px solid var(--ln);border-radius:18px;padding:16px;margin:16px 0}.card h2{margin-top:0}#nf input,#uf input{margin-bottom:10px;font-size:1rem}.sw{display:flex;gap:10px;margin:4px 0 6px}.swb{width:34px;height:34px;padding:0;border-radius:50%;border:2px solid var(--ln)}.swb.on{border-color:var(--ink);outline:2px solid var(--bg);outline-offset:-5px}.lk{background:var(--fd);border:1px solid var(--ln);border-left:8px solid var(--ln);border-radius:14px;padding:12px 14px;margin-bottom:12px;overflow-wrap:anywhere}.btns{display:flex;gap:8px;flex-wrap:wrap;margin-top:10px}.btns button,.top button{padding:6px 12px;font-size:.85rem}.top{display:flex;justify-content:space-between;align-items:center;gap:10px}.bar{height:8px;border-radius:99px;margin-bottom:18px}.grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(150px,1fr));gap:10px;margin:14px 0}.stat{background:var(--fd);border:1px solid var(--ln);border-radius:18px;padding:14px}.stat b{display:block;font-size:1.5rem;margin-top:2px}.stat.hi{background:linear-gradient(135deg,#1a3a25,#101914);border-color:#3a6a4a}.stat.hi b{color:var(--gd)}.b{padding:2px 10px;border-radius:99px;font-size:.78rem;font-weight:700;color:#fff}.b.paid{background:#168a4a}.b.pending{background:#9a6b00}.b.expired{background:#b3261e}[hidden]{display:none!important}`;

const head = (t, extra) => '<!DOCTYPE html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="theme-color" content="#070d0a"><title>' + esc(t) + "</title>" + (extra || "") + "<style>" + CSS + "</style></head><body><main>";
const tail = (s) => "</main>" + s + "</body></html>";

const OGPNG = "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";
const hash = (p, s) => crypto.scryptSync(p, s, 32).toString("hex");
const eq = (a, b) => { a = Buffer.from(String(a)); b = Buffer.from(String(b)); return a.length === b.length && crypto.timingSafeEqual(a, b); };
function who(req) {
  const m = /(?:^|; )ses=([^;]+)/.exec(req.headers.cookie || "");
  if (!m || !SEC) return null;
  const p = m[1].split(".");
  if (p.length !== 3 || Date.now() > +p[1] || !eq(p[2], sign(p[0] + "." + p[1]))) return null;
  return p[0];
}
function setSes(res, w) {
  const e = Date.now() + 7 * 864e5;
  res.setHeader("Set-Cookie", "ses=" + w + "." + e + "." + sign(w + "." + e) + "; HttpOnly; Secure; SameSite=Strict; Path=/; Max-Age=604800");
}
async function btcUsd() {
  try { const j = await (await fetch("https://mempool.space/api/v1/prices")).json(); if (j.USD) return +j.USD; } catch (e) {}
  const c = await (await fetch("https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd")).json();
  return +c.bitcoin.usd;
}
// Auto-verify: LNURL verify URL first, then Blink's public status query
async function pstatus(r) {
  if (r.verify) { try { const j = await (await fetch(r.verify)).json(); if (j.settled === true) return "PAID"; } catch (e) {} }
  try {
    const j = await (await fetch("https://api.blink.sv/graphql", { method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ query: "query($i:LnInvoicePaymentStatusByPaymentRequestInput!){lnInvoicePaymentStatusByPaymentRequest(input:$i){status}}", variables: { i: { paymentRequest: r.pr } } }) })).json();
    return j.data.lnInvoicePaymentStatusByPaymentRequest.status;
  } catch (e) { return "PENDING"; }
}
async function settle(r, paid) {
  if (paid) {
    if (await db(["SETNX", "paid:" + r.id, "1"])) {
      const c = Math.round(r.usd * 100); let fee = 0;
      if (r.owner !== "admin") {
        const x = await db(["HGET", "users", r.owner]);
        if (x) { fee = Math.round(c * (+JSON.parse(x).fee || 0) / 100); await db(["HINCRBY", "bal", r.owner, c - fee]); } else fee = c;
      }
      await db(["HINCRBY", "bal", "admin", r.owner === "admin" ? c : fee]);
    }
    r.st = "paid"; r.pt = Date.now();
  } else r.st = "expired";
  await db(["HSET", "inv", r.id, JSON.stringify(r)]);
}
const checkOne = async (r) => { const s = await pstatus(r); if (s === "PAID" || s === "EXPIRED" || Date.now() > r.exp) await settle(r, s === "PAID"); };

const PAYJS = String.raw`var $=function(i){return document.getElementById(i)},cur='',iid='',tm=null,pt=null,exp=0,amt='';
function show(s){['s1','s2','s3'].forEach(function(x){$(x).hidden=x!==s});window.scrollTo(0,0)}
function stop(){clearInterval(tm);clearInterval(pt)}
function cp(){return navigator.clipboard.writeText(cur).catch(function(){$('inv').select();document.execCommand('copy')})}
function draw(){$('big').textContent='$'+(amt||'0');var v=parseFloat(amt);$('go').disabled=!(v>0);$('go').textContent=v>0?'Pay $'+v.toFixed(2):'Pay'}
$('kp').onclick=function(e){var k=e.target.getAttribute('data-k');if(k==null)return;$('er').hidden=true;
if(k==='b')amt=amt.slice(0,-1);else if(k==='.'){if(amt.indexOf('.')<0)amt=(amt||'0')+'.'}else{if(/\.\d\d$/.test(amt)||amt.length>=8)return;amt=amt==='0'?k:amt+k}draw()};
function tick(){var s=Math.max(0,Math.round((exp-Date.now())/1000));$('cd').textContent=String(Math.floor(s/60)).padStart(2,'0')+':'+String(s%60).padStart(2,'0')}
function end(j){stop();if(j.st==='paid'){$('amt').textContent='We received $'+Number(j.usd).toFixed(2)+'. Thank you.';show('s3')}else{$('cd').textContent='00:00';$('stt').textContent='This invoice expired. Start over to create a new one.';$('pay').hidden=true}}
function poll(){fetch('/api/check?id='+iid).then(function(r){return r.json()}).then(function(j){if(j.st==='paid'||j.st==='expired')end(j)}).catch(function(){})}
$('go').onclick=function(){var er=$('er');er.hidden=true;var usd=parseFloat(amt);if(!(usd>0))return;
var b=$('go');b.disabled=true;b.textContent='Creating invoice...';
fetch('/api/invoice',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({slug:SLUG,usd:usd})}).then(function(r){return r.json().then(function(j){if(!r.ok)throw new Error(j.error||'Error');return j})}).then(function(j){
cur=j.pr;iid=j.id;exp=j.exp;$('inv').value=j.pr;$('top').textContent='$'+usd.toFixed(2);$('sats').textContent=j.sats.toLocaleString()+' sats at 1 BTC = $'+Math.round(j.price).toLocaleString();
var q=$('qr');q.innerHTML='';if(window.QRCode)new QRCode(q,{text:'LIGHTNING:'+j.pr.toUpperCase(),width:240,height:240,correctLevel:QRCode.CorrectLevel.L});
$('pay').hidden=false;$('stt').textContent='Waiting for your payment...';show('s2');tick();stop();tm=setInterval(tick,1000);pt=setInterval(poll,3000)
}).catch(function(e){er.textContent=e.message||'Something went wrong.';er.hidden=false}).then(function(){b.disabled=false;draw()})};
$('cp').onclick=function(){var b=this;cp().then(function(){b.textContent='Copied';setTimeout(function(){b.textContent='Copy invoice'},1800)})};
$('oc').onclick=function(){cp().then(function(){location.href='cashme://';setTimeout(function(){if(!document.hidden)location.href='https://cash.app'},1500)})};
function again(){stop();amt='';draw();show('s1')}
$('again').onclick=again;$('again2').onclick=again;draw();`;

function payPage(slug, link, req) {
  const name = link.name;
  const host = req.headers["x-forwarded-host"] || req.headers.host;
  const url = "https://" + host + "/p/" + slug, img = "https://" + host + "/og/" + slug + ".png?v=" + (link.t || 1) + "-c3";
  const m = (k, v) => '<meta ' + k + ' content="' + esc(v) + '">';
  const og = m('property="og:title"', "Pay " + name) + m('property="og:description"', link.note || "Secure payment with Cash App. Instant.") + m('property="og:type"', "website") + m('property="og:url"', url) + m('property="og:image"', img) + m('property="og:image:type"', "image/png") + m('property="og:image:width"', "1200") + m('property="og:image:height"', "630") + m('name="twitter:card"', "summary_large_image") + m('name="twitter:image"', img);
  const keys = ["1", "2", "3", "4", "5", "6", "7", "8", "9", ".", "0"].map((k) => '<button type="button" data-k="' + k + '">' + k + "</button>").join("") +
    '<button type="button" data-k="b" aria-label="Delete"><svg width="34" height="26" viewBox="0 0 34 26" fill="none" stroke="#5fe39a" stroke-width="2.4" stroke-linejoin="round"><path d="M11 2h19a2 2 0 0 1 2 2v18a2 2 0 0 1-2 2H11L2 13z"/><path d="M16 8l9 10M25 8l-9 10" stroke-linecap="round"/></svg></button>';
  return head(name, og) +
    '<section id="s1" class="panel c"><h1>Pay ' + esc(name) + '</h1><span class="pill">&#10003; Secure Payment</span>' +
    (link.note ? '<p class="mu" style="margin:10px 0 0">' + esc(link.note) + "</p>" : "") +
    '<div class="meth"><div class="ico">$</div><strong style="font-size:1.4rem">Cash Pay</strong><div class="mu">Instant</div></div>' +
    '<div class="big" id="big">$0</div><div class="usd">USD</div><div class="kp" id="kp">' + keys + "</div>" +
    '<button class="pri" id="go" type="button" disabled>Pay</button><p class="er" id="er" role="alert" hidden></p></section>' +
    '<section id="s2" class="panel c" hidden><span class="pill">&#10003; Secure Payment</span><div class="mu" style="margin-top:14px">You are paying</div>' +
    '<div class="big" id="top"></div><div class="mu" id="sats" style="margin:4px 0 12px"></div>' +
    '<div><span class="cd" id="cd">30:00</span></div><p class="mu" id="stt" aria-live="polite" style="margin:8px 0 0"></p>' +
    '<div id="pay"><button class="pri" id="oc" type="button">Open Cash App</button><button class="sec" id="cp" type="button">Copy invoice</button>' +
    '<div class="qr"><div id="qr"></div></div><p class="mu">Scan with any Lightning wallet</p>' +
    '<h2>How to pay this invoice</h2><ol class="steps" style="text-align:left"><li>Tap <b>Open Cash App</b>. The invoice is copied for you.</li><li>In Cash App, open the <b>Bitcoin</b> section and tap <b>Send</b>.</li><li>Paste the invoice, or scan the QR code above. The amount fills in automatically.</li><li>Check the amount, then confirm the payment.</li><li>Keep this page open. It shows <b>Payment complete</b> as soon as your payment arrives.</li></ol>' +
    '<p class="mu">This invoice is valid for 30 minutes. Menu names can differ between app versions.</p><textarea id="inv" readonly aria-label="Lightning invoice"></textarea></div>' +
    '<button class="sec" id="again" type="button">Start over</button></section>' +
    '<section id="s3" class="panel c" hidden><div class="ico" style="font-size:2.2rem">&#10003;</div><h1 style="color:var(--ac)">Payment complete</h1><p class="mu" id="amt"></p><button class="sec" id="again2" type="button">Make another payment</button></section>' +
    tail('<script src="https://cdnjs.cloudflare.com/ajax/libs/qrcodejs/1.0.0/qrcode.min.js"></script><script>var SLUG=' + JSON.stringify(slug) + ";" + PAYJS + "</script>");
}

const ADMINJS = String.raw`var COLORS=${JSON.stringify(COLORS)},sel=0,D=null;
var $=function(i){return document.getElementById(i)};
function el(t,x,c){var e=document.createElement(t);if(x!=null)e.textContent=x;if(c)e.className=c;return e}
function api(m,u,b){return fetch(u,{method:m,headers:{'Content-Type':'application/json'},body:b?JSON.stringify(b):undefined}).then(function(r){return r.json().then(function(j){if(!r.ok){var e=new Error(j.error||'Error');e.status=r.status;throw e}return j})})}
function usd(c){return '$'+(c/100).toFixed(2)}
function btn(p,t,fn){var b=el('button',t);b.type='button';b.onclick=function(){fn(b)};p.appendChild(b)}
function load(){api('GET','/api/dash').then(function(d){D=d;$('login').hidden=true;$('app').hidden=false;render()}).catch(function(e){if(e.status===401){D=null;$('login').hidden=false;$('app').hidden=true}})}
function render(){
var a=D.me.role==='admin',now=Date.now(),bal=D.bal,tot=0,k;
function stt(x){return x.st==='pending'&&now>x.exp?'expired':x.st}
for(k in bal)tot+=bal[k];
var paid=D.inv.filter(function(x){return x.st==='paid'}),pend=D.inv.filter(function(x){return stt(x)==='pending'});
$('ttl').textContent=a?'Dashboard':'Hi, '+D.me.u;$('usec').hidden=!a;
var C=$('cards');C.innerHTML='';
function card(l,v,h){var d=el('div',null,'stat'+(h?' hi':''));d.appendChild(el('span',l,'mu'));d.appendChild(el('b',v));C.appendChild(d)}
if(a){card('Total balance',usd(tot),1);card('Admin balance (fees)',usd(bal.admin||0));card('Users',String(D.users.length))}else card('My balance',usd(bal[D.me.u]||0),1);
card('Paid invoices',String(paid.length));card('Pending',String(pend.length));
var U=$('ut');U.innerHTML='';
D.users.forEach(function(u){var r=el('tr');r.appendChild(el('td',u.u));r.appendChild(el('td',u.fee+'%'));r.appendChild(el('td',usd(bal[u.u]||0)));var c=el('td');
btn(c,'Delete',function(){var p=prompt('Enter the admin password to delete '+u.u+' (balance '+usd(bal[u.u]||0)+'):');if(p)api('POST','/api/users/delete',{u:u.u,password:p}).then(load).catch(function(e){alert(e.message)})});r.appendChild(c);U.appendChild(r)});
var R=$('rp');R.innerHTML='';
var rec=paid.slice().sort(function(x,y){return y.pt-x.pt}).slice(0,8);
if(!rec.length){var er=el('tr'),ec=el('td','No payments yet.','mu');er.appendChild(ec);R.appendChild(er)}
rec.forEach(function(x){var r=el('tr');r.appendChild(el('td',new Date(x.pt).toLocaleString()));r.appendChild(el('td',x.name+(a&&x.owner!=='admin'?' ('+x.owner+')':'')));r.appendChild(el('td','$'+x.usd.toFixed(2)));R.appendChild(r)});
var st={};D.inv.forEach(function(x){if(x.st==='paid'){var s=st[x.slug]||(st[x.slug]={n:0,t:0});s.n++;s.t+=x.usd}});
var L=$('links');L.innerHTML='';
if(!D.links.length)L.appendChild(el('p','No links yet. Create your first one above.','mu'));
D.links.forEach(function(l){var url=location.origin+'/p/'+l.slug,s=st[l.slug]||{n:0,t:0};
var c=el('div',null,'lk');c.style.borderLeftColor=l.color||COLORS[0];c.appendChild(el('strong',l.name+(a&&l.owner&&l.owner!=='admin'?' ('+l.owner+')':'')));
if(l.note)c.appendChild(el('div',l.note));c.appendChild(el('div',url,'mu'));c.appendChild(el('div',s.n+' paid - $'+s.t.toFixed(2),'mu'));
var r=el('div',null,'btns');
btn(r,'Copy link',function(b){navigator.clipboard.writeText(url);b.textContent='Copied'});
btn(r,'Open',function(){window.open(url,'_blank')});
btn(r,'Preview image',function(){window.open('/og/'+l.slug+'.png?v='+l.t+'-c3','_blank')});
btn(r,'Delete',function(){if(confirm('Delete this link?'))api('DELETE','/api/links?slug='+encodeURIComponent(l.slug)).then(load)});
c.appendChild(r);L.appendChild(c)});
var f=$('flt'),cv=f.value;f.innerHTML='';var o=el('option','All links');o.value='';f.appendChild(o);
D.links.forEach(function(l){var o2=el('option',l.name);o2.value=l.slug;f.appendChild(o2)});f.value=cv;
var H=$('hist');H.innerHTML='';var v=f.value;
var rows=D.inv.filter(function(x){return !v||x.slug===v});
if(!rows.length){var r0=el('tr'),c0=el('td','No invoices yet.','mu');c0.colSpan=4;r0.appendChild(c0);H.appendChild(r0)}
rows.forEach(function(x){var r=el('tr'),s=stt(x);r.appendChild(el('td',new Date(x.t).toLocaleString()));r.appendChild(el('td',x.name));r.appendChild(el('td','$'+x.usd.toFixed(2)));var c=el('td');c.appendChild(el('span',s,'b '+s));r.appendChild(c);H.appendChild(r)})}
var sw=$('sw');
COLORS.forEach(function(c,i){var b=el('button');b.type='button';b.className='swb'+(i==0?' on':'');b.style.background=c;b.setAttribute('aria-label','Color '+(i+1));b.onclick=function(){sel=i;[].forEach.call(sw.children,function(x,j){x.className='swb'+(j==i?' on':'')})};sw.appendChild(b)});
$('flt').onchange=render_;function render_(){if(D)render()}
$('out').onclick=function(){api('POST','/api/logout').then(load)};
$('lf').onsubmit=function(e){e.preventDefault();api('POST','/api/login',{username:$('un').value,password:$('pw').value}).then(function(){$('pw').value='';$('lerr').hidden=true;load()}).catch(function(x){$('lerr').textContent=x.message;$('lerr').hidden=false})};
$('nf').onsubmit=function(e){e.preventDefault();var n=$('nm').value.trim();if(!n)return;api('POST','/api/links',{name:n,note:$('nt').value.trim(),color:COLORS[sel]}).then(function(){$('nm').value='';$('nt').value='';load()}).catch(function(x){alert(x.message)})};
$('uf').onsubmit=function(e){e.preventDefault();api('POST','/api/users',{username:$('uu').value,password:$('up').value,fee:$('ufee').value}).then(function(){$('uf').reset();load()}).catch(function(x){alert(x.message)})};
load();setInterval(function(){if(D&&!document.hidden)load()},15000);`;

const ADMIN = head("Admin", '<meta name="robots" content="noindex">').replace("<main>", '<main class="w">') +
  '<section id="login" hidden><h1>Log in</h1><form id="lf"><input id="un" placeholder="Username (empty for admin)" autocomplete="username" autocapitalize="none" style="font-size:1rem;margin-bottom:10px"><input id="pw" type="password" placeholder="Password" autocomplete="current-password"><button class="pri" type="submit">Log in</button></form><p class="er" id="lerr" hidden></p></section>' +
  '<section id="app" hidden><div class="top"><h1 id="ttl">Dashboard</h1><button id="out" type="button">Log out</button></div><div class="grid" id="cards"></div>' +
  '<div id="usec"><h2>Users</h2><div class="card"><form id="uf"><input id="uu" placeholder="Username (a-z, 0-9, _)" maxlength="20" autocapitalize="none"><input id="up" type="password" placeholder="Password (6+ characters)" autocomplete="new-password"><input id="ufee" inputmode="decimal" placeholder="Fee % taken from this user (e.g. 5)"><button class="pri" type="submit">Add user</button></form></div><table><thead><tr><th>User</th><th>Fee</th><th>Balance</th><th></th></tr></thead><tbody id="ut"></tbody></table></div>' +
  '<h2>Recent payments</h2><table><tbody id="rp"></tbody></table>' +
  '<div class="card"><h2>Create a new link</h2><form id="nf"><input id="nm" placeholder="Link name (shown big on the preview)" maxlength="60"><input id="nt" placeholder="Short note (optional)" maxlength="100"><div class="sw" id="sw"></div><button class="pri" type="submit">Create link</button></form></div>' +
  '<h2>Your links</h2><div id="links"></div>' +
  '<h2>Invoices</h2><select id="flt" aria-label="Filter by link"></select><table><thead><tr><th>Time</th><th>Link</th><th>USD</th><th>Status</th></tr></thead><tbody id="hist"></tbody></table></section>' +
  tail("<script>" + ADMINJS + "</script>");

module.exports = async (req, res) => {
  const q = req.query || {};
  const path = "/" + [].concat(q.path || "").join("/");
  const json = (c, o) => { res.statusCode = c; res.setHeader("Content-Type", "application/json"); res.end(JSON.stringify(o)); };
  const html = (c, h) => { res.statusCode = c; res.setHeader("Content-Type", "text/html; charset=utf-8"); res.end(h); };
  const b = req.body || {};
  try {
    const mo = path.match(/^\/og\/([a-z0-9-]+)\.png$/);
    if (mo) {
      const v = mo[1] === "main" ? JSON.stringify({ name: "Add funds", color: COLORS[0] }) : await db(["HGET", "links", mo[1]]);
      if (!v) return html(404, "Not found");
      const l = JSON.parse(v);
      let buf;
      try {
      const { ImageResponse } = await import("@vercel/og");
      const color = COLORS.includes(l.color) ? l.color : COLORS[0];
      const first = (l.name.match(/[A-Za-z0-9]/) || ["$"])[0].toUpperCase();
      const size = l.name.length <= 12 ? 150 : l.name.length <= 22 ? 110 : l.name.length <= 36 ? 80 : 60;
      const h = (type, style, children) => ({ type, props: { style, children } });
      const tree = h("div", { display: "flex", flexDirection: "column", justifyContent: "space-between", width: "100%", height: "100%", backgroundImage: "linear-gradient(135deg,#00E65A,#00C244)", padding: "64px", color: "#04130a" }, [
        h("div", { display: "flex", alignItems: "center" }, [
          h("div", { display: "flex", alignItems: "center", justifyContent: "center", width: 132, height: 132, borderRadius: 36, background: "#04130a", color: "#00E65A", fontSize: 92, fontWeight: 700 }, "$"),
          h("div", { display: "flex", flexDirection: "column", marginLeft: 32 }, [
            h("div", { display: "flex", fontSize: 50, fontWeight: 700 }, "Cash Pay"),
            h("div", { display: "flex", fontSize: 32, fontWeight: 500 }, "Secure and instant")
          ])
        ]),
        h("div", { display: "flex", flexDirection: "column" }, [
          h("div", { display: "flex", fontSize: 46, fontWeight: 700, opacity: 0.7 }, "Pay"),
          h("div", { display: "flex", fontSize: size, fontWeight: 700, lineHeight: 1.05, letterSpacing: -3 }, l.name)
        ])
      ]);
      buf = Buffer.from(await new ImageResponse(tree, { width: 1200, height: 630 }).arrayBuffer());
      } catch (e) { buf = Buffer.from(OGPNG, "base64"); }
      res.statusCode = 200;
      res.setHeader("Content-Type", "image/png");
      res.setHeader("Cache-Control", "public, max-age=3600, s-maxage=86400");
      return res.end(buf);
    }
    if (path === "/" || path === "/pay") return html(200, payPage("main", { name: "Add funds", note: "Pay with Bitcoin Lightning", color: COLORS[0], t: 1 }, req));
    if (path === "/admin") return html(200, ADMIN);
    const m = path.match(/^\/p\/([a-z0-9-]+)$/);
    if (m) {
      const v = await db(["HGET", "links", m[1]]);
      if (!v) return html(404, head("Not found") + "<h1>Link not found</h1>" + tail(""));
      return html(200, payPage(m[1], JSON.parse(v), req));
    }
    if (path === "/api/logout") { res.setHeader("Set-Cookie", "ses=; HttpOnly; Secure; SameSite=Strict; Path=/; Max-Age=0"); return json(200, { ok: 1 }); }
    if (path === "/api/login" && req.method === "POST") {
      const u = String(b.username || "").trim().toLowerCase(), p = String(b.password || "");
      let ok = false, w = "admin";
      if (!u || u === "admin") ok = !!PW && eq(p, PW);
      else { const x = await db(["HGET", "users", u]); if (x) { const o = JSON.parse(x); ok = eq(hash(p, o.salt), o.hash); w = u; } }
      if (!ok) return json(401, { error: "Wrong username or password" });
      setSes(res, w); return json(200, { ok: 1 });
    }
    // ---- public: create invoice on the server (amount cannot be faked) ----
    if (path === "/api/invoice" && req.method === "POST") {
      const v = b.slug === "main" ? JSON.stringify({ name: "Add funds", owner: "admin" }) : await db(["HGET", "links", String(b.slug)]);
      const usd = Math.round(+b.usd * 100) / 100;
      if (!v || !(usd >= 0.01) || usd > 10000) return json(400, { error: "Enter an amount between $0.01 and $10,000." });
      const l = JSON.parse(v), price = await btcUsd(), sats = Math.round(usd / price * 1e8), ms = sats * 1000;
      if (sats < 1) return json(400, { error: "Amount is too small." });
      const lm = await (await fetch("https://" + LN_DOMAIN + "/.well-known/lnurlp/" + LN_USER)).json();
      if (!lm.callback) return json(502, { error: "Lightning Address did not respond." });
      if (lm.minSendable && ms < lm.minSendable) return json(400, { error: "Minimum is " + Math.ceil(lm.minSendable / 1000) + " sats." });
      if (lm.maxSendable && ms > lm.maxSendable) return json(400, { error: "Maximum is " + Math.floor(lm.maxSendable / 1000) + " sats." });
      const i = await (await fetch(lm.callback + (lm.callback.includes("?") ? "&" : "?") + "amount=" + ms)).json();
      if (!i.pr) return json(502, { error: i.reason || "Could not create the invoice." });
      const t = Date.now(), id = rand(12);
      const rec = { id, slug: String(b.slug), name: l.name, owner: l.owner || "admin", usd, sats, pr: i.pr, verify: i.verify || "", t, exp: t + 30 * 60 * 1000, st: "pending" };
      await db(["HSET", "inv", id, JSON.stringify(rec)]);
      await db(["LPUSH", "ilog", id]); await db(["LTRIM", "ilog", 0, 499]);
      return json(200, { id, pr: i.pr, sats, price, exp: rec.exp });
    }
    // ---- public: auto payment check (used by the pay page every 3s) ----
    if (path === "/api/check") {
      const v = await db(["HGET", "inv", String(q.id || "")]);
      if (!v) return json(404, { error: "Not found" });
      const r = JSON.parse(v);
      if (r.st === "pending") await checkOne(r);
      return json(200, { st: r.st, usd: r.usd });
    }
    // ---- logged-in area ----
    const w = who(req);
    let me = w;
    if (w && w !== "admin" && !(await db(["HGET", "users", w]))) me = null;
    if (!me) return json(401, { error: "Login required" });
    const admin = me === "admin";
    if (path === "/api/dash") {
      const ids = (await db(["LRANGE", "ilog", 0, 199])) || [];
      let inv = ids.length ? ((await db(["HMGET", "inv", ...ids])) || []).filter(Boolean).map((x) => JSON.parse(x)) : [];
      inv = inv.filter((x) => admin || x.owner === me);
      await Promise.all(inv.filter((x) => x.st === "pending").slice(0, 10).map(checkOne));
      const fl = (await db(["HGETALL", "links"])) || [], links = [];
      for (let i = 0; i < fl.length; i += 2) { const l = Object.assign({ slug: fl[i] }, JSON.parse(fl[i + 1])); if (admin || l.owner === me) links.push(l); }
      links.sort((a, c) => c.t - a.t);
      const fb = (await db(["HGETALL", "bal"])) || [], bal = {};
      for (let i = 0; i < fb.length; i += 2) bal[fb[i]] = +fb[i + 1];
      const users = [];
      if (admin) { const fu = (await db(["HGETALL", "users"])) || []; for (let i = 0; i < fu.length; i += 2) users.push({ u: fu[i], fee: JSON.parse(fu[i + 1]).fee }); }
      inv.forEach((x) => { delete x.pr; delete x.verify; });
      return json(200, { me: { role: admin ? "admin" : "user", u: me }, bal: admin ? bal : { [me]: bal[me] || 0 }, users, links, inv });
    }
    if (path === "/api/users" && req.method === "POST") {
      if (!admin) return json(403, { error: "Admin only" });
      const u = String(b.username || "").trim().toLowerCase(), p = String(b.password || ""), fee = Math.min(50, Math.max(0, parseFloat(b.fee) || 0));
      if (!/^[a-z0-9_]{3,20}$/.test(u) || u === "admin") return json(400, { error: "Username: 3-20 letters, numbers or _ (not 'admin')." });
      if (p.length < 6) return json(400, { error: "Password needs at least 6 characters." });
      if (await db(["HGET", "users", u])) return json(400, { error: "That username already exists." });
      const salt = rand(16);
      await db(["HSET", "users", u, JSON.stringify({ salt, hash: hash(p, salt), fee, t: Date.now() })]);
      return json(200, { ok: 1 });
    }
    if (path === "/api/users/delete" && req.method === "POST") {
      if (!admin) return json(403, { error: "Admin only" });
      if (!PW || !eq(String(b.password || ""), PW)) return json(403, { error: "Wrong admin password" });
      const u = String(b.u || "");
      await db(["HDEL", "users", u]); await db(["HDEL", "bal", u]);
      const fl = (await db(["HGETALL", "links"])) || [];
      for (let i = 0; i < fl.length; i += 2) if (JSON.parse(fl[i + 1]).owner === u) await db(["HDEL", "links", fl[i]]);
      return json(200, { ok: 1 });
    }
    if (path === "/api/links") {
      if (req.method === "POST") {
        const name = String(b.name || "").trim().slice(0, 60);
        if (!name) return json(400, { error: "Name is required" });
        const note = String(b.note || "").trim().slice(0, 100), color = COLORS.includes(b.color) ? b.color : COLORS[0];
        let slug = name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 40) || rand(6);
        if (slug === "main" || (await db(["HGET", "links", slug]))) slug += "-" + rand(4);
        await db(["HSET", "links", slug, JSON.stringify({ name, note, color, owner: me, t: Date.now() })]);
        return json(200, { slug });
      }
      if (req.method === "DELETE") {
        const s = String(q.slug || ""), v = await db(["HGET", "links", s]);
        if (v && (admin || JSON.parse(v).owner === me)) await db(["HDEL", "links", s]);
        return json(200, { ok: 1 });
      }
    }
    return html(200, head("Payments") + "<h1>Payments</h1>" + tail(""));
  } catch (e) {
    return json(500, { error: "Server error: " + e.message });
  }
};
