export namespace config {
    export namespace weather {
        /** Weather update rate (in milliseconds) */
        export const update_rate: number = 300000; // 5 minutes

        /** Weahter Underground API key */
        export const api_key: string = "";
        /** Two-letter state code. ex: MN */
        export const state: string   = "";
        /** City. ex: St_Paul */
        export const city: string    = "";

        export const api_host: string = "api.wunderground.com";
        export const api_base_path: string = "api/";

        export const api_base_url: string = "http://" + api_host + "/" + api_base_path;

    }
}