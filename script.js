const canvas=document.getElementById('canvas');
const ctx= canvas.getContext('2d');
const typebox= document.getElementById('typebox');
const clearbtn=document.getElementById('clearbtn');
const downloadbtn= document.getElementById('downloadbtn');
const soundbtn= document.getElementById("sbtn");
const soundmenu = document.getElementById("soundmenu");
const rainVolume=document.getElementById("rainVolume");
const blossomVolume=document.getElementById("blossomVolume");
const forestVolume =document.getElementById("forestVolume");
const W=860;
const H=440;
canvas.width= W;
 canvas.height=H;
const VOWELS= new Set(['a','e','i','o','u','y']) //one extra vowel made by me :}
const PALETTE={
    stems:
    ['#6e4f45','#7d5b50','#8c6759','#735247'
], leaves:[
    '#b7e4a8',
    '#c9efb6','#d7f6c8','#a9db98','#dff7d7'
],
flowers:[
   '#ffd9e8','#ffc2d8','#ffb3cf',
   '#f8a7c4','#f6c6d9',
   '#f9b6cf','#f4a9c7',

], flowerCenter: ['#fff5aa','#ffe680','#fff3c4','#ffe08f']
};
const rain=new Audio("r.mp3")
const blossom=new Audio("s.mp3")
const forest=new Audio("f.mp3")
rain.loop=true;
blossom.loop=true;
forest.loop= true;
rain.volume= 0;
blossom.volume=0;
forest.volume=0.4;
const modes=['sunlight','rain','breeze','blossom','night'];
let currentMode='sunlight';
const mode_sky={
    sunlight:{t:'#dff4ff', m:'#fef8fb', b:'#ffeef6',g:'#ccb392',ge: '#b99973'},

    rain: {t:'#9fb4c4', m:'#c7d3dc' ,b:'#dfe6ea',g :'#8f7c63', ge:'#75664f'},
    breeze :{t:'#cdeeff',
        m:'#f2fbf3', b:'#eafbe9',g:'#c9b083',ge:'#ad8f64'
    } ,blossom:
    {t:'#ffd6e6', m:'#ffe9f0', b:'#fff2f7',g:'#d8b98f',ge:'#c19a6f'}, night:{t:'#0c1730',m:'#1b2545',b: '#2c2550',g:'#3a2e42' ,ge:'#2a2131'}};
const mode_audio={sunlight:{rain:0, blossom:0, forest:0.4},
rain:{rain:0.6,blossom:0.1, forest:0.1},
breeze:{ rain:0, blossom:0.1, forest:0.5},
blossom: {rain:0,blossom:0.6, forest: 0.2},
night:{rain:0, blossom:0, forest:0.3} //add custom songs but not now like they only sound here not at snd sec
};
let skyNow=Object.assign({}, mode_sky.sunlight);
let skyTarget=Object.assign({},mode_sky.sunlight);
let audioTarget=Object.assign({},mode_audio.sunlight);
// i will use ai for help in hex rgb conversion as i am not well versed in this 
function hexToRgb(hex){const n=parseInt(hex.slice(1),16);
    return [(n>>16) &255,(n>>8)&255,n&255];
}
function rgbToHex(r,g,b){
return '#' +[r,g,b].map(v=>Math.round(clamp(v,0,255)).toString(16).padStart(2,'0')).join('');} function lerpColor(a,b,t){
    const ca=hexToRgb(a), cb=hexToRgb(b);
    return rgbToHex(ca[0]+ (cb[0]-ca[0])*t,ca[1]+(cb[1] -ca[1]) *t,ca[2]+(cb[2]-ca[2])* t);
}
function updateSky() {const speed=0.03;
    for (const  k in skyTarget) skyNow[k]= lerpColor(skyNow[k],skyTarget[k] ,speed) ;}
function updateAudioFade(){
    const speed=0.01;
    rain.volume= clamp(rain.volume+(audioTarget.rain-rain.volume)* speed,0,1);
    blossom.volume=clamp (blossom.volume+(audioTarget.blossom-blossom.volume)* speed,0,1);
    forest.volume=clamp (forest.volume+(audioTarget.forest-forest.volume)* speed,0,1);
    rainVolume.value=rain.volume;
    blossomVolume.value=blossom.volume;
    forestVolume.value=forest.volume;
}
function applyMode(mode){ currentMode=mode; skyTarget=mode_sky[mode]; audioTarget=mode_audio[mode]
;}
function  scheduleNextMode(){
    const wait =rnd(20000,45000); // imo 20 to 45 sec is fast like 10 time less minecraft
    setTimeout(()=>{
        let next=pick(modes); while (next===currentMode) next=pick(modes);
        applyMode(next); scheduleNextMode();
    
    }, wait
    );
}

//fuckng math once again for particle efect
let particles= [];

let stars=[];
for(let i=0; 
    i<40;
    i++
){ stars.push({ x:rnd(0,W), y:rnd(0,H*0.6),r:rnd(0.6,1.7), phase: rnd(0,Math.PI*2)});}
function spawnParticle(){
if (currentMode==='rain' &&Math.random()<0.5){
    particles.push({type:'rain',x:rnd(0,W),y:-10, vx:-0.6, vy:rnd(8,16),len:rnd(8,16), alpha:0.5});
}



if (currentMode==='breeze' &&Math.random()<0.08){
    particles.push({ type:'leaf',x:-10,y:rnd(H*0.2,H*0.8), vx:rnd(1.5,3), vy:rnd(-0.3,0.3),rot:rnd(0,Math.PI*2), spin:rnd(-0.05,0.05), size:rnd(6,10), color:pick(PALETTE.leaves)});
}
if( currentMode==='blossom' && Math.random()<0.10){particles.push({type:'petal',x:rnd(0,W), y :-10,vx:rnd(-0.4,0.4), vy:rnd(0.6,1.4), rot:rnd(0,Math.PI*2),
spin:rnd(-0.04,0.04),size:rnd(5,9), color:pick(PALETTE.flowers)});
}
}

function updateParticles(){
    for (const p of particles ){
        p.x+=p.vx; p.y+=p.vy;
        if  (p.rot!==undefined) p.rot+=p.spin;
    }
particles=particles.filter(p=> p.y<H+20 && p.x>-20 && p.x<W+20);
}
function drawParticles(){
    for (const p of particles) { if (p.type==='rain'){
        ctx.strokeStyle='rgba(200,220,235,'+p.alpha+')';
        ctx.lineWidth= 1.2;
        ctx.beginPath();
ctx.beginPath(); ctx.moveTo(p.x,p.y) ;
ctx.lineTo(p.x+p.vx* 3,p.y+p.len);
ctx.stroke();
    }
else {
    ctx.save();
    ctx.translate(p.x,p.y);
    ctx.rotate(p.rot);
    ctx.fillStyle =p.color;
    ctx.globalAlpha =0.85;
ctx.beginPath();
ctx.ellipse(0,0 ,p.size *0.5,p.size*0.25,0,0,Math.PI*2);
ctx.fill();
ctx.globalAlpha =1 ;
 ctx.restore();}}
}
/*will keep this feature rare so thers more to explore*/
let sparkles=[];
function trySpawnSpecialEffect(){
if (Math.random() >0.003) return;
const allFlowers= [];
for (const p of plants) 
    allFlowers.push(...p.flowers);
if(!allFlowers.length) return;
const f=pick(allFlowers);
for( let i=0; i<10; 
    i++
){sparkles.push({
    x:f.x,  y:f.y, vx:rnd(-1.2,1.2) ,vy:rnd(-1.6,-0.5),
life:1, size:rnd(2,4)});

}

}
function updateSparkles(){
    for(const s of sparkles){
        s.x+=s.vx; 
        s.y+=s.vy; s.life-=0.02;
    } sparkles= sparkles.filter(s=>s.life >0);
}
function drawSparkles(){ for(const s of sparkles){
    ctx.save(); ctx.globalAlpha =Math.max(0,s.life);  
ctx.fillStyle='#fff3b0';  ctx.beginPath();
ctx.arc (s.x,s.y,s.size,0,Math.PI*2)// NOW I M GOOD IN ARCS
ctx.fill(); ctx.restore();
} 
}
function drawStars() {
    if (currentMode!== 'night') return; const t=Date.now()/600;
    ctx.fillStyle="#fff" 
    for ( const s of stars){ const tw= 0.5 +0.5 * Math.sin(t+s.phase); ctx.globalAlpha=0.3+tw*0.6;
        ctx.beginPath();
        ctx.arc(s.x,s.y,s.r,0,Math.PI*2); ctx.fill();
} ctx.globalAlpha =1;

} 
// empty left side so putting ts  stuff here
let wallet={leaves:0, flowers:0};
let unlocked={sunflower:false, dandelion: false, 
     blossomtree:false
}; 

const savedWallet=localStorage.getItem("gardenWallet");
if(savedWallet) wallet=JSON.parse(savedWallet);
const savedUnlocks  =localStorage.getItem("gardenUnlocks");

if (savedUnlocks ) unlocked=Object.assign(unlocked ,JSON.parse(savedUnlocks))
const shopItems =[{id:'sunflower' ,cost:{leaves:30, flowers:5}},
    {id:'dandelion' , cost :{leaves:18, 
flowers:3}},
    {id:'blossomtree',cost:{ leaves:45, flowers:9}}
];

function saveWallet(){
    localStorage.setItem("gardenWallet" ,JSON.stringify(wallet)); // for the stringification i asked chatgpt as without it thhe thing dissapears and no use of local storage
    localStorage.setItem("gardenUnlocks", JSON.stringify(unlocked));
}
function renderShop(){
    document.getElementById('walletLeaves').textContent=wallet.leaves;
    document.getElementById('walletFlowers').textContent =wallet.flowers;
    document.querySelectorAll('.buybtn').forEach (btn=>{ const id=btn.dataset.id;
         const item=shopItems.find(i=>i.id===id);
         if(unlocked[id]) {
            btn.textContent='Unlocked';
         btn.disabled= true; } else{const canAfford=  wallet.leaves>=item.cost.leaves && wallet.flowers>=item.cost.flowers; btn.disabled=!canAfford}

    }

    );
}
function buyItem(id){
    const item= shopItems.find(i=>i.id===id);
    if (!item|| unlocked[id]) return;
    if (wallet.leaves>= item.cost.leaves&& wallet.flowers>=item.cost.flowers){ wallet.leaves-=item.cost.leaves; wallet.flowers -= item.cost.flowers;
unlocked[id] =true; 
saveWallet();
renderShop();
} 
}
//fuckin math again #2 
function drawSunflower(x,y){ ctx.save();
    ctx.strokeStyle='#4b7f3a';  ctx.lineWidth ='4'; ctx.beginPath(); ctx.moveTo(x,y); 
    ctx.lineTo(x,y-73); ctx.stroke();
ctx.translate(x,y-81);
for (let i =0;i<16; i++){
    ctx.save(); ctx.rotate((i/16)* Math.PI *2);
     ctx.fillStyle='#ffcc33'; 
    ctx.beginPath(); ctx.ellipse
    (16,0,12,6,0,0,Math.PI*2); ctx.fill(); ctx.restore();
    
} ctx.fillStyle='#7a4a24'; ctx.beginPath(); ctx.arc(0,0,10,0,Math.PI*2); ctx.fill();
 ctx.restore ();
} 


// bro was invisible because of sky color and was looking on night only
//todo fix it later 
function drawDandelion(x,y){
ctx.save();
ctx.strokeStyle= '#6e8f4f' ;ctx.lineWidth= 2.6; ctx.beginPath(); ctx.moveTo(x,y); 
ctx.lineTo(x, y-55 ); 
ctx.stroke(); ctx.translate(x,y-60); for(
    let i=0; i<24;i++){ const a=(i/24)*Math.PI*2; 
        ctx.strokeStyle=' rgba(255,255,255,0.85)'; 
        ctx.lineWidth=1; ctx.beginPath();
        ctx.moveTo(0,0); ctx.lineTo(Math.cos(a)*13,Math.sin(a)*13)
   ; ctx.stroke(); } ctx.fillStyle ='#fff9e6'; 
    ctx.beginPath(); ctx.arc(0,0,4,0,Math.PI*2); ctx.fill(); 
    ctx.restore();

} function drawBlossomTree(x,y){ ctx.save();
    ctx.strokeStyle='#6e4f45'; ctx.lineWidth=5; ctx.beginPath();
ctx.moveTo(x,y);    ctx.lineTo(x-6,y-50); ctx.stroke(); ctx.lineWidth =2.99999; ctx.beginPath();
ctx.moveTo(x-6,y-50); ctx.lineTo(x-24,y-72);
ctx.moveTo(x-6,y-50); ctx.lineTo(x+14,y-68);
    ctx.stroke(); // gonna try the ts for 1st time can be bit ugly 
   const clusters=[[x-24,y-72],[x+14,y-68],[x-6,y-58]];
   for(const c of  clusters) { for(let i=0;i<6;i++){
    ctx.fillStyle ="#ffc2d8"; ctx.globalAlpha=.85;
    ctx.beginPath() ;ctx.ellipse(c[0]+ rnd(-10,10),c[1]+ rnd(-8,8),6,4,rnd(0,Math.PI),0,Math.PI*2); ctx.fill();


   }
}
ctx.globalAlpha =1;
ctx.restore();} 
function drawSpecialPlants(){
    if(unlocked.sunflower) drawSunflower(W-70,H-18);
        if(unlocked.dandelion) drawDandelion(W-30, H-18);
            if(unlocked.blossomtree) drawBlossomTree(W-130,H-18);
}



let boost=0;
let boostLastTick= Date.now();
function updateBoost(typedFast){
    const now= Date.now(); const dt =(now-boostLastTick)/1000;
    boostLastTick =now; if (typedFast) {
        boost= clamp(boost+ 0.09,0,1);} else{
    
 boost =clamp(boost-dt *0.15,0,1);}} function drawBoostMeter(){
    if(boost<= 0.02) return; const 
barW = 140,barH= 6; 
const x=W-barW-14,y =14; ctx.save();
ctx.globalAlpha =0.86;
ctx.fillStyle='rgba(255,255,255,0.25)';
const grad=ctx.createLinearGradient(x,0,x+barW,0);
grad.addColorStop (0,'#ffd166'); 
grad.addColorStop(1,'#ff6fa5');
ctx.fillStyle =grad; ctx.fillRect(x,y,barW*boost,barH); 
ctx.restore();
 }
let plants=[]; 
let lastTime=Date.now();
let  charCount= 0;
let totalStems=0;
let totalLeaves=0;
let  totalFlowers=0;
let lastTypedAt=Date.now();
function applyDecay() {
    const idleMs= Date.now()- lastTypedAt; if(idleMs <15000 ) return;
    const decayAmount= 0.00025;
    for(const plant of plants){
    wiltSeg(plant.root,decayAmount);
    for(const f of plant.fallen) f.wilt=
    clamp((f.wilt||0)+decayAmount,0,1);    }
} function wiltSeg( seg,amount){
    seg.wilt=clamp((seg.wilt|| 0)+amount,0,1);
    for (const leaf of seg.leaves)leaf.wilt= clamp((leaf.wilt|| 0 )+ amount,0,1);
if (seg.flower)seg.flower.wilt= clamp((seg.flower.wilt||0)+amount,0,1);
for (const c of seg.children) 
    wiltSeg(c,amount);

}
function pick(arr) {
    return arr[Math.floor(Math.random() * arr.length)];}
function rnd( a,b){
    return a+ Math.random()* (b-a);
}
function clamp( v,a,b ){
    return Math.max(a, Math.min(b,v));
}// in the class segment block i will use claude as i am not familiar with cos sin math in js and it is essential part so yes i will use claude for help in debug
 class Segment{
    constructor(x,y,angle,len,thick,color,depth){
        this.x =x;
        this.y =y;
        this.angle=angle;
        this.len=len;
        this.thick=thick;
        this.color=color;
        this.depth=depth;
        this.ex= x+ Math.cos(angle) *len;
        this.ey=y+ Math.sin(angle) *len;

        this.children=[];
        this.leaves=[];
        this.flower=null;
    }

} class Plant{
    constructor(x) { 
        this.x=x;
        this.root=null;
        this.tips=[]
        this.LetterFreq={};
        this.stemColor=pick(PALETTE.stems);
        this.leafColor= pick(PALETTE.leaves);
        this.flowerColor=pick(PALETTE.flowers);
        this.flowerCenter= 
  pick(PALETTE.flowerCenter);
  this.flowers=[];
  this.fallen=[];
            this.init();
    }
    init(){
        const baseY=H-28;
        const angle=-Math.PI/ 2 +rnd(-0.08,0.08);
        this.root=new Segment(this.x, baseY,angle, rnd(28,38), 5, 
    this.stemColor,0);
    this.tips=[this.root];
    totalStems++;


// todo in my final touch make it look more real
    } 
grow(ch,speed ){if (!this.tips.length) return;
    this.LetterFreq[ch]=(this.LetterFreq[ch] ||0)+1;
const isVowel=VOWELS.has(ch.toLowerCase());
const isSpace=ch ===' ';

const freq=this.LetterFreq[ch]|| 1 ;
const tip=
this.tips[Math.floor(Math.random() * 
this.tips.length)];

if (ch==='!'){ this.burst(); return;}
if(ch ==='?'){ this.curl(tip); return;}
if (ch==='.'){this.dropLeaf(); return; }
if (isSpace|| (tip.depth>2 && Math.random() <0.4)
) {this.branch(tip);} else if (isVowel &&  Math.random() <0.7) {
    if (!tip.flower) {
        tip.flower={
            x:tip.ex,
            y:tip.ey,
            r: clamp(4 +freq*0.7, 5, 14),color:this.flowerColor,
            center:this.flowerCenter, 
            petals:5+ Math.floor(freq/ 2), rot:Math.random()* Math.PI}; 
                totalFlowers++;
                wallet.flowers++; 
                saveWallet();
                this.flowers.push(tip.flower);
        }
    } else{ this.extend(tip,speed,freq);
} if (Math.random()> 0.5) this.addLeaf(tip);

}extend(tip,speed,freq) {
    const wbl=rnd(-0.18, 0.18);
    const NewAngle=tip.angle+ wbl;
    const bLen=clamp(20+ speed*0.4 +freq *1.6,14,49);
    const len= rnd(bLen*0.8,bLen*1.2);
    const thick=Math.max(1,tip.thick -0.6 );
    const child=new Segment(tip.ex, tip.ey,NewAngle,len,thick,this.stemColor, tip.depth +1); tip.children.push(child);
    const idx= this.tips.indexOf(tip);
    if(idx !== -1) 
        this.tips.splice(idx,1,child);
    totalStems++;

}
branch(tip){
    if (tip.depth> 14) return;
    const spread=rnd(0.3,0.7);
    const  angles=[tip.angle-spread, tip.angle+spread ];
    const newTips=[];
    for (const angle of  angles){
    const len =rnd(18,32);
    const thick= Math.max(1, tip.thick- 1); 

    const  child=new Segment(tip.ex, 
        tip.ey,
        angle,
        len,
        thick,
        this.stemColor, 
        tip.depth+1);
    tip.children.push(child);
    newTips.push(child);
    totalStems++;
    
    } const idx= this.tips.indexOf(tip) ;
    if (idx !==-1)
    this.tips.splice(idx ,1,...newTips);
}
addLeaf(seg){ //time to take claude help a bit its
    const t=rnd(0.3,0.9);
    const bx =seg.x +Math.cos(seg.angle)*seg.len *t;
    const by =seg.y+Math.sin(seg.angle)*seg.len *t;
    const side=Math.random()<0.5 ? 1:-1 ; //posibly in next update add leaf dew too when i learn js math as taking claude help fell unproductiv
    const lAngle=seg.angle+ side *rnd(0.6,1.2);
    const lLen=rnd(12,27);
seg.leaves.push({x:bx,y:by,angle: lAngle, len:lLen, 
    color:this.leafColor});totalLeaves ++;
wallet.leaves++; saveWallet();
} 
burst() {
    if (!this.flowers.length) return;
    const f=pick(this.flowers)
f.r =clamp(f.r *1.4,5,26);
 f.petals=Math.min(f.petals+2,14);
}
curl(tip) { const dir=Math.random()< 0.5? 1:-1;

    const hookAngle= tip.angle +dir*rnd(0.9,1.3) ;
    const len=rnd(10, 16);
    const thick=Math.max(1,tip.thick -0.7);
    const child=new Segment(tip.ex,tip.ey ,hookAngle, len,thick,this.stemColor,tip.depth +1);
    tip.children.push(child);
    const idx =this.tips.indexOf(tip);
    if (idx!==-1) this.tips.splice(idx,1,child); totalStems++;

}
dropLeaf() {  //fucking circle math again
    const gx=this.x+rnd(-40,40);
    const gy=H -20+rnd(-4,4) ;
this.fallen.push({x:gx,y:gy,angle:rnd(0,Math.PI*2),len:rnd(12,20),color:this.leafColor}); totalLeaves++; wallet.leaves++; saveWallet();

}

    draw(){ this.drawSeg(this.root);
    for (const lf  of this.fallen) this.drawLeaf(lf);}
    drawSeg(seg){
        const wilt =seg.wilt||0; ctx.save();
        ctx.globalAlpha=1-wilt*0.6;

        ctx.strokeStyle= wilt>0.5 ?'#8a7860' : seg.color;
        ctx.lineWidth =seg.thick ;
        ctx.lineCap='round';
        ctx.beginPath();
        ctx.moveTo(seg.x,seg.y);
        ctx.lineTo(seg.ex,seg.ey);
        ctx.stroke();
        ctx.restore();
        for (const leaf of seg.leaves)
        this.drawLeaf(leaf);
       
    for (const child of seg.children )
    this.drawSeg(child);
 if(seg.flower) this.drawFlower(seg.flower);

// todo draw for cherry bolsom to
    } drawLeaf(leaf){
        const wilt=leaf.wilt||0;
        ctx.save();
        ctx.translate(leaf.x,leaf.y)
        ctx.rotate(leaf.angle);
        ctx.fillStyle =wilt>0.5 ? '#c9a15a':leaf.color;
    ctx.globalAlpha=0.88* (1-wilt *0.5 );
ctx.beginPath();
         ctx.ellipse(leaf.len*0.5,
            0,
            leaf.len *0.5, leaf.len * 0.18 ,
            0,0,
            Math.PI *2
         )  ; ctx.fill();
        ctx.globalAlpha = 1;
    ctx.restore();  } drawFlower(f){
        const wilt=f.wilt || 0;
        ctx.save();
        ctx.translate(f.x,f.y)
        ctx.globalAlpha =1-wilt*0.7;        for (let i=0;i<f.petals; i++){ctx.save();

//some feature to be added here
            ctx.rotate(f.rot + (i/f.petals)*Math.PI* 2);
            ctx.fillStyle=f.color;
            ctx.globalAlpha= 0.9; ctx.beginPath();
            ctx.ellipse(f.r*1.11, 0,f.r* 0.55,
                f.r*0.35, 0 , 0 ,Math.PI *2);
                ctx.fill();
                ctx.globalAlpha= 1;
                ctx.restore();
            
        } 
        ctx.fillStyle= f.center;
        ctx.beginPath();
        ctx.arc(0, 0 ,f.r*0.38,0 ,Math.PI *2);
        ctx.fill(); ctx.restore();
    }
}
function shiftPlant(seg,dx){
    seg.x+= dx;
    seg.ex+= dx;
    if (seg.flower) {seg.flower.x +=dx;}
    for (const l of seg.leaves) l.x+=dx;
    for (const c of seg.children) shiftPlant(c,dx);
}
function getPlantX(index,total){
    return (W/ (total +1) )*(index+1);
}

function  redistributePlants(){
    plants.forEach((p,i)=>{
        const nx=getPlantX(i,plants.length);
        const dx=nx-p.x;
        if (Math.abs(dx) >1){
            shiftPlant(p.root,dx);
            for (const lf of p.fallen)  lf.x+=dx;
        }
       p.x=nx;
    });
} function drawBackground(){
    const g=ctx.createLinearGradient(0,0,0,H)
    g.addColorStop(0,skyNow.t)
    g.addColorStop(0.45,skyNow.m)
    g.addColorStop(1,skyNow.b)
    ctx.fillStyle= g;
    ctx.fillRect(0,0,W,H);

    ctx.fillStyle=skyNow.g
    ctx.beginPath();
    ctx.ellipse(W/2,H-10, W*0.55, 22, 0 ,0,Math.PI* 2);  //btw for these tag i prefer to test first with any ai or unwanted error come
   ctx.fill();
    ctx.fillStyle =skyNow.ge; // this func made thing hard i could have used a easier insted 
   ctx.fillRect(0,H-18,W,18);

} 
function updateStats() {
    document.getElementById('sc').textContent=totalStems;
    document.getElementById('lc').textContent= totalLeaves;
    document.getElementById('fc').textContent=totalFlowers;
    document.getElementById('cc').textContent=charCount;
} 
function render() {
    ctx.clearRect(0,0,W,H);
    drawBackground();
    drawSpecialPlants();
    drawBoostMeter() ;
    drawStars();
    for (const plant of plants ) {
        plant.draw();}
drawParticles(); drawSparkles();
    updateStats(); renderShop();}
    let pLen =0;
    typebox.addEventListener('input', () => {
        lastTypedAt=Date.now();
        const val=typebox.value;
        const now=Date.now();
        const dt=now -lastTime;
        let speed= clamp(1000 /(dt+1),0,20);
        lastTime=now ;
        updateBoost(dt<180);
        speed= speed*(1+boost*1.5);
    if (val.length<pLen){
        pLen=val.length;
        return;
    }
    const newChars=val.slice(pLen);
    pLen=val.length;
    for(const ch of newChars) {charCount++;
        if (ch ==='\n'){plants.push(new Plant(0));
            redistributePlants();
            continue;
        }
        if (plants.length===0){
            plants.push(new Plant(W/2));
        }
    const target=plants[plants.length -1];
    target.grow(ch,speed);
    } render();
localStorage.setItem("gardenText",typebox.value);});
//will add a dissapearing effect later on clearbtn
clearbtn.addEventListener('click',() => {
    plants=[];
    totalStems=0;
    totalLeaves=0;
    totalFlowers=0;
    charCount=0;
    typebox.value ='' ;
    pLen=0;
    ctx.clearRect(0,0,W,H);
    drawBackground();
    updateStats();

}) 
soundbtn.addEventListener("click",() => {
    soundmenu.classList.toggle("hidden");

});

downloadbtn.addEventListener("click",()=> {
const  link=document.createElement("a");
link.download="my-typegarden"+Date.now()+".png";
link.href=canvas.toDataURL("image/png"); link.click();

});
rainVolume.addEventListener("input",() => {
    rain.volume=rainVolume.value;
});
blossomVolume.addEventListener("input",() =>{
    blossom.volume=blossomVolume.value;
});
// add more sound in case i forgot

forestVolume.addEventListener("input",()  =>{
    forest.volume=forestVolume.value;
});

let musicStarted=false;
function startMusic(){


    if(musicStarted) return;
    musicStarted= true;
    Promise.all([rain.play(), blossom.play(), forest.play()]) 
    .catch((err)=>{
    console.warn("blocked idiot,retry:}",err);
    musicStarted=false;
 });}
document.addEventListener("pointerdown",startMusic, {once:true});
document.addEventListener("keydown",startMusic ,{once:true});
document.querySelectorAll('.buybtn').forEach(btn=>{btn.addEventListener('click',()=>buyItem(btn.dataset.id));});
renderShop();
const spanelEl=document.getElementById('spanel');
const sToggleBtn=document.getElementById('sToggle');
function setsCollapsed(collapsed){
    spanelEl.classList.toggle('collapsed' , collapsed);
    sToggleBtn.textContent =collapsed ? '☑️' :'✂️';
    localStorage.setItem('sCollapsed',collapsed? '1':'0');
} sToggleBtn.addEventListener('click',(e)=>
{ e.stopPropagation();
    setsCollapsed(!spanelEl.classList.contains('collapsed')); 

});
spanelEl.addEventListener('click' ,()=>{if(spanelEl.classList.contains('collapsed') )
    setsCollapsed(false); 
}); 
setsCollapsed(localStorage.getItem('sCollapsed')==='1');


const themeBtns= document.querySelectorAll('.themebtn');
function applyTheme(theme){
    document.documentElement.setAttribute('data-theme', theme);
    themeBtns.forEach(b=>b.classList.toggle('active', b.dataset.theme===theme));
    localStorage.setItem('gardenTheme',theme);
}
themeBtns.forEach(btn=>{
    btn.addEventListener('click', ()=>applyTheme(btn.dataset.theme));});
    const savedTheme= localStorage.getItem('gardenTheme') || 'normal'; 
    applyTheme(savedTheme);
    

drawBackground();
const saved=localStorage.getItem("gardenText");
if (saved)
{typebox.value= saved;
    typebox.dispatchEvent(new Event("input"));
}
typebox.focus();

function loop(){  // as my alch theme was endless so this was neccesary
 updateSky();
 updateAudioFade();
 spawnParticle();
 updateParticles();
 applyDecay();
 render();   
 trySpawnSpecialEffect();
 updateSparkles();
 requestAnimationFrame(loop);
 
} requestAnimationFrame(loop);
scheduleNextMode();
