import {PHI} from "/@phi/src/script/PHI.js"


(async () => {

    const phi = new PHI("display-canvas");
    phi.textDisplay("text-canvas");
    phi.display([innerWidth, innerHeight]);

    phi.loop(() => {
        phi.fill(255,255,255);

    });

})();