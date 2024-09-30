import { Scene } from "three";
import { PLYLoader } from "three/examples/jsm/loaders/PLYLoader";
import { ModelStates } from "./scene";
import { onFlyFileLoad } from "./helpers/plyLoader";
import { genFiles, importModel, splitPly } from "./helpers/buttonEvent";

function bindButtonEvent(btn: string, callback: () => void) {
    $(btn).on("click", callback);
}

export async function loadMenu(loader: PLYLoader, modelStates: ModelStates, scene: Scene) {
    // add new button event listener
    bindButtonEvent("#splitPly", splitPly.bind(null, modelStates));
    bindButtonEvent("#loadPlyDir", () => {
        $("#fileInputDir").click();
    });
    bindButtonEvent("#genFiles", genFiles.bind(null, $("#fileInputDir").get(0) as HTMLInputElement));
    $("#fileInputDir").on("change", importModel.bind(null, $("#fileInputDir").get(0) as HTMLInputElement));
    $("#fileInput").on("change", onFlyFileLoad.bind(null, loader, modelStates, scene));
}

