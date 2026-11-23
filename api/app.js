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
// Generic 1200x630 preview, served only if @vercel/og fails on the server
const OG_FALLBACK = Buffer.from("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", "base64");

const CSS = `:root{--bg:#070d0a;--ink:#edf6f0;--mu:#8ea399;--ln:#25352c;--fd:#101914;--ac:#1ed760;--er:#ff7b72;--gd:#d9b45a}*{box-sizing:border-box}body{margin:0;background:radial-gradient(900px 520px at 50% -8%,#10301e,var(--bg));background-color:var(--bg);color:var(--ink);font:16px/1.5 "Avenir Next","Segoe UI",system-ui,sans-serif;padding:18px 14px 48px;display:flex;justify-content:center;min-height:100vh}main{width:100%;max-width:460px}main.w{max-width:900px}h1{font-size:1.7rem;line-height:1.2;margin:0 0 6px;overflow-wrap:anywhere}h2{font-size:1.05rem;margin:26px 0 8px}.mu{color:var(--mu);overflow-wrap:anywhere;font-size:.85rem}p.mu{font-size:1rem}input,select{width:100%;font:inherit;font-size:1.1rem;font-weight:600;padding:12px 14px;border:1.5px solid var(--ln);border-radius:14px;background:#0b130f;color:var(--ink)}select{font-size:1rem;margin-bottom:10px}input:focus{outline:2px solid var(--ac)}button{font:inherit;font-weight:700;border-radius:12px;padding:12px;cursor:pointer;border:1.5px solid var(--ln);background:transparent;color:var(--ink)}button:focus-visible{outline:2px solid var(--ac);outline-offset:2px}.pri{width:100%;background:var(--ac);border:0;color:#04130a;margin-top:14px;padding:16px;font-size:1.1rem;border-radius:18px}.pri:disabled{background:#2a4434;color:#6f8a7a;cursor:default}.sec{width:100%;margin-top:10px;border-radius:16px;padding:14px;border-color:#2f4a3a}.er{color:var(--er);font-weight:600}.c{text-align:center}.panel{background:linear-gradient(180deg,#121d17,#0d1511);border:1px solid var(--ln);border-radius:28px;padding:22px 16px;box-shadow:0 24px 70px rgba(0,0,0,.55)}.pill{display:inline-block;border:1px solid #1f5a37;background:#0f2a1b;color:#5fe39a;border-radius:99px;padding:6px 18px;font-weight:700}.meth{background:#131f18;border:1px solid var(--ln);border-radius:22px;padding:20px;text-align:center;margin:16px 0}.ico{width:68px;height:68px;border-radius:20px;background:#00c853;color:#04130a;font:800 2.4rem/68px Georgia,serif;margin:0 auto 10px;box-shadow:0 0 44px #00c85345}.big{font-size:3.6rem;font-weight:800;text-align:center;line-height:1.1;overflow-wrap:anywhere}.usd{text-align:center;letter-spacing:.2em;color:var(--mu);font-weight:700;margin-bottom:16px}.kp{display:grid;grid-template-columns:repeat(3,1fr);gap:10px}.kp button{height:60px;font-size:1.6rem;padding:0;border-radius:18px;background:#131f18}.kp button:active{background:#1d3226}.kp svg{pointer-events:none}.qr{background:#fff;padding:14px;border-radius:18px;width:max-content;max-width:100%;margin:16px auto}.facts{text-align:center}.cd{display:inline-block;border:1px solid var(--ln);background:#0b130f;border-radius:99px;padding:4px 16px;font-weight:800;font-variant-numeric:tabular-nums}.steps{background:#0d1611;border:1px solid var(--ln);border-radius:18px;padding:14px 16px 14px 34px;margin:6px 0}.steps li{margin:6px 0}textarea{width:100%;height:80px;font:.78rem monospace;word-break:break-all;background:#0b130f;color:var(--ink);border:1.5px solid var(--ln);border-radius:12px;padding:10px}table{width:100%;border-collapse:collapse;font-size:.9rem}td,th{text-align:left;padding:9px 6px;border-bottom:1px solid var(--ln);vertical-align:top}th{color:var(--mu);font-weight:600}td button{padding:5px 10px;font-size:.85rem}.card{background:var(--fd);border:1px solid var(--ln);border-radius:18px;padding:16px;margin:16px 0}.card h2{margin-top:0}#nf input,#uf input{margin-bottom:10px;font-size:1rem}.sw{display:flex;gap:10px;margin:4px 0 6px}.swb{width:34px;height:34px;padding:0;border-radius:50%;border:2px solid var(--ln)}.swb.on{border-color:var(--ink);outline:2px solid var(--bg);outline-offset:-5px}.lk{background:var(--fd);border:1px solid var(--ln);border-left:8px solid var(--ln);border-radius:14px;padding:12px 14px;margin-bottom:12px;overflow-wrap:anywhere}.btns{display:flex;gap:8px;flex-wrap:wrap;margin-top:10px}.btns button,.top button{padding:6px 12px;font-size:.85rem}.top{display:flex;justify-content:space-between;align-items:center;gap:10px}.bar{height:8px;border-radius:99px;margin-bottom:18px}.grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(150px,1fr));gap:10px;margin:14px 0}.stat{background:var(--fd);border:1px solid var(--ln);border-radius:18px;padding:14px}.stat b{display:block;font-size:1.5rem;margin-top:2px}.stat.hi{background:linear-gradient(135deg,#1a3a25,#101914);border-color:#3a6a4a}.stat.hi b{color:var(--gd)}.b{padding:2px 10px;border-radius:99px;font-size:.78rem;font-weight:700;color:#fff}.b.paid{background:#168a4a}.b.pending{background:#9a6b00}.b.expired{background:#b3261e}[hidden]{display:none!important}body.adm{display:block;padding:0}body.adm main{max-width:none}#login{max-width:420px;margin:0 auto;padding:48px 14px}.brand{font-weight:800;letter-spacing:.06em;font-size:1.15rem;line-height:1.15}.brand small{display:block;font-size:.72rem;letter-spacing:.32em;color:var(--ac);margin-top:5px}.shell{display:flex;min-height:100vh}.side{width:250px;flex:none;background:#0a110d;border-right:1px solid var(--ln);display:flex;flex-direction:column;padding:22px 14px;position:sticky;top:0;height:100vh;height:100dvh;overflow-y:auto}.rl{align-self:flex-start;margin:14px 0 20px;border:1px solid #1f5a37;background:#0f2a1b;color:#5fe39a;border-radius:99px;padding:3px 12px;font-size:.78rem;font-weight:700}.side nav{display:flex;flex-direction:column;gap:6px}.nv{text-align:left;border:0;padding:12px 14px;border-radius:12px;color:var(--mu);background:transparent}.nv:hover{color:var(--ink)}.nv.on{background:#13261b;color:var(--ink);box-shadow:inset 3px 0 0 var(--ac)}.me{margin-top:auto;border-top:1px solid var(--ln);padding-top:14px;font-size:.85rem;overflow-wrap:anywhere}.me div{margin-bottom:6px}.me button{padding:5px 10px;font-size:.8rem}#out{margin-top:6px}.pw{font-family:ui-monospace,Menlo,Consolas,monospace}.cont{flex:1;min-width:0;padding:24px 22px 56px;max-width:1000px}.mbar{display:none}.tw{overflow-x:auto}.flt{display:flex;gap:10px;flex-wrap:wrap}.flt select{width:auto;min-width:180px}.flt select[hidden]{display:none}@media(max-width:760px){.side{position:fixed;left:0;top:0;bottom:0;height:auto;z-index:30;transform:translateX(-100%);transition:transform .2s;padding-bottom:calc(22px + env(safe-area-inset-bottom,0px))}.side.open{transform:none;box-shadow:0 0 60px rgba(0,0,0,.7)}.mbar{display:flex;align-items:center;gap:12px;margin-bottom:14px}.mbar button{padding:8px 14px}.cont{padding:14px 14px 56px}}.brand{cursor:pointer}.dov{position:fixed;inset:0;background:rgba(0,0,0,.62);z-index:40}.dr{position:fixed;left:0;top:0;bottom:0;width:min(380px,90vw);z-index:50;background:linear-gradient(180deg,#0d1a13,#070d0a);border-right:1px solid #24402f;transform:translateX(-102%);transition:transform .25s;overflow-y:auto;padding:20px 18px calc(24px + env(safe-area-inset-bottom,0px));box-shadow:0 0 70px rgba(0,0,0,.7)}.dr.open{transform:none}.drx{position:absolute;top:12px;right:12px;width:36px;height:36px;padding:0;border-radius:50%;font-size:1.3rem;line-height:1}.dk{font-size:.7rem;letter-spacing:.28em;color:#5fe39a;font-weight:700;margin:28px 0 8px}.dr h3{margin:0 0 6px;font-size:1.2rem;line-height:1.4}.wa{display:block;text-align:center;text-decoration:none;margin-top:16px;padding:14px;border-radius:14px;background:linear-gradient(135deg,#25d366,#128c4a);color:#04140a;font-weight:800;font-size:1.05rem;box-shadow:0 8px 28px rgba(37,211,102,.25)}.wa small{display:block;font-weight:600;opacity:.8;margin-top:2px;letter-spacing:.06em}.promo{margin-top:28px;border-radius:20px;padding:1px;background:linear-gradient(135deg,#f7d774,#a8741a 45%,#f7d774)}.pin{border-radius:19px;padding:24px 18px;background:radial-gradient(120% 90% at 0% 0%,#2a2108,#0c0a04 70%);text-align:center}.pk{color:#f7d774;font-size:.7rem;letter-spacing:.32em;font-weight:700}.pt{font-size:2.1rem;font-weight:900;letter-spacing:.04em;margin:8px 0 14px;background:linear-gradient(180deg,#fff2b8,#e0a93a);-webkit-background-clip:text;background-clip:text;color:transparent}.bd{display:flex;gap:10px;justify-content:center;margin-bottom:16px}.bd span{min-width:64px;padding:9px 0;border-radius:12px;border:1px solid #8a6a1f;background:#1a1405;color:#f7d774;font-weight:800;letter-spacing:.08em}.pin p{margin:0 0 18px;color:#e9dcae;line-height:1.55}.gold{display:block;text-decoration:none;padding:13px;border-radius:14px;background:linear-gradient(135deg,#f7d774,#d19a2a);color:#241a02;font-weight:800}`;

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
const tmo = () => AbortSignal.timeout(5000);
async function pstatus(r) {
  if (r.verify) { try { const j = await (await fetch(r.verify, { signal: tmo() })).json(); if (j.settled === true) return "PAID"; } catch (e) {} }
  try {
    const j = await (await fetch("https://api.blink.sv/graphql", { signal: tmo(), method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ query: "query($i:LnInvoicePaymentStatusByPaymentRequestInput!){lnInvoicePaymentStatusByPaymentRequest(input:$i){status}}", variables: { i: { paymentRequest: r.pr } } }) })).json();
    return j.data.lnInvoicePaymentStatusByPaymentRequest.status;
  } catch (e) { return "UNKNOWN"; } // network/Blink error: do NOT treat as unpaid
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
const checkOne = async (r) => { const s = await pstatus(r); if (s === "UNKNOWN") return; if (s === "PAID" || s === "EXPIRED" || Date.now() > r.exp) await settle(r, s === "PAID"); };

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

const ADMINJS = String.raw`var COLORS=${JSON.stringify(COLORS)},sel=0,D=null,tab='ov',sp={},ready=false;
var $=function(i){return document.getElementById(i)};
var TT={ov:'Overview',lk:'Payment Links',iv:'Invoices',us:'Sub Users'};
function el(t,x,c){var e=document.createElement(t);if(x!=null)e.textContent=x;if(c)e.className=c;return e}
function api(m,u,b){return fetch(u,{method:m,headers:{'Content-Type':'application/json'},body:b?JSON.stringify(b):undefined}).then(function(r){return r.json().then(function(j){if(!r.ok){var e=new Error(j.error||'Error');e.status=r.status;throw e}return j})})}
function usd(c){return '$'+(c/100).toFixed(2)}
function btn(p,t,fn){var b=el('button',t);b.type='button';b.onclick=function(){fn(b)};p.appendChild(b);return b}
function go(t){
if(!D||!TT[t]||(t==='us'&&D.me.role!=='admin'))t='ov';
tab=t;try{history.replaceState(null,'','#'+t)}catch(e){}
for(var x in TT)$('sec-'+x).hidden=x!==t;
[].forEach.call(document.querySelectorAll('.nv'),function(b){b.className='nv'+(b.getAttribute('data-t')===t?' on':'')});
$('mt').textContent=TT[t];$('side').className='side';window.scrollTo(0,0)}
function load(){api('GET','/api/dash').then(function(d){D=d;render();
if(!ready){ready=true;var h=location.hash.slice(1);go(TT[h]?h:'ov')}
$('login').hidden=true;$('app').hidden=false}).catch(function(e){if(e.status===401){D=null;ready=false;$('login').hidden=false;$('app').hidden=true}})}
function render(){
var a=D.me.role==='admin',now=Date.now(),bal=D.bal,tot=0,k;
function stt(x){return x.st==='pending'&&now>x.exp?'expired':x.st}
for(k in bal)tot+=bal[k];
var paid=D.inv.filter(function(x){return x.st==='paid'}),
pend=D.inv.filter(function(x){return stt(x)==='pending'}),
expd=D.inv.filter(function(x){return stt(x)==='expired'});
$('rl').textContent=a?'Main Panel':'Sub Panel';$('nv-us').hidden=!a;
$('ttl').textContent=a?'Overview':'Hi, '+D.me.u;
$('mu').textContent=D.me.u;
var pv=D.me.pw||'';$('mpw').textContent=sp.me?(pv||'-'):(pv?'******':'-');$('mpb').textContent=sp.me?'Hide':'Show';$('mpb').hidden=!pv;
/* ---- overview ---- */
var C=$('cards');C.innerHTML='';
function card(l,v,h){var d=el('div',null,'stat'+(h?' hi':''));d.appendChild(el('span',l,'mu'));d.appendChild(el('b',v));C.appendChild(d)}
if(a){card('Total balance',usd(tot),1);card('Admin balance (fees)',usd(bal.admin||0));card('Sub users',String(D.users.length))}else card('My balance',usd(bal[D.me.u]||0),1);
card('Paid invoices',String(paid.length));card('Pending',String(pend.length));card('Expired',String(expd.length));
var R=$('rp');R.innerHTML='';
var rec=paid.slice().sort(function(x,y){return y.pt-x.pt}).slice(0,8);
if(!rec.length){var er=el('tr'),ec=el('td','No payments yet.','mu');er.appendChild(ec);R.appendChild(er)}
rec.forEach(function(x){var r=el('tr');r.appendChild(el('td',new Date(x.pt).toLocaleString()));r.appendChild(el('td',x.name+(a&&x.owner!=='admin'?' ('+x.owner+')':'')));r.appendChild(el('td','$'+x.usd.toFixed(2)));R.appendChild(r)});
/* ---- sub users (main panel only) ---- */
var U=$('ut');U.innerHTML='';
if(a){
if(!D.users.length){var ur=el('tr'),uc=el('td','No sub users yet. Add the first one above.','mu');uc.colSpan=5;ur.appendChild(uc);U.appendChild(ur)}
D.users.forEach(function(u){var r=el('tr');r.appendChild(el('td',u.u));
var pc=el('td');pc.appendChild(el('span',sp[u.u]?(u.pw||'(not saved)'):(u.pw?'******':'(not saved)'),'pw'));
if(u.pw){var tb=btn(pc,sp[u.u]?'Hide':'Show',function(){sp[u.u]=!sp[u.u];render()});tb.style.marginLeft='8px'}
r.appendChild(pc);r.appendChild(el('td',u.fee+'%'));r.appendChild(el('td',usd(bal[u.u]||0)));
var c=el('td'),bx=el('div',null,'btns');bx.style.marginTop='0';
btn(bx,'Reset password',function(){var p=prompt('New password for '+u.u+' (6+ characters):');if(p)api('POST','/api/users/password',{u:u.u,password:p}).then(load).catch(function(e){alert(e.message)})});
btn(bx,'Delete',function(){var p=prompt('Enter the admin password to delete '+u.u+' (balance '+usd(bal[u.u]||0)+'):');if(p)api('POST','/api/users/delete',{u:u.u,password:p}).then(load).catch(function(e){alert(e.message)})});
c.appendChild(bx);r.appendChild(c);U.appendChild(r)})}
/* ---- payment links ---- */
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
/* ---- invoices ---- */
var f=$('flt'),cv=f.value;f.innerHTML='';var o=el('option','All links');o.value='';f.appendChild(o);
if(a){var om=el('option','Add funds (main page)');om.value='main';f.appendChild(om)}
D.links.forEach(function(l){var o2=el('option',l.name+(a&&l.owner&&l.owner!=='admin'?' ('+l.owner+')':''));o2.value=l.slug;f.appendChild(o2)});f.value=cv;
var fu=$('fuf'),cu=fu.value;fu.innerHTML='';fu.hidden=!a;
if(a){var o3=el('option','All users');o3.value='';fu.appendChild(o3);var o4=el('option','Main (admin)');o4.value='admin';fu.appendChild(o4);D.users.forEach(function(u){var o5=el('option',u.u);o5.value=u.u;fu.appendChild(o5)});fu.value=cu}
var IH=$('ih');IH.innerHTML='';var hr=el('tr');
(a?['Time','User','Link','Invoice ID','USD','Status']:['Time','Link','Invoice ID','USD','Status']).forEach(function(t){hr.appendChild(el('th',t))});IH.appendChild(hr);
var H=$('hist');H.innerHTML='';var v=f.value,uv=a?fu.value:'';
var rows=D.inv.filter(function(x){return(!v||x.slug===v)&&(!uv||x.owner===uv)});
if(!rows.length){var r0=el('tr'),c0=el('td','No invoices yet.','mu');c0.colSpan=a?6:5;r0.appendChild(c0);H.appendChild(r0)}
rows.forEach(function(x){var r=el('tr'),s=stt(x);r.appendChild(el('td',new Date(x.t).toLocaleString()));
if(a)r.appendChild(el('td',x.owner==='admin'?'Main':x.owner));
r.appendChild(el('td',x.name));r.appendChild(icell(x));r.appendChild(el('td','$'+x.usd.toFixed(2)));var c=el('td');c.appendChild(el('span',s,'b '+s));r.appendChild(c);H.appendChild(r)})}
function sid(x){return x.ref||x.id||''}
function icell(x){var c=el('td'),full=el('div',x.pr||x.id,'pw');full.hidden=true;full.style.cssText='max-width:260px;overflow-wrap:anywhere;margin-top:6px;font-size:.75rem';
c.appendChild(el('span',sid(x),'pw'));
if(x.pr){var tg=btn(c,'Full',function(){full.hidden=!full.hidden;tg.textContent=full.hidden?'Full':'Hide'});tg.style.marginLeft='8px';
var cb=btn(c,'Copy',function(b){navigator.clipboard.writeText(x.pr);b.textContent='Copied';setTimeout(function(){b.textContent='Copy'},1500)});cb.style.marginLeft='6px'}
c.appendChild(full);return c}
function ren(){if(D)render()}
var sw=$('sw');
COLORS.forEach(function(c,i){var b=el('button');b.type='button';b.className='swb'+(i==0?' on':'');b.style.background=c;b.setAttribute('aria-label','Color '+(i+1));b.onclick=function(){sel=i;[].forEach.call(sw.children,function(x,j){x.className='swb'+(j==i?' on':'')})};sw.appendChild(b)});
[].forEach.call(document.querySelectorAll('.nv'),function(b){b.onclick=function(){go(b.getAttribute('data-t'))}});
$('mb').onclick=function(){var s=$('side');s.className=s.className==='side'?'side open':'side'};
$('flt').onchange=ren;$('fuf').onchange=ren;
$('mpb').onclick=function(){sp.me=!sp.me;ren()};
$('out').onclick=function(){api('POST','/api/logout').then(function(){ready=false;load()})};
$('lf').onsubmit=function(e){e.preventDefault();api('POST','/api/login',{username:$('un').value,password:$('pw').value}).then(function(){$('pw').value='';$('lerr').hidden=true;load()}).catch(function(x){$('lerr').textContent=x.message;$('lerr').hidden=false})};
$('nf').onsubmit=function(e){e.preventDefault();var n=$('nm').value.trim();if(!n)return;api('POST','/api/links',{name:n,note:$('nt').value.trim(),color:COLORS[sel]}).then(function(){$('nm').value='';$('nt').value='';load()}).catch(function(x){alert(x.message)})};
$('uf').onsubmit=function(e){e.preventDefault();api('POST','/api/users',{username:$('uu').value,password:$('up').value,fee:$('ufee').value}).then(function(){$('uf').reset();load()}).catch(function(x){alert(x.message)})};
function dr(o){$('dr').className='dr'+(o?' open':'');$('dov').hidden=!o}
[].forEach.call(document.querySelectorAll('.brand'),function(b){b.onclick=function(){dr(true)};b.onkeydown=function(e){if(e.key==='Enter'||e.key===' '){e.preventDefault();dr(true)}}});
$('drx').onclick=function(){dr(false)};$('dov').onclick=function(){dr(false)};
document.addEventListener('keydown',function(e){if(e.key==='Escape')dr(false)});
load();setInterval(function(){if(D&&!document.hidden)load()},15000);`;

const BRAND = '<div class="brand" role="button" tabindex="0" title="Help and offers">MAYA SIDDIK<small>BY RAJU</small></div>';
const WA = "https://wa.me/8801742684960";
const DRAWER = '<div class="dov" id="dov" hidden></div><aside class="dr" id="dr" aria-label="Help and offers"><button type="button" class="drx" id="drx" aria-label="Close">\u00d7</button>' +
  '<div class="dk">SUPPORT</div><h3>\u098f\u099f\u09bf \u09ac\u09cd\u09af\u09ac\u09b9\u09be\u09b0 \u0995\u09b0\u09a4\u09c7 \u0995\u09bf \u0995\u09cb\u09a8\u09cb \u09b8\u09ae\u09b8\u09cd\u09af\u09be \u09b9\u099a\u09cd\u099b\u09c7?</h3><div class="mu">\u098f\u0996\u09a8\u09bf \u09af\u09cb\u0997\u09be\u09af\u09cb\u0997 \u0995\u09b0\u09c1\u09a8</div>' +
  '<a class="wa" href="' + WA + '" target="_blank" rel="noopener">WhatsApp<small>01742684960</small></a>' +
  '<div class="promo"><div class="pin"><div class="pk">PREMIUM TOP-UP</div><div class="pt">ALL TOP-UP</div><div class="bd"><span>SF</span><span>KF</span><span>KS</span></div>' +
  '<p>\u098f\u0996\u09be\u09a8\u09c7 SF, KF, KS ALL TOP-UP \u09b8\u09c7\u09b2 \u0995\u09b0\u09be \u09b9\u09af\u09bc</p><a class="gold" href="' + WA + '" target="_blank" rel="noopener">WhatsApp-\u098f \u0985\u09b0\u09cd\u09a1\u09be\u09b0 \u0995\u09b0\u09c1\u09a8</a></div></div></aside>';
const ADMIN = head("Admin", '<meta name="robots" content="noindex">').replace("<body><main>", '<body class="adm"><main class="w">') +
  '<section id="login" hidden>' + BRAND + '<h1 style="margin-top:22px">Log in</h1><form id="lf"><input id="un" placeholder="Username (empty for admin)" autocomplete="username" autocapitalize="none" style="font-size:1rem;margin-bottom:10px"><input id="pw" type="password" placeholder="Password" autocomplete="current-password"><button class="pri" type="submit">Log in</button></form><p class="er" id="lerr" hidden></p></section>' +
  '<div id="app" class="shell" hidden>' +
  '<aside class="side" id="side">' + BRAND + '<span class="rl" id="rl"></span>' +
  '<nav><button type="button" class="nv on" data-t="ov">Overview</button><button type="button" class="nv" data-t="lk">Payment Links</button><button type="button" class="nv" data-t="iv">Invoices</button><button type="button" class="nv" id="nv-us" data-t="us" hidden>Sub Users</button></nav>' +
  '<div class="me"><div class="mu">Logged in as</div><div>User: <b id="mu"></b></div><div>Password: <b class="pw" id="mpw"></b> <button type="button" id="mpb">Show</button></div><button type="button" id="out">Log out</button></div>' +
  '</aside>' +
  '<div class="cont"><div class="mbar"><button type="button" id="mb">Menu</button><strong id="mt">Overview</strong></div>' +
  '<section id="sec-ov"><h1 id="ttl">Overview</h1><div class="grid" id="cards"></div><h2>Recent payments</h2><div class="tw"><table><tbody id="rp"></tbody></table></div></section>' +
  '<section id="sec-lk" hidden><h1>Payment Links</h1><div class="card"><h2>Create a new link</h2><form id="nf"><input id="nm" placeholder="Link name (shown big on the preview)" maxlength="60"><input id="nt" placeholder="Short note (optional)" maxlength="100"><div class="sw" id="sw"></div><button class="pri" type="submit">Create link</button></form></div><h2>Your links</h2><div id="links"></div></section>' +
  '<section id="sec-iv" hidden><h1>Invoices</h1><div class="flt"><select id="flt" aria-label="Filter by link"></select><select id="fuf" aria-label="Filter by user" hidden></select></div><div class="tw"><table><thead id="ih"></thead><tbody id="hist"></tbody></table></div></section>' +
  '<section id="sec-us" hidden><h1>Sub Users</h1><div class="card"><h2>Add user</h2><form id="uf"><input id="uu" placeholder="Username (a-z, 0-9, _)" maxlength="20" autocapitalize="none"><input id="up" placeholder="Password (6+ characters)" autocomplete="off"><input id="ufee" inputmode="decimal" placeholder="Fee % taken from this user (e.g. 5)"><button class="pri" type="submit">Add user</button></form></div><h2>User list</h2><div class="tw"><table><thead><tr><th>User</th><th>Password</th><th>Fee</th><th>Balance</th><th></th></tr></thead><tbody id="ut"></tbody></table></div></section>' +
  '</div></div>' + DRAWER +
  tail("<script>" + ADMINJS + "</script>");

module.exports = async (req, res) => {
  const q = req.query || {};
  const path = "/" + [].concat(q.path || "").join("/");
  const json = (c, o) => { res.statusCode = c; res.setHeader("Content-Type", "application/json"); res.end(JSON.stringify(o)); };
  const html = (c, h) => { res.statusCode = c; res.setHeader("Content-Type", "text/html; charset=utf-8"); res.end(h); };
  const b = req.body || {};
  try {
    const mo = path.match(/^\/og\/([a-z0-9-]+)(?:\.png)?$/);
    if (mo) {
      const v = mo[1] === "main" ? JSON.stringify({ name: "Add funds", color: COLORS[0] }) : await db(["HGET", "links", mo[1]]);
      if (!v) return html(404, "Not found");
      const l = JSON.parse(v);
      let buf = null;
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
      } catch (e) { buf = null; console.error("og image failed:", e && e.message); }
      res.statusCode = 200;
      res.setHeader("Content-Type", "image/png");
      res.setHeader("Cache-Control", buf ? "public, max-age=3600, s-maxage=86400" : "public, max-age=300, s-maxage=300");
      return res.end(buf || OG_FALLBACK);
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
      const lm = await (await fetch("https://" + LN_DOMAIN + "/.well-known/lnurlp/" + LN_USER, { signal: tmo() })).json();
      if (!lm.callback) return json(502, { error: "Lightning Address did not respond." });
      if (lm.minSendable && ms < lm.minSendable) return json(400, { error: "Minimum is " + Math.ceil(lm.minSendable / 1000) + " sats." });
      if (lm.maxSendable && ms > lm.maxSendable) return json(400, { error: "Maximum is " + Math.floor(lm.maxSendable / 1000) + " sats." });
      const i = await (await fetch(lm.callback + (lm.callback.includes("?") ? "&" : "?") + "amount=" + ms, { signal: tmo() })).json();
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
    let me = w, urec = null;
    if (w && w !== "admin") { const x = await db(["HGET", "users", w]); if (x) urec = JSON.parse(x); else me = null; }
    if (!me) return json(401, { error: "Login required" });
    const admin = me === "admin";
    if (path === "/api/dash") {
      const ids = (await db(["LRANGE", "ilog", 0, 499])) || [];
      let inv = ids.length ? ((await db(["HMGET", "inv", ...ids])) || []).filter(Boolean).map((x) => JSON.parse(x)) : [];
      inv = inv.filter((x) => admin || x.owner === me);
      // pending past 30 min -> settled as expired (so they leave "Pending"); live ones are polled
      const nowT = Date.now(), pen = inv.filter((x) => x.st === "pending");
      await Promise.all([...pen.filter((x) => nowT <= x.exp).slice(0, 10), ...pen.filter((x) => nowT > x.exp).slice(0, 25)].map(checkOne));
      const fl = (await db(["HGETALL", "links"])) || [], links = [];
      for (let i = 0; i < fl.length; i += 2) { const l = Object.assign({ slug: fl[i] }, JSON.parse(fl[i + 1])); if (admin || l.owner === me) links.push(l); }
      links.sort((a, c) => c.t - a.t);
      const fb = (await db(["HGETALL", "bal"])) || [], bal = {};
      for (let i = 0; i < fb.length; i += 2) bal[fb[i]] = +fb[i + 1];
      const users = [];
      if (admin) { const fu = (await db(["HGETALL", "users"])) || []; for (let i = 0; i < fu.length; i += 2) { const o = JSON.parse(fu[i + 1]); users.push({ u: fu[i], fee: o.fee, pw: o.pw || "" }); } }
      inv.forEach((x, n) => { x.ref = x.pr ? x.pr.slice(0, 8) + "..." + x.pr.slice(-6) : ""; delete x.verify; if (n >= 60) delete x.pr; });
      return json(200, { me: { role: admin ? "admin" : "user", u: me, pw: admin ? PW : (urec && urec.pw) || "" }, bal: admin ? bal : { [me]: bal[me] || 0 }, users, links, inv });
    }
    if (path === "/api/users" && req.method === "POST") {
      if (!admin) return json(403, { error: "Admin only" });
      const u = String(b.username || "").trim().toLowerCase(), p = String(b.password || ""), fee = Math.min(50, Math.max(0, parseFloat(b.fee) || 0));
      if (!/^[a-z0-9_]{3,20}$/.test(u) || u === "admin") return json(400, { error: "Username: 3-20 letters, numbers or _ (not 'admin')." });
      if (p.length < 6) return json(400, { error: "Password needs at least 6 characters." });
      if (await db(["HGET", "users", u])) return json(400, { error: "That username already exists." });
      const salt = rand(16);
      await db(["HSET", "users", u, JSON.stringify({ salt, hash: hash(p, salt), pw: p, fee, t: Date.now() })]);
      return json(200, { ok: 1 });
    }
    if (path === "/api/users/password" && req.method === "POST") {
      if (!admin) return json(403, { error: "Admin only" });
      const u = String(b.u || ""), p = String(b.password || ""), x = await db(["HGET", "users", u]);
      if (!x) return json(404, { error: "User not found" });
      if (p.length < 6) return json(400, { error: "Password needs at least 6 characters." });
      const o = JSON.parse(x), salt = rand(16);
      await db(["HSET", "users", u, JSON.stringify(Object.assign(o, { salt, hash: hash(p, salt), pw: p }))]);
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
