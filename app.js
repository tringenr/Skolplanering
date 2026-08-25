let ADJ={};try{ADJ=JSON.parse(localStorage.getItem("skolAdj")||"{}")}catch(e){}
function saveAdj(){try{localStorage.setItem("skolAdj",JSON.stringify(ADJ))}catch(e){}}
function baseDays(w){return w>=5?7:w>=4?5:w>=3?3:w>=2?1:0}
function all(){const o=[];for(const k in D)D[k].ev.forEach((e,i)=>{
  const id=k[0]+"-"+e[0]+"-"+i, bw=W[e[2]]||0, a=ADJ[id]||{};
  o.push({id,child:k,date:e[0],subject:e[1],type:e[2],title:e[3],mat:e[4],
    baseW:bw, w:a.w!==undefined?a.w:bw, days:a.d!==undefined?a.d:baseDays(bw), adj:!!(a.w!==undefined||a.d!==undefined)});
});o.sort((a,b)=>a.date.localeCompare(b.date));return o}
let EV=all(); const T=td();
let span=2, who="all", selWeek=null, mode="cal", meas="effort", hideWknd=false;
let hiddenTypes=new Set();
let PREFS={};try{PREFS=JSON.parse(localStorage.getItem("skolPrefs")||"{}")}catch(e){}
if(PREFS.span!==undefined)span=PREFS.span;
if(PREFS.who)who=PREFS.who;
if(PREFS.mode)mode=PREFS.mode;
if(PREFS.meas)meas=PREFS.meas;
if(PREFS.hideWknd!==undefined)hideWknd=PREFS.hideWknd;
if(Array.isArray(PREFS.hiddenTypes))hiddenTypes=new Set(PREFS.hiddenTypes);
function saveP(){try{localStorage.setItem("skolPrefs",JSON.stringify({span,who,mode,meas,hideWknd,hiddenTypes:[...hiddenTypes]}))}catch(e){}}
function typeOn(t){return !hiddenTypes.has(t)}
const iso=d=>`${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,"0")}-${String(d.getDate()).padStart(2,"0")}`;
function dayLoad(){
  const L={};
  EV.forEach(e=>{
    if(!e.w)return;
    if(who!=="all"&&e.child!==who)return;
    if(meas==="count"){L[e.date]=(L[e.date]||0)+1;return}
    const n=e.days+1,each=e.w/n,d0=pd(e.date);
    for(let i=0;i<n;i++){const d=new Date(d0);d.setDate(d.getDate()-i);const k=iso(d);L[k]=(L[k]||0)+each}
  });
  return L;
}

function tube(child){
  const c=D[child], ev=EV.filter(e=>e.child===child&&e.w>0);
  const done=ev.filter(e=>pd(e.date)<T);
  const tot=ev.reduce((s,e)=>s+e.w,0), got=done.reduce((s,e)=>s+e.w,0);
  const W_=760,H=64,r0=6,pad=14;
  let x=pad+8,balls="";
  done.forEach(e=>{const r=r0+e.w*1.6;x+=r;balls+=`<circle cx="${x.toFixed(1)}" cy="32" r="${r.toFixed(1)}" fill="${c.col}" opacity="${.45+e.w*.11}"/>`;x+=r+2});
  const mile=[["2026-10-26","höstlov"],["2026-12-21","jullov"],["2027-02-15","sportlov"],["2027-06-10","slut"]];
  let ml="";
  const start=pd("2026-08-17"),end=pd("2027-06-11"),rng=end-start;
  mile.forEach(m=>{const p=pad+((pd(m[0])-start)/rng)*(W_-pad*2);ml+=`<line x1="${p.toFixed(0)}" y1="8" x2="${p.toFixed(0)}" y2="56" stroke="var(--line)" stroke-width="2"/><text x="${p.toFixed(0)}" y="6" text-anchor="middle" font-size="9" fill="var(--faint)">${m[1]}</text>`});
  return `<div class="tube-wrap"><div class="tube-head"><span class="who"><span class="dot" style="background:${c.col}"></span>${child}</span>
  <span class="num">${done.length} avklarade · insats ${Math.round(got)} av ${Math.round(tot)}</span></div>
  <svg viewBox="0 0 ${W_} ${H}"><rect x="${pad}" y="12" width="${W_-pad*2}" height="40" rx="20" fill="none" stroke="${c.col}" stroke-opacity=".55" stroke-width="1.5"/>${ml}${balls}</svg></div>`;
}

function weekRow(){
  const wks=[];
  let d,end;
  if(span==="year"){d=pd("2026-08-17");end=pd("2027-06-11")}
  else{
    d=pd(wkKey(T));
    if(span==="lov"){const lov=EV.find(e=>e.type==="lov"&&pd(e.date)>T);end=lov?pd(lov.date):new Date(T.getTime()+28*864e5)}
    else end=new Date(T.getTime()+span*7*864e5);
  }
  while(d<=end){wks.push(new Date(d));d.setDate(d.getDate()+7)}
  const dl=dayLoad(),load={};
  for(const k in dl)  {const wk=wkKey(pd(k));load[wk]=(load[wk]||0)+dl[k]}
  const kids=who==="all"?2:1;
  const base=meas==="count"?[2,4,7]:[3,6,10];
  const th=base.map(x=>x*kids);
  const unit=meas==="count"?"saker":"insats";
  document.getElementById("scaleHint").textContent=
    meas==="count"
    ? `Räknar antal uppgifter per vecka: 1–${th[0]} Amaze!, ${th[0]+1}–${th[1]} lagom, ${th[1]+1}–${th[2]} intensivt, över ${th[2]} WTF?.${kids===2?" Trösklarna är dubblade eftersom båda barnen visas.":""} Klicka på en vecka för att se innehållet.`
    : `Räknar arbetsinsats, där varje uppgifts vikt fördelas över arbetsperioden — ett prov tynger även dagarna före. Under ${th[0]} Amaze!, under ${th[1]} lagom, under ${th[2]} intensivt, däröver WTF?.${kids===2?" Trösklarna är dubblade eftersom båda barnen visas.":""} Klicka på en vecka.`;
  const nowK=wkKey(T);
  const ramp=who==="Gustav"?["--w0","--g1","--g2","--g3","--g4"]:who==="Syno"?["--w0","--s1","--s2","--s3","--s4"]:["--w0","--w1","--w2","--w3","--w4"];
  document.querySelectorAll(".scale .sc i").forEach((el,i)=>el.style.background=`var(${ramp[i]})`);
  return `<div class="weeks">`+wks.map(w=>{
    const k=wkKey(w),l=load[k]||0;
    const c=l===0?ramp[0]:l<=th[0]?ramp[1]:l<=th[1]?ramp[2]:l<=th[2]?ramp[3]:ramp[4];
    const dark=l>th[1];
    return `<button class="wk ${k===nowK?"now":""} ${k===selWeek?"sel":""}" data-k="${k}" style="background:var(${c});color:${dark?"#0a0d14":"var(--muted)"}" title="Vecka ${iw(w)} · ${meas==="count"?Math.round(l)+" uppgifter":"insats "+l.toFixed(1)}">${iw(w)}</button>`;
  }).join("")+`</div>`;
}

function matBlock(e){
  const m=MATLIB[e.child[0]+"|"+e.date+"|"+e.subject];if(!m)return "";
  let h=`<div class="stats">
    <div><p class="n">${m.nPages}</p><p class="l">sidor</p></div>
    <div><p class="n">${m.nSheets}</p><p class="l">arbetsblad</p></div>
    <div><p class="n">${m.nFilms}</p><p class="l">filmer</p></div>
    <div><p class="n">${m.nWeeks}</p><p class="l">veckor</p></div></div>
    <p style="margin:0 0 .5rem;font-size:.83rem;color:var(--muted)">${m.desc}</p>`;
  m.links.forEach(l=>{h+=`<div class="mat"><span class="ic">→</span><span>${l[0]}</span><a href="${l[1]}" target="_blank" rel="noopener">öppna</a></div>`});
  return h;
}

function detail(id){
  const e=EV.find(x=>x.id===id);if(!e)return;
  const d=pd(e.date),doc=(D[e.child].docs||{})[e.subject],t=D[e.child].teachers[e.subject];
  const st=new Date(d);st.setDate(st.getDate()-e.days);
  const o=document.createElement("div");o.className="ov";
  o.innerHTML=`<div class="ovc"><button class="x" id="cx">✕</button>
    <div class="evtitle" style="font-size:1.05rem">${e.title}</div>
    <div class="evmeta"><span class="dot" style="background:${D[e.child].col}"></span>${e.child} · ${e.subject}${t?" · "+t:""}</div>
    <div style="margin:.6rem 0"><span class="when" style="background:${COL[e.type]}">${LBL[e.type]}</span>
    <span style="font-size:.82rem;color:var(--muted);margin-left:.5rem">${DAY[d.getDay()]} ${d.getDate()} ${MON[d.getMonth()]}</span></div>
    ${matBlock(e)}
    ${e.baseW?`<div class="adj">
      <div class="row"><span>Vikt</span><b id="vw">${e.w}</b></div>
      <input type="range" min="0.5" max="10" step="0.5" value="${e.w}" id="rw">
      <label>Hur tungt är det? Standard för ${LBL[e.type].toLowerCase()} är ${e.baseW}.</label>
      <div class="row" style="margin-top:.7rem"><span>Arbetsperiod</span><b id="vd">${e.days} ${e.days===1?"dag":"dagar"}</b></div>
      <input type="range" min="0" max="21" step="1" value="${e.days}" id="rd">
      <label>Hur många dagar innan behöver man jobba? Pluggstart blir <b id="vs">${st.getDate()} ${MON[st.getMonth()]}</b>.</label>
      ${e.adj?`<button class="rst" id="rst">Återställ till standard</button>`:""}
    </div>`:""}
    ${doc?`<p style="margin:.9rem 0 0"><a href="${doc}" target="_blank" rel="noopener" style="color:var(--accent);text-decoration:none;font-size:.85rem">Öppna lärarens planeringsdokument →</a></p>`:""}
  </div>`;
  document.body.appendChild(o);
  const close=()=>o.remove();
  o.onclick=ev=>{if(ev.target===o)close()};
  o.querySelector("#cx").onclick=close;
  const rw=o.querySelector("#rw"),rd=o.querySelector("#rd");
  const apply=()=>{
    ADJ[id]={w:+rw.value,d:+rd.value};saveAdj();EV=all();
    o.querySelector("#vw").textContent=(+rw.value);
    o.querySelector("#vd").textContent=rd.value+(+rd.value===1?" dag":" dagar");
    const s2=new Date(d);s2.setDate(s2.getDate()-(+rd.value));
    o.querySelector("#vs").textContent=`${s2.getDate()} ${MON[s2.getMonth()]}`;
    render();
  };
  if(rw){rw.oninput=apply;rd.oninput=apply;}
  const r=o.querySelector("#rst");if(r)r.onclick=()=>{delete ADJ[id];saveAdj();EV=all();close();render()};
}

function actDetail(key){
  const[k,j]=key.split(":");
  const acts=ACT.filter(a=>a[1]===k&&(who==="all"||a[0]===who));
  const a=acts[+j];if(!a)return;
  const d=pd(a[1]);
  const o=document.createElement("div");o.className="ov";
  o.innerHTML=`<div class="ovc"><button class="x" id="cx">✕</button>
    <div class="evtitle" style="font-size:1.05rem">${a[3]}</div>
    <div class="evmeta"><span class="dot" style="background:${D[a[0]]?D[a[0]].col:"var(--faint)"}"></span>${a[0]} · aktivitet från Google Kalender</div>
    <p style="font-size:.85rem;color:var(--muted);margin:.6rem 0">${DAY[d.getDay()]} ${d.getDate()} ${MON[d.getMonth()]} · ${a[4]||a[2]}</p>
    ${a[5]?`<a href="${a[5]}" target="_blank" rel="noopener" style="color:var(--accent);text-decoration:none;font-size:.85rem">Öppna i Google Kalender →</a>`:""}
  </div>`;
  document.body.appendChild(o);
  o.onclick=ev=>{if(ev.target===o)o.remove()};
  o.querySelector("#cx").onclick=()=>o.remove();
}

function card(e){
  const d=pd(e.date),diff=Math.round((d-T)/864e5);
  const rel=diff===0?"idag":diff===1?"imorgon":diff>0?`om ${diff} d`:`${-diff} d sedan`;
  const doc=(D[e.child].docs||{})[e.subject];
  const t=D[e.child].teachers[e.subject];
  const start=e.days>0?new Date(d.getTime()-e.days*864e5):null;
  return `<div class="ev" data-id="${e.id}" style="cursor:pointer"><div class="evtop"><div>
    <div class="evtitle">${e.title}</div>
    <div class="evmeta"><span class="dot" style="background:${D[e.child].col}"></span>${e.child} · ${e.subject}${t?" · "+t:""}</div>
    </div><span class="when" style="background:${COL[e.type]}">${LBL[e.type]}</span></div>
    ${matBlock(e)}
    <div class="foot"><span>${DAY[d.getDay()]} ${d.getDate()} ${MON[d.getMonth()]} · ${rel}</span>
    ${start?`<span style="color:var(--accent)">· pluggstart ${start.getDate()} ${MON[start.getMonth()]}</span>`:""}
    ${e.w?`<span>· vikt ${e.w}${e.adj?" (justerad)":""}</span>`:""}
    ${doc?`<a href="${doc}" target="_blank" rel="noopener">källdokument</a>`:""}</div></div>`;
}

function range(){
  let from=T,to,label;
  if(span==="year"){
    to=pd("2027-06-12");label="Hela läsåret";
  }else if(span==="lov"){
    const lov=EV.find(e=>e.type==="lov"&&pd(e.date)>T);
    to=lov?new Date(pd(lov.date).getTime()+864e5):new Date(T.getTime()+28*864e5);
    label=lov?`Fram till ${lov.title.toLowerCase().split(" ")[0]} (${pd(lov.date).getDate()} ${MON[pd(lov.date).getMonth()]})`:"Kommande 4 veckor";
  }else{
    to=new Date(T.getTime()+span*7*864e5);label=`Kommande ${span} ${span===1?"vecka":"veckor"}`;
  }
  if(selWeek){from=pd(selWeek);to=new Date(from.getTime()+7*864e5);label=`Vecka ${iw(from)}`}
  document.getElementById("periodTitle").textContent=label;
  return[from,to];
}

function cal(){
  const[from,to]=range();
  let s=new Date(from);s.setDate(s.getDate()-((s.getDay()+6)%7));
  const evs={},acts={};
  EV.forEach(e=>{if(who!=="all"&&e.child!==who)return;if(!typeOn(e.type))return;(evs[e.date]=evs[e.date]||[]).push(e)});
  ACT.forEach(a=>{if(who!=="all"&&a[0]!==who)return;(acts[a[1]]=acts[a[1]]||[]).push(a)});
  const tk=iso(T);
  let h="";
  const nDays=hideWknd?5:7;
  while(s<to){
    h+=`<div class="calwk">Vecka ${iw(s)}</div><div class="cal" style="grid-template-columns:repeat(${nDays},minmax(0,1fr))">`;
    h+=["mån","tis","ons","tors","fre","lör","sön"].slice(0,nDays).map(d=>`<div class="ch">${d}</div>`).join("");
    for(let i=0;i<nDays;i++){
      const d=new Date(s);d.setDate(d.getDate()+i);const k=iso(d);
      const past=d<T;
      h+=`<div class="cd ${i>4?"we":""} ${k===tk?"today":""}" style="${past?"opacity:.45":""}">
        <div class="dn"><b>${d.getDate()}</b> ${MON[d.getMonth()]}</div>`;
      (evs[k]||[]).forEach(e=>{h+=`<button class="pill" data-id="${e.id}" style="background:${COL[e.type]}" title="${e.child} · ${e.subject}: ${e.title}">${e.subject!=="Skolan"?`<b style="font-weight:700">${e.child[0]} · ${e.subject}</b><br>`:""}${e.title}</button>`});
      (acts[k]||[]).forEach((a,j)=>{h+=`<button class="pill act" data-act="${k}:${j}">${a[2]} ${a[3]}</button>`});
      h+=`</div>`;
    }
    h+=`</div>`;
    s.setDate(s.getDate()+7);
  }
  return h+`<p class="hint">Klicka på en uppgift för att se material, källor och justera vikt och arbetsperiod. Streckade rutor är aktiviteter från kalendrarna Gustav och Syno. G eller S framför en uppgift visar vilket barn den gäller.</p>`;
}

function list(){
  const[from,to]=range();
  const ev=EV.filter(e=>{const d=pd(e.date);return d>=from&&d<to&&(who==="all"||e.child===who)&&typeOn(e.type)});
  if(!ev.length)return `<div class="empty">Inget planerat i perioden.</div>`;
  let h="",last="";
  ev.forEach(e=>{if(e.date!==last){const d=pd(e.date);h+=`<div class="daylbl">${DAY[d.getDay()]} ${d.getDate()} ${MON[d.getMonth()]}</div>`;last=e.date}h+=card(e)});
  return h;
}

function nextProv(){
  const kids=who==="all"?["Gustav","Syno"]:[who];
  let cards=[];
  kids.forEach(k=>{
    const provs=EV.filter(e=>["prov","NP","muntlig"].includes(e.type)&&pd(e.date)>=T&&e.child===k);
    if(!provs.length)return;
    const wk=wkKey(pd(provs[0].date));
    cards=cards.concat(provs.filter(e=>wkKey(pd(e.date))===wk));
  });
  if(!cards.length)return `<div class="empty">Inga kommande prov.</div>`;
  const bg=c=>c==="Gustav"?"rgba(224,103,142,.10)":"rgba(63,192,207,.10)";
  return `<div class="npgrid">`+cards.map(e=>{
    const d=pd(e.date),diff=Math.round((d-T)/864e5);
    const rel=diff===0?"idag":diff===1?"imorgon":`om ${diff} dagar`;
    const m=MATLIB[e.child[0]+"|"+e.date+"|"+e.subject];
    return `<div class="ev" data-id="${e.id}" style="cursor:pointer;border-color:${D[e.child].col};border-width:1.5px;background:${bg(e.child)};margin-bottom:0">
      <div class="evtop"><div>
        <div style="font-size:1.15rem;font-weight:700;color:${D[e.child].col};line-height:1.2">${e.subject}</div>
        <div style="font-size:.95rem;font-weight:600;margin-top:.15rem">${DAY[d.getDay()]} ${d.getDate()} ${MON[d.getMonth()]} <span style="color:var(--accent)">· ${rel}</span></div>
        <div class="evmeta" style="margin-top:.3rem"><span class="dot" style="background:${D[e.child].col}"></span>${e.child} · ${e.title}</div>
        ${m?`<div class="evmeta" style="margin-top:.3rem">${m.desc} — ${m.links.length} källor, klicka för underlag</div>`:""}
      </div><span class="when" style="background:${COL[e.type]}">${LBL[e.type]}</span></div>
    </div>`;
  }).join("")+`</div>`;
}
function render(){
  document.getElementById("tubes").innerHTML=(who==="all"?["Gustav","Syno"]:[who]).map(tube).join("");
  document.getElementById("nextprov").innerHTML=nextProv();
  document.getElementById("weeks").innerHTML=weekRow();
  document.getElementById("list").innerHTML=(mode==="cal"&&span!=="year")?cal():list();
  document.getElementById("seg2").innerHTML=document.getElementById("seg").innerHTML;
  document.querySelectorAll("[data-id]").forEach(b=>b.onclick=ev=>{
    if(ev.target.tagName==="A")return;
    detail(b.dataset.id);
  });
  document.querySelectorAll("[data-act]").forEach(b=>b.onclick=()=>actDetail(b.dataset.act));
  document.querySelectorAll(".wk").forEach(b=>b.onclick=()=>{selWeek=selWeek===b.dataset.k?null:b.dataset.k;render();window.scrollTo({top:document.getElementById("periodTitle").offsetTop-20,behavior:"smooth"})});
}
function setSpan(v){span=(v==="lov"||v==="year")?v:+v;selWeek=null;saveP();document.querySelectorAll("#seg button, #seg2 button").forEach(b=>b.classList.toggle("on",b.dataset.w===v));render();document.querySelectorAll("#seg button, #seg2 button").forEach(b=>b.classList.toggle("on",b.dataset.w===v))}
document.getElementById("seg").onclick=e=>{if(e.target.dataset.w)setSpan(e.target.dataset.w)};
document.getElementById("seg2").onclick=e=>{if(e.target.dataset.w)setSpan(e.target.dataset.w)};
document.getElementById("meas").onclick=e=>{if(!e.target.dataset.m)return;meas=e.target.dataset.m;saveP();document.querySelectorAll("#meas button").forEach(b=>b.classList.toggle("on",b===e.target));render()};
document.getElementById("tfilter").onclick=e=>{
  const b=e.target.closest("button");if(!b)return;
  if(b.dataset.t==="all"){hiddenTypes.clear()}
  else{const ts=b.dataset.t.split(",");const anyOn=ts.some(t=>!hiddenTypes.has(t));ts.forEach(t=>anyOn?hiddenTypes.add(t):hiddenTypes.delete(t))}
  document.querySelectorAll("#tfilter button[data-t]").forEach(x=>{
    if(x.dataset.t==="all")return;
    x.classList.toggle("off",x.dataset.t.split(",").every(t=>hiddenTypes.has(t)));
  });
  saveP();
  render();
};
document.getElementById("mode").onclick=e=>{
  if(e.target.id==="wknd"){hideWknd=!hideWknd;saveP();e.target.textContent=hideWknd?"Visa helger":"Dölj helger";e.target.classList.toggle("on",hideWknd);render();return}
  if(!e.target.dataset.m)return;mode=e.target.dataset.m;saveP();document.querySelectorAll("#mode button[data-m]").forEach(b=>b.classList.toggle("on",b===e.target));render()};
document.getElementById("who").onclick=e=>{if(!e.target.dataset.c)return;who=e.target.dataset.c;saveP();document.querySelectorAll("#who button").forEach(b=>b.classList.toggle("on",b===e.target));render()};
(function(){
  const sv=String(span);
  document.querySelectorAll("#seg button, #seg2 button").forEach(b=>b.classList.toggle("on",b.dataset.w===sv));
  document.querySelectorAll("#meas button").forEach(b=>b.classList.toggle("on",b.dataset.m===meas));
  document.querySelectorAll("#mode button[data-m]").forEach(b=>b.classList.toggle("on",b.dataset.m===mode));
  document.querySelectorAll("#who button").forEach(b=>b.classList.toggle("on",b.dataset.c===who));
  const w=document.getElementById("wknd");
  if(w){w.textContent=hideWknd?"Visa helger":"Dölj helger";w.classList.toggle("on",hideWknd);}
  document.querySelectorAll("#tfilter button[data-t]").forEach(x=>{
    if(x.dataset.t==="all")return;
    x.classList.toggle("off",x.dataset.t.split(",").every(t=>hiddenTypes.has(t)));
  });
  render();
})();
(function(){
  const cv=document.getElementById("stars"),cx=cv.getContext("2d");
  function draw(){
    cv.width=innerWidth;cv.height=innerHeight;
    cx.clearRect(0,0,cv.width,cv.height);
    const n=Math.round(cv.width*cv.height/9000);
    for(let i=0;i<n;i++){
      const x=Math.random()*cv.width,y=Math.random()*cv.height,r=Math.random();
      cx.beginPath();cx.arc(x,y,r<.85?.7:1.3,0,7);
      cx.fillStyle=r<.75?"rgba(232,235,242,"+(0.08+Math.random()*0.25)+")":r<.92?"rgba(242,163,60,"+(0.15+Math.random()*0.3)+")":"rgba(140,180,255,"+(0.15+Math.random()*0.25)+")";
      cx.fill();
    }
  }
  draw();addEventListener("resize",draw);
})();
