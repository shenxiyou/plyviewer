import { Scene, BufferGeometry, PointsMaterial, Points } from "three";
import { PLYLoader } from "three/examples/jsm/loaders/PLYLoader";
import { showNetLoadingView, hideNetLoadingView } from "../NetLoadingView";
import { ModelStates } from "../scene";
function readFileInChunks(file: File, chunkSize: number, callback: (chunk: ArrayBuffer | null) => void) {
    const totalSize = file.size;
    let offset = 0;

    const reader = new FileReader();
    reader.onload = function (e) {
        // 处理读取的chunk
        callback(e.target?.result as ArrayBuffer);

        // 继续读取下一个块
        offset += chunkSize;
        if (offset >= totalSize) {
            callback(null);
            console.log('文件读取完成');
            return;
        }

        const slice = file.slice(offset, offset + chunkSize);
        reader.readAsArrayBuffer(slice);
    };

    reader.onerror = function (e) {
        console.error('读取文件出错:', e);
    };

    // 读取第一块文件
    const slice = file.slice(offset, chunkSize);
    reader.readAsArrayBuffer(slice);
}
export function onFlyFileLoad(loader: PLYLoader, modelStates: ModelStates, scene: Scene, event: Event) {
    const fileInput = event.target as HTMLInputElement;
    if (fileInput.files == null || fileInput.files.length == 0) return;
    showNetLoadingView(0);
    modelStates.reset();
    const file = fileInput.files[0];
    const chunkSize = 1024 * 1024 * 20; // 20MB
    const arrayBuffer: Uint8Array = new Uint8Array(file.size);
    let offset = 0;
    readFileInChunks(file, chunkSize, (chunk: ArrayBuffer | null) => {
        if (chunk) {
            // 处理每个块的数据
            arrayBuffer.set(new Uint8Array(chunk), offset);
            offset += chunk.byteLength;
            showNetLoadingView(Math.floor((offset / file.size) * 100));
        }
        else {
            // 读取完成，开始加载
            showNetLoadingView(Math.floor((offset / file.size) * 100));
            loadPlyByArrayBuffer(loader, arrayBuffer.buffer, modelStates, scene);
        }
    });
}

function loadPlyByArrayBuffer(loader: PLYLoader, arrayBuffer: ArrayBuffer, modelStates: ModelStates, scene: Scene) {
    try {
        const geometry = loader.parse(arrayBuffer);
        createMesh(geometry, modelStates, scene);
    } catch (e) {

    }
    hideNetLoadingView();
}

function createMesh(geometry: BufferGeometry, modelStates: ModelStates, scene: Scene) {
    geometry.computeVertexNormals();

    const material = new PointsMaterial({
        size: 0.001,
        vertexColors: true,
    });
    const mesh = new Points(geometry, material);

    mesh.scale.multiplyScalar(modelStates.scale);

    mesh.castShadow = true;
    mesh.receiveShadow = true;

    scene.add(mesh);
    modelStates.model = mesh;
}

export function loadPly(loader: PLYLoader, url: string, modelStates: ModelStates, scene: Scene) {
    showNetLoadingView(0);
    loader.load(url, function (geometry) {
        createMesh(geometry, modelStates, scene);
        hideNetLoadingView();
    }, function (xhr) {
        showNetLoadingView(Math.floor(xhr.loaded / xhr.total * 100));
    }, function () {
        hideNetLoadingView();
    });
}