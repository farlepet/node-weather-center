export namespace util {
    export function pad(n: number | string, width: number, z: string = "0"): string {
        z = z || '0';
        n = n + '';
        return n.length >= width ? n : new Array(width - n.length + 1).join(z) + n;
    }

    export function dayToString(n: number): string {
        if(n > 6 || n < 0) return "N/A";
        return ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"][n];
    }

    export function dayToShortString(n: number): string {
        if(n > 6 || n < 0) return "N/A";
        return ["Sun", "Mon", "Tues", "Wed", "Thurs", "Fri", "Sat"][n];
    }
}