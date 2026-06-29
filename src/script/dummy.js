import { applePhi } from "../../applePhi/src/script/applePhi.js"


(async () => {

const phi = new applePhi("display-canvas");
phi.textDisplay("text-canvas");
phi.display([innerWidth, innerHeight]);

window.addEventListener('resize',()=>{
    phi.resizeDisplay()
})


const img = await phi.imgLoad('../src/img/0.png');
let test3dobj = phi.obj(img,[100,100],[500,500],[
    100,100,
    500,100,
    100,500,
    100,500,
    500,100,
    1000,1000,

])

phi.loop(() => {
    phi.fill(255,255,255);
    
    let test3dobj = phi.obj(img,[100,100],[400,400])

    if (phi.press_l){
        test3dobj = phi.obj(img,[100,100],[500,500],[
            100,100,
            500,100,
            100,500,
            100,500,
            500,100,
            phi.mousepos[0]/phi.screenRatio,phi.mousepos[1]/phi.screenRatio*phi.dpr
        ])
    }
    // console.log(phi.mousepos[0])
    phi.flip(test3dobj)

    phi.blit(test3dobj)

});


})();