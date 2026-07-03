import { applePhi } from "../../applePhi/src/script/applePhi.js"


(async () => {
    
const phi = new applePhi("display-canvas");
await phi.display([innerWidth, innerHeight]);

phi.textDisplay("text-canvas");

window.addEventListener('resize',()=>{
    phi.resizeDisplay()
})


phi.loop(() => {
    phi.fill(90, 90, 100);
});

})();