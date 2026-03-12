 
import { easyWebgl2 } from "/@phi/src/script/easyWebgl2.js"

export class PHI {
    constructor(id){
        const canvas_ = document.getElementById(id)
        canvas_.width = innerWidth
        canvas_.height = innerHeight
        canvas_.style.margin = 0
        canvas_.style.padding = 0
        this.canvas = canvas_;
        this.app = new easyWebgl2(this.canvas);
        this.textCanvas = null;
        this.ctx = null;
        this.autoResize = false;
        this.dpr = 1;
        this.width = 0;
        this.height = 0;
        this.settingList = {}
        
    }

    setting(name=String,value=Boolean){
        if (Object.hasOwn(this.settingList,name)){
            this.settingList[name] = value
        }
    }


    async imgLoad(src){
        const img_ = await this.app.loadImage(src);
        return img_
    }

    textDisplay(id){
        this.textCanvas = document.getElementById(id);
        this.textCanvas.width = this.canvas.width;
        this.textCanvas.height = this.canvas.height;
        this.ctx = this.textCanvas.getContext('2d');
        this.resizeDisplay()
    }

    async font(name,path){
        const font = new FontFace(name, `url(${path})`);
        await font.load();
        document.fonts.add(font);
    }


    text(text,pos=[0,0],size='20px',color='balck',font=null,align='left'){
        if (this.ctx == null){
            console.error('text canvas is not defined')
            return;
        }
        this.ctx.save();
        
        if (font == null || font == undefined || typeof(font) != String){
            this.ctx.font = `${size} serif`;
        } else {
            this.ctx.font = `${size} ${font}`;
        }
        
        this.ctx.fillStyle = color;
        this.ctx.textAlign = align;
        this.ctx.textBaseline = 'alphabetic';
        this.ctx.fillText(text, pos[0],pos[1]);
        this.ctx.textAlign = 'left';
        this.ctx.restore();
    }


    resizeTextCanvas(baseWidth = 1920, baseHeight = 1080) {
        if (this.textCanvas != null){
            this.textCanvas.width = baseWidth + 'px'
            this.textCanvas.height = baseHeight + 'px'
            const displayWidth  = Math.floor(baseWidth * this.dpr)
            const displayHeight = Math.floor(baseHeight * this.dpr)
            if (this.textCanvas.width !== displayWidth || this.textCanvas.height !== displayHeight) {
                this.textCanvas.width  = displayWidth
                this.textCanvas.height = displayHeight
                this.ctx.setTransform(this.dpr, 0, 0, this.dpr, 0, 0)
            }
        }
    }


    resizeDisplay(){
        this.app.resizeCanvas()
        this.dpr = this.app.dpr
        this.width = this.canvas.width;
        this.height = this.canvas.height;
        this.resizeTextCanvas(this.width,this.height)

    }



    display(size){
        this.resizeDisplay();
        this.canvas.width = size[0];
        this.canvas.height = size[1];
        this.width = size[0];
        this.height = size[1];
        this.resizeDisplay();
        // console.log(this.canvas.width)
    }

    object(img, pos, size = null, vertex = null,texcoord=null){
        const obj = { 
            img: null, 
            x:0, 
            y:0, 
            width:0,
            height:0,
            vertex: null, 
            angle:0, 
            texcoord:null, 
            startX : 0, 
            startY : 0,
            startWidth : 0,
            startHeight : 0, 
            fillColor:null,
        };

        
        obj.img = img;
        obj.x = pos[0];
        obj.y = pos[1];
        obj.startX = obj.x
        obj.startY = obj.y


        if (size === null){
            obj.width = img.width;
            obj.height = img.height;
        } else {
            obj.width = size[0];
            obj.height = size[1];
        }

        if (vertex == null){
            const x1 = obj.x;
            const y1 = obj.y;
            const x2 = obj.x + obj.width;
            const y2 = obj.y + obj.height;
            obj.vertex = [x1, y1,x2, y1,x1, y2,x1, y2,x2, y1,x2, y2]
        } else {
            obj.vertex = vertex;
        }
        


        if (texcoord == null){
            const u1 = 0.0;       
            const v1 = 0.0;       
            const u2 = 1.0;       
            const v2 = 1.0;       

            texcoord = 
            obj.texcoord = [
                u1, v1,
                u2, v1,
                u1, v2,
                u1, v2,
                u2, v1,
                u2, v2
            ];

        } else {
            obj.texcoord = texcoord;
        }


        return obj;
    }

    blit(obj_,mark='null'){
        const obj = {...obj_}
        
        this.reSizeBy(obj,this.app.dpr);
        // this.goto(obj,[obj.x/this.app.dpr,obj.y/this.app.dpr]);


        // console.log(obj.x)

        if (!obj.img) return;

        if ( mark == 'center' ){
            this.move(obj,-(obj.width/2),-(obj.height/2))
            this.app.drawImage(obj.img,obj.x,obj.y,obj.width,obj.height,obj.vertex,obj.texcoord,obj.fillColor);
            this.move(obj,+(obj.width/2),+(obj.height/2))

        } else {
            this.app.drawImage(obj.img,obj.x,obj.y,obj.width,obj.height,obj.vertex,obj.texcoord,obj.fillColor);
            
        }

        return true;
    }





    mainLoop(func){
        this.app.update(func);
    }

    fill(r,g,b,a=255){
        if (this.ctx != null && this.textCanvas != null) {this.ctx.clearRect(0, 0, this.textCanvas.width, this.textCanvas.height)}
        if (r <= 1 && g <= 1 && b <= 1 && a <= 1){
            this.app.clear(
                r,g,b,a
            );
        } else {
            this.app.clear(
                r/255,g/255,b/255,a/255
            );
        }
    }


    distanceGetObj(obj1,obj2,mark="center"){
        if (mark == 'center') {
            return Math.sqrt(((obj2.x+(obj2.width/2)) - (obj1.x+(obj1.width/2)))**2 + ((obj2.y+(obj2.height/2)) - (obj1.y+(obj1.height/2)))**2)

        } else {
            return Math.sqrt((obj2.x - obj1.x)**2 + (obj2.y - obj1.y)**2)
        }
    }

    isEncounterObj(obj1, obj2) {
        return (
            obj1.x < obj2.x + obj2.width &&
            obj1.x + obj1.width > obj2.x &&
            obj1.y < obj2.y + obj2.height &&
            obj1.y + obj1.height > obj2.y
        );
    }

    isEncounterPos(obj,pos){ // 추후 가능하다면 정점이 전환된 이미지의 접촉여부도 감지할수 있게 만들기
        if (((obj.x <= pos[0])  && (pos[0] <= obj.x + obj.width)) && ((obj.y <= pos[1]) && (pos[1] <= obj.y + obj.height))) {          
            return true  
        }
        return false
    }

    random(num1,num2){
        if (num1 > num2) {
            console.error('랜덤오류. 최솟값이 최댓값보다 클수 없습니다')
            return;
        }
        return Math.floor(Math.random() * (num2 - num1 + 1)) + num1
    }

    randomFloat(num1,num2){
        if (num1 > num2) {
            console.error('랜덤오류. 최솟값이 최댓값보다 클수 없습니다')
            return;
        }
        return (Math.random() * (num2 - num1)) + num1
    }


    rotate(obj,deg,mark="center",pos=[0,0]){
        const rad = deg * Math.PI / 180;
        const cos = Math.cos(rad);
        const sin = Math.sin(rad);
        const rotated = [];

        
        if (mark == 'zero'){
            for (let i = 0; i < obj.vertex.length; i += 2) {
                const x = obj.vertex[i];
                const y = obj.vertex[i + 1];
                const rx = x * cos - y * sin;
                const ry = x * sin + y * cos;
                rotated.push(rx, ry);
            }
        } else if (mark == 'center') {
            for (let i = 0; i < obj.vertex.length; i += 2) {
                const x = obj.vertex[i] - (obj.x+obj.width/2);
                const y = obj.vertex[i + 1] - (obj.y+obj.height/2);
                const rx = x * cos - y * sin + (obj.x+obj.width/2);
                const ry = x * sin + y * cos + (obj.y+obj.height/2);
                rotated.push(rx, ry);
            }
        } else if (mark == 'custom') {
            for (let i = 0; i < obj.vertex.length; i += 2) {
                const x = obj.vertex[i] - pos[0];
                const y = obj.vertex[i + 1] - pos[1];
                const rx = x * cos - y * sin + pos[0];
                const ry = x * sin + y * cos + pos[1];
                rotated.push(rx, ry);
            }
        }

        obj.vertex = rotated;
        obj.angle += deg;
        return obj;
    }

    reSizeBy(obj_,ratio,mark='center'){
        
        if (mark == 'center'){
            const obj = {
                ...obj_,
                vertex: [...obj_.vertex]
            };
            obj_.width = obj_.width * ratio
            obj_.height = obj_.height * ratio
            obj_.x -= obj_.width/2
            obj_.y -= obj_.height/2
            obj_.x += obj.width/2
            obj_.y += obj.height/2
            

            //  이건 가장 나중에 obj_의 버텍스 설정 (신경안써도됨)
            const x1 = obj_.x;
            const y1 = obj_.y;
            const x2 = obj_.x + obj_.width;
            const y2 = obj_.y + obj_.height;
            obj_.vertex = [x1, y1,x2, y1,x1, y2,x1, y2,x2, y1,x2, y2]
            return obj_

        } else {
            const obj = {
                ...obj_,
                vertex: [...obj_.vertex]
            };
            obj_.width = obj_.width * ratio;
            obj_.height = obj_.height * ratio;
            const x1 = obj_.x;
            const y1 = obj_.y;
            const x2 = obj_.x + obj_.width;
            const y2 = obj_.y + obj_.height;
            obj_.vertex = [x1, y1,x2, y1,x1, y2,x1, y2,x2, y1,x2, y2]
            return obj_
        }
    }
    

    move(obj,pos=Array){
        const addX = pos[0]
        const addY = pos[1]
        obj.x += addX
        obj.y += addY

        for(let i = 0; i < obj.vertex.length; i+=2){
            obj.vertex[ i ] += addX
            obj.vertex[ i + 1 ] += addY
        }
        
        return obj;
    }

    moveX(obj,addX){
        obj.x += addX
        for(let i = 0; i < obj.vertex.length; i+=2){
            obj.vertex[ i ] += addX
        }
        return obj;
    }

    moveY(obj,addY){
        obj.y += addY
        for(let i = 0; i < obj.vertex.length; i+=2){
            obj.vertex[ i + 1 ] += addY
        }
        return obj;
    }

    goto(obj,pos=Array,mark='zero'){
        let addX = pos[0] - obj.x
        let addY = pos[1] - obj.y 
        
        if (mark == 'center'){
            addX -= obj.width/2 
            addY -= obj.height/2
        }

        obj.x +=  pos[0] - obj.x
        obj.y += pos[1] - obj.y 

        for(let i = 0; i < obj.vertex.length; i+=2){
            obj.vertex[ i ] += addX
            obj.vertex[ i + 1 ] += addY
        }
        return obj;
    }

    
    flip(obj,what='hor'){

        if (what == 'hor'){
            for(let i=0; i<obj.texcoord.length; i+=2){
                obj.texcoord[i] = 1 - obj.texcoord[i]
            }
        } else if (what == 'ver'){
            for(let i=0; i<obj.texcoord.length; i+=2){
                obj.texcoord[i+1] = 1 - obj.texcoord[i+1]
            }
        }
    }
}

PHI.prototype.obj = PHI.prototype.object;
PHI.prototype.loop = PHI.prototype.mainLoop;
PHI.prototype.loop = PHI.prototype.mainLoop;
PHI.prototype.movex = PHI.prototype.moveX;
PHI.prototype.movey = PHI.prototype.moveY;
PHI.prototype.Goto = PHI.prototype.goto;
PHI.prototype.reSizeDisplay = PHI.prototype.resizeDisplay;