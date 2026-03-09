import { NextResponse } from 'next/server';

// Fallback highly realistic demo data following the strict color-coding rules
const FALLBACK_NEWS = [
  {
    id: "news-1",
    title: "Heavy Artillery Fire Reported in Eastern Ukraine: Infrastructure Crippled",
    description: "Intense clashes continue along the eastern front. Satellite imagery confirms significant damage to power grids in the Donbas region. Emergency crews are unable to reach affected areas.",
    source: "Reuters",
    url: "https://www.reuters.com/world/europe/",
    publishedAt: new Date(Date.now() - 15 * 60000).toISOString(),
    category: "critical",
    colorNode: "red",
    country: "Ukraine",
    lat: 48.3794,
    lng: 31.1656
  },
  {
    id: "news-7",
    title: "Israel-Iran Escalation: Direct Ballistic Exchanges Reported",
    description: "Israel has confirmed intercepts of multiple long-range drones. In response, retaliatory strikes have targeted missile manufacturing facilities deep within Iranian territory.",
    source: "BBC World",
    url: "https://www.bbc.com/news/world-middle-east",
    publishedAt: new Date(Date.now() - 5 * 60000).toISOString(),
    category: "critical",
    colorNode: "red",
    country: "Israel",
    lat: 31.0461,
    lng: 34.8516
  },
  {
    id: "news-4",
    title: "Emergency Alert: UN Warning on Northern India Heatwave",
    description: "WMO and UN agencies have issued a joint alert on record-breaking temperatures across Northern India districts. Local administrations are activating 'Heat Action Plans' to prevent casualties.",
    source: "United Nations",
    url: "https://news.un.org/en/story/",
    publishedAt: new Date(Date.now() - 30 * 60000).toISOString(),
    category: "alert",
    colorNode: "orange",
    country: "India",
    lat: 28.6139,
    lng: 77.2090
  },
  {
    id: "news-6",
    title: "NexusChip Semiconductor Mission: IMF Projects 8.2% GDP Boost",
    description: "The IMF's latest regional outlook highlights India's semiconductor FAB project as a major structural driver. Forecasts suggest a sustained shift in global tech supply chains.",
    source: "IMF Intel",
    url: "https://www.imf.org/en/News",
    publishedAt: new Date(Date.now() - 200 * 60000).toISOString(),
    category: "business",
    colorNode: "light-blue",
    country: "India",
    lat: 12.9716,
    lng: 77.5946
  }
];

// Helper to determine color based on title/description keywords
function classifyNewsColor(title: string, desc: string, country: string) {
  const text = (title + " " + desc).toLowerCase();
  
  if (text.includes("war ") || text.includes("attack") || text.includes("civil war") || text.includes("airstrike") || text.includes("explosion") || text.includes("missile")) {
    return "red";
  }
  
  if (country.toLowerCase() === "india") {
    if (text.includes("terror") || text.includes("riot") || text.includes("disaster")) {
      return "orange";
    }
    if (text.includes("upcoming") || text.includes("flood") || text.includes("alert") || text.includes("cyclone") || text.includes("storm")) {
      return "yellow-orange";
    }
    if (text.includes("business") || text.includes("economy") || text.includes("investment") || text.includes("achievement") || text.includes("growth")) {
      return "light-blue";
    }
  }

  if (text.includes("good") || text.includes("ceasefire") || text.includes("peace") || text.includes("drop") || text.includes("resolv") || text.includes("agreement")) {
    return "green"; // global good news
  }

  // default fallback based on general sentiment
  if (text.includes("tension") || text.includes("standoff")) return "yellow-orange";
  
  return "light-blue"; // safe default
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const useLiveAPI = process.env.NEWS_API_KEY && process.env.NEWS_API_KEY !== "YOUR_API_KEY_HERE";

  try {
    if (useLiveAPI) {
      // Example of an actual fetch if API key is provided
      const res = await fetch(`https://newsapi.org/v2/top-headlines?language=en&apiKey=${process.env.NEWS_API_KEY}`);
      if (!res.ok) throw new Error("API Limit Reached");
      const data = await res.json();
      
      const mapped = data.articles.map((article: any, index: number) => {
        // Very rough geolocation mapping for demo purposes. 
        // In reality, we'd use an NLP entity extractor (like spaCy) to geocode.
        const country = article.title.includes("India") ? "India" : (article.title.includes("Ukraine") ? "Ukraine" : "Global");
        const lat = country === "India" ? 22.0 : (country === "Ukraine" ? 48.0 : 0);
        const lng = country === "India" ? 78.0 : (country === "Ukraine" ? 31.0 : 0);
        
        return {
          id: `live-${index}`,
          title: article.title,
          description: article.description || "No description available.",
          source: article.source.name,
          url: article.url,
          publishedAt: article.publishedAt,
          colorNode: classifyNewsColor(article.title, article.description || "", country),
          country: country,
          lat: lat + (Math.random() * 5 - 2.5), // disperse markers a bit
          lng: lng + (Math.random() * 5 - 2.5)
        };
      });
      return NextResponse.json(mapped);
    }

    // Fallback if no real API key is present
    return NextResponse.json(FALLBACK_NEWS);
    
  } catch (error) {
    console.error("News API Error:", error);
    return NextResponse.json(FALLBACK_NEWS);
  }
}
