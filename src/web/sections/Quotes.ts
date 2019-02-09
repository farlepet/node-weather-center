import { AxiosStatic } from 'axios';
import * as axios from 'axios';

export class Quotes {
    private qf: QuotesFile;

    constructor() {
        this.update();
    }

    public update() {
        var url: string = "quotes.json";
        axios.default.get(url).then((response: axios.AxiosResponse) => {
            var cond: QuotesFile = response.data;
            console.info("Received quotes response");
            this.qf = cond;
        }).catch((error: any) => {
            console.error("Axios error: " + error);
        });
    }

    public getRandomQuote(): Quote {
        if(this.qf === undefined || this.qf.quotes.length < 1) return null;

        let idx = Math.floor(Math.random() * this.qf.quotes.length);

        return this.qf.quotes[idx];
    }
}

interface Quote {
    quote:  string;
    author: string;
}

interface QuotesFile {
    quotes: Quote[];
}
