import { applePhi } from "../../applePhi/src/script/applePhi.js"


(async () => {

const phi = new applePhi("display-canvas");
phi.textDisplay("text-canvas");
phi.display([innerWidth, innerHeight]);

window.addEventListener('resize',()=>{
    phi.resizeDisplay()
})


phi.loop(() => {
    phi.fill(255,255,255);


});


})();