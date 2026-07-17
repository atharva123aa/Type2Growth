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
        this.flowerCenter= //burnt out a bit will do logic later 5.07

    }
}