import { Scene } from "three";
import { PLYLoader } from "three/examples/jsm/loaders/PLYLoader";
import { ModelStates } from "./scene";
import { onFlyFileLoad } from "./helpers/plyLoader";
import { splitPly } from "./helpers/buttonEvent";

function bindButtonEvent(btn: string, callback: () => void) {
    $(btn).on("click", callback);
}

export async function loadMenu(loader: PLYLoader, modelStates: ModelStates, scene: Scene) {
    bindButtonEvent("#splitPly", splitPly.bind(null, modelStates));
    $("#fileInput").on("change", onFlyFileLoad.bind(null, loader, modelStates, scene));
    // const fileInput = document.getElementById("fileInput") as HTMLInputElement;
    // fileInput.addEventListener("change", onFlyFileLoad.bind(null, loader, modelStates, scene));
}

