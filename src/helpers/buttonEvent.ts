import { ModelStates } from "../scene";

export function splitPly(modelStates: ModelStates) {
    if (!modelStates.model) return;
    console.log("Splitting PLY");
    postMeshDataToServer(modelStates);
}

function postMeshDataToServer(modelStates: ModelStates) {
    if (!modelStates.model) return;
    const geometry = modelStates.model.geometry;
    const vertices = geometry.getAttribute('position').array.buffer;
    const colors = geometry.getAttribute('color').array.buffer;
    const normals = geometry.getAttribute('normal').array.buffer;
    $.ajax({
        url: 'http://localhost:3000/split',
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