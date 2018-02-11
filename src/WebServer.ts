import * as express from 'express';
import * as expressCore from "express-serve-static-core";
import * as _debug from 'debug';

import {WeatherAPI} from "./api/weather/WeatherAPI";
import {config} from "./config";

/**
 * Web server
 */
export class WebServer {
    /** Express server object */
    private app:  express.Express;
    /** TCP port number */
    private port: number;

    /** Weather API */
    private weather: WeatherAPI;

    /** General-purpose log */
    private log:           debug.IDebugger;
    /** Connection log */
    private connectionLog: debug.IDebugger;

    /**
     * Constructor, initializes state, and creates API instances
     * 
     * @param port TCP port to serve through
     */
    constructor(port: number) {
        this.app  = express();
        this.port = port;

        this.log           = _debug("WebServer");
        this.connectionLog = _debug("WebServer:connection");

        this.weather = new WeatherAPI(config.weather.api_key);
    }

    /**
     * Initialize server
     */
    public init() {
        this.app.use("/", express.static('dist/web'));
        
        this.app.get("/api/weather/:param", (req, res) => {
            this.reqApiWeatherParam(req, res);
        });
        //(req, res) => this.reqApiWeatherParam);
        
        this.log("Server initialized");
        
    }

    /**
     * Start server
     */
    public start() {
        this.app.listen(this.port, () => {
            this.connectionLog('Listening on port ' + this.port + '!');
        }).on("connection", (socket) => {
            this.connectionLog("CONN " +  socket.remoteAddress + ":" + socket.localPort);
        });

        this.log("Server started");
    }

    /*****************
     * API handlers: *
     *****************/

    /* Weather: */
    private reqApiWeatherParam(req: expressCore.Request, res: expressCore.Response): void {
        this.log("GET " + req.path);
        
        switch(req.params.param) {
            case "all": // Return everything
                res.json(this.weather.getConditions());
                break;
            
            case "short":
                res.json(this.weather.getSmallWeather());
                break;
            
            case "forecast":
                res.json(this.weather.getSmallForecast());
                break;
            
            default:
                res.json({
                    error: "Invalid parameter!"
                })
                break;
        }
    }
}