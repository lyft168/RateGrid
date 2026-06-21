// ---- Homepage converter (uses window.ALL_RATES = rate per 1 SGD) ----
function initHome(){
  if(typeof ALL_RATES==='undefined') return;
  const from=document.getElementById('from'), to=document.getElementById('to'),
        amt=document.getElementById('hamt'), res=document.getElementById('hres'),
        sub=document.getElementById('hsub'), link=document.getElementById('hlink');
  const codes=Object.keys(ALL_RATES).sort();
  const opts=c=>codes.map(x=>`<option value="${x}" ${x===c?'selected':''}>${x} · ${NAMES[x]||x}</option>`).join('');
  from.innerHTML=opts('SGD'); to.innerHTML=opts('USD');
  function calc(){
    const f=from.value,t=to.value,a=parseFloat(amt.value||'0');
    const rate=ALL_RATES[t]/ALL_RATES[f];
    res.innerHTML=`<b>${(a*rate).toLocaleString(undefined,{maximumFractionDigits:2})} ${t}</b>`;
    sub.textContent=`1 ${f} = ${rate.toLocaleString(undefined,{maximumFractionDigits:6})} ${t}`;
    // link to a pair page when SGD is involved
    let target=null;
    if(f==='SGD'&&t!=='SGD') target='pair-'+t+'.html';
    else if(t==='SGD'&&f!=='SGD') target='pair-'+f+'.html';
    if(target){link.style.display='inline-block';link.href=target;link.textContent=`View ${f} → ${t} chart →`;}
    else {link.style.display='inline-block';link.href='rates.html';link.textContent='See all rates →';}
  }
  [from,to,amt].forEach(e=>e.addEventListener('input',calc));
  document.getElementById('hswap').addEventListener('click',()=>{const v=from.value;from.value=to.value;to.value=v;calc();});
  calc();
}

// ---- Rates directory region filter ----
function filterRegion(btn, region){
  document.querySelectorAll('.region-tabs button').forEach(b=>b.classList.remove('active'));
  btn.classList.add('active');
  document.querySelectorAll('.rate-card').forEach(c=>{
    const r=c.getAttribute('data-region'), common=c.getAttribute('data-common')==='1';
    c.style.display=(region==='All'||(region==='Common'&&common)||r===region)?'':'none';
  });
}

// ---- Pair page converter + chart ----
function fmt(n,dec){return Number(n).toLocaleString(undefined,{minimumFractionDigits:dec,maximumFractionDigits:dec});}
function initPair(){
  if(typeof PAIR==='undefined') return;
  const amtIn=document.getElementById('amt'),out=document.getElementById('out');
  const recalc=()=>{const v=parseFloat(amtIn.value||'0');out.textContent=fmt(v*PAIR.rate,PAIR.decimals);};
  if(amtIn){amtIn.addEventListener('input',recalc);recalc();}
  const canvas=document.getElementById('chart'); if(!canvas) return;
  const ctx=canvas.getContext('2d'); let range='1Y';
  function slice(){const all=PAIR.history;const days={'1M':30,'3M':91,'6M':182,'1Y':365,'5Y':99999}[range];
    if(range==='5Y')return all;const cutoff=new Date(all[all.length-1][0]);cutoff.setDate(cutoff.getDate()-days);
    return all.filter(p=>new Date(p[0])>=cutoff);}
  function draw(){const data=slice();const dpr=window.devicePixelRatio||1;const W=canvas.clientWidth,H=280;
    canvas.width=W*dpr;canvas.height=H*dpr;ctx.setTransform(dpr,0,0,dpr,0,0);ctx.clearRect(0,0,W,H);
    const vals=data.map(p=>p[1]);const min=Math.min(...vals),max=Math.max(...vals);
    const pad=(max-min)*0.12||max*0.01;const lo=min-pad,hi=max+pad;
    const x=i=>8+i*(W-16)/(data.length-1||1);const y=v=>H-24-(v-lo)/(hi-lo||1)*(H-40);
    ctx.strokeStyle='#e8edf6';ctx.lineWidth=1;
    for(let g=0;g<=3;g++){const yy=8+g*(H-32)/3;ctx.beginPath();ctx.moveTo(8,yy);ctx.lineTo(W-8,yy);ctx.stroke();}
    const grd=ctx.createLinearGradient(0,0,W,0);grd.addColorStop(0,'#6366f1');grd.addColorStop(1,'#0ea5e9');
    ctx.beginPath();data.forEach((p,i)=>{const xx=x(i),yy=y(p[1]);i?ctx.lineTo(xx,yy):ctx.moveTo(xx,yy);});
    ctx.lineTo(x(data.length-1),H-24);ctx.lineTo(x(0),H-24);ctx.closePath();
    const fill=ctx.createLinearGradient(0,0,0,H);fill.addColorStop(0,'rgba(79,70,229,.18)');fill.addColorStop(1,'rgba(14,165,233,.02)');
    ctx.fillStyle=fill;ctx.fill();
    ctx.beginPath();data.forEach((p,i)=>{const xx=x(i),yy=y(p[1]);i?ctx.lineTo(xx,yy):ctx.moveTo(xx,yy);});
    ctx.strokeStyle=grd;ctx.lineWidth=2.4;ctx.stroke();
    document.getElementById('mm-min').textContent='Low '+fmt(min,PAIR.decimals+2);
    document.getElementById('mm-max').textContent='High '+fmt(max,PAIR.decimals+2);
    document.getElementById('mm-range').textContent=data[0][0]+' → '+data[data.length-1][0];}
  draw();window.addEventListener('resize',draw);
  document.querySelectorAll('.ranges button').forEach(b=>b.addEventListener('click',()=>{
    document.querySelectorAll('.ranges button').forEach(x=>x.classList.remove('active'));
    b.classList.add('active');range=b.dataset.r;draw();}));
}
document.addEventListener('DOMContentLoaded',()=>{initHome();initPair();});
