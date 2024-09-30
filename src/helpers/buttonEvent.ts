import { ModelStates } from "../scene";
const host = "http://localhost:3000";
// 分割
export function splitPly(modelStates: ModelStates) {
    if (!modelStates.model) return;
    console.log("Splitting PLY");
    postMeshDataToServer(modelStates);
}

//加载文件列表
export function importModel(e: HTMLInputElement) {
    console.log("Importing Model");
    if(e == null || e.files == null || e.files.length == 0) return;
    let directoryHandle = e.files;
    var list:string[] = [];
    var files = ""
    for (let i = 0; i < directoryHandle.length; i++) {
        let file = directoryHandle[i];
        list.push(file.name);
        // console.log(file);
        files += file.name + "<br/>";
    }
    $("#fileList").html(files);
}

//处理文件列表
export function genFiles(e: HTMLInputElement) {
    console.log("genFiles Model");
    if(e == null || e.files == null || e.files.length == 0) return;
    var list:string[] = [];
    for (let i = 0; i < e.files.length; i++) {
        let file = e.files[i];
        list.push(file.name);
    }
    postFilesToServer(list);
}
function postMeshDataToServer(modelStates: ModelStates) {
    if (!modelStates.model) return;
    const geometry = modelStates.model.geometry;
    const vertices = geometry.getAttribute('position').array.buffer;
    const colors = geometry.getAttribute('color').array.buffer;
    const normals = geometry.getAttribute('normal').array.buffer;
    $.ajax({
        url: `${host}/split`,
        type: 'POST',
        data: {
            vertices: vertices,
            colors: colors,
            normals: normals
        },
        success: function (response) {
            console.log(response);
        },
        error: function (xhr, status, error) {
            console.error(error);
            console.error(xhr.responseText);
            console.error(status);
        }
    });
}

function postFilesToServer(list: string[]) {
    $.ajax({
        url: `${host}/import`,
        type: 'POST',
        data: {
            files: list
        },
        success: function (response) {
            console.log(response);
        },
        error: function (xhr, status, error) {
            console.error(error);
            console.error(xhr.responseText);
            console.error(status);
        }
    });
}
