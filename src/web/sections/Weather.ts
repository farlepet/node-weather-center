/// <reference path="../../api.ts"/>
/// <reference path="../../../node_modules/axios/index.d.ts"/>
/// <reference path="../config.ts"/>


declare var axios : AxiosStatic;

class Weather {
    private conditions: SmallWeatherAPI  = undefined;
    private forecast:   SmallForecastAPI = undefined;
    
    constructor() {
        
    }

    public init() {
        this.update();
        setInterval(() => this.update(), config.weather.update_rate);
    }

    public update() {
        var url: string = "/api/weather/short";
        axios.default.get(url).then((response: axios.AxiosResponse) => {
            var cond: SmallWeatherAPI = response.data;
            console.info("Received conditions response");
            this.conditions = cond;
        }).catch((error: any) => {
            console.error("Axios error: " + error);
        });

        var url: string = "/api/weather/forecast";
        axios.default.get(url).then((response: axios.AxiosResponse) => {
            var fc: SmallForecastAPI = response.data;
            console.info("Received forecast response");
            this.forecast = fc;
        }).catch((error: any) => {
            console.error("Axios error: " + error);
        });
    }

    public getWeather() : SmallWeatherAPI {
        return this.conditions;
    }

    public getTemp() : number | string {
        if(this.conditions === undefined) {
            return "--";
        }
        return this.conditions.temp;
    }

    public getPrecipitation(): number | string {
        if(this.conditions === undefined) {
            return "--";
        }
        return this.conditions.precip_day;
    }

    public getWindSpeed(): number | string {
        if(this.conditions === undefined) {
            return "--";
        }
        return this.conditions.wind_speed;
    }

    public getWindDirection(): number {
        if(this.conditions === undefined) {
            return 0;
        }
        return this.conditions.wind_deg;
    }

    public getWindchill(): number | string {
        if(this.conditions === undefined) {
            return "--";
        }
        return this.conditions.windchill;
    }

    public getVisibility(): number | string {
        if(this.conditions === undefined) {
            return "--";
        }
        return this.conditions.visibility;
    }

    public getDewPoint(): number | string {
        if(this.conditions === undefined) {
            return "--";
        }
        return this.conditions.dewpoint;
    }

    public getIcon() : string {
        if(this.conditions === undefined) {
            return null;
        }
        return this.conditions._icon;
    }

    public getForecast(n: number): SmallForecastAPIDay {
        if(this.forecast === undefined) return null;

        if(n < 0 || n >= this.forecast.forecast.length) {
            console.error("getForecast: Day out of range: " + n);
            return null;
        }

        return this.forecast.forecast[n];
    }
}