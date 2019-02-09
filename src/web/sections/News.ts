export abstract class News {
    constructor() {

    }

    public abstract init(): void;

    /**
     * Get specifed news item
     * @param n Item index
     */
    public abstract getItem(n: number): NewsItem;

    /**
     * Get number of news items
     */
    public abstract getItemCount(): number;

    /**
     * Update news items
     */
    public abstract update(): void;
}

export interface NewsItem {
    title:       string;
    author:      string;
    published:   Date;
    description: string;
    imageUrl:    string;
    url:         string;
}