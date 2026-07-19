const canvas=document.getElementById('canvas');
const ctx= canvas.getContext('2d');
const typebox= document.getElementById('typebox');
const clearbtn=document.getElementById('clearbtn');
const soundbtn= document.getElementById("sbtn");
const soundmenu = document.getElementById("soundmenu");
const rainVolume=document.getElementById("rainVolume");
const blossomVolume=document.getElementById("blossomVolume");
const forestVolume =document.getElementById("forestVolume");
const W=679;
const H=338;
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

let plants=[]; 
let lastTime=Date.now();
let  charCount= 0;
let totalStems=0;
let totalLeaves=0;
let  totalFlowers=0;
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
    if (tip.depth> 8) return;
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
    color:this.leafColor});totalLeaves ++;} 
    draw(){ this.drawSeg(this.root);}
    drawSeg(seg){
        ctx.strokeStyle= seg.color ;
        ctx.lineWidth =seg.thick ;
        ctx.lineCap='round';ctx.beginPath();
        ctx.moveTo(seg.x,seg.y);
        ctx.lineTo(seg.ex,seg.ey);
        ctx.stroke();
        for (const leaf of seg.leaves)
        this.drawLeaf(leaf);
        if(seg.flower) this.drawFlower(seg.flower);
    for (const child of seg.children )
    this.drawSeg(child);

// todo draw for cherry bolsom to
    } drawLeaf(leaf){
        ctx.save();
        ctx.translate(leaf.x,leaf.y)
        ctx.rotate(leaf.angle);
        ctx.fillStyle =leaf.color;
    ctx.globalAlpha=0.88;
ctx.beginPath();
         ctx.ellipse(leaf.len*0.5,
            0,
            leaf.len *0.5, leaf.len * 0.18 ,
            0,0,
            Math.PI *2
         )  ; ctx.fill();
        ctx.globalAlpha = 1;
    ctx.restore();  } drawFlower(f){
        ctx.save();
        ctx.translate(f.x,f.y)
        for (let i=0;i<f.petals; i++){ctx.save();

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
        if (Math.abs(dx)> 1) shiftPlant(p.root,dx);
        p.x=nx;
    });
} function drawBackground(){
    const g=ctx.createLinearGradient(0,0,0,H)
    g.addColorStop(0,'#DFF4FF')
    g.addColorStop(0.45,'#FEF8FB')
    g.addColorStop(1,'#FFEEF6')
    ctx.fillStyle= g;
    ctx.fillRect(0,0,W,H);

    ctx.fillStyle='#ccb392'
    ctx.beginPath();
    ctx.ellipse(W/2,H-10, W*0.55, 22, 0 ,0,Math.PI* 2);  //btw for these tag i prefer to test first with any ai or unwanted error come
   ctx.fill();
    ctx.fillStyle ='#b99973'; 
   ctx.fillRect(0,H-18,W,18);

} 
function updateStats() {
    document.getElementById('sc').textContent=totalStems;
    document.getElementById('lc').textContent= totalLeaves;
    document.getElementById('fc').textContent=totalFlowers;
    document.getElementById('cc').textContent=charCount;
} 
function  render() {
    ctx.clearRect(0,0,W,H);
    drawBackground();
    for (const plant of plants ) {
        plant.draw();}
    updateStats();}
    let pLen =0;
    typebox.addEventListener('input', () => {
        const val=typebox.value;
        const now=Date.now();
        const dt=now -lastTime;
        const speed= clamp(1000 /(dt+1),0,20);
        lastTime=now ;
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


    

drawBackground();
const saved=localStorage.getItem("gardenText");
if (saved)
{typebox.value= saved;
    typebox.dispatchEvent(new Event("input"));
}
typebox.focus();

