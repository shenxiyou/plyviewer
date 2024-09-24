let netLoadingView: HTMLElement | null = null;
export function showNetLoadingView(progress: number) {
    if (netLoadingView === null) {
        netLoadingView = document.getElementById("loading");
    }
    netLoadingView!.style.display = "flex";
    netLoadingView!.innerHTML = `Loading... ${progress}%`;
}

export function hideNetLoadingView() {
    if (netLoadingView !== null) {
        netLoadingView!.style.display = "none";
    }
}