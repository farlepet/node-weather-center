namespace config {
    export namespace weather {
        /** Rate, in ms, at which to request updates to weather. */
        export var update_rate: number = 5000;

        /** Location name, for display */
        export var location_name: string = "";
    }

    export namespace newsAPI {
        /** Rate, in ms, at which to request update from news api */
        export var update_rate: number = 60000;

        /** newsapi.org API key */
        export var api_key:  string = "";
        /** newsapi country code. ex: us */
        export var country:  string = "";
        /** newsapi category/categories. ex: technology */
        export var category: string = "";

        //Uncomment to enable category selection:
        //export var url: string = "https://newsapi.org/v2/top-headlines?country=" + country + "&category=" + category + "&apiKey=" + api_key;
        export var url: string = "https://newsapi.org/v2/top-headlines?country=" + country + "&apiKey=" + api_key;
    }

    export namespace backdrops {
        /** Backdrop base directory */
        export var backdrop_dir: string = "/img/backdrops/";

        export interface BackdropEntry {
            /** Name of backdrop set */
            name:          string;
            /** Subdirectory within backdrop_dir */
            dir:           string;
            /** Default file for day */
            default_day:   string;
            /** Default file for night */
            default_night: string;

            /**
             * List of backdrop images for different conditions
             * 
             * Filename format: [file_day/file_night]_[0 <= n <= n_files_day/n_files_night].png
             */
            backdrops: {
                /** Condition string */
                condition:     string;
                /** Prefix for day */
                file_day:      string;
                /** Prefix for night */
                file_night:    string;
                /** Number of files for day */
                n_files_day:   number;
                /** Number of files for night */
                n_files_night: number;
            }[];
        }

        /** List of backdrop themes */
        export var backdropThemes : BackdropEntry[] = [
            // Place themes here
        ];

        /** Which theme to choose */
        export var backdropTheme: number = 0;

        /**
         * Get a random backdrop image with given conditon and time.
         * 
         * @param condition Current condition
         * @param time Current time (day/night)
         * @return Path to file, if one exists, else the default for the given time
         */
        export function getBackdropFile(condition: string, time: string): string {
            var bEnt = backdropThemes[backdropTheme];
            var baseDir = backdrop_dir + bEnt.dir + "/";

            for(var i = 0; i < bEnt.backdrops.length; i++) {
                if(bEnt.backdrops[i].condition === condition) {
                    if(time == "night") {
                        if(bEnt.backdrops[i].n_files_night > 0) {
                            return baseDir + bEnt.backdrops[i].file_night + "_"
                                + Math.floor(Math.random() * bEnt.backdrops[i].n_files_night) + ".png";
                        }
                    } else {
                        if(bEnt.backdrops[i].n_files_day > 0) {
                            return baseDir + bEnt.backdrops[i].file_day + "_"
                                + Math.floor(Math.random() * bEnt.backdrops[i].n_files_day) + ".png";
                        }
                    }
                }
            }

            if(time == "day")
                return baseDir + bEnt.default_day;
            else
                return baseDir + bEnt.default_night;
        }

        /**
         * Get a list of backdrop images with given conditon and time.
         * 
         * @param condition Current condition
         * @param time Current time (day/night)
         * @return Array of image paths, if any exist, else the default for the given time
         */
        export function getBackdropFiles(condition: string, time: string): string[] {
            var bEnt          = backdropThemes[backdropTheme];
            var baseDir       = backdrop_dir + bEnt.dir + "/";
            var ret: string[] = new Array();

            for(var i = 0; i < bEnt.backdrops.length; i++) {
                if(bEnt.backdrops[i].condition === condition) {
                    if(time == "night") {
                        if(bEnt.backdrops[i].n_files_night > 0) {
                            for(var j = 0; j < bEnt.backdrops[j].n_files_night; j++) {
                                ret[j] = baseDir + bEnt.backdrops[i].file_night + "_" + j + ".png";
                            }
                            return ret;
                        }
                    } else {
                        if(bEnt.backdrops[i].n_files_day > 0) {
                            for(var j = 0; j < bEnt.backdrops[i].n_files_day; j++) {
                                ret[j] = baseDir + bEnt.backdrops[i].file_day + "_" + j + ".png";
                            }
                            return ret;
                        }
                    }
                }
            }

            if(time == "day")
                return [ baseDir + bEnt.default_day ];
            else
                return [ baseDir + bEnt.default_night ];
        }
    }
}