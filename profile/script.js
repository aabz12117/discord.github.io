document.addEventListener("DOMContentLoaded",()=>{

//========================================
// Basic Config
//========================================
document.getElementById("name").textContent=config.name;
document.getElementById("username").textContent=`@${config.username}`;
document.getElementById("bio").textContent=config.bio;
document.getElementById("member-since").textContent=config.memberSince;
document.getElementById("banner").style.backgroundImage=`url('${config.bannerUrl}')`;
document.getElementById("avatar").src=config.avatarUrl;
document.getElementById("btn-message").href=config.messageUrl;

//========================================
// Badges
//========================================
const badges=document.getElementById("badges");
config.badges.forEach(b=>{
    const div=document.createElement("div");
    div.className="badge";
    div.title=b.title;
    div.innerHTML=`<i class="${b.icon}"></i>`;
    badges.appendChild(div);
});

//========================================
// Connections
//========================================
const links=document.getElementById("connections");
config.connections.forEach(c=>{
    const a=document.createElement("a");
    a.href=c.url;
    a.target="_blank";
    a.className="connection-icon";
    a.title=c.name;
    a.innerHTML=`<i class="${c.icon}"></i>`;
    links.appendChild(a);
});

//========================================
// Copy Username
//========================================
const copyBtn=document.getElementById("btn-copy");
const toast=document.getElementById("toast");

copyBtn.onclick=()=>{
    navigator.clipboard.writeText(config.username);
    toast.classList.add("show");
    copyBtn.querySelector("span").textContent="Copied!";
    setTimeout(()=>{
        toast.classList.remove("show");
        copyBtn.querySelector("span").textContent="Copy Username";
    },1800);
};

//========================================
// Discord Presence
//========================================
async function updateDiscord(){
    try{
        const res=await fetch(`https://api.lanyard.rest/v1/users/${config.discordId}`);
        const json=await res.json();
        if(!json.success) return;
        const data=json.data;
        const user=data.discord_user;

        if(user.avatar){
            const ext=user.avatar.startsWith("a_")?"gif":"png";
            document.getElementById("avatar").src=`https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.${ext}?size=512`;
        }

        const status=document.getElementById("status");
        status.className="status-indicator";
        status.classList.add(data.discord_status);

        const custom=data.activities.find(a=>a.type===4);
        const box=document.getElementById("custom-status");

        if(custom){
            box.style.display="flex";
            const emoji=document.getElementById("cs-emoji");
            if(custom.emoji){
                emoji.innerHTML=custom.emoji.id
                    ?`<img src="https://cdn.discordapp.com/emojis/${custom.emoji.id}.webp?size=24">`
                    :custom.emoji.name;
            }else{
                emoji.innerHTML="";
            }
            document.getElementById("cs-text").textContent=custom.state||"";
        }else{
            box.style.display="none";
        }

        const activity=document.getElementById("activity-card");
        const wave=document.querySelector(".soundwave");

        if(data.spotify){
            activity.style.display="block";
            document.getElementById("activity-title").textContent="LISTENING TO SPOTIFY";
            document.getElementById("activity-img").src=data.spotify.album_art_url;
            document.getElementById("activity-name").textContent=data.spotify.song;
            document.getElementById("activity-artist").textContent=data.spotify.artist;
            wave.style.display="flex";
        }else{
            const game=data.activities.find(a=>a.type===0);
            if(game){
                activity.style.display="block";
                wave.style.display="none";
                document.getElementById("activity-title").textContent="PLAYING";
                document.getElementById("activity-name").textContent=game.name;
                document.getElementById("activity-artist").textContent=game.details||game.state||"";
                let img="https://cdn-icons-png.flaticon.com/512/686/686589.png";
                if(game.assets&&game.assets.large_image){
                    const large=game.assets.large_image;
                    if(large.startsWith("mp:external/")){
                        img=`https://media.discordapp.net/external/${large.replace("mp:external/","")}`;
                    }else{
                        img=`https://cdn.discordapp.com/app-assets/${game.application_id}/${large}.png`;
                    }
                }
                document.getElementById("activity-img").src=img;
            }else{
                activity.style.display="none";
            }
        }
    }catch(err){
        console.error(err);
    }
}

updateDiscord();
setInterval(updateDiscord,3000);

//========================================
// Card Tilt
//========================================
const card=document.getElementById("card");
document.addEventListener("mousemove",e=>{
    const x=(window.innerWidth/2-e.clientX)/32;
    const y=(window.innerHeight/2-e.clientY)/32;
    card.style.transform=`rotateY(${x}deg) rotateX(${y}deg)`;
});

document.addEventListener("mouseleave",()=>{
    card.style.transform="rotateY(0deg) rotateX(0deg)";
});

//========================================
// Smoke System
//========================================
const smokeCanvas=document.getElementById("smoke");
const smokeCtx=smokeCanvas.getContext("2d");
smokeCanvas.width=innerWidth;
smokeCanvas.height=innerHeight;

const smoke=[];
class Smoke{
    constructor(){ this.reset(); }
    reset(){
        this.x=Math.random()*smokeCanvas.width;
        this.y=smokeCanvas.height+Math.random()*250;
        this.size=90+Math.random()*180;
        this.speed=.25+Math.random()*.45;
        this.alpha=.015+Math.random()*.03;
    }
    update(){
        this.y-=this.speed;
        this.x+=Math.sin(this.y*.02)*.35;
        if(this.y<-this.size) this.reset();
    }
    draw(){
        const g=smokeCtx.createRadialGradient(this.x,this.y,0,this.x,this.y,this.size);
        g.addColorStop(0,`rgba(60,60,60,${this.alpha})`);
        g.addColorStop(.45,`rgba(25,25,25,${this.alpha*.8})`);
        g.addColorStop(1,"rgba(0,0,0,0)");
        smokeCtx.fillStyle=g;
        smokeCtx.beginPath();
        smokeCtx.arc(this.x,this.y,this.size,0,Math.PI*2);
        smokeCtx.fill();
    }
}
for(let i=0;i<18;i++){ smoke.push(new Smoke()); }

//========================================
// Fire Embers
//========================================
const emberCanvas=document.getElementById("embers");
const emberCtx=emberCanvas.getContext("2d");
emberCanvas.width=innerWidth;
emberCanvas.height=innerHeight;

const embers=[];
const colors=["#ff2d00","#ff5500","#ff8800","#ffb300"];
class Ember{
    constructor(){ this.reset(); }
    reset(){
        this.x=Math.random()*emberCanvas.width;
        this.y=emberCanvas.height+Math.random()*200;
        this.size=Math.random()*2.6+.5;
        this.speedY=Math.random()*2+0.6;
        this.speedX=Math.random()*1-.5;
        this.alpha=Math.random()*.7+.2;
        this.color=colors[Math.floor(Math.random()*colors.length)];
    }
    update(){
        this.y-=this.speedY;
        this.x+=this.speedX+Math.sin(this.y*.03)*.35;
        this.alpha-=.0025;
        if(this.y<0||this.alpha<=0) this.reset();
    }
    draw(){
        emberCtx.globalAlpha=this.alpha;
        emberCtx.shadowBlur=14;
        emberCtx.shadowColor=this.color;
        emberCtx.fillStyle=this.color;
        emberCtx.beginPath();
        emberCtx.arc(this.x,this.y,this.size,0,Math.PI*2);
        emberCtx.fill();
    }
}
for(let i=0;i<80;i++){ embers.push(new Ember()); }

//========================================
// Falling Dragon Scales
// Obsidian-black scales with glowing valyrian-red rims,
// drifting and spinning down like a dragon molting overhead.
//========================================
const scaleCanvas=document.getElementById("scales");
const scaleCtx=scaleCanvas.getContext("2d");
scaleCanvas.width=innerWidth;
scaleCanvas.height=innerHeight;

const scales=[];
class Scale{
    constructor(){ this.reset(true); }
    reset(initial){
        this.x=Math.random()*scaleCanvas.width;
        this.y=initial?Math.random()*-scaleCanvas.height:-30;
        this.size=8+Math.random()*14;
        this.speedY=.5+Math.random()*1.1;
        this.drift=Math.random()*.6-.3;
        this.sway=Math.random()*Math.PI*2;
        this.swaySpeed=.01+Math.random()*.02;
        this.rotation=Math.random()*Math.PI*2;
        this.rotationSpeed=(Math.random()*.02-.01);
        this.alpha=.35+Math.random()*.45;
    }
    update(){
        this.sway+=this.swaySpeed;
        this.x+=this.drift+Math.sin(this.sway)*.6;
        this.y+=this.speedY;
        this.rotation+=this.rotationSpeed;
        if(this.y>scaleCanvas.height+30) this.reset(false);
    }
    draw(){
        scaleCtx.save();
        scaleCtx.translate(this.x,this.y);
        scaleCtx.rotate(this.rotation);
        scaleCtx.globalAlpha=this.alpha;

        // scale body: elongated diamond, like a shed dragon scale
        const s=this.size;
        const grad=scaleCtx.createLinearGradient(0,-s,0,s);
        grad.addColorStop(0,"rgba(20,4,4,0.95)");
        grad.addColorStop(.55,"rgba(10,2,2,0.95)");
        grad.addColorStop(1,"rgba(0,0,0,0.9)");

        scaleCtx.beginPath();
        scaleCtx.moveTo(0,-s);
        scaleCtx.quadraticCurveTo(s*.55,-s*.15,0,s);
        scaleCtx.quadraticCurveTo(-s*.55,-s*.15,0,-s);
        scaleCtx.closePath();
        scaleCtx.fillStyle=grad;
        scaleCtx.fill();

        scaleCtx.lineWidth=.8;
        scaleCtx.strokeStyle="rgba(255,80,30,0.55)";
        scaleCtx.shadowBlur=6;
        scaleCtx.shadowColor="rgba(255,70,20,0.6)";
        scaleCtx.stroke();

        scaleCtx.restore();
    }
}
for(let i=0;i<26;i++){ scales.push(new Scale()); }

//========================================
// Main Animation Loop
//========================================
function animate(){
    smokeCtx.clearRect(0,0,smokeCanvas.width,smokeCanvas.height);
    emberCtx.clearRect(0,0,emberCanvas.width,emberCanvas.height);
    scaleCtx.clearRect(0,0,scaleCanvas.width,scaleCanvas.height);

    smoke.forEach(s=>{ s.update(); s.draw(); });
    embers.forEach(e=>{ e.update(); e.draw(); });
    scales.forEach(sc=>{ sc.update(); sc.draw(); });

    emberCtx.globalAlpha=1;
    scaleCtx.globalAlpha=1;
    requestAnimationFrame(animate);
}
animate();

//========================================
// Resize
//========================================
window.addEventListener("resize",()=>{
    smokeCanvas.width=innerWidth;
    smokeCanvas.height=innerHeight;
    emberCanvas.width=innerWidth;
    emberCanvas.height=innerHeight;
    scaleCanvas.width=innerWidth;
    scaleCanvas.height=innerHeight;
});

//========================================
// Banner Parallax
//========================================
const banner=document.getElementById("banner");
window.addEventListener("mousemove",e=>{
    const x=(e.clientX/window.innerWidth-.5)*12;
    const y=(e.clientY/window.innerHeight-.5)*12;
    banner.style.transform=`translate(${x}px,${y}px) scale(1.08)`;
});

});