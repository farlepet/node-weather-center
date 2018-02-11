/// <reference path="../sections/Weather.ts"/>
/// <reference path="../sections/News.ts"/>

abstract class Overlay {
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