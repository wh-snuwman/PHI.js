import { applePhi } from "../../applePhi/src/script/applePhi.js"


(async () => {
    
const phi = new applePhi("display-canvas");
await phi.display([innerWidth, innerHeight]);

phi.textDisplay("text-canvas");

window.addEventListener('resize',()=>{
    phi.resizeDisplay()
})


let test = await phi.quickObj(null,[0,40],[40,40],[255,0,0,255]) 
phi.reSize(test,[200,1000])

let i = 0
phi.loop(() => {
    phi.fill(90, 90, 100);

    phi.blit(test)

    phi.reserve('test',0.1,()=>{ 
        phi.move(test,[
            ((phi.width/2) - test.x) / 10,
            ((phi.height/2) - test.y) / 10,
        ])
        phi.rotate(test,(360 - test.angle) / 10)
        phi.reSize(test,[
            test.width + (400 - test.width)/10,
            test.height + (1000 - test.height)/10,
        ])
    })

    phi.text('Hello World', [10, 30]);

    
    
    
});

})();