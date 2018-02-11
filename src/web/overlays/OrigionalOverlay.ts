/// <reference path="./Overlay.ts"/>
/// <reference path="../util.ts"/>
/// <reference path="../sections/news/NewsAPI.ts"/>

namespace Overlays {
    interface weatherIcon {
        base:  string;
        day:   string;
        night: string;
    }

    export class OrigionalOverlay extends Overlay {
        private updateRate:         number = 5000;
        private backdropRotateRate: number = 60000;

        private weatherIcons: {[index: string] : weatherIcon} = {
            "snow": {
                base:  "snow.png",
                day:   "snow_day.png",
                night: "snow_night.png"
            },
            "rain": {
                base:  "rain.png",
                day:   "rain_day.png",
                night: "rain_night.png"
            },
            "clear": {
                base:  "sun_day.png",
                day:   "sun_day.png",
                night: "clear_night.png"
            },
            "fog": {
                base:  "fog_day.png",
                day:   "fog_day.png",
                night: "fog_night.png"
            },
            "windy": {
                base:  "wind.png",
                day:   "wind_day.png",
                night: "wind_night.png"
            },
            "thunder": {
                base:  "thunder.png",
                day:   "thunder_day.png",
                night: "thunder_night.png"
            },
            "tstorm": {
                base:  "tstorm.png",
                day:   "tstorm_day.png",
                night: "tstorm_night.png"
            },
            "partlycloudy": {
                base:  "cloudy_day.png",
                day:   "cloudy_day.png",
                night: "cloudy_night.png"
            },
            "mostlycloudy": {
                base:  "cloudy_day.png",
                day:   "cloudy_day.png",
                night: "cloudy_night.png"
            }
        };

        private currBackdropCondition: string;
        private currBackdropTime:      string;

        constructor() {
            super();

            this.news = new NewsAPI();

            this.createForecast();
        }

        public init() {
            super.init();

            this.news.init();

            setInterval(() => this.update(), this.updateRate);
            setInterval(() => this.rotateBackdrop(), this.backdropRotateRate);
        }
        
        public update() {
            this.updateBackdrop();
            this.updateDateTime();
            this.updateBriefWeather();
            this.updateExtendedWeather()
            this.updateForecast();
            this.updateNews();
        }


        private updateBackdrop() {
            var date = new Date();

            var cond = this.weather.getIcon();
            var time = (date.getHours() > 17) ? "night" : "day";

            if(this.currBackdropCondition === undefined || this.currBackdropCondition !== cond || this.currBackdropTime !== time) {
                var backdrops = config.backdrops.getBackdropFiles(cond, time);
                $(".backdrop").empty();
                backdrops.forEach((value: string, index: number, arr: string[]) => {
                    $(".backdrop").append(
                        $("<img/>", { src: value }).css({
                            display: (index === 0) ? "block" : "none",
                            "-webkit-animation-name": "fade",
                            "-webkit-animation-duration": "1s",
                            "animation-name": "fade",
                            "animation-duration": "1s"
                        }).addClass("backdropImg").addClass((index === 0) ? "active" : "inactive")
                    )
                });

                /*var backdrop = config.backdrops.getBackdropFile(cond, time);
                $(".backdrop").attr("src", backdrop);

                this.currBackdropCondition = cond;
                this.currBackdropTime      = time;*/
            }
        }

        private rotateBackdrop() {
            /*var date = new Date();
            
            var cond = this.weather.getIcon();
            var time = (date.getHours() > 17) ? "night" : "day";

            var backdrop = config.backdrops.getBackdropFile(cond, time);
            $(".backdrop").attr("src", backdrop);*/
        }

        private updateDateTime() {
            var date = new Date();

            $(".time .hour").html(util.pad(date.getHours(), 2, "0"));
            $(".time .minute").html(util.pad(date.getMinutes(), 2, "0"));
            $(".date .dateText").html(date.toDateString());
        }


        private updateBriefWeather() {
            // Todo: city

            var date = new Date();

            $(".briefWeather .day").html(util.dayToString(date.getDay()));
            $(".briefWeather .temp").html(this.weather.getTemp().toString());

            $(".briefWeather  .weatherIcon").attr("src", this.getWeatherIcon(this.weather.getIcon(), (date.getHours() > 17) ? "night" : "day"));
        }


        private updateExtendedWeather() {
            var today = this.weather.getForecast(0);
            if(today !== null) {
                $(".highLow .high").html(today.high.toString());
                $(".highLow .low").html(today.low.toString());
            }

            // TODO: Percent chance
            $(".precipContainer .precip").html(this.weather.getPrecipitation().toString());
            
            $(".windContainer .windSpeed").html(this.weather.getWindSpeed().toString());
            $(".windDirection").css("transform", "rotate(" + (this.weather.getWindDirection() + 180) + "deg)");

            $(".feelsLikeContainer .feelsLike").html(this.weather.getWindchill().toString());
            $(".visibilityContainer .visibility").html(this.weather.getVisibility().toString());
            $(".dewPointContainer .dewPoint").html(this.weather.getDewPoint().toString());
        }


        private createForecast() {
            $(".forecastDay").append(
                $("<span/>").addClass("day").text("Day")
            ).append(
                $("<img/>", {
                    src: "img/weather/cond_icons/rain.png"
                }).addClass("icon")
            ).append(
                $("<span/>").addClass("temp").addClass("degrees").html("--")
            ).each((idx: number, elem: HTMLElement) => {
                $(elem).css("left", idx * 20 + "%")
            });

            $(".forecastSeparator").append(
                $("<img/>", {
                    src: "img/separator.png"
                })
            ).each((idx: number, elem: HTMLElement) => {
                $(elem).css("left", (18.5 + idx * 20) + "%");
            });
        }

        private updateForecast() {
            var date = new Date();

            $(".forecastDay").each((idx: number, elem: HTMLElement) => {
                var day = this.weather.getForecast(idx + 1);
                if(day !== null) {
                    $(elem).find(".day").text(util.dayToShortString((date.getDay() + idx + 1) % 7));
                    $(elem).find(".icon").attr("src", this.getWeatherIcon(day._icon));
                    $(elem).find(".temp").html(day.high.toString());
                }
            });
        }

        private updateNews() {
            if(this.news.getItemCount() <= 0) return;

            $(".newsContainer").empty();

            for(var i = 0; i < 5; i++) {
                var item = this.news.getItem(i);
                if(item === null) break;

                $(".newsContainer").append(
                    $("<article/>").addClass("newsItem").append(
                        $("<img/>").addClass("thumb").attr("src", item.imageUrl)
                    ).append(
                        $("<header/>").append(
                            $("<h2/>").addClass("title").text(item.title)
                    ))
                );
            }
        }

        private getWeatherIcon(cond: string, time: string = "day"): string {
            if(cond in this.weatherIcons) {
                switch(time) {
                    case "day":
                        return "img/weather/cond_icons/" + this.weatherIcons[cond].day;
                    case "night":
                        return "img/weather/cond_icons/" + this.weatherIcons[cond].night;
                    default:
                        return "img/weather/cond_icons/" + this.weatherIcons[cond].base;
                }
            }

            switch(time) {
                case "day":
                    return "img/weather/cond_icons/" + this.weatherIcons["clear"].day;
                case "night":
                    return "img/weather/cond_icons/" + this.weatherIcons["clear"].night;
                default:
                    return "img/weather/cond_icons/" + this.weatherIcons["clear"].base;
            }
        }
    }
}