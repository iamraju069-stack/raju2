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

const CSS = `:root{--bg:#eaf1f4;--ink:#0f1f2e;--mu:#55697a;--ln:#c3d3dc;--fd:#fff;--ac:#ffb300;--er:#b3261e}@media(prefers-color-scheme:dark){:root{--bg:#0c1721;--ink:#e6eef3;--mu:#93a8b7;--ln:#25394a;--fd:#12222f;--er:#ff8a80}}*{box-sizing:border-box}body{margin:0;background:var(--bg);color:var(--ink);font:16px/1.5 "Avenir Next","Segoe UI",system-ui,sans-serif;padding:26px 18px 48px;display:flex;justify-content:center}main{width:100%;max-width:460px}h1{font-size:1.7rem;line-height:1.2;margin:0 0 6px;overflow-wrap:anywhere}h2{font-size:1.05rem;margin:26px 0 8px}.mu{color:var(--mu);overflow-wrap:anywhere;font-size:.85rem}p.mu{font-size:1rem}input{width:100%;font:inherit;font-size:1.3rem;font-weight:700;padding:12px 14px;border:2px solid var(--ln);border-radius:12px;background:var(--fd);color:var(--ink)}input:focus{outline:3px solid var(--ac)}button{font:inherit;font-weight:700;border-radius:12px;padding:12px;cursor:pointer;border:2px solid var(--ink);background:transparent;color:var(--ink)}button:focus-visible{outline:3px solid var(--ac);outline-offset:2px}.pri{width:100%;background:var(--ac);border-color:var(--ac);color:#1a1200;margin-top:12px}.sec{width:100%;margin-top:10px}.chips{display:flex;gap:8px;flex-wrap:wrap;margin:10px 0}.chips button{padding:6px 15px;border-width:1.5px;border-radius:99px}.er{color:var(--er);font-weight:600}.qr{background:#fff;padding:14px;border-radius:14px;width:max-content;max-width:100%;margin:14px auto}.facts{text-align:center}.facts strong{font-size:1.4rem}textarea{width:100%;height:80px;font:.78rem monospace;word-break:break-all;background:var(--fd);color:var(--ink);border:1.5px solid var(--ln);border-radius:10px;padding:10px}table{width:100%;border-collapse:collapse;font-size:.9rem}td,th{text-align:left;padding:8px 6px;border-bottom:1px solid var(--ln);vertical-align:top}td button{padding:5px 10px;margin:0 6px 4px 0;font-size:.85rem}form.row{display:flex;gap:8px}form.row input{font-size:1rem}.card{background:var(--fd);border:1.5px solid var(--ln);border-radius:14px;padding:16px;margin:16px 0}.card h2{margin-top:0}#nf input{margin-bottom:10px;font-size:1rem}.sw{display:flex;gap:10px;margin:4px 0 6px}.swb{width:34px;height:34px;padding:0;border-radius:50%;border:2px solid var(--ln)}.swb.on{border-color:var(--ink);outline:2px solid var(--bg);outline-offset:-5px}.lk{background:var(--fd);border:1.5px solid var(--ln);border-left:8px solid var(--ln);border-radius:12px;padding:12px 14px;margin-bottom:12px;overflow-wrap:anywhere}.btns{display:flex;gap:8px;flex-wrap:wrap;margin-top:10px}.btns button,.top button{padding:6px 12px;font-size:.85rem}.top{display:flex;justify-content:space-between;align-items:center;gap:10px}select{width:100%;font:inherit;padding:10px;border-radius:10px;border:1.5px solid var(--ln);background:var(--fd);color:var(--ink);margin-bottom:10px}.bar{height:8px;border-radius:99px;margin-bottom:18px}[hidden]{display:none!important}`;

const head = (t, extra) => '<!DOCTYPE html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>' + esc(t) + "</title>" + (extra || "") + "<style>" + CSS + "</style></head><body><main>";
const tail = (s) => "</main>" + s + "</body></html>";

const PAYJS = `var $=function(i){return document.getElementById(i)};
var LU="${LN_USER}",LD="${LN_DOMAIN}",cur="";
function gj(u){return fetch(u).then(function(r){if(!r.ok)throw new Error("Request failed ("+r.status+")");return r.json()})}
function price(){return gj("https://mempool.space/api/v1/prices").then(function(j){if(!j.USD)throw 0;return +j.USD}).catch(function(){return gj("https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd").then(function(c){return +c.bitcoin.usd})})}
$("chips").onclick=function(e){var v=e.target.getAttribute("data-v");if(v)$("usd").value=v};
function cp(){return navigator.clipboard.writeText(cur).catch(function(){$("inv").select();document.execCommand("copy")})}
$("go").onclick=function(){
var er=$("er");er.hidden=true;
var usd=parseFloat(String($("usd").value).replace(",","."));
if(!(usd>0)){er.textContent="Enter an amount greater than 0.";er.hidden=false;return}
var b=$("go");b.disabled=true;b.textContent="Creating invoice...";
Promise.all([gj("https://"+LD+"/.well-known/lnurlp/"+LU),price()]).then(function(a){
var m=a[0],p=a[1];if(!m.callback)throw new Error("Lightning Address did not respond.");
var sats=Math.round(usd/p*1e8),ms=sats*1000;
if(sats<1)throw new Error("Amount is too small.");
if(m.minSendable&&ms<m.minSendable)throw new Error("Minimum is "+Math.ceil(m.minSendable/1000)+" sats.");
if(m.maxSendable&&ms>m.maxSendable)throw new Error("Maximum is "+Math.floor(m.maxSendable/1000)+" sats.");
return gj(m.callback+(m.callback.indexOf("?")<0?"?":"&")+"amount="+ms).then(function(i){
if(!i.pr)throw new Error(i.reason||"Could not create the invoice.");
cur=i.pr;$("inv").value=i.pr;
$("sats").textContent=sats.toLocaleString()+" sats";
$("rate").textContent="$"+usd.toFixed(2)+" at 1 BTC = $"+Math.round(p).toLocaleString();
var q=$("qr");q.innerHTML="";
if(window.QRCode)new QRCode(q,{text:"LIGHTNING:"+i.pr.toUpperCase(),width:240,height:240,correctLevel:QRCode.CorrectLevel.L});
$("s1").hidden=true;$("s2").hidden=false;window.scrollTo(0,0);
fetch("/api/log",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({slug:SLUG,usd:usd,sats:sats})}).catch(function(){});
});
}).catch(function(e){er.textContent=e.message||"Something went wrong.";er.hidden=false}).then(function(){b.disabled=false;b.textContent="Create invoice"});
};
$("cp").onclick=function(){var b=this;cp().then(function(){b.textContent="Copied";setTimeout(function(){b.textContent="Copy invoice"},1800)})};
$("oc").onclick=function(){cp().then(function(){location.href="cashme://";setTimeout(function(){if(!document.hidden)location.href="https://cash.app"},1500)})};
$("again").onclick=function(){$("s2").hidden=true;$("s1").hidden=false;$("usd").value=""};`;

function payPage(slug, link, req) {
  const name = link.name;
  const color = COLORS.includes(link.color) ? link.color : COLORS[0];
  const host = req.headers["x-forwarded-host"] || req.headers.host;
  const url = "https://" + host + "/p/" + slug;
  const img = "https://" + host + "/og/" + slug + ".png?v=" + (link.t || 1);
  const desc = link.note || "Pay with Bitcoin Lightning";
  const og = '<meta property="og:title" content="' + esc("Pay " + name) + '"><meta property="og:description" content="' + esc(desc) + '"><meta property="og:type" content="website"><meta property="og:url" content="' + esc(url) + '"><meta property="og:image" content="' + esc(img) + '"><meta property="og:image:type" content="image/png"><meta property="og:image:width" content="1200"><meta property="og:image:height" content="630"><meta name="twitter:card" content="summary_large_image"><meta name="twitter:image" content="' + esc(img) + '">';
  return head(name, og) +
    '<section id="s1"><div class="bar" style="background:' + color + '"></div><h1>' + esc(name) + '</h1><p class="mu">' + esc(link.note || "Pay with Bitcoin Lightning.") + " Enter an amount in US dollars.</p>" +
    '<label for="usd"><strong>Amount (USD)</strong></label><input id="usd" inputmode="decimal" placeholder="10.00" autocomplete="off">' +
    '<div class="chips" id="chips"><button type="button" data-v="5">$5</button><button type="button" data-v="10">$10</button><button type="button" data-v="25">$25</button><button type="button" data-v="50">$50</button><button type="button" data-v="100">$100</button></div>' +
    '<button class="pri" id="go" type="button">Create invoice</button><p class="er" id="er" role="alert" hidden></p></section>' +
    '<section id="s2" hidden><h1>Send your payment</h1><p class="facts"><strong id="sats"></strong><br><span class="mu" id="rate"></span></p>' +
    '<button class="pri" id="oc" type="button">Open Cash App</button><button class="sec" id="cp" type="button">Copy invoice</button>' +
    '<h2>How to pay from Cash App</h2><ol><li>Tap <b>Open Cash App</b>. The invoice is copied for you.</li><li>Open the <b>Bitcoin</b> section and tap <b>Send</b>.</li><li>Paste the invoice (or scan the QR code below). The amount fills in.</li><li>Check the amount and confirm.</li></ol>' +
    '<p class="mu">Menu names can differ between Cash App versions. Any Lightning wallet works too.</p>' +
    '<div class="qr"><div id="qr"></div></div><textarea id="inv" readonly aria-label="Lightning invoice"></textarea>' +
    '<button class="sec" id="again" type="button">Start over</button></section>' +
    tail('<script src="https://cdnjs.cloudflare.com/ajax/libs/qrcodejs/1.0.0/qrcode.min.js"></script><script>var SLUG=' + JSON.stringify(slug) + ";" + PAYJS + "</script>");
}

const ADMINJS = `var COLORS=${JSON.stringify(COLORS)},sel=0,DATA=null;
var $=function(i){return document.getElementById(i)};
function el(t,x,c){var e=document.createElement(t);if(x!=null)e.textContent=x;if(c)e.className=c;return e}
function api(m,u,b){return fetch(u,{method:m,headers:{"Content-Type":"application/json"},body:b?JSON.stringify(b):undefined}).then(function(r){return r.json().then(function(j){if(!r.ok){var e=new Error(j.error||"Error");e.status=r.status;throw e}return j})})}
function load(){api("GET","/api/links").then(function(d){$("login").hidden=true;$("app").hidden=false;DATA=d;links();hist()}).catch(function(e){if(e.status===401){$("login").hidden=false;$("app").hidden=true}else alert(e.message)})}
function btn(p,t,fn){var b=el("button",t);b.type="button";b.onclick=function(){fn(b)};p.appendChild(b)}
function links(){
var L=$("links");L.innerHTML="";var st={};
DATA.log.forEach(function(x){var s=st[x.slug]||(st[x.slug]={n:0,t:0});s.n++;s.t+=Number(x.usd)});
if(!DATA.links.length)L.appendChild(el("p","No links yet. Create your first one above.","mu"));
DATA.links.forEach(function(l){
var url=location.origin+"/p/"+l.slug,s=st[l.slug]||{n:0,t:0};
var c=el("div",null,"lk");c.style.borderLeftColor=l.color||COLORS[0];
c.appendChild(el("strong",l.name));
if(l.note)c.appendChild(el("div",l.note));
c.appendChild(el("div",url,"mu"));
c.appendChild(el("div",s.n+" invoice"+(s.n==1?"":"s")+" - $"+s.t.toFixed(2),"mu"));
var r=el("div",null,"btns");
btn(r,"Copy link",function(b){navigator.clipboard.writeText(url);b.textContent="Copied"});
btn(r,"Open",function(){window.open(url,"_blank")});
btn(r,"Preview image",function(){window.open("/og/"+l.slug+".png?v="+l.t,"_blank")});
btn(r,"Delete",function(){if(confirm("Delete this link?"))api("DELETE","/api/links?slug="+encodeURIComponent(l.slug)).then(load)});
c.appendChild(r);L.appendChild(c)});
var f=$("flt"),cur=f.value;f.innerHTML="";
var o=el("option","All links");o.value="";f.appendChild(o);
DATA.links.forEach(function(l){var o2=el("option",l.name);o2.value=l.slug;f.appendChild(o2)});
f.value=cur}
function hist(){
var H=$("hist");H.innerHTML="";var v=$("flt").value;
var rows=DATA.log.filter(function(x){return !v||x.slug===v}).slice(0,200);
if(!rows.length){var r=el("tr");var c=el("td","No invoices yet.","mu");c.colSpan=3;r.appendChild(c);H.appendChild(r)}
rows.forEach(function(x){var r=el("tr");r.appendChild(el("td",new Date(x.t).toLocaleString()));r.appendChild(el("td",x.name));r.appendChild(el("td","$"+Number(x.usd).toFixed(2)));H.appendChild(r)})}
var sw=$("sw");
COLORS.forEach(function(c,i){var b=el("button");b.type="button";b.className="swb"+(i==0?" on":"");b.style.background=c;b.setAttribute("aria-label","Color "+(i+1));b.onclick=function(){sel=i;[].forEach.call(sw.children,function(x,j){x.className="swb"+(j==i?" on":"")})};sw.appendChild(b)});
$("flt").onchange=hist;
$("out").onclick=function(){api("POST","/api/logout").then(load)};
$("lf").onsubmit=function(e){e.preventDefault();api("POST","/api/login",{password:$("pw").value}).then(function(){$("pw").value="";$("lerr").hidden=true;load()}).catch(function(x){$("lerr").textContent=x.message;$("lerr").hidden=false})};
$("nf").onsubmit=function(e){e.preventDefault();var n=$("nm").value.trim();if(!n)return;api("POST","/api/links",{name:n,note:$("nt").value.trim(),color:COLORS[sel]}).then(function(){$("nm").value="";$("nt").value="";load()}).catch(function(x){alert(x.message)})};
load();`;

const ADMIN = head("Admin", '<meta name="robots" content="noindex">') +
  '<section id="login" hidden><h1>Admin login</h1><form id="lf"><input id="pw" type="password" placeholder="Password" autocomplete="current-password"><button class="pri" type="submit">Log in</button></form><p class="er" id="lerr" hidden></p></section>' +
  '<section id="app" hidden><div class="top"><h1>Payment links</h1><button id="out" type="button">Log out</button></div>' +
  '<div class="card"><h2>Create a new link</h2><form id="nf"><input id="nm" placeholder="Link name (shown big on the preview)" maxlength="60"><input id="nt" placeholder="Short note (optional)" maxlength="100"><div class="sw" id="sw"></div><button class="pri" type="submit">Create link</button></form></div>' +
  '<h2>Your links</h2><div id="links"></div>' +
  '<h2>Invoice history</h2><select id="flt" aria-label="Filter by link"></select><table><thead><tr><th>Time</th><th>Link</th><th>USD</th></tr></thead><tbody id="hist"></tbody></table></section>' +
  tail("<script>" + ADMINJS + "</script>");

module.exports = async (req, res) => {
  const q = req.query || {};
  const path = "/" + [].concat(q.path || "").join("/");
  const json = (c, o) => { res.statusCode = c; res.setHeader("Content-Type", "application/json"); res.end(JSON.stringify(o)); };
  const html = (c, h) => { res.statusCode = c; res.setHeader("Content-Type", "text/html; charset=utf-8"); res.end(h); };
  try {
    const mo = path.match(/^\/og\/([a-z0-9-]+)\.png$/);
    if (mo) {
      const v = await db(["HGET", "links", mo[1]]);
      if (!v) return html(404, "Not found");
      const l = JSON.parse(v);
      const { ImageResponse } = await import("@vercel/og");
      const color = COLORS.includes(l.color) ? l.color : COLORS[0];
      const first = (l.name.match(/[A-Za-z0-9]/) || ["$"])[0].toUpperCase();
      const size = l.name.length <= 12 ? 150 : l.name.length <= 22 ? 110 : l.name.length <= 36 ? 80 : 60;
      const h = (type, style, children) => ({ type, props: { style, children } });
      const tree = h("div", { display: "flex", flexDirection: "column", justifyContent: "space-between", width: "100%", height: "100%", background: color, padding: "64px", color: "#0f1f2e" }, [
        h("div", { display: "flex", alignItems: "center", justifyContent: "space-between" }, [
          h("div", { display: "flex", alignItems: "center", justifyContent: "center", width: 120, height: 120, borderRadius: 60, background: "#0f1f2e", color: "#ffffff", fontSize: 64, fontWeight: 700 }, first),
          h("div", { display: "flex", fontSize: 38, fontWeight: 700 }, "Bitcoin Lightning")
        ]),
        h("div", { display: "flex", fontSize: size, fontWeight: 700, lineHeight: 1.05, letterSpacing: -3 }, l.name)
      ]);
      const buf = Buffer.from(await new ImageResponse(tree, { width: 1200, height: 630 }).arrayBuffer());
      res.statusCode = 200;
      res.setHeader("Content-Type", "image/png");
      res.setHeader("Cache-Control", "public, max-age=3600, s-maxage=86400");
      return res.end(buf);
    }
    if (path === "/admin") return html(200, ADMIN);
    const m = path.match(/^\/p\/([a-z0-9-]+)$/);
    if (m) {
      const v = await db(["HGET", "links", m[1]]);
      if (!v) return html(404, head("Not found") + "<h1>Link not found</h1>" + tail(""));
      return html(200, payPage(m[1], JSON.parse(v), req));
    }
    if (path === "/api/logout") {
      res.setHeader("Set-Cookie", "adm=; HttpOnly; Secure; SameSite=Strict; Path=/; Max-Age=0");
      return json(200, { ok: 1 });
    }
    if (path === "/api/login" && req.method === "POST") {
      if (!PW || (req.body || {}).password !== PW) return json(401, { error: "Wrong password" });
      const exp = String(Date.now() + 7 * 864e5);
      res.setHeader("Set-Cookie", "adm=" + exp + "." + sign(exp) + "; HttpOnly; Secure; SameSite=Strict; Path=/; Max-Age=604800");
      return json(200, { ok: 1 });
    }
    if (path === "/api/log" && req.method === "POST") {
      const b = req.body || {};
      const v = await db(["HGET", "links", String(b.slug)]);
      const usd = +b.usd, sats = +b.sats;
      if (!v || !(usd > 0) || !(sats > 0)) return json(400, { error: "Bad request" });
      await db(["LPUSH", "log", JSON.stringify({ slug: b.slug, name: JSON.parse(v).name, usd, sats, t: Date.now() })]);
      await db(["LTRIM", "log", 0, 999]);
      return json(200, { ok: 1 });
    }
    if (path === "/api/links") {
      if (!authed(req)) return json(401, { error: "Login required" });
      if (req.method === "GET") {
        const flat = (await db(["HGETALL", "links"])) || [];
        const links = [];
        for (let i = 0; i < flat.length; i += 2) links.push(Object.assign({ slug: flat[i] }, JSON.parse(flat[i + 1])));
        links.sort((a, b) => b.t - a.t);
        const log = ((await db(["LRANGE", "log", 0, 999])) || []).map((x) => JSON.parse(x));
        return json(200, { links, log });
      }
      if (req.method === "POST") {
        const name = String((req.body || {}).name || "").trim().slice(0, 60);
        if (!name) return json(400, { error: "Name is required" });
        const note = String((req.body || {}).note || "").trim().slice(0, 100);
        const color = COLORS.includes((req.body || {}).color) ? req.body.color : COLORS[0];
        let slug = name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 40) || rand(6);
        if (await db(["HGET", "links", slug])) slug += "-" + rand(4);
        await db(["HSET", "links", slug, JSON.stringify({ name, note, color, t: Date.now() })]);
        return json(200, { slug });
      }
      if (req.method === "DELETE") {
        await db(["HDEL", "links", String(q.slug || "")]);
        return json(200, { ok: 1 });
      }
    }
    return html(200, head("Payments") + "<h1>Payments</h1>" + tail(""));
  } catch (e) {
    return json(500, { error: "Server error: " + e.message });
  }
};
