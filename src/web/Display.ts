/// <reference path="./sections/Weather.ts"/>
/// <reference path="./overlays/Overlay.ts"/>
/// <reference path="./overlays/OrigionalOverlay.ts"/>


class Display {
    /** Currently displayed overlay */
    private overlay : Overlay;

    constructor() {
        $("document").ready(() => {
            this.overlay = new Overlays.OrigionalOverlay();
            this.overlay.init();
            this.overlay.update();
        });
    }
}