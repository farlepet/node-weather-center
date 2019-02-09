import { Overlay } from "./overlays/Overlay";
import { Overlays } from "./overlays/OrigionalOverlay";

export class Display {
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