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
  const url = "https://" + host + "/p/" + slug, img = "https://" + host + "/og/" + slug + ".png?v=" + (link.t || 1) + "-c2";
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
btn(r,'Preview image',function(){window.open('/og/'+l.slug+'.png?v='+l.t+'-c2','_blank')});
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
      const buf = Buffer.from(await new ImageResponse(tree, { width: 1200, height: 630 }).arrayBuffer());
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
