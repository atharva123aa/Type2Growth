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
const enchantSound =new Audio("enchant.mp3");
enchantSound.volume =0.5;
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
const PALETTES= {
    classic :{stems :PALETTE.stems,
        leaves: PALETTE.leaves, flowers:PALETTE.flowers, flowerCenter: PALETTE.flowerCenter}, graveyard:{
            stems:['#2b2530','#332b3a','#241f2b'],leaves:['#4a3d55','#3a3140','#584a63'],
            flowers :['#6e2f5e','#8a3d74','#5a2450'], flowerCenter :['#c9a3d9','#a878c4']
        },
        samurai :{stems:['#3a2418' ,'#4a2e1c',
            '#2e1c12'
        ],leaves:['#5a3a28','#4a3020', '#6b4530' 
        ],flowers:['#c81d1d' ,
            '#e0342f', '#b31414','#8f1010'],
        flowerCenter:['#ffd54f' , '#ffca28']}
    };
const sky_overrides= {graveyard:{sunlight:{t:'#241a33',m:'#2e2040',b:'#3a2a51', g: '#180f24',ge:'#100a18'
},rain:{t:'#1c1428',m:'#241a33',b:'#2c2140', g: '#130d1c',ge:'#0c0812'}, breeze:{t:'#281f3d',m:'#32284a',b:'#3d3159', g: '#1a1327',ge:'#120c1c'},
blossom:
{t:'#2e1f42',m:'#382650',b:'#432e5e', g: '#1e1428',ge:'#150e1e'}, night:{t:'#0a0612 ',m:'#120a1c',b:'#1a1208', g: '#08050c',ge:'#040308'}


},samurai :{
sunlight :{t:'#ffe0b8',m:'#ffc98f',b:'#ff9e6e',g :'#8f4a2a',ge :'#6b3418'

}, rain:{t:'#d9a878',m:'#c985fe' ,
    b:'#a86840', g :'#6b3f24',ge :'#4a2a18'
},breeze :{t: '#ffd9a0', m:'#ffbe80',b:'#ff9860', g:'#7a4228',ge:'#5a3018'},blossom:{t :'#ff8f70', m:'#e85d4a',
    b:'#c73a2e',
    g:'#4a1e14', ge:'#301006'
},night:{t:'#241008',m:'#3a1810', b:'#4a2014', g:'#1a0a06', ge:'#100604'}
}};
const themeMusic ={graveyard: new
    Audio("horror.mp3")}; Object.values(themeMusic).forEach(a=>{
    a.loop= true; a.volume=0.9;
});//jasdfasdjasdfasd
const swordSFX =new Audio ("short.mp3"); swordSFX.volume= 0.89 ;
const eventMusic = new Audio("mid.mp3");
eventMusic.volume =0.75 ;
const hSFX =[new Audio("h1.mp3"),
    new Audio("h2.mp3"), new Audio("h3.mp3"),new Audio("h4.mp3"),
    new Audio("h5.mp3"), new Audio("h6.mp3")
] ; 
hSFX.forEach(a=>
    a.volume=0.67
); 
function schedulehSFX(){const wait =rnd(9000,20000);
setTimeout(()=>{
    if(currentMapTheme ==='graveyard' && musicStarted && !document.hidden){
        pick(hSFX).play().catch(()=> {});

    } schedulehSFX();
},
wait);
}
schedulehSFX();
let currentMapTheme =
localStorage.getItem('gardenMap') ||'classic';
let tombstones=[];

const rain=new Audio("r.mp3")
const blossom=new Audio("s.mp3")
const forest=new Audio("f.mp3")
const cSongInput=document.getElementById("cSong");
const playcBtn=document.getElementById("playcBtn")
const cVolume=document.getElementById("cVolume")
const cAudio=new Audio(); 
let cSongName ="";
cAudio.loop=true;
cAudio.volume =0.7;
rain.loop=true;
blossom.loop=true;
forest.loop= true;
rain.volume= 0;
blossom.volume=0;
forest.volume=0.4;
const loadscreen =document.getElementById('loadscreen') ;
const lsBarFill=document.getElementById('lsBarFill');
const atl=[rain,blossom ,forest] ;

let loadedCount =0;
const loadStart=Date.now();
function markLoaded (){loadedCount++;
    if (lsBarFill) 
        lsBarFill.style.width =(loadedCount /atl.length) *100 +'%' ;
    if (loadedCount >=atl.length) finishLoading() ;
} atl.forEach(a=>{
    if(a.readyState >=3) markLoaded(); else{a.addEventListener('canplaythrough',markLoaded, {once:true});
a.addEventListener('error',markLoaded,{once:true});}
});
// for canplay and problem error through one i asked ai and it gave me thiss coolass
function finishLoading(){
    const wait= Math.max(0,900 -(Date.now()-loadStart));
     setTimeout(()=>  {
        loadscreen.classList.add('hide');
        setTimeout(()=>loadscreen.remove(),
            600);
        }, wait
     );

} setTimeout(()=> {if (!loadscreen.classList.contains('hide')) 
    finishLoading();
}, 6000);// like wdym  you got stuck in this so i thought i shld add a safe screen exit

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

const mode_sky_d =
JSON.parse(JSON.stringify(mode_sky));
function playThemeMusic(id){
    Object.entries(themeMusic).forEach((
        [key,audio])=>{
            if (key===id) {if(musicStarted) audio.play().catch(()=>{});
        } else{audio.pause(); audio.currentTime =0;}
    });
}
function spawnTombstones(){
    tombstones =[];
    const count =3 +Math.floor(Math.random()* 3); 
    for(let i=0;i<count; i++){
        tombstones.push({x:rnd(30,W-30),
            y:H-18, r:rnd (11,16)
        });
    }
} function screenShake() {
    canvas.classList.add('shake');
    setTimeout(()=> canvas.classList.remove('shake'),420);
}
let samuraiEventActive=false;
let samuraiEventTimer =null; let eventHits=0;
const EVENT_HITS_NEEDED= 18;
let eventDTimer=null;
function scheduleSwordEvent(){
    const wait=rnd(45000,75000);
    samuraiEventTimer =setTimeout(()=>{if (currentMapTheme==='samurai' &&musicStarted&&!samuraiEventActive){triggerSwordEvent();}
scheduleSwordEvent();} ,wait);
}
function clearSwordEvent(){clearTimeout(samuraiEventTimer);
    clearTimeout(eventDTimer); samuraiEventActive= false;

    document.getElementById('samuraiEventOverlay')?.classList.add('hidden');
    eventMusic.pause();
eventMusic.currentTime = 0;
}
function triggerSwordEvent(){swordSFX.currentTime =0;
    swordSFX.play().catch(()=>{}
    ); screenShake();
canvas.classList.add('jumpflash');
        setTimeout(()=>canvas.classList.remove('jumpflash'),250);
for  (const p  of plants)
    wiltSeg(p.root, 0.55);//made the effect very less i think of improving it but not now
startSamuraiEvent();
}
function startSamuraiEvent(){samuraiEventActive =true;
    eventHits =  0;
    themeMusic.samurai.pause();
eventMusic.currentTime= 0 ; 
eventMusic.play().catch(()=>{});
document.getElementById('samuraiEventOverlay')?.classList.remove('hidden'); updateeBars();
const startedAt= Date.now (); const DURATION =32000;
function tick (){if (!samuraiEventActive)
    return;
    const remain=Math.max(0,DURATION -(Date.now()-startedAt));
    const timerFill= document.getElementsByClassName('eventTimerFill');
  if(timerFill) 
    timerFill.style.width =(remain /DURATION*100) +'%';
if(remain <=0){loseSamuraiEvent();
    return;
}
eventDTimer =setTimeout(tick,100);

  }
  tick();}
  function updateeBars(){
    const fill =document.getElementById('eventProgressFill');
    if (fill)
        fill.style.width =clamp(eventHits /EVENT_HITS_NEEDED0,0,1)*100+'%';
  }

function winSamuraiEvent(){ 
    samuraiEventActive =false;
clearTimeout(eventDTimer);

}
    mapMenu.classList.add('hidden');
 localStorage.setItem('gardenMap',id );
const pal = PALETTES[id]|| PALETTES.classic ; PALETTE.stems= pal.stems;

PALETTE.leaves=pal.leaves; 
PALETTE.flowers= pal.flowers; 
PALETTE.flowerCenter= pal.flowerCenter;
Object.assign(mode_sky,sky_overrides[id] ||mode_sky_d); 
 applyMode(currentMode);
 document.querySelectorAll('.mapcard').forEach(
    c=> c.classList.toggle('active', 
        c.dataset.map ===id)
    ); playThemeMusic(id); 
    if(!skipClear){
        plants=[];
        totalStems = 0; totalLeaves =0 ; totalFlowers =0; charCount= 0;
        typebox.value='';pLen=0; 
        localStorage.setItem("gardenText","");
        ctx.clearRect(0,0,W,H);
    }
    if (id==='graveyard'){
        spawnTombstones();
        screenShake();
        document.getElementById('fogOverlay')?.classList.remove('hidden');

    } else{tombstones=[];
document.getElementById('fogOverlay')?.classList.add('hidden');
    }
 
}
const mapBtn= document.getElementById('mapBtn'); 
const mapMenu = document.getElementById('mapMenu'); mapBtn.addEventListener('click', (e)=>{
e.stopPropagation();
mapMenu.classList.toggle('hidden')
});
document.addEventListener('click',(e) =>
{if(!mapMenu.classList.contains('hidden') && !mapMenu.contains(e.target) &&

    e.target !== mapBtn) 
mapMenu.classList.add('hidden');

});

document.querySelectorAll('.mapcard').forEach(card =>{
        card.addEventListener('click',(e) =>{
            e.stopPropagation();   mapMenu.classList.add('hidden')
            if (card.classList.contains('locked')) return;
         
            applyMapTheme(card.dataset.map);
    }
);});
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
if (currentMapTheme ==='graveyard'&& Math.random() <0.05){particles.push({
    type:'fog', x: rnd(0,W), y:H-30+rnd(-10,10),
    vx:rnd(0.1,0.4),  vy:0, 
    size :rnd(40,80), alpha:0.12
});}
if (currentMapTheme==='samurai' && Math.random()<0.12)
{particles.push({type:'redpetal',
    x :rnd(0,W ),
    y: -10,
    vx: rnd(-0.4,0.4), vy:rnd(0.8,1.6),
rot : rnd(0, Math.PI*2),
spin :rnd(-0.05,0.05), size : rnd(6,11),
color :pick(['#c81d1d',
        '#e0342f','#b31414'
    ])
});}
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
        if(p.enchant){
            ctx.save(); ctx.shadowColor=p.color; ctx.shadowBlur= 6;
            ctx.strokeStyle =p.color; ctx.lineWidth =1.8; 
            ctx.globalAlpha = p.alpha; 
            ctx.beginPath(); ctx.moveTo(
                p.x,p.y
            ) ;ctx.lineTo(p.x+ p.vx *3, p.y+ p.len); 
       ctx.stroke(); 
    ctx.restore(); } else{

    
        ctx.strokeStyle='rgba(200,220,235,'+p.alpha+')';
        ctx.lineWidth= 1.2;
        ctx.beginPath();
ctx.beginPath(); ctx.moveTo(p.x,p.y) ;
ctx.lineTo(p.x+p.vx* 3,p.y+p.len);
ctx.stroke();
    }}
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


//todo is dun
if (currentMapTheme ==='graveyard'){for (const p of particles){
    if(p.type ==='fog'){ctx.save(); 
         ctx.globalAlpha =p.alpha ;
ctx.fillStyle ='#cfc9d6';
ctx.beginPath();
ctx.ellipse(p.x,p.y,p.size,p.size *0.3,0,0,Math.PI*2);
ctx.fill(); 
        ctx.restore();
    }
}}
if (currentMapTheme ==='samurai'){for( const p  of particles){if(p.type==='redpetal'){ctx.save();
    ctx.translate(p.x,p.y); ctx.rotate(p.rot); ctx.fillStyle= p.color;
    ctx.globalAlpha =0.85;
ctx.beginPath();
ctx.ellipse(0,0,p.size *0.5,p.size *0.22,0,0,Math.PI*2);
ctx.fill ();
ctx.globalAlpha =1; ctx.restore()
;
}}}
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
ctx.fillStyle=s.color||'#fff3b0' ; ctx.beginPath();
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
const BUFF_DURATION =30000;
const buffCosts ={
    rain:{leaves:20, flowers:0}, sun:{leaves:25, flowers:5},
    sakura:{leaves:0, flowers:15}, 
    moon :{leaves:30, flowers:10}, photosynthesis:{leaves:35, flowers:0} ,//1st time i used bio in smthg 
k_growth :{leaves: 99999, flowers: 99999}, k_bloom :{
    leaves:99999,flowers :99999
}, k_weather:{leaves:99999,flowers :99999}
};// like yes these are sideffect when you are not good in backend it is very absurd ig

//one more blessing is what i guess goin to get added next update
let  buffs={rain:{until:0},
sun:{until:0}, sakura :{until:0},moon:{until:0}
,photosynthesis:{until:0},k_growth:{until :0},
k_bloom:{until:0},
k_weather:{until:0}};
function buffActive(id){return Date.now() < buffs[id].until;

} function activateBuff(id){
    enchantSound.currentTime=0; 
    enchantSound.play().catch(() => {} );
const cost =buffCosts[id];

if  (!cost ||buffActive(id)) 
    return ; if(wallet.leaves >=cost.leaves && wallet.flowers>=cost.flowers){

wallet.leaves-= cost.leaves; wallet.flowers -=cost.flowers; buffs[id].until=Date.now()+BUFF_DURATION;
saveWallet(); renderShop(); spawnBuffBurst(id); 
flashCard(id);
}} function spawnBuffBurst(id){
    const color=  id==='rain' ? '#9fd3ff': id==='sun' ?
    '#ffd166' :'#ffb3cf'; for(let i= 0; i<14; 
        i++){sparkles.push({
            x:W/2+rnd(-60,60), y:H*0.4 +rnd(-30,30), vx:rnd(-1.5,1.5),vy:rnd(-2,-0.6), life:1, 
            size:rnd(2,4), color:color



        });}} function flashCard(id){
            const timerEl=document.querySelector(`.bufftimer[data-timer="${id}"]`);
            if(!timerEl) return;
            const card=timerEl.closest('.bi'); 
            card.classList.remove('justActivated');
            void card.offsetWidth;
            card.classList.add('justActivated'
            );
        }

function renderBuffs(){
    document.querySelectorAll('.buffbtn').forEach(btn=>{
        const id=btn.dataset.id; 
        const active=buffActive(id); const cost =buffCosts[id];
        const canAfford= wallet.leaves>= cost.leaves&& wallet.flowers >=cost.flowers; 
        btn.disabled=active||!canAfford ; 
        btn.classList.toggle('live', active ); 
    const card=btn.closest('.bi')
    if(card)card.classList.toggle ('live-glow',active );
    if(active && !btn.dataset.origLabel){
        btn.dataset.origLabel =btn.textContent;
    } btn.textContent=active ?'active' :(btn.dataset.origLabel ||btn.textContent);}
    );

document.querySelectorAll('.bufftimer').forEach (bar=>{
    const id=bar.dataset.timer;
    const active=buffActive(id); bar.classList.toggle('active' ,active) ; if(active){
        const remaining =buffs[id].until-Date.now(); 
        const pct =clamp(remaining/BUFF_DURATION,0,1)*100; bar.innerHTML=
        `<div class="bufftimer-fill"style="width:${pct}%"></div>`;//i hd lil confusion as i hdnot used inner html from long time
    }
});

}       


let unlocked={sunflower:false, dandelion: false, 
     blossomtree:false ,rose:false,cherryframe : false 
}; 

const savedWallet=localStorage.getItem("gardenWallet");
if(savedWallet) wallet=JSON.parse(savedWallet);
const savedUnlocks  =localStorage.getItem("gardenUnlocks");

if (savedUnlocks ) unlocked=Object.assign(unlocked ,JSON.parse(savedUnlocks))
const shopItems =[{id:'sunflower' ,cost:{leaves:30, flowers:5}},
    {id:'dandelion' , cost :{leaves:18, 
flowers:3}},
    {id:'blossomtree',cost:{ leaves:45, flowers:9}},
    {id :'rose',cost :{
        leaves:22,
        flowers:6
    }}, {id:'cherryframe', cost: {leaves:35, flowers: 10}}
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

function drawRose(x,y){ctx.save ();
    ctx.strokeStyle ='#3e6b3a'; ctx.lineWidth=3;
    ctx.beginPath();
    ctx.moveTo(x,y);
ctx.lineTo(x,y-60); ctx.stroke();  ctx.translate(x,y-66);
for (let i=0; i<3; i++){
    ctx.save();
    ctx.rotate (i*0.35); ctx.fillStyle =i% 2===0?
    '#c2185b':'#e0507e';
     ctx.beginPath() ; ctx.arc(0,0,10-i*2,0,Math.PI*2);
     ctx.fill() ;ctx.restore();
}
ctx.fillStyle ='#8a1338';
ctx.beginPath();
ctx.arc(0,0,4,0,Math.PI*2) ;ctx.fill(); 
ctx.restore();}
function drawCherryFrame(){ctx.save();
    const spots =[[20,20],[W-20,20 ]]; for (const [cx,cy] of spots){
        for(let  i=0; i<8;
            i++
        ){ctx.fillStyle ='#ffb7c5';
            ctx.globalAlpha =0.85; ctx.beginPath();
        ctx.ellipse(cx+rnd(-30,30),cy+rnd(-15,25),
    6,4,
rnd(0,Math.PI),0, 
Math.PI* 2);
     ctx.fill();   }
    }

ctx.globalAlpha =1;
ctx.restore()
;
}










function drawTombstone(x,y,r){
ctx.save();

ctx.fillStyle ='#5a5560'; ctx.beginPath();
ctx.moveTo(x-r,y-r*2.1); ctx.arc(x,y-r*2.1001,r,Math.PI,0);
ctx.lineTo(x+r,y);
       ctx.closePath();
 ctx.fill() ; ctx.strokeStyle ='#3b3640' ; ctx.lineWidth= 1.5; 
ctx.beginPath(); ctx.moveTo(x-r *0.5,y-r); 
ctx.lineTo(x+r*.5,y-r); 
ctx.moveTo(x,y-r *1.5); 
ctx.lineTo(x,y-r* 0.5); 
ctx.stroke(); ctx.restore ();
}
function dtGate(x,y){ctx.save();
    ctx.strokeStyle='#8f1010'; ctx.lineWidth  =6;
    ctx.lineCap ='round';
ctx.beginPath(); ctx.moveTo(x-24,y) ;
ctx.lineTo(x-24, y-46); ctx.stroke();

ctx.lineWidth= 8; ctx.beginPath(); ctx.moveTo(x+24,y); 
ctx.lineTo(x+24 , y-46);
ctx.stroke();ctx.lineWidth=4;
ctx.beginPath();
ctx.moveTo(x-26,y-40); ctx.lineTo(x+26,y-40);
ctx.stroke();ctx.restore();}


// add  a samurai too

function drawSpecialPlants(){
    if(unlocked.sunflower) drawSunflower(W-70,H-18);
        if(unlocked.dandelion) drawDandelion(W-30, H-18);
            if(unlocked.blossomtree) drawBlossomTree(W-130,H-18);
            if(unlocked.rose) drawRose(W-190,H-18); 
            if (unlocked.cherryframe) drawCherryFrame();
            if (currentMapTheme=== 'graveyard'){
            for (const t of tombstones) 
                drawTombstone(t.x,t.y, t.r);
            } if(currentMapTheme==='samurai'){dtGate(80, H-18)}
}

const enchantColors =['#9fd3ff', '#ffd166','#ff9fc4','#c9a0ff','#8fffc4'];
function spawnBuffRain(){
    if(!buffActive('rain')) 
        return; if(Math.random()<0.6){
    const isEnchant= Math.random() <0.15; particles.push({
    type:'rain',
    x:rnd(0,W),y:-10, 
    vx :-0.6,
    vy:rnd(8,16), len:rnd(8,16), 
    alpha :isEnchant? 0.9 :.5, enchant:isEnchant,
    color:isEnchant ? pick(enchantColors) :
    null
    });}
}



function drawBuffSun(){
    if(!buffActive('sun')) 
        return;
    const cx=90 
    ,cy=75,r= 32; 
     ctx.save();

    ctx.strokeStyle ='rgba(255,203, 97,0.8)'
    ;ctx.lineWidth =3; 
    ctx.lineCap ='round';
    const rayCount=10;
    const t=Date.now() /1000; for(let i=0;i<rayCount; i++){
        const angle= (i/rayCount)* Math.PI*2
        + t* 0.15; const rayLen  =10+Math.sin(t*2 +i)* 3;
        ctx.beginPath(); ctx.moveTo(cx +Math.cos(angle) *(r+4),cy +Math.sin(angle) *(r+4)); ctx.lineTo(
            cx
            +Math.cos(angle) *(r+4+rayLen), cy +Math.sin(angle) *(r+4+rayLen));
ctx.stroke();
    }
    ctx.fillStyle ='#ffcb61';
    ctx.beginPath(); ctx.arc(cx,cy,r,0,Math.PI*2) ;
    ctx.fill();
    ctx.strokeStyle ='#e08a1f66';
    ctx.lineWidth =2;
ctx.beginPath(); 
ctx.arc(cx,cy,r-4, 0,Math.PI*2); ctx.stroke(); ctx.restore();
}

function drawBuffMoon(){
if(!buffActive('moon')) return; const cx=W-90, 
cy =75, r=30;
ctx.save(); ctx.fillStyle ='#f0eaff';

ctx.beginPath() ; ctx.arc(cx,cy,r, 0,Math.PI *2); 
ctx.fill(); ctx.fillStyle =skyNow.t||'#0c1730'; ctx.beginPath();
ctx.arc(cx+12,cy-6,r*0.85,0,Math.PI* 2);  ctx.fill(); ctx.strokeStyle ='rgba(240,234,255,0.5)' ; 
ctx.lineWidth =2 ;

const  t=Date.now()/1000;
for(let i= 0;i<6; i++){
const angle =(i/6
)*Math.PI*2 + t*0.1;
ctx.beginPath();
ctx.moveTo(cx +Math.cos(angle) *(r+8), cy+Math.sin(angle)* (r+8));
ctx.lineTo(cx +Math.cos(angle) *(r+16), cy+Math.sin(angle)* (r+16));// though i have got the cos sin concept but still i face probs when i do myself
ctx.stroke();

}
ctx.restore();

} function spawnPhotoSparks(){
if (!buffActive('photosynthesis')||!plants.length) return ;if(
    Math.random()<0.3
){const p=pick(plants);
    if(!p.tips.length)
        return ;
    const tip=pick(p.tips);
sparkles.push({x:tip.ex,y:tip.ey,vx:rnd(-0.4,0.4),vy: rnd(-1.4,-0.5),
    life :1, size:rnd(2,4),
color:'#7cff8c'
});
}}
let typingSpeedWPM= 0; 
let charTimestamps=[]; 
function rkfs(){
    const now=Date.now();
    charTimestamps.push(now) ;
    charTimestamps =charTimestamps.filter(t=>
        now-t<3000);}
 let speedoLastTick =Date.now();
    function updateSpeedometer(){
    const now=Date.now();
    const dt=(now-speedoLastTick)/1000;
    speedoLastTick = now;
    charTimestamps=charTimestamps.filter(t=> now-t < 3000);
         if(charTimestamps.length<2){
            typingSpeedWPM =Math.max(0, typingSpeedWPM-dt*40);
            
        } else{
            
        
const span =(charTimestamps[charTimestamps.length-1]-charTimestamps[0])/ 1000; 
const charsPerSec= span>0? charTimestamps.length/span: 0;
const TargetWPM= (charsPerSec *60)/5 ;
typingSpeedWPM += ( TargetWPM -typingSpeedWPM
)* 0.15;
}
document.getElementById('wpm').textContent = Math.round(typingSpeedWPM);


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
    if (buffActive('sun')) return;
    const idleMs= Date.now()- lastTypedAt; if(idleMs <15000 ) return;
    const decayAmount= currentMapTheme==='graveyard' ?0.0012:0.00025;
    for(const plant of plants){
    wiltSeg(plant.root,decayAmount);
    for(const f of plant.fallen) f.wilt=
    clamp((f.wilt||0)+decayAmount,0,1);    }
    if(currentMapTheme ==='graveyard') checkrTrees();


} function getAvgWilt(seg){
    let total=seg.wilt||0, count =1;
    for (const  c of seg.children){
        const r=getAvgWilt(c) ; total+=r.total; count+=r.count;}
        return {total,count};
    
}

function rustandRegrow(index){
    const p= plants[index];
    const x=p.x;
    for (let i=0; 
        i<12; i++){sparkles.push({x:x+rnd(-20,20), y:H-30+rnd(-10,10),vx:rnd (-0.3,0.3), 
vy:rnd(-0.6,-0.1), life :1 ,
size:rnd(2,4), color:'#6e2f5e'
        });} plants[index]=new Plant(x);
}
function checkrTrees(){
    plants.forEach((p,i)=>{
        const {total,count} =getAvgWilt(p.root); if
        (total/count >0.92) rustandRegrow(i);
    });
}
function wiltSeg( seg,amount){
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
        const startThick= buffActive('sun') ? 8: 5;
        this.root=new Segment(this.x, baseY,angle, rnd(28,38), startThick, 
    this.stemColor,0);
    this.tips=[this.root];
    totalStems++;


// todo in my final touch make it look more real
    } 
grow(ch,speed ){if (!this.tips.length) return;
    this.tryRipenFruit();
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
        const sakuraBoost= buffActive('sakura');
    const kBloom=buffActive('k_bloom');
        tip.flower={
            x:tip.ex,
            y:tip.ey,
            r: clamp((4 +freq*0.7)*((sakuraBoost ||kBloom)? 1.7 :1),5,(sakuraBoost||kBloom)?26:14),
            color:this.flowerColor,
            center:this.flowerCenter, 
            petals:5+ Math.floor(freq/ 2)+(sakuraBoost?4:0),rot:Math.random()* Math.PI}; 
                totalFlowers++;
                wallet.flowers++; 
                saveWallet();
                this.flowers.push(tip.flower);
                if (sakuraBoost){
                    for (let i=0;i<3; i++){
                        particles.push({type:'petal', x:tip.ex,y:tip.ey,vx:rnd(-0.5,0.5),vy:rnd(0.5,1.2), 
                            rot:rnd(0,Math.PI* 2),spin :rnd(-0.04,0.04),
                            size:rnd(6,10),color:pick(PALETTE.flowers)
                        });

                    }
                }
        }
    } else{ this.extend(tip,speed,freq);
}
const leafChance =buffActive('rain') ? 0.8:0.5;
 if (Math.random()> (1 -leafChance)) this.addLeaf(tip);

}extend(tip,speed,freq) {
    const wbl=rnd(-0.18, 0.18);
    const NewAngle=tip.angle+ wbl;
    const rainMult =buffActive('rain') ? 1.6:1;
    const bLen=clamp((20+ speed*0.4 +freq *1.6)*(
        buffActive('k_growth') ?2.2: 1
    ), 14,110);
    const len= rnd(bLen*0.8,bLen*1.2);
    const sunThinning=buffActive('sun') ?0.15 :0.6;
    const photoFatten= buffActive('photosynthesis')? 1.4: 0;
    const kBoost=
buffActive('k_growth')? 2.2 :
1;
    const thick=Math.max(1,tip.thick- sunThinning+ photoFatten);
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
} tryRipenFruit(){
    for(const f of this.flowers) {if (f.fruit) 
        continue; 
    f.age =(f.age ||0) +1;
    if (f.age >25&& Math.random()< 0.02){
    f.fruit ={
        type :pick(['apple','berry','orange']),
        r :rnd(6,9),
        sway :rnd(0,Math.PI*2)
    };
    wallet.flowers+=2; //fruit should be a reward for flower too ig
    saveWallet();
    }
    }
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
        ctx.rotate(leaf.angle); if(currentMapTheme ==='graveyard'){

        
        ctx.fillStyle =wilt>0.5 ? '#2a2530':leaf.color;
    ctx.globalAlpha=0.90* (1-wilt *0.5 );
ctx.beginPath();
ctx.moveTo (0,0);
ctx.lineTo(leaf.len *0.5, -leaf.len *0.14 );
ctx.lineTo(leaf.len,0);
ctx.lineTo(leaf.len *0.5 ,  leaf.len*0.14 );
ctx.closePath();
ctx.fill();} else {ctx.fillStyle =wilt>0.5 ? '#c9a15a':leaf.color;
    ctx.globalAlpha=0.88* (1-wilt *0.5 );
ctx.beginPath();
         ctx.ellipse(leaf.len*0.5,
            0,
            leaf.len *0.5, leaf.len * 0.18 ,
            0,0,
            Math.PI *2
         )  ; ctx.fill();}
        ctx.globalAlpha = 1;
    ctx.restore();  } drawFlower(f){
        const wilt=f.wilt || 0;
        ctx.save();
        ctx.translate(f.x,f.y)
        ctx.globalAlpha =1-wilt*0.7;

        if(f.fruit){
            this.drawFruit(f);
            ctx.restore();
            return;
        }

        for( let i=0; i<f.petals; i++){ctx.save();
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
    drawFruit(f){
        const sway= Math.sin( Date.now()/ 700 +f.fruit.sway)* 2;
        const r =f.fruit.r; ctx.save();
    ctx.translate(sway, 3);
    if(f.fruit.type ==='apple') {
        ctx.fillStyle ='#e0483f' ;
        ctx.beginPath (); 
        ctx.arc(0,0,r,0,Math.PI*2 ); ctx.fill();
        ctx.strokeStyle ='#6e4f45' ; 
        ctx.lineWidth =1.5;

        ctx.beginPath();
        ctx.moveTo(0, -r);ctx.lineTo(0,-r-4); 
        ctx.stroke(); 
        ctx.fillStyle ='rgba(255,255,255,0.35)' ;
        ctx.beginPath(); 
        ctx.ellipse(-r *0.3,-r*0.3,r*0.25, r*0.15 ,0, 0 ,Math.PI*2) ;
        ctx.fill();

    }else if (f.fruit.type ==='berry'){
        ctx.fillStyle ='#5a3d7b';
        for (let i =0; i<3;i++){
const bx=Math.cos((i/3) *Math.PI* 2) *r*0.4; const by=
Math.sin((i/3)*Math.PI*2)*r* 0.4;
ctx.beginPath (); 
ctx.arc(bx,by,r*0.5 ,0, Math.PI* 2);
ctx.fill();
        }
    }else{ // todo-will add lemon for lemongggggggggg too
    ctx.fillStyle ='#ffa798'; 
    ctx.beginPath(); 
    ctx.arc(0,0,r,0,Math.PI*2); 
    ctx.fill(); 
   ctx.strokeStyle ='rgba(0,0,0,.15)' ;
   ctx.lineWidth= 0.81;
   for (let i=0; i<5; i++){
    ctx.beginPath();
    ctx.moveTo(0,0);
    ctx.lineTo(Math.cos((i/5)*Math.PI*2)*r, Math.sin((i/5)*Math.PI*2)*r);
    ctx.stroke();
   }
}
ctx.restore();
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
    drawBuffSun();
    drawBuffMoon();
    drawBoostMeter() ;
    drawStars();
    for (const plant of plants ) {
        plant.draw();}
drawParticles(); drawSparkles();
    updateStats(); renderShop();}
    let pLen =0;
    typebox.addEventListener('input', () => {
        lastTypedAt=Date.now();
        rkfs();
        const val=typebox.value;
        const now=Date.now();
        const dt=now -lastTime;
        let speed= clamp(1000 /(dt+1),0,20);
        lastTime=now ;
        updateBoost(dt<180);
        speed= speed*(1+boost*1.5);
        if(buffActive('moon')) speed*=1.8;
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
    cAudio.pause();// the audio should pass too or it will look like bug ig
cAudio.currentTime =0;
playcBtn.textContent = "play custom song"
}) ;
soundbtn.addEventListener("click",(e) => {
    e.stopPropagation();
    soundmenu.classList.toggle("hidden");}); document.addEventListener('click',(e)=>{
        if(!soundmenu.classList.contains('hidden')&& !soundmenu.contains(e.target)
        && e.target !==soundbtn){soundmenu.classList.add('hidden');}
    }
);

downloadbtn.addEventListener("click",()=> {
const  link=document.createElement("a");
link.download="my-typegarden"+Date.now()+".png";
link.href=canvas.toDataURL("image/png"); link.click();

});
let customSongName= "play song";
playcBtn.addEventListener("click",()=>{
    if(!cAudio.src){alert("choose a song first!"); return;} //the js feature are pretty more workful than that of python like they just need their word like alert  but in python you have to create a script:{
            
    
    if (cAudio.paused){
        cAudio.play(); 
        playcBtn.textContent ="pause";


    } else{
        cAudio.pause();
        playcBtn.textContent ="play ";
    }
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
cVolume.addEventListener("input",()=>
{cAudio.volume =cVolume.value;});
cSongInput.addEventListener("change", ()=> {
    const file =cSongInput.files[0];
    if(!file) return; 
cAudio.src =URL.createObjectURL(file);
 playcBtn.textContent ="Play " +file.name;
cSongName =file.name;
 playcBtn.textContent ="Play " +file.name;
cSongName =file.name;

});
let musicStarted=false;
function startMusic(){


    if(musicStarted) return;
    musicStarted= true;
    Promise.all([rain.play(), blossom.play(), forest.play()]) .then(()=> 
{if (themeMusic[currentMapTheme])
    themeMusic[currentMapTheme].play().catch(()=>{});})
    .catch((err)=>{
    console.warn("blocked idiot,retry:}",err);
    musicStarted=false;
 });}
document.addEventListener("pointerdown",startMusic, {once:true});
document.addEventListener("keydown",startMusic ,{once:true});
document.querySelectorAll('.buybtn').forEach(btn=>{btn.addEventListener('click',()=>buyItem(btn.dataset.id));});
renderShop();
document.querySelectorAll('.buffbtn').forEach( btn=>{btn.addEventListener('click',()=>activateBuff(btn.dataset.id));}); renderBuffs();
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
    lastTime =Date.now();
    typebox.dispatchEvent(new Event("input"));
}
typebox.focus();
applyMapTheme(currentMapTheme,true)// forgot this like things were bugging a lot not even kidding i got fog instead of flower

canvas.addEventListener('click',(e)=>{
if(currentMapTheme!=='graveyard' || !plants.length) return; 
const rect =canvas.getBoundingClientRect();//btw this function was something i wanted but no idea how to make so i used gemini for js features to do so 
const mx=(e.clientX-rect.left)*(W/rect.width);
plants.forEach((p,i)=>{
    if(Math.abs(mx-p.x)< 40){const {total ,count}=getAvgWilt(p.root);
    const AvgWilt=total/count;
        if(AvgWilt >0.35){
            rustandRegrow(i); 
            screenShake();
        }

}
});
});





function loop(){ 
 // as my alch theme was endless so this was neccesary
 if(buffActive('moon'))
    skyTarget =(sky_overrides[currentMapTheme]&& sky_overrides[currentMapTheme].night)||  mode_sky.night;

 updateSky();
 updateAudioFade();
 spawnParticle();
 spawnBuffRain();
 spawnPhotoSparks();
 updateParticles();
 updateSpeedometer();
 applyDecay();
 render();   
 trySpawnSpecialEffect();
 updateSparkles();
 renderBuffs();
 requestAnimationFrame(loop);
 
} requestAnimationFrame(loop);
scheduleNextMode();
