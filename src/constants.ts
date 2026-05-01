import { Article } from './types';

export const ARTICLES: Article[] = [
  {
    id: 1,
    title: "Top 10 Quietest Spots at Dubai International Airport",
    category: "Airport Guide",
    author: "Sarah Mitchell",
    authorInitials: "SM",
    date: "May 12, 2026",
    rating: 5,
    readTime: "7 min read",
    image: "https://plus.unsplash.com/premium_photo-1663039978729-6f6775725f89?q=80&w=869&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    preview: "Dubai (DXB) is one of the world's busiest hubs, but hidden within its terminals are oasis-like spots perfect for catching some Zs.",
    content: [
      "Dubai International Airport (DXB) is a massive city in itself, operating 24/7 with a constant flow of travelers.",
      "Terminal 3 features several 'Zen Gardens' where the ambient noise is significantly lower.",
      "The 'Sleep 'n Fly' pods in Terminal 3 offer private, soundproof cubicles for a fee.",
      "Pro tip: Always head to the upper levels of the terminals where the shopping footprint is smaller."
    ],
    tags: ["Dubai", "DXB", "Middle East", "Sleep Pods"],
    reviews: [
      { id: '1', userName: 'TravelerJoe', rating: 5, comment: 'The Zen Gardens are a lifesaver!', date: 'Jan 15, 2026' },
      { id: '2', userName: 'NomadNina', rating: 4, comment: 'A bit loud near the gates, but definitely doable.', date: 'Feb 10, 2026' }
    ]
  },
  {
    id: 2,
    title: "How to Survive a 12-Hour Layover at London Heathrow",
    category: "Travel Tips",
    author: "James Okonkwo",
    authorInitials: "JO",
    date: "June 05, 2026",
    rating: 4.5,
    readTime: "6 min read",
    image: "https://images.unsplash.com/photo-1529154036614-a60975f5c760?q=80&w=800&auto=format&fit=crop",
    preview: "Heathrow is notorious for its strict security and terminal transfers. Here’s how to navigate it and find rest.",
    content: [
      "London Heathrow (LHR) is a beast of an airport, with five terminals and strict security protocols.",
      "During the day, Terminal 5 offers the most modern facilities.",
      "For overnight stays, YOTELAIR in Terminal 4 offers compact cabins for short-stay intervals.",
      "Remember to dress in layers. Heathrow's air conditioning can be unpredictable."
    ],
    tags: ["London", "LHR", "Layover Tips", "UK"],
    reviews: [
      { id: '3', userName: 'LondonBound', rating: 4, comment: 'YOTELAIR is pricey but worth it for a shower.', date: 'Mar 05, 2026' }
    ]
  },
  {
    id: 3,
    title: "Singapore Changi Airport: A Sleeper's Paradise — 2026 Guide",
    category: "Airport Guide",
    author: "Li Wei Chen",
    authorInitials: "LC",
    date: "April 28, 2026",
    rating: 5,
    readTime: "8 min read",
    image: "https://unsplash.com/photos/people-walking-inside-amazon-building-surrounded-with-plants-O-Unw-ho1kQ",
    preview: "Consistently voted the world's best airport, Changi takes airport sleeping to a luxury level.",
    content: [
      "Singapore Changi Airport (SIN) isn't just an airport; it's a destination.",
      "Terminal 4's Heritage Zone is a quiet favorite, with dedicated 'Snooze Zones'.",
      "In 2026, Changi has expanded its automated pod system via the Changi App.",
      "If you're airside and on a budget, the 'Sanctuary' in T2 is the place to be."
    ],
    tags: ["Singapore", "Changi", "Best Airport", "Luxury Sleep"],
    isPopular: true,
    reviews: [
      { id: '4', userName: 'ChangiFan', rating: 5, comment: 'Best sleep of my life in an airport. Literally.', date: 'April 20, 2026' }
    ]
  },
  {
    id: 4,
    title: "Free vs Paid Airport Lounges: Is It Worth The Money?",
    category: "Lounge Review",
    author: "Maria Santos",
    authorInitials: "MS",
    date: "May 20, 2026",
    rating: 4,
    readTime: "5 min read",
    image: "https://images.unsplash.com/photo-1701625211383-61e64af1f05c?q=80&w=774&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    preview: "Is that $60 entry fee really worth it? We break down the cost-benefit of paid lounge access.",
    content: [
      "The debate between 'Free' transit areas and 'Paid' lounges is as old as commercial flight.",
      "Paid lounges offer consistent standards: comfortable seating, hot food, and showers.",
      "Free lounges are becoming more common but lack the privacy and security of paid ones.",
      "Verdict: If you need to work or sleep properly, go for the paid lounge."
    ],
    tags: ["Lounges", "Travel Hacks", "Budget", "Luxury"]
  },
  {
    id: 5,
    title: "The Ultimate Airport Sleeping Kit Checklist for 2026",
    category: "Travel Tips",
    author: "Ahmed Al-Rashid",
    authorInitials: "AA",
    date: "March 15, 2026",
    rating: 4.5,
    readTime: "10 min read",
    image: "https://images.unsplash.com/photo-1517713982677-4b66332f98de?q=80&w=800&auto=format&fit=crop",
    preview: "Don't get caught shivering on a metal bench. These 5 essentials turn any corner into a bedroom.",
    content: [
      "Sleeping in an airport is an art form. Here is what should be in your carry-on.",
      "The Hybrid Pillow: Modern travel pillows now offer 360-degree support.",
      "Active Noise Canceling (ANC) Headphones: Your shield against constant paging.",
      "Lastly, always carry a small toiletry kit to refresh after a few hours."
    ],
    tags: ["Gear", "Checklist", "Packing", "Essentials"]
  },
  {
    id: 6,
    title: "JFK New York: Best Hidden Corners to Sleep Undisturbed",
    category: "Airport Guide",
    author: "Sarah Mitchell",
    authorInitials: "SM",
    date: "June 20, 2026",
    rating: 4,
    readTime: "7 min read",
    image: "https://images.unsplash.com/photo-1496588152823-86ff7695e68f?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    preview: "JFK is famous for its chaos, but Terminal 5 and the TWA Hotel offer unique opportunities.",
    content: [
      "John F. Kennedy International (JFK) is loud, busy, and sprawling.",
      "Terminal 5 (JetBlue) is widely considered the best for sleeping with modern seating.",
      "If you have the budget, the TWA Hotel at Terminal 5 offers 'Day Stay' rooms.",
      "Clear security as soon as possible and find your spot in airside transit zones."
    ],
    tags: ["New York", "JFK", "USA", "Sleep Spots"]
  },
  {
    id: 7,
    title: "How Airline Status Gets You Free Lounge Access — A Guide",
    category: "Lounge Review",
    author: "James Okonkwo",
    authorInitials: "JO",
    date: "July 01, 2026",
    rating: 5,
    readTime: "9 min read",
    image: "https://images.unsplash.com/photo-1540962351504-03099e0a754b?q=80&w=800&auto=format&fit=crop",
    preview: "Stop paying for day passes. Learn the tricks of airline alliances to unlock free luxury.",
    content: [
      "Frequent flyer status is the holy grail of airport comfort.",
      "The key is understanding alliances like Oneworld, SkyTeam, or Star Alliance.",
      "In 2026, many airlines offer 'Status Matches' to instantly get luxury access.",
      "Many premium travel cards now come with 'Priority Pass' memberships as well."
    ],
    tags: ["Status", "Alliances", "Luxury", "Freebies"]
  },
  {
    id: 8,
    title: "Tokyo Haneda vs Narita: Which Airport is Better for Sleeping?",
    category: "Airport Guide",
    author: "Li Wei Chen",
    authorInitials: "LC",
    date: "August 12, 2026",
    rating: 4.5,
    readTime: "8 min read",
    image: "https://images.unsplash.com/photo-1569154941061-e231b4725ef1?q=80&w=800&auto=format&fit=crop",
    preview: "Tokyo’s two major airports couldn't be more different. We compare the facilities.",
    content: [
      "Tokyo Haneda (HND) and Tokyo Narita (NRT) are both world-class.",
      "Haneda Terminal 3 is a masterclass in clean, quiet, and safe environments.",
      "Narita has many 'Day Program' options, including cheap rest rooms and showers.",
      "Final comparison: Convenience at Haneda, budget nap rooms at Narita."
    ],
    tags: ["Tokyo", "Japan", "Haneda", "Narita"]
  },
  {
    id: 9,
    title: "Why Ear Plugs and Eye Masks Are Airport Sleeper Essentials",
    category: "Gear Guide",
    author: "Maria Santos",
    authorInitials: "MS",
    date: "September 05, 2026",
    rating: 4,
    readTime: "4 min read",
    image: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?q=80&w=800&auto=format&fit=crop",
    preview: "It sounds basic, but the right pair of earplugs can be the difference between rest and a headache.",
    content: [
      "The two biggest enemies of airport sleep are Light and Noise.",
      "Silicon earplugs are far superior to standard foam ones for blocking jet engines.",
      "We tested over 20 combos. Our top pick is the Manta Sleep Mask with Loop earplugs.",
      "Always keep them in a dedicated 'Sleep Pouch' so they are easy to find."
    ],
    tags: ["Gear", "Sleep Science", "Wellness", "Reviews"]
  }
];

export const RANKINGS = [
  { rank: 1, name: "Singapore Changi", city: "Singapore", score: "9.8", lounges: "Premium", access: "24/7" },
  { rank: 2, name: "Tokyo Haneda", city: "Tokyo", score: "9.5", lounges: "Excellent", access: "24/7" },
  { rank: 3, name: "Seoul Incheon", city: "Seoul", score: "9.3", lounges: "High-End", access: "24/7" },
  { rank: 4, name: "Dubai International", city: "Dubai", score: "9.1", lounges: "Luxury", access: "24/7" },
  { rank: 5, name: "Munich Airport", city: "Munich", score: "8.9", lounges: "Modern", access: "24/7" },
  { rank: 6, name: "Zurich Airport", city: "Zurich", score: "8.7", lounges: "Premium", access: "22/7" },
  { rank: 7, name: "Vancouver Int'l", city: "Vancouver", score: "8.6", lounges: "Good", access: "24/7" },
  { rank: 8, name: "Hamad International", city: "Doha", score: "8.5", lounges: "World-Class", access: "24/7" },
];

export const PRODUCTS = [
  {
    id: 1,
    name: "Trtl Travel Pillow",
    price: "$59.99",
    rating: 5,
    stars: "★★★★★",
    image: "https://plus.unsplash.com/premium_photo-1687436749473-98f03cb51068?q=80&w=1374&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    description: "Scientifically proven neck support for sleeping in an upright position. Much better than U-shaped pillows."
  },
  {
    id: 2,
    name: "Alaska Bear Sleep Mask",
    price: "$14.99",
    rating: 4.5,
    stars: "★★★★½",
    image: "https://plus.unsplash.com/premium_photo-1727437241681-bb94c455185f?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    description: "100% natural silk mask that blocks every single photon of light. Essential for daytime layovers."
  },
  {
    id: 3,
    name: "3M Peltor Ear Muffs",
    price: "$29.50",
    rating: 5,
    stars: "★★★★★",
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=400&auto=format&fit=crop",
    description: "Industrial strength noise reduction. Turns a noisy terminal into a library-quiet sanctuary."
  },
  {
    id: 4,
    name: "Tumi Alpha Carry-On Lock",
    price: "$45.00",
    rating: 4,
    stars: "★★★★☆",
    image: "https://images.unsplash.com/photo-1568571959361-3bffbad07499?q=80&w=1374&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    description: "Keep your belongings safe while you sleep. Heavy-duty metal construction with TSA approval."
  },
];

export const TIPS = [
  { id: "tip1", icon: "🎧", title: "Charge Your Devices First", text: "Before settling in, find a power station and juice up. Most airports now have USB-C standard ports." },
  { id: "tip2", icon: "🛏", title: "Book a Day Room at the Hotel", text: "If your layover is over 8 hours, a day room can be a lifesaver with block bookings." },
  { id: "tip3", icon: "🔒", title: "Always Lock Your Luggage", text: "Safety first. Use a TSA-approved lock and keep your valuables at the bottom of your bag." },
  { id: "tip4", icon: "📱", title: "Download Offline Entertainment", text: "Airport Wi-Fi can be patchy. Download your favorite movies or podcasts before you arrive." },
  { id: "tip5", icon: "🔇", title: "Use Noise-Canceling Headphones", text: "A secondary defense against loud announcements and the constant terminal drone." },
  { id: "tip6", icon: "🌙", title: "Know Your Terminal's Quiet Zone", text: "Most modern terminals have designated quiet areas. Check our guides for the exact gate numbers." },
];
