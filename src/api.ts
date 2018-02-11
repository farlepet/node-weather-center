interface SmallWeatherAPI {
    weather_str: string;

    temp:       number;
    humidity:   number;
    pressure:   number;
    dewpoint:   number;
    windchill:  number;
    visibility: number;

    wind_speed: number;
    wind_deg:   number;

    precip_1hr: number;
    precip_day: number;

    _icon:     string;
    _icon_url: string;
}

interface SmallForecastAPI {
    forecast: SmallForecastAPIDay[];
}

interface SmallForecastAPIDay {
    weather_str: string;

    high: number;
    low:  number;

    precip_day:   number;
    precip_night: number;
    precip_total: number;

    snow_day:   number;
    snow_night: number;
    snow_total: number;

    humidity: number;

    wind_speed_max: number;
    wind_speed_avg: number;
    wind_deg_avg:   number

    _icon:     string;
    _icon_url: string;
}