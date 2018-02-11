import {WebServer} from "./WebServer";

import * as _debug from 'debug';

const PORT  = 3000;

var log = _debug("main");

log("Starting...");

var srv = new WebServer(PORT);

srv.init();
srv.start();