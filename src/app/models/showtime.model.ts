import { Movie } from "./movie.model";
import { Theatre } from "./theatre.model";

export interface Showtime {
    id: number;
    // Full entities returned by Spring Boot (without lazy loading issues)
    movie: Movie;
    theatre: Theatre;

    // Java LocalDateTime is typically serialized as a string in ISO format
    startTime: string;
    priceModifier: number; // Double from Java maps to number in TS
}