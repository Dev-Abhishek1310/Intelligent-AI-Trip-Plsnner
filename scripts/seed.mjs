import mongoose from "mongoose";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const envPath = path.join(__dirname, "..", ".env.local");
const env = fs.readFileSync(envPath, "utf8");
const uriLine = env.split("\n").find((l) => l.startsWith("MONGODB_URI="));
const MONGODB_URI = uriLine.replace("MONGODB_URI=", "").trim();

const DestinationSchema = new mongoose.Schema(
    {
        slug: { type: String, required: true, unique: true },
        name: String,
        country: String,
        image: String,
        tag: String,
        description: String,
        rating: Number,
        reviews: Number,
        trending: Boolean,
    },
    { timestamps: true }
);

const ReviewSchema = new mongoose.Schema(
    {
        author: String,
        avatarInitial: String,
        destination: String,
        rating: Number,
        title: String,
        body: String,
        tripType: String,
        helpful: Number,
    },
    { timestamps: true }
);

const Destination = mongoose.model("Destination", DestinationSchema);
const Review = mongoose.model("Review", ReviewSchema);

const DESTINATIONS = [
    { slug: "paris", name: "Paris", country: "France", image: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=800", tag: "Romantic", description: "The Eiffel Tower, charming cafés, and world-class museums.", rating: 4.8, reviews: 12480, trending: true },
    { slug: "bali", name: "Bali", country: "Indonesia", image: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=800", tag: "Beach", description: "Tropical beaches, ancient temples, and vibrant culture.", rating: 4.7, reviews: 9840, trending: true },
    { slug: "tokyo", name: "Tokyo", country: "Japan", image: "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=800", tag: "Culture", description: "Neon-lit streets, timeless temples, and unforgettable food.", rating: 4.9, reviews: 15320 },
    { slug: "santorini", name: "Santorini", country: "Greece", image: "https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=800", tag: "Scenic", description: "Whitewashed villages perched over turquoise Aegean waters.", rating: 4.8, reviews: 7210 },
    { slug: "newyork", name: "New York", country: "USA", image: "https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=800", tag: "Urban", description: "The city that never sleeps — Broadway, skyline, and energy.", rating: 4.6, reviews: 18950 },
    { slug: "dubai", name: "Dubai", country: "UAE", image: "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=800", tag: "Luxury", description: "Futuristic skyline, desert adventures, and unmatched luxury.", rating: 4.7, reviews: 11230, trending: true },
    { slug: "swiss", name: "Swiss Alps", country: "Switzerland", image: "https://images.unsplash.com/photo-1530122037265-a5f1f91d3b99?w=800", tag: "Adventure", description: "Snow-capped peaks, alpine villages, and scenic train rides.", rating: 4.9, reviews: 6430 },
    { slug: "iceland", name: "Iceland", country: "Iceland", image: "https://images.unsplash.com/photo-1504829857797-ddff29c27927?w=800", tag: "Nature", description: "Waterfalls, glaciers, and the Northern Lights.", rating: 4.8, reviews: 5140 },
];

const REVIEWS = [
    { author: "Priya S.", avatarInitial: "P", destination: "Bali, Indonesia", rating: 5, title: "A magical honeymoon escape", body: "The beaches in Uluwatu were beyond stunning, and our private villa in Ubud came with its own rice-field view.", tripType: "Couple", helpful: 128 },
    { author: "Marcus L.", avatarInitial: "M", destination: "Tokyo, Japan", rating: 5, title: "Best food trip of my life", body: "Every single meal was an event. Public transit is flawless.", tripType: "Solo", helpful: 96 },
    { author: "Aisha R.", avatarInitial: "A", destination: "Santorini, Greece", rating: 4, title: "Stunning views, bring sunscreen", body: "Oia at sunset is every bit as magical as the photos.", tripType: "Friends", helpful: 74 },
    { author: "Daniel K.", avatarInitial: "D", destination: "Swiss Alps, Switzerland", rating: 5, title: "Winter wonderland, truly", body: "Zermatt and the Gornergrat railway were highlights. Matterhorn views worth every franc.", tripType: "Family", helpful: 152 },
    { author: "Sophia M.", avatarInitial: "S", destination: "Paris, France", rating: 4, title: "Charming but crowded", body: "Loved every café. Book the Eiffel Tower in advance.", tripType: "Solo", helpful: 61 },
];

async function main() {
    await mongoose.connect(MONGODB_URI);
    console.log("connected");
    await Destination.deleteMany({});
    await Review.deleteMany({});
    const d = await Destination.insertMany(DESTINATIONS);
    const r = await Review.insertMany(REVIEWS);
    console.log(`inserted destinations=${d.length} reviews=${r.length}`);
    await mongoose.disconnect();
}

main().catch((e) => { console.error(e); process.exit(1); });