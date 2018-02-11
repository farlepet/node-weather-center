/// <reference path="../../config.ts"/>
/// <reference path="../../global.ts"/>
/// <reference path="../../api.ts"/>

import * as _debug from 'debug';
import * as axios  from 'axios';

import {config}          from "../../config";

/**
 * Class for accessing the wunderground.com weather API
 */
export class WeatherAPI {
    /** Weather Underground API key */
    private apiKey: string = null;

    /** General-purpose log */
    private log:        debug.IDebugger;
    /** Request log */
    private requestLog: debug.IDebugger;

    private conditions: WeatherAPIConditionsAndForecast = null;

    /**
     * Constructor
     * 
     * @param apiKey Weather Underground API key
     */
    constructor(apiKey: string) {
        this.apiKey = apiKey;

        this.log        = _debug("api:weather");
        this.requestLog = _debug("api:weather:request");

        this.log("Weather API object instantiated");

        this.updateWeather("MN", "St_Paul");
        setInterval(() => {
            this.updateWeather("MN", "St_Paul");
        }, config.weather.update_rate);
    }

    /**
     * Returns the current weather conditions.
     */
    public getConditions() : WeatherAPIConditions {
        return this.conditions;
    }

    public getSmallWeather() : SmallWeatherAPI {
        var w: SmallWeatherAPI = <SmallWeatherAPI>new Object();

        /*w = {
            weather_str: "Light Snow",
            temp: 15.3,
            humidity: 86,
            pressure: 29.9,
            dewpoint: 12,
            windchill: 15,
            visibility: 0.8,
            wind_speed: 2,
            wind_deg: 90,
            precip_1hr: 0,
            precip_day: 0,
            _icon: "snow",
            _icon_url: "http://icons.wxug.com/i/c/k/snow.gif"
        };*/

        if(this.conditions === null) return null;

        w.weather_str = this.conditions.current_observation.weather;
        
        // TODO: Support multiple units!
        w.temp       = this.conditions.current_observation.temp_f;
        w.humidity   = parseFloat(this.conditions.current_observation.relative_humidity);
        w.pressure   = parseFloat(this.conditions.current_observation.pressure_in);
        w.dewpoint   = this.conditions.current_observation.dewpoint_f;
        w.windchill  = parseFloat(this.conditions.current_observation.windchill_f);
        w.visibility = parseFloat(this.conditions.current_observation.visibility_mi);

        w.wind_speed = this.conditions.current_observation.wind_mph;
        w.wind_deg   = this.conditions.current_observation.wind_degrees;

        w.precip_1hr = parseFloat(this.conditions.current_observation.precip_1hr_in);
        w.precip_day = parseFloat(this.conditions.current_observation.precip_today_in);

        w._icon      = this.conditions.current_observation.icon;
        w._icon_url  = this.conditions.current_observation.icon_url;

        return w;
    }

    public getSmallForecast() : SmallForecastAPI {
        var w: SmallForecastAPI = <SmallForecastAPI>new Object();

        if(this.conditions === null) return null;
        w.forecast = new Array();

        for(var i: number = 0; i < this.conditions.forecast.simpleforecast.forecastday.length; i++) {
            var day = this.conditions.forecast.simpleforecast.forecastday[i];
            w.forecast[i] = <SmallForecastAPIDay>new Object();
            
            w.forecast[i].weather_str = day.conditions;

            w.forecast[i].high = parseFloat(day.high.fahrenheit);
            w.forecast[i].low  = parseFloat(day.low.fahrenheit);

            w.forecast[i].precip_day   = day.qpf_day.in;
            w.forecast[i].precip_night = day.qpf_night.in;
            w.forecast[i].precip_total = day.qpf_allday.in;

            w.forecast[i].snow_day   = day.snow_day.in;
            w.forecast[i].snow_night = day.snow_night.in;
            w.forecast[i].snow_total = day.snow_allday.in;

            w.forecast[i].humidity = day.avehumidity;

            w.forecast[i].wind_speed_max = day.maxwind.mph;
            w.forecast[i].wind_speed_avg = day.avewind.mph;
            w.forecast[i].wind_deg_avg   = day.avewind.degrees;

            w.forecast[i]._icon     = day.icon;
            w.forecast[i]._icon_url = day.icon_url;
        }

        return w;
    }

    /**
     * Grabs the most recent weather data, and returns the JSON-formatted
     * result.
     * 
     * @param state Two letter state code
     * @param city City, capatalized with underscores
     */
    private updateWeather(state: string, city: string) : string {
        var url: string = config.weather.api_base_url + this.apiKey + "/forecast10day/conditions/q/" + state + "/" + city + ".json";

        this.requestLog("Grabbing latest weather information from url: " + url);

        axios.default.get(url).then((response: axios.AxiosResponse) => {
            var cond: WeatherAPIConditionsAndForecast = response.data;
            this.requestLog("Received response");
            if("error" in cond.response) {
                this.requestLog("Error included in response: " + cond.response.error.type + ": " + cond.response.error.description);
            } else {
                this.requestLog("Response good");
                this.conditions = cond;
            }
        }).catch((error: any) => {
            this.requestLog("Axios error: " + error);
        });

        return null;
    }
}


export interface WeatherAPIConditionsAndForecast {
    response:            WeatherAPIResponse;
    current_observation: WeatherAPICurrentObservation;
    forecast:            WeatherAPIForecast;
}

export interface WeatherAPIConditions {
    response:            WeatherAPIResponse;
    current_observation: WeatherAPICurrentObservation;
}

export interface WeatherAPIResponse {
    version: string;
    termsorService: string;
    features: {
        conditions: number;
    };
    error: {
        type:        string;
        description: string;
    };
}

export interface WeatherAPICurrentObservation {
    image: {
        url: string;
        title: string;
        link: string;
    };

    display_location: {
        full:            string;
        city:            string;
        state:           string;
        state_name:      string;
        country:         string;
        country_iso3166: string;
        zip:             string;
        magic:           string;
        wmo:             string;
        latitude:        string;
        longitude:       string;
        elevation:       string;
    };

    observation_location: {
        full:  string;
        city:  string;
        state: string;
        country:         string;
        country_iso3166: string;
        latitude:        string;
        longitude:       string;
        elevation:       string;
    }

    estimated: {

    };

    station_id: string;
    
    observation_time:        string;
    observation_time_rfc822: string;
    observation_epoch:       string;

    local_time_rfc822: string;
    local_epoch:       string;
    local_tz_short:    string;
    local_tz_long:     string;
    local_tz_offset:   string;

    weather: string;

    temperature_string: string;
    temp_f:             number;
    temp_c:             number;
    relative_humidity:  string;

    wind_string:   string;
    wind_dir:      string;
    wind_degrees:  number;
    wind_mph:      number;
    wind_gust_mph: number;
    wind_kph:      number;
    wind_gust_kph: number;

    pressure_mb:    string;
    pressure_in:    string;
    pressure_trend: string;

    dewpoint_string: string;
    dewpoint_f:      number;
    dewpoint_c:      number;

    heat_index_string: string;
    heat_index_f:      string;
    heat_index_c:      string;

    windchill_string: string;
    windchill_f:      string;
    windchill_c:      string;

    feelslike_string: string;
    feelslike_f:      string;
    feelslike_c:      string;

    visibility_mi: string;
    visibility_km: string;

    solarradiation: string;
    UV:             string;

    precip_1hr_string:   string;
    precip_1hr_in:       string;
    precip_1hr_metric:   string;
    precip_today_string: string;
    precip_today_in:     string;
    precip_today_metric: string;

    icon:     string;
    icon_url: string;

    forecast_url: string;
    history_url:  string;
    ob_url:       string;

    nowcast: string;
}


export interface WeatherAPISimpleForecastDay {
    date: {
        epoch:  string;
        pretty: string;

        day:   number;
        month: number;
        year:  number;
        yday:  number;
        hour:  number;
        min:   string;
        sec:   number;
        isdst: string;

        monthname:       string;
        monthname_short: string;
        weekday_short:   string;
        weekday:         string;

        ampm:     string;
        tz_short: string;
        tz_long:  string;
    };

    period: number;

    high: {
        fahrenheit: string;
        celsius:    string;
    };

    low: {
        fahrenheit: string;
        celsius:    string;
    };

    conditions: string;
    icon:       string;
    icon_url:   string;
    skyicon:    string;
    pop:        number;

    qpf_allday: { in: number; mm: number; };
    qpf_day:    { in: number; mm: number; };
    qpf_night:  { in: number; mm: number; };

    snow_allday: { in: number; cm: number; };
    snow_day:    { in: number; cm: number; };
    snow_night:  { in: number; cm: number; };
    
    maxwind: {
        mph:     number;
        kph:     number;
        dir:     string;
        degrees: number;
    };

    avewind: {
        mph:     number;
        kph:     number;
        dir:     string;
        degrees: number;
    };

    avehumidity: number;
    maxhumidity: number;
    minhumidity: number;
}

export interface WeatherAPIForecast {
    txt_forecast: any;
    simpleforecast: {
        forecastday: WeatherAPISimpleForecastDay[];
    }
}