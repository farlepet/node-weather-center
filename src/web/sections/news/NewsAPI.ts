import { News, NewsItem } from "../News";
import { config } from "../../config";

import * as axios from 'axios';

export class NewsAPI extends News {
    private stories: NewsAPIResponse;

    constructor() {
        super();
    }

    public init(): void {
        this.update();
        setInterval(() => this.update(), config.newsAPI.update_rate);
    }

    public getItem(n: number): NewsItem {
        if(this.stories == null) return null;
        if(n < 0 || n >= this.stories.totalResults) {
            console.error("NewsAPI.getItem(): Index out of range: " + n);
            return null;
        }

        var story: NewsItem = <NewsItem>new Object();

        story.title  = this.stories.articles[n].title;
        story.author = this.stories.articles[n].author;
        story.description = this.stories.articles[n].description;
        story.url = this.stories.articles[n].url;
        story.imageUrl = this.stories.articles[n].urlToImage;

        story.published = new Date(this.stories.articles[n].title);

        return story;
    }

    public getItemCount(): number {
        if(this.stories === undefined) return 0;
        return this.stories.totalResults;
    }

    public update() {
        axios.default.get(config.newsAPI.url).then((response: axios.AxiosResponse) => {
            var cond: NewsAPIResponse = response.data;
            console.info("Received news response");
            this.stories = cond;
        }).catch((error: any) => {
            console.error("Axios error: " + error);
        });
    }
}

interface NewsAPIResponse {
    status: string;
    totalResults: number;
    articles: NewsAPIArticle[];
}

interface NewsAPIArticle {
    source: {
        id:   string;
        name: string;
    };
    author:      string;
    title:       string;
    description: string;
    
    url:        string;
    urlToImage: string;

    publishedAt: string;
}