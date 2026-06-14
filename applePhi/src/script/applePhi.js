import { core } from "./core.js"

export class applePhi {
    constructor(id){
        const canvas_ = document.getElementById(id)
        canvas_.width = innerWidth
        canvas_.height = innerHeight
        canvas_.style.margin = 0
        canvas_.style.padding = 0
        this.canvas = canvas_;
        this.app = new core(this.canvas);
        this.textCanvas = null;
        this.ctx = null;
        this.autoResize = false;
        this.dpr = 1;
        this.width = 0;
        this.height = 0;
        this.settingList = {}
        this.screenRatio = (1920 / this.width);
        this.sceneFunc = {}
        
        this.docsImg = {}
        this.docsObj = {}
        this.mainLoopFunc = function(){};
        this.scene = ''
        this.sceneChangeDetect = false
        this.update()
        
        
    }
    

    
    sceneCode(wantedScene,func){
        if (this.scene === wantedScene){
            this.sceneFunc[wantedScene] = func
        }
    }

    
    changeScene(scene){
        this.scene = scene;
        this.sceneChangeDetect = true;
    }



    mainLoop(func){
        this.mainLoopFunc = func;
    }

     

    update() {
        const loop = () => {
            this.mainLoopFunc()
            for (let key in this.sceneFunc){
                this.sceneFunc[key]()
            }
            
            requestAnimationFrame(loop);
        };
        requestAnimationFrame(loop);
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

    //#region 
    text(text,pos=[0,0],size='20px',color='black',font=null,align='left'){
        if (this.ctx == null){
            console.error('text canvas is not defined')
            return;
        }
        this.ctx.save();
        
        if (font == null || font == undefined || typeof(font) != 'string'){
            this.ctx.font = `${size} serif`;
        } else {
            this.ctx.font = `${size} ${font}`;
        }
        
        this.ctx.fillStyle = color;
        this.ctx.textAlign = align;
        this.ctx.textBaseline = 'alphabetic';
        this.ctx.fillText(text, pos[0]*this.screenRatio,pos[1]*this.screenRatio);
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
        this.screenRatio = (this.width / 1920);
        this.resizeTextCanvas(this.width,this.height)
    }

    display(size){
        this.canvas.width = size[0];
        this.canvas.height = size[1];
        this.width = size[0];
        this.height = size[1];
        this.resizeDisplay();
    }

    object(img, pos, size = null, vertex = null, texcoord = null){
        const w = size ? size[0] : img.width;
        const h = size ? size[1] : img.height;
        const v = vertex || [
            pos[0], pos[1], 
            pos[0] + w, pos[1], 
            pos[0], pos[1] + h, 
            pos[0], pos[1] + h, 
            pos[0] + w, pos[1], 
            pos[0] + w, pos[1] + h
        ];
        return { 
            img, x: pos[0], y: pos[1], width: w, height: h,
            vertex: v, angle: 0, 
            texcoord: texcoord || [0,0, 1,0, 0,1, 0,1, 1,0, 1,1],
            fillColor: null
        };
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

    isEncounterPos(obj,pos){
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
        const an = obj_.angle;
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
            const x1 = obj_.x;
            const y1 = obj_.y;
            const x2 = obj_.x + obj_.width;
            const y2 = obj_.y + obj_.height;
            obj_.vertex = [x1, y1,x2, y1,x1, y2,x1, y2,x2, y1,x2, y2]
            
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
        }
        this.rotate(obj_,an);
        return obj_
    }

    reSize(obj_,size){
        const an = obj_.angle;
        const obj = {
            ...obj_,
            vertex: [...obj_.vertex]
        };
        obj_.width = size[0];
        obj_.height = size[1];
        const x1 = obj_.x;
        const y1 = obj_.y;
        const x2 = obj_.x + obj_.width;
        const y2 = obj_.y + obj_.height;
        obj_.vertex = [x1, y1,x2, y1,x1, y2,x1, y2,x2, y1,x2, y2]
        this.rotate(obj_,an);
        return obj_
    }

    
    move(obj,pos=Array){
        obj.x += pos[0]
        obj.y += pos[1]
        for(let i = 0; i < obj.vertex.length; i+=2){
            obj.vertex[ i ] += pos[0]
            obj.vertex[ i + 1 ] += pos[1]
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


    blit(obj, mark = 'null') {  
        if (!obj.img) return;
        const { img, x, y, width, height, vertex, texcoord, fillColor } = obj;
        const ratioMulp =  this.screenRatio;
        const renderX = x * ratioMulp;
        const renderY = y * ratioMulp;
        const renderW = width * ratioMulp;
        const renderH = height * ratioMulp;
        const scaledVertex = vertex ? vertex.map(v => v * ratioMulp) : null;

        this.app.drawImage(
            img, 
            renderX, 
            renderY, 
            renderW, 
            renderH, 
            scaledVertex || vertex, 
            texcoord, 
            fillColor
        );
    }
    //#endregion


    async docsLoad(){
        location.replace("../applePhi/docs/docs.html");
    }

    
}
applePhi.prototype.obj = applePhi.prototype.object;
applePhi.prototype.loop = applePhi.prototype.mainLoop;
applePhi.prototype.movex = applePhi.prototype.moveX;
applePhi.prototype.movey = applePhi.prototype.moveY;
applePhi.prototype.Goto = applePhi.prototype.goto;
applePhi.prototype.reSizeDisplay = applePhi.prototype.resizeDisplay;