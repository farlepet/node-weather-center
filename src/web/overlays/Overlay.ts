import { Weather } from "../sections/Weather";
import { News } from "../sections/News";

export abstract class Overlay {
    protected container : JQuery;

    protected weather : Weather;
    protected news    : News;

    constructor() {
        this.container = $(".mainContainer");
        this.weather = new Weather();
    }

    public init(): void {
        this.weather.init();
    }

    public abstract update(): void;
}