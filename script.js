const canvas=document.getElementById('canvas');
const ctx= canvas.getContext('2d');
const typebox= document.getElementById('typebox');
const clearbtn=document.getElementById('clearbtn')
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
    '#c9efb6','#d7f6c8','a9db98','dff7d7'
],
flowers:[
   ' #ffd9e8','#ffc2d8','#ffb3cf',
   '#f8a7c4','#f6c6d9',
   '#f9b6cf','#f4a9c7',

], flowerCenter: ['#fff5aa','#ffe680','#fff3c4','#ffe08f']
};
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
    contructor(x) { 
        this.x=x;
        this.root=null;
        this.tips=[]
        this.LetterFreq={};
        this.stemColor=pick(PALETTE.stems);
        this.leafColor= pick(PALETTE.leaves);
        this.flowerCenterColor=pick(PALETTE.flowers);
        this.flowerCenter= 
  pick(PALETTE.flowerCenter);
            this.init();



    }
    init(){
        const baseY=H-28;
        const angle=Math.PI/ 2 +rnd(-0.08,0.08);
        this.root=new Segment(this.x, baseY,angle, rnd(28,38), 5, 
    this.stemColor,0);
    this.tips=[this.root];
    totalStems++;


// todo in my final touch make it look more real
    } 
grow(ch,speed ){if (!this.tips.length) return;
    this.LetterFreq[ch]=(this.letterFreq[ch] ||0)+1;
const isVowel=VOWELS.has(ch.toLowerCase());
const isSpace=ch ===' ';

const freq=this.LetterFreq[ch]|| 1 
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
