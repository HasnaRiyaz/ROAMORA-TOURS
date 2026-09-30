import React, { useEffect, useRef, useState } from "react";
import { supabase } from "./lib/supabase";
import emailjs from "@emailjs/browser";
import { createRoot } from "react-dom/client";

import {
  ArrowRight,
  CalendarDays,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Compass,
  MapPin,
  Menu,
  Play,
  Search,
  Sparkles,
  X,
  Clock,
  Heart,
  Check,
  Car,
  Users,
  Plane,
  MessageCircle,
  Mail,
} from "lucide-react";

import "./styles.css";

// ============================================================
// EMAILJS CONFIGURATION
// ============================================================

const EMAILJS_SERVICE_ID = "service_3tl2dzu";
const EMAILJS_TEMPLATE_ID = "template_bno7zvt";
const EMAILJS_PUBLIC_KEY = "GEjOOqaCVh_8Jdsxa";

// WhatsApp number in international format
const OWNER_WHATSAPP = "+94773430146";

// ============================================================
// DESTINATIONS
// ============================================================

const places = [
  {
    name: "Colombo",
    district: "Colombo",
    province: "Western Province",
    tag: "Capital city escape",
    accent: "Western coast",
    image: "/Colombo.jpg",
    description:
      "A vibrant coastal capital blending modern city life, colonial heritage, food and ocean views.",
    duration: "1–2 days",
    bestFor: "City, food & culture",
    highlights: ["Galle Face Green", "Colombo Fort", "Gangaramaya Temple", "Pettah Market"],
  },
  {
    name: "Negombo",
    district: "Gampaha",
    province: "Western Province",
    tag: "Beach & lagoon escape",
    accent: "Western coast",
    image: "/negombo.jpg",
    description:
      "A relaxed coastal town close to the international airport, known for beaches, seafood and lagoon experiences.",
    duration: "1–2 days",
    bestFor: "Beach & airport stay",
    highlights: ["Negombo Beach", "Dutch Canal", "Negombo Lagoon", "Fish Market"],
  },
  {
    name: "Kalutara",
    district: "Kalutara",
    province: "Western Province",
    tag: "Coastal retreat",
    accent: "Western coast",
    image: "/Kalutara.jpg",
    description:
      "A peaceful coastal destination with beaches, rivers, temples and resort experiences.",
    duration: "1–2 days",
    bestFor: "Relaxation & resorts",
    highlights: ["Kalutara Bodhiya", "Kalutara Beach", "Richmond Castle"],
  },
  {
    name: "Kandy",
    district: "Kandy",
    province: "Central Province",
    tag: "Heritage & hills",
    accent: "Central highlands",
    image: "/kandy.jpg",
    description:
      "Sri Lanka's cultural heart surrounded by green hills, sacred heritage and the famous Kandy Lake.",
    duration: "2 days",
    bestFor: "Heritage & culture",
    highlights: ["Temple of the Tooth", "Kandy Lake", "Royal Botanical Gardens"],
  },
  {
    name: "Sigiriya",
    district: "Matale",
    province: "Central Province",
    tag: "Ancient wonder",
    accent: "Cultural triangle",
    image: "/sigiriya.jpg",
    description:
      "Climb the ancient rock fortress and discover one of Sri Lanka's most iconic archaeological landscapes.",
    duration: "1–2 days",
    bestFor: "Heritage & adventure",
    highlights: ["Sigiriya Rock Fortress", "Pidurangala", "Ancient frescoes", "Minneriya Safari"],
  },
  {
    name: "Dambulla",
    district: "Matale",
    province: "Central Province",
    tag: "Cave temples",
    accent: "Cultural triangle",
    image: "/dambulla.jpg",
    description:
      "An ancient cultural destination famous for its remarkable cave temple complex.",
    duration: "1 day",
    bestFor: "Culture & history",
    highlights: ["Dambulla Cave Temple", "Golden Temple", "Cave paintings"],
  },
  {
    name: "Nuwara Eliya",
    district: "Nuwara Eliya",
    province: "Central Province",
    tag: "Tea country",
    accent: "Hill country",
    image: "/nuwara-eliya.jpg",
    description:
      "Cool mountain air, tea estates, waterfalls and colonial-era charm in Sri Lanka's highlands.",
    duration: "2–3 days",
    bestFor: "Nature & couples",
    highlights: ["Tea plantations", "Gregory Lake", "Horton Plains", "Lover's Leap"],
  },
  {
    name: "Galle",
    district: "Galle",
    province: "Southern Province",
    tag: "Fort & ocean",
    accent: "South coast",
    image: "/galle.jpg",
    description:
      "A romantic coastal city where colonial architecture, cafes and Indian Ocean sunsets meet.",
    duration: "1–2 days",
    bestFor: "Culture & couples",
    highlights: ["Galle Fort", "Lighthouse", "Fort ramparts"],
  },
  {
    name: "Mirissa",
    district: "Matara",
    province: "Southern Province",
    tag: "Tropical coast",
    accent: "South coast",
    image: "/mirisa.jpg",
    description:
      "A laid-back beach destination famous for tropical sunsets, ocean activities and coastal escapes.",
    duration: "2 days",
    bestFor: "Beach & friends",
    highlights: ["Mirissa Beach", "Coconut Tree Hill", "Whale watching"],
  },
  {
    name: "Yala",
    district: "Hambantota",
    province: "Southern Province",
    tag: "Wild Sri Lanka",
    accent: "Wildlife",
    image: "/yala.jpg",
    description:
      "A legendary wildlife destination offering safari experiences through forests, grasslands and lagoons.",
    duration: "2 days",
    bestFor: "Wildlife & photography",
    highlights: ["Yala National Park", "Safari", "Leopards", "Elephants"],
  },
  {
    name: "Jaffna",
    district: "Jaffna",
    province: "Northern Province",
    tag: "Northern soul",
    accent: "Northern Sri Lanka",
    image: "/jaffna.jpg",
    description:
      "Discover northern culture, historic forts, temples, islands and a distinctive Tamil heritage.",
    duration: "2–3 days",
    bestFor: "Culture & food",
    highlights: ["Nallur Kandaswamy Kovil", "Jaffna Fort", "Delft Island", "Keerimalai"],
  },
  {
    name: "Kilinochchi",
    district: "Kilinochchi",
    province: "Northern Province",
    tag: "Northern journey",
    accent: "Northern Sri Lanka",
    image: "/Kilinochchi.jpg",
    description:
      "A northern destination for travellers exploring the changing landscapes and heritage of the Vanni region.",
    duration: "1 day",
    bestFor: "Road trips & discovery",
    highlights: ["Northern landscapes", "Irrigation heritage", "Vanni culture"],
  },
  {
    name: "Mannar",
    district: "Mannar",
    province: "Northern Province",
    tag: "Island of history",
    accent: "Northern coast",
    image: "/mannar.jpg",
    description:
      "A remote northern destination known for islands, wildlife, history and unique landscapes.",
    duration: "1–2 days",
    bestFor: "Nature & history",
    highlights: ["Mannar Island", "Baobab Tree", "Mannar Fort", "Bird watching"],
  },
  {
    name: "Mullaitivu",
    district: "Mullaitivu",
    province: "Northern Province",
    tag: "Untouched coast",
    accent: "Northern coast",
    image: "/Mullaitivul.jpg",
    description:
      "A quiet northern coastal region with long beaches, lagoons and a peaceful road-trip atmosphere.",
    duration: "1–2 days",
    bestFor: "Coast & exploration",
    highlights: ["Northern beaches", "Lagoons", "Coastal scenery"],
  },
  {
    name: "Vavuniya",
    district: "Vavuniya",
    province: "Northern Province",
    tag: "Gateway to the north",
    accent: "Northern Sri Lanka",
    image: "/vavuniya.jpg",
    description:
      "A northern gateway connecting travellers with the cultural and natural landscapes of the region.",
    duration: "1 day",
    bestFor: "Road trips",
    highlights: ["Madukanda Vihara", "Vavuniya landscapes", "Northern culture"],
  },
  {
    name: "Trincomalee",
    district: "Trincomalee",
    province: "Eastern Province",
    tag: "Blue water escape",
    accent: "East coast",
    image: "/trincomale.jpg",
    description:
      "A spectacular eastern coastal destination with beaches, bays, temples and marine experiences.",
    duration: "2–3 days",
    bestFor: "Beach & family",
    highlights: ["Nilaveli Beach", "Pigeon Island", "Koneswaram Temple", "Fort Frederick"],
  },
  {
    name: "Batticaloa",
    district: "Batticaloa",
    province: "Eastern Province",
    tag: "Lagoon & culture",
    accent: "East coast",
    image: "/Batticola.jpg",
    description:
      "A peaceful eastern city surrounded by lagoons, beaches and distinctive cultural heritage.",
    duration: "1–2 days",
    bestFor: "Culture & beach",
    highlights: ["Batticaloa Lagoon", "Kallady Beach", "Dutch Fort"],
  },
  {
    name: "Arugam Bay",
    district: "Ampara",
    province: "Eastern Province",
    tag: "Surf capital",
    accent: "East coast",
    image: "/arugambay.jpg",
    description:
      "One of Sri Lanka's most famous surf destinations with a relaxed beach-town atmosphere.",
    duration: "2–3 days",
    bestFor: "Surf & adventure",
    highlights: ["Main Point", "Surfing", "Lagoon safari", "Kudumbigala"],
  },
  {
    name: "Kurunegala",
    district: "Kurunegala",
    province: "North Western Province",
    tag: "Rock city",
    accent: "North western Sri Lanka",
    image: "/kurunegala.jpg",
    description:
      "A historic inland city surrounded by dramatic rock formations and cultural landmarks.",
    duration: "1 day",
    bestFor: "Road trips & culture",
    highlights: ["Athugala", "Ridi Viharaya", "Historic city"],
  },
  {
    name: "Kalpitiya",
    district: "Puttalam",
    province: "North Western Province",
    tag: "Ocean adventure",
    accent: "North western coast",
    image: "/kalpitiya.jpg",
    description:
      "A coastal adventure destination famous for kitesurfing, dolphins and lagoons.",
    duration: "2 days",
    bestFor: "Adventure & beach",
    highlights: ["Dolphin watching", "Kitesurfing", "Kalpitiya Lagoon", "Bar Reef"],
  },
  {
    name: "Anuradhapura",
    district: "Anuradhapura",
    province: "North Central Province",
    tag: "Ancient kingdom",
    accent: "Cultural triangle",
    image: "/Anurathapura.jpg",
    description:
      "Explore one of Sri Lanka's great ancient capitals, filled with sacred sites and monumental ruins.",
    duration: "1–2 days",
    bestFor: "History & culture",
    highlights: ["Sri Maha Bodhi", "Ruwanwelisaya", "Jetavanaramaya", "Ancient city"],
  },
  {
    name: "Polonnaruwa",
    district: "Polonnaruwa",
    province: "North Central Province",
    tag: "Medieval kingdom",
    accent: "Cultural triangle",
    image: "/polanaruwa.jpg",
    description:
      "A fascinating ancient city featuring temples, statues, reservoirs and royal ruins.",
    duration: "1–2 days",
    bestFor: "History & cycling",
    highlights: ["Gal Vihara", "Royal Palace", "Parakrama Samudra"],
  },
  {
    name: "Ella",
    district: "Badulla",
    province: "Uva Province",
    tag: "Mountain escape",
    accent: "Hill country",
    image: "/elle.jpg",
    description:
      "A misty mountain town filled with tea landscapes, dramatic viewpoints and unforgettable train journeys.",
    duration: "2–3 days",
    bestFor: "Adventure & couples",
    highlights: ["Nine Arch Bridge", "Little Adam's Peak", "Ella Rock", "Ravana Falls"],
  },
  {
    name: "Monaragala",
    district: "Monaragala",
    province: "Uva Province",
    tag: "Wild eastern hills",
    accent: "Uva",
    image: "/monaragala.jpg",
    description:
      "A spacious Uva region offering forests, ancient sites, reservoirs and access to wildlife country.",
    duration: "1–2 days",
    bestFor: "Nature & road trips",
    highlights: ["Buduruwagala", "Gal Oya access", "Rural Uva landscapes"],
  },
  {
    name: "Ratnapura",
    district: "Ratnapura",
    province: "Sabaragamuwa Province",
    tag: "City of gems",
    accent: "Sabaragamuwa",
    image: "/ratnapura.jpg",
    description:
      "Discover Sri Lanka's gem country surrounded by forests, rivers and waterfalls.",
    duration: "1–2 days",
    bestFor: "Nature & culture",
    highlights: ["Gem experiences", "Bopath Ella", "Maha Saman Devalaya"],
  },
  {
    name: "Kitulgala",
    district: "Kegalle",
    province: "Sabaragamuwa Province",
    tag: "Rainforest adventure",
    accent: "Wet zone",
    image: "/kitulgala.jpg",
    description:
      "A lush adventure destination famous for white-water rafting, rainforest and outdoor activities.",
    duration: "1–2 days",
    bestFor: "Adventure & friends",
    highlights: ["White-water rafting", "Kelani River", "Rainforest walks"],
  },
];

// ============================================================
// EXPERIENCES
// ============================================================

const experiences = [
  {
    num: "01",
    title: "Tea trails",
    text: "Walk through misty estates, meet local tea makers and watch the hills change colour at golden hour.",
    image:
      "https://images.unsplash.com/photo-1590716209211-ea74d5f63573?auto=format&fit=crop&w=1200&q=90",
  },
  {
    num: "02",
    title: "Wild safaris",
    text: "Spot elephants, leopards and painted landscapes in Sri Lanka's wild national parks.",
    image:
      "https://images.unsplash.com/photo-1516426122078-c23e76319801?auto=format&fit=crop&w=1200&q=90",
  },
  {
    num: "03",
    title: "Ocean days",
    text: "Slow down with reef-blue water, hidden coves, surf towns and unforgettable sunsets.",
    image:
      "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=90",
  },
];

const travelStyles = [
  "Slow & curious",
  "Adventure seeker",
  "Beach escape",
  "Culture lover",
  "Wildlife explorer",
  "Luxury retreat",
];

// ============================================================
// VEHICLES
// ============================================================

const vehicles = [
  {
    name: "Comfort Car",
    type: "CAR",
    passengers: "1–3 passengers",
    luggage: "2–3 bags",
    image: "/car.jpg",
  },
  {
    name: "Tourist Van",
    type: "VAN",
    passengers: "4–8 passengers",
    luggage: "Large luggage",
    image: "/van.jpg",
  },
  {
    name: "Mini Bus",
    type: "BUS",
    passengers: "9–25 passengers",
    luggage: "Large luggage",
    image: "/bus.jpg",
  },
];

const airports = [
  "Bandaranaike International Airport",
  "Mattala Rajapaksa International Airport",
  "Jaffna International Airport",
  "Ratmalana Airport",
  "Batticaloa Airport",
];

// ============================================================
// TOUR PACKAGES
// ============================================================

const tourPackages = [
  {
    title: "Family Escape",
    icon: "👨‍👩‍👧‍👦",
    text: "Comfortable journeys, family-friendly stays and memorable island experiences.",
  },
  {
    title: "Friends Getaway",
    icon: "🧑‍🤝‍🧑",
    text: "Beaches, adventure and road trips made for your group.",
  },
  {
    title: "Honeymoon Escape",
    icon: "💍",
    text: "Romantic beaches, misty mountains and beautiful private stays.",
  },
  {
    title: "Wild Sri Lanka",
    icon: "🐘",
    text: "Safari adventures, wildlife and unforgettable nature experiences.",
  },
  {
    title: "Beach Escape",
    icon: "🌊",
    text: "Discover Sri Lanka's most beautiful coastal destinations.",
  },
  {
    title: "Custom Journey",
    icon: "🧭",
    text: "Tell us where you want to go and shape a journey around you.",
  },
];

// ============================================================
// CUSTOMER REVIEWS
// ============================================================

const customerReviews = [
  {
    id: 1,
    name: "Ayesha & Family",
    country: "United Kingdom",
    trip: "Family Escape",
    rating: 5,
    text: "ROAMORA made our Sri Lanka trip so easy. The airport pickup was on time, the driver was friendly and every destination felt beautifully planned.",
  },
  {
    id: 2,
    name: "Daniel",
    country: "Australia",
    trip: "Island Journey",
    rating: 5,
    text: "Beautiful places, comfortable transport and excellent communication. We loved the freedom to enjoy Sri Lanka without worrying about the route.",
  },
  {
    id: 3,
    name: "Sara & James",
    country: "Germany",
    trip: "Honeymoon Escape",
    rating: 5,
    text: "From the airport to the south coast, everything felt smooth and personal. The memories are unforgettable.",
  },
];

// ============================================================
// OWNER FEEDBACK MEDIA
// ============================================================

const ownerFeedbackMedia = [
  { type: "video", src: "/reviews/new.mp4" },
  { type: "video", src: "/reviews/feedback-02.mp4" },
  { type: "image", src: "/reviews/feedback-03.jpg" },
];

// ============================================================
// GALLERY
// ============================================================

const range = (from, to) =>
  Array.from({ length: to - from + 1 }, (_, i) => from + i);

const pad3 = (n) => String(n).padStart(3, "0");

// Files live in public/gallery/<folder>/<folder>-NNN.jpeg (photos)
// and public/gallery/<folder>/<folder>-NNN.mp4 (videos).
// Photos and videos share ONE running number (germany-046 and germany-064
// do not exist, so they are simply left out of the lists below).
const galleryCountryBase = [
  {
    id: "germany",
    name: "Germany",
    folder: "germany",
    images: range(1, 45),
    videos: [...range(47, 63), 65, 66],
    description:
      "A glimpse of Sri Lanka through the eyes of our German guests — warm moments, island colours and memories made along the way.",
  },
  {
    id: "romania",
    name: "Romania",
    folder: "romania",
    images: range(1, 40),
    videos: [...range(55, 56), 57, 58, 59],
    description:
      "Captured by our Romanian travellers in Sri Lanka — real moments of discovery, connection and the island's unforgettable beauty.",
  },
  {
    id: "common",
    name: "Common",
    folder: "common",
    images: range(1, 20),
    videos: [],
    description:
      "A shared collection of Sri Lankan moments — landscapes, people and little details that make every journey feel different.",
  },
];

// total = images + videos
const galleryCountryConfig = galleryCountryBase.map((country) => ({
  ...country,
  total: country.images.length + country.videos.length,
}));

const makeGalleryItems = (country) => {
  const images = country.images.map((n) => ({
    type: "image",
    n,
    src: `/gallery/${country.folder}/${country.folder}-${pad3(n)}.jpeg`,
    title: country.name,
    country: country.id,
  }));

  const videos = country.videos.map((n) => ({
    type: "video",
    n,
    src: `/gallery/${country.folder}/${country.folder}-${pad3(n)}.mp4`,
    title: country.name,
    country: country.id,
  }));

  // photos and videos are mixed in file-number order
  return [...images, ...videos]
    .sort((a, b) => a.n - b.n)
    .map((item, i) => ({ ...item, index: i + 1 }));
};

const roamoraGallery = galleryCountryConfig.flatMap(makeGalleryItems);

// ============================================================
// APP
// ============================================================

function App() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [activePlace, setActivePlace] = useState(0);
  const [scrolled, setScrolled] = useState(false);
  const [modal, setModal] = useState(null);

  // PLANNER
  const [destination, setDestination] = useState("Anywhere in Sri Lanka");
  const [date, setDate] = useState("");
  const [travelStyle, setTravelStyle] = useState("Slow & curious");
  const [travellers, setTravellers] = useState("2");
  const [travelType, setTravelType] = useState("Family");
  const [vehicleType, setVehicleType] = useState("Tourist Van");

  // PICKUP
  const [pickupOpen, setPickupOpen] = useState(false);
  const [sendingPickup, setSendingPickup] = useState(false);
  const [pickupStatus, setPickupStatus] = useState("");
  const [pickupForm, setPickupForm] = useState({
    name: "",
    phone: "",
    email: "",
    time: "",
    notes: "",
  });

  // AIRPORT PICKUP
  const [airportSending, setAirportSending] = useState(false);
  const [airportStatus, setAirportStatus] = useState("");
  const [airportForm, setAirportForm] = useState({
    airport: airports[0],
    destination: "",
    arrivalDate: "",
    arrivalTime: "",
    name: "",
    phone: "",
    email: "",
    notes: "",
  });

  // PICKUP LOCATION
  const [pickupLocation, setPickupLocation] = useState({
    address: "",
    latitude: "",
    longitude: "",
    mapsLink: "",
  });
  const [gettingLocation, setGettingLocation] = useState(false);
  const [locationStatus, setLocationStatus] = useState("");
  const [routeResult, setRouteResult] = useState(null);

  // SEARCH
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchText, setSearchText] = useState("");

  // GALLERY
  const [activeGalleryCountry, setActiveGalleryCountry] = useState("romania");
  const [galleryOpen, setGalleryOpen] = useState(null);
  const [galleryLightboxIndex, setGalleryLightboxIndex] = useState(null);
  const touchStart = useRef(null);
  // files that failed to load (missing / unsupported) are skipped automatically
  const [brokenSrcs, setBrokenSrcs] = useState([]);
  const markBroken = (src) =>
    setBrokenSrcs((prev) => (prev.includes(src) ? prev : [...prev, src]));

  // REVIEWS
  const [reviews, setReviews] = useState(customerReviews);
  const [reviewOpen, setReviewOpen] = useState(false);
  const [reviewStatus, setReviewStatus] = useState("");
  const [selectedReviewImage, setSelectedReviewImage] = useState(null);
  const [reviewForm, setReviewForm] = useState({
    name: "",
    country: "",
    trip: "",
    rating: "5",
    text: "",
    media: null,
  });

  // ============================================================
  // GALLERY VIEWER (next / prev / swipe / keyboard)
  // ============================================================

  const galleryItems = galleryOpen
    ? roamoraGallery.filter(
        (item) =>
          item.country === galleryOpen.id && !brokenSrcs.includes(item.src)
      )
    : [];

  const activeGalleryItem =
    galleryLightboxIndex !== null ? galleryItems[galleryLightboxIndex] : null;

  const showNextGallery = () => {
    if (!galleryItems.length) return;
    setGalleryLightboxIndex((i) =>
      i === null ? null : (i + 1) % galleryItems.length
    );
  };

  const showPrevGallery = () => {
    if (!galleryItems.length) return;
    setGalleryLightboxIndex((i) =>
      i === null ? null : (i - 1 + galleryItems.length) % galleryItems.length
    );
  };

  const handleGalleryTouchStart = (event) => {
    const touch = event.touches[0];

    // Video controls (seek bar) area-la swipe start aanaa ignore pannum
    if (event.target.tagName === "VIDEO") {
      const rect = event.target.getBoundingClientRect();
      if (touch.clientY > rect.bottom - 60) {
        touchStart.current = null;
        return;
      }
    }

    touchStart.current = { x: touch.clientX, y: touch.clientY };
  };

  const handleGalleryTouchEnd = (event) => {
    if (!touchStart.current) return;

    const touch = event.changedTouches[0];
    const dx = touch.clientX - touchStart.current.x;
    const dy = touch.clientY - touchStart.current.y;

    touchStart.current = null;

    if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy)) {
      if (dx < 0) showNextGallery();
      else showPrevGallery();
    }
  };

  useEffect(() => {
    if (galleryLightboxIndex === null) return;

    const onKey = (event) => {
      if (event.key === "ArrowRight") showNextGallery();
      if (event.key === "ArrowLeft") showPrevGallery();
      if (event.key === "Escape") setGalleryLightboxIndex(null);
    };

    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [galleryLightboxIndex, galleryItems.length]);

  // ============================================================
  // LOAD REVIEWS
  // ============================================================

  const loadReviews = async () => {
    try {
      const { data, error } = await supabase
        .from("reviews")
        .select("*")
        .eq("status", "published")
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Supabase review load error:", error);
        return;
      }

      const savedReviews = (data || []).map((review) => {
        let mediaUrl = "";

        if (review.media_path) {
          const { data: mediaData } = supabase.storage
            .from("review-media")
            .getPublicUrl(review.media_path);

          mediaUrl = mediaData?.publicUrl || "";
        }

        return {
          id: review.id,
          name: review.name,
          country: review.country || "Traveller",
          trip: review.trip || "Sri Lanka Journey",
          rating: Number(review.rating || 5),
          text: review.text,
          image: review.media_type === "image" ? mediaUrl : "",
          video: review.media_type === "video" ? mediaUrl : "",
          localMedia: false,
        };
      });

      setReviews([...savedReviews, ...customerReviews]);
    } catch (error) {
      console.error("Review loading error:", error);
    }
  };

  // INITIAL LOAD
  useEffect(() => {
    loadReviews();
  }, []);

  // SCROLL
  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 30);
    };

    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // DESTINATION AUTO SLIDER
  useEffect(() => {
    const id = setInterval(() => {
      setActivePlace((value) => (value + 1) % places.length);
    }, 5000);

    return () => clearInterval(id);
  }, []);

  // BODY SCROLL LOCK
  useEffect(() => {
    document.body.style.overflow =
      modal || searchOpen || pickupOpen || reviewOpen || galleryOpen
        ? "hidden"
        : "";

    return () => {
      document.body.style.overflow = "";
    };
  }, [modal, searchOpen, pickupOpen, reviewOpen, galleryOpen]);

  // ============================================================
  // NAVIGATION
  // ============================================================

  const scrollTo = (id) => {
    setMenuOpen(false);
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  const openPlace = (index) => {
    if (index < 0) return;
    setActivePlace(index);
    setModal({ type: "place", data: places[index] });
  };

  // ============================================================
  // ROUTE PLANNER
  // ============================================================

  const findRoute = () => {
    const selected =
      destination === "Anywhere in Sri Lanka"
        ? places[activePlace]
        : places.find((place) => place.name === destination) || places[0];

    setRouteResult({
      destination:
        destination === "Anywhere in Sri Lanka" ? selected.name : destination,
      date: date || "Flexible dates",
      style: travelStyle,
      travellers,
      travelType,
      vehicleType,
      place: selected,
    });
  };

  // OPEN PICKUP
  const openPickupRequest = () => {
    setPickupStatus("");
    setLocationStatus("");
    setPickupOpen(true);
  };

  // ============================================================
  // CURRENT LOCATION
  // ============================================================

  const getCurrentLocation = () => {
    if (!navigator.geolocation) {
      setLocationStatus(
        "Live location is not supported by this browser. Please enter your pickup address."
      );
      return;
    }

    setGettingLocation(true);
    setLocationStatus("Getting your current location...");

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;

        const mapsLink = `https://www.google.com/maps?q=${latitude},${longitude}`;

        setPickupLocation({
          address: "",
          latitude: latitude.toFixed(6),
          longitude: longitude.toFixed(6),
          mapsLink,
        });

        setGettingLocation(false);

        setLocationStatus(
          "Live location added successfully. The driver can open the Google Maps link."
        );
      },
      (error) => {
        console.error("Geolocation error:", error);

        setGettingLocation(false);

        if (error.code === 1) {
          setLocationStatus(
            "Location permission was denied. Please allow location access or enter your pickup address manually."
          );
        } else {
          setLocationStatus(
            "Unable to get your location. Please enter your pickup address manually."
          );
        }
      },
      {
        enableHighAccuracy: true,
        timeout: 15000,
        maximumAge: 0,
      }
    );
  };

  const clearPickupLocation = () => {
    setPickupLocation({
      address: "",
      latitude: "",
      longitude: "",
      mapsLink: "",
    });

    setLocationStatus("");
  };

  // ============================================================
  // WHATSAPP - TOUR / PICKUP
  // ============================================================

  const sendWhatsAppRequest = () => {
    const route = routeResult || {
      destination:
        destination === "Anywhere in Sri Lanka"
          ? places[activePlace].name
          : destination,
      date: date || "Flexible dates",
      style: travelStyle,
      travellers,
      vehicleType,
    };

    const locationText = pickupLocation.mapsLink
      ? `Live location: ${pickupLocation.mapsLink}`
      : pickupLocation.address
      ? `Pickup address: ${pickupLocation.address}`
      : "Pickup location: Not provided";

    const message = [
      "Hello ROAMORA TOURS, I would like to request a pickup/tour.",
      "",
      `Name: ${pickupForm.name || "Not provided"}`,
      `Phone: ${pickupForm.phone || "Not provided"}`,
      `Email: ${pickupForm.email || "Not provided"}`,
      `Destination: ${route.destination}`,
      `Date: ${route.date}`,
      `Pickup time: ${pickupForm.time || "To be confirmed"}`,
      `Travel style: ${route.style}`,
      `Travellers: ${route.travellers}`,
      `Vehicle: ${route.vehicleType}`,
      locationText,
      pickupLocation.latitude && pickupLocation.longitude
        ? `Coordinates: ${pickupLocation.latitude}, ${pickupLocation.longitude}`
        : "",
      `Notes: ${pickupForm.notes || "None"}`,
    ]
      .filter(Boolean)
      .join("\n");

    const phone = OWNER_WHATSAPP.replace(/\D/g, "");

    if (!phone) {
      setPickupStatus("Add the owner's WhatsApp number in OWNER_WHATSAPP first.");
      return;
    }

    window.open(
      `https://wa.me/${phone}?text=${encodeURIComponent(message)}`,
      "_blank",
      "noopener,noreferrer"
    );
  };

  // ============================================================
  // EMAIL - TOUR / PICKUP
  // ============================================================

  const sendPickupRequest = async (event) => {
    event.preventDefault();

    setPickupStatus("");

    if (
      EMAILJS_SERVICE_ID === "YOUR_SERVICE_ID" ||
      EMAILJS_TEMPLATE_ID === "YOUR_TEMPLATE_ID" ||
      EMAILJS_PUBLIC_KEY === "YOUR_PUBLIC_KEY"
    ) {
      setPickupStatus(
        "EmailJS is not configured yet. Use WhatsApp below, or add your EmailJS IDs in main.jsx."
      );
      return;
    }

    setSendingPickup(true);

    const route = routeResult || {
      destination:
        destination === "Anywhere in Sri Lanka"
          ? places[activePlace].name
          : destination,
      date: date || "Flexible dates",
      style: travelStyle,
      travellers,
      vehicleType,
    };

    const pickupAddress = pickupLocation.address || "Not provided";
    const pickupMapsLink = pickupLocation.mapsLink || "Not provided";
    const pickupCoordinates =
      pickupLocation.latitude && pickupLocation.longitude
        ? `${pickupLocation.latitude}, ${pickupLocation.longitude}`
        : "Not provided";

    const templateParams = {
      customer_name: pickupForm.name,
      customer_phone: pickupForm.phone,
      customer_email: pickupForm.email,
      destination: route.destination,
      travel_date: route.date,
      pickup_time: pickupForm.time || "To be confirmed",
      travel_style: route.style,
      travellers: route.travellers,
      vehicle: route.vehicleType,
      pickup_address: pickupAddress,
      pickup_location: pickupMapsLink,
      pickup_coordinates: pickupCoordinates,
      notes: pickupForm.notes || "None",
      request_type: "Tour / Pickup Request",
    };

    try {
      await emailjs.send(
        EMAILJS_SERVICE_ID,
        EMAILJS_TEMPLATE_ID,
        templateParams,
        { publicKey: EMAILJS_PUBLIC_KEY }
      );

      setPickupStatus("success");

      setPickupForm({
        name: "",
        phone: "",
        email: "",
        time: "",
        notes: "",
      });
    } catch (error) {
      console.error("EmailJS error:", error);

      setPickupStatus(
        "Email could not be sent right now. Please use WhatsApp instead."
      );
    } finally {
      setSendingPickup(false);
    }
  };

  // ============================================================
  // AIRPORT PICKUP - WHATSAPP
  // ============================================================

  const sendAirportWhatsApp = () => {
    const phone = OWNER_WHATSAPP.replace(/\D/g, "");

    if (!phone) {
      setAirportStatus("WhatsApp number is not configured.");
      return;
    }

    const message = [
      "✈️ AIRPORT PICKUP REQUEST",
      "",
      "Hello ROAMORA TOURS, I would like to request an airport pickup.",
      "",
      `Arrival Airport: ${airportForm.airport || "Not provided"}`,
      `Destination / Hotel: ${airportForm.destination || "Not provided"}`,
      `Arrival Date: ${airportForm.arrivalDate || "Not provided"}`,
      `Arrival Time: ${airportForm.arrivalTime || "Not provided"}`,
      "",
      `Name: ${airportForm.name || "Not provided"}`,
      `Phone / WhatsApp: ${airportForm.phone || "Not provided"}`,
      `Email: ${airportForm.email || "Not provided"}`,
      "",
      `Special Request: ${airportForm.notes || "None"}`,
    ].join("\n");

    window.open(
      `https://wa.me/${phone}?text=${encodeURIComponent(message)}`,
      "_blank",
      "noopener,noreferrer"
    );

    setAirportStatus("WhatsApp opened with your airport pickup request.");
  };

  // ============================================================
  // AIRPORT PICKUP - EMAIL
  // ============================================================

  const sendAirportEmail = async (event) => {
    event.preventDefault();

    setAirportStatus("");

    if (
      EMAILJS_SERVICE_ID === "YOUR_SERVICE_ID" ||
      EMAILJS_TEMPLATE_ID === "YOUR_TEMPLATE_ID" ||
      EMAILJS_PUBLIC_KEY === "YOUR_PUBLIC_KEY"
    ) {
      setAirportStatus(
        "EmailJS is not configured. Please check your EmailJS settings."
      );
      return;
    }

    setAirportSending(true);

    const templateParams = {
      customer_name: airportForm.name,
      customer_phone: airportForm.phone,
      customer_email: airportForm.email,
      arrival_airport: airportForm.airport,
      airport: airportForm.airport,
      destination: airportForm.destination,
      hotel_destination: airportForm.destination,
      travel_date: airportForm.arrivalDate,
      arrival_date: airportForm.arrivalDate,
      arrival_time: airportForm.arrivalTime,
      pickup_time: airportForm.arrivalTime,
      notes: airportForm.notes || "None",
      request_type: "Airport Pickup Request",
    };

    try {
      await emailjs.send(
        EMAILJS_SERVICE_ID,
        EMAILJS_TEMPLATE_ID,
        templateParams,
        { publicKey: EMAILJS_PUBLIC_KEY }
      );

      setAirportStatus("success");

      setAirportForm({
        airport: airports[0],
        destination: "",
        arrivalDate: "",
        arrivalTime: "",
        name: "",
        phone: "",
        email: "",
        notes: "",
      });
    } catch (error) {
      console.error("Airport EmailJS error:", error);

      setAirportStatus("Email could not be sent. Please use WhatsApp instead.");
    } finally {
      setAirportSending(false);
    }
  };

  // ============================================================
  // REVIEW MEDIA
  // ============================================================

  const handleReviewMedia = (event) => {
    const file = event.target.files?.[0];

    if (!file) return;

    if (!file.type.startsWith("image/") && !file.type.startsWith("video/")) {
      setReviewStatus("Please select an image or video.");
      return;
    }

    if (file.size > 25 * 1024 * 1024) {
      setReviewStatus("Please keep review media below 25MB.");
      return;
    }

    setReviewStatus("");

    setReviewForm((previous) => ({
      ...previous,
      media: file,
    }));
  };

  // ============================================================
  // SUBMIT REVIEW
  // ============================================================

  const submitReview = async (event) => {
    event.preventDefault();

    setReviewStatus("");

    const file = reviewForm.media;

    try {
      const reviewId = crypto.randomUUID();

      let mediaPath = null;
      let mediaType = null;

      // Upload photo/video
      if (file) {
        mediaType = file.type.startsWith("image/") ? "image" : "video";

        const extension = file.name.split(".").pop()?.toLowerCase() || "bin";

        mediaPath = `${reviewId}/${crypto.randomUUID()}.${extension}`;

        const { error: uploadError } = await supabase.storage
          .from("review-media")
          .upload(mediaPath, file, {
            contentType: file.type,
            upsert: false,
          });

        if (uploadError) {
          console.error("Review media upload error:", uploadError);

          setReviewStatus("Photo/video upload failed. Please try again.");

          return;
        }
      }

      // Save review
      const { error } = await supabase.from("reviews").insert({
        id: reviewId,
        name: reviewForm.name.trim(),
        country: reviewForm.country.trim() || "Traveller",
        trip: reviewForm.trip.trim() || "Sri Lanka Journey",
        rating: Number(reviewForm.rating),
        text: reviewForm.text.trim(),
        media_type: mediaType,
        media_path: mediaPath,
        status: "published",
      });

      if (error) {
        console.error("Supabase review insert error:", error);

        setReviewStatus("Your review could not be saved. Please try again.");

        return;
      }

      await loadReviews();

      setReviewForm({
        name: "",
        country: "",
        trip: "",
        rating: "5",
        text: "",
        media: null,
      });

      setReviewStatus(
        "Your review has been published successfully. Thank you for sharing your ROAMORA journey! ❤️"
      );
    } catch (error) {
      console.error("Review submission error:", error);

      setReviewStatus("Something went wrong. Please try again.");
    }
  };

  // SEARCH FILTER
  const filteredPlaces = places.filter((place) =>
    place.name.toLowerCase().includes(searchText.toLowerCase())
  );

  // ============================================================
  // RENDER
  // ============================================================

  return (
    <main>
      {/* NAVIGATION */}

      <header className={`nav ${scrolled ? "nav-scrolled" : ""}`}>
        <button
          className="brand"
          onClick={() => scrollTo("home")}
          aria-label="ROAMORA TOURS home"
        >
          <span className="brand-mark">
            <span />
          </span>

          <span>
            ROAMORA
            <span className="brand-soft">/TOURS</span>
          </span>
        </button>

        <nav className={`nav-links ${menuOpen ? "open" : ""}`}>
          <button onClick={() => scrollTo("discover")}>Discover</button>
          <button onClick={() => scrollTo("stories")}>Stories</button>
          <button onClick={() => scrollTo("vehicles")}>Vehicles</button>
          <button onClick={() => scrollTo("airport")}>Airport</button>
          <button onClick={() => scrollTo("reviews")}>Reviews</button>
          <button onClick={() => scrollTo("experiences")}>Experiences</button>
          <button onClick={() => scrollTo("gallery")}>Gallery</button>
          <button onClick={() => scrollTo("plan")}>Plan a trip</button>
        </nav>

        <div className="nav-actions">
          <button
            className="icon-btn"
            aria-label="Search"
            onClick={() => setSearchOpen(true)}
          >
            <Search size={18} />
          </button>

          <button className="pill-btn" onClick={() => scrollTo("plan")}>
            Start exploring
            <ArrowRight size={16} />
          </button>

          <button
            className="menu-btn"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Menu"
          >
            {menuOpen ? <X /> : <Menu />}
          </button>
        </div>
      </header>

      {/* HERO */}

      <section id="home" className="hero hero-clean">
        <div className="hero-media">
          <img src="/c5.jpeg" alt="Sri Lanka landscape" />

          <div className="hero-vignette" />
          <div className="grain" />
        </div>
      </section>

      {/* CUSTOMER REVIEWS */}

      <section id="reviews" className="reviews-section">
        <div className="reviews-inner">
          <div className="section-head reviews-head">
            <div>
              <span className="kicker">TRAVELLER STORIES</span>

              <h2>
                Loved by travellers.
                <br />
                <span>Shared by them.</span>
              </h2>
            </div>

            <div className="reviews-head-side">
              <p>
                Real journeys, real memories and feedback from people who
                explored Sri Lanka with ROAMORA.
              </p>

              <button
                className="review-add-btn"
                onClick={() => {
                  setReviewStatus("");
                  setReviewOpen(true);
                }}
              >
                Share your experience
                <ArrowRight size={16} />
              </button>
            </div>
          </div>

          <div className="review-grid">
            {reviews.map((review) => (
              <article className="review-card" key={review.id}>
                <div className="review-card-top">
                  <div className="review-stars">
                    {"★".repeat(Number(review.rating || 0))}
                  </div>

                  <span>{review.trip}</span>
                </div>

                <p className="review-text">“{review.text}”</p>

                {(review.image || review.video) && (
                  <div className="review-media">
                    {review.video ? (
                      <video
                        src={review.video}
                        controls
                        playsInline
                        preload="metadata"
                      />
                    ) : (
                      <img
                        src={review.image}
                        alt={`${review.name} travel memory`}
                        className="review-clickable-image"
                        onClick={() => setSelectedReviewImage(review.image)}
                      />
                    )}

                    {review.localMedia && (
                      <small>Preview — publish after approval</small>
                    )}
                  </div>
                )}

                <div className="review-person">
                  <div className="review-avatar">
                    {review.name?.charAt(0)?.toUpperCase() || "R"}
                  </div>

                  <div>
                    <strong>{review.name}</strong>
                    <small>{review.country}</small>
                  </div>
                </div>
              </article>
            ))}
          </div>

          {/* OWNER CURATED FEEDBACK */}

          <div className="owner-feedback-section">
            <div className="owner-feedback-heading">
              <div>
                <span className="kicker">ROAMORA / UNCUT</span>

                <h3>Voices from the road.</h3>
              </div>

              <p>
                A collection of genuine feedback moments shared with ROAMORA —
                captured in their own words, photos and videos.
              </p>
            </div>

            <div className="owner-feedback-grid">
              {ownerFeedbackMedia.map((item, index) => (
                <article
                  className={`owner-feedback-card owner-feedback-card-${
                    (index % 5) + 1
                  }`}
                  key={`${item.src}-${index}`}
                >
                  <div className="owner-feedback-media">
                    {item.type === "video" ? (
                      <video
                        src={item.src}
                        controls
                        playsInline
                        preload="metadata"
                      />
                    ) : (
                      <img src={item.src} alt="ROAMORA customer feedback" />
                    )}

                    <span className="owner-feedback-tag">
                      {item.type === "video"
                        ? "VIDEO FEEDBACK"
                        : "PHOTO FEEDBACK"}
                    </span>

                    <span className="owner-feedback-number">0{index + 1}</span>
                  </div>
                </article>
              ))}
            </div>
          </div>

          <div className="reviews-trust-row">
            <span>★★★★★</span>

            <strong>Every journey leaves a story.</strong>

            <small>Real feedback. Real moments. Curated by ROAMORA.</small>
          </div>
        </div>
      </section>

      {/* REVIEW IMAGE LIGHTBOX */}

      {selectedReviewImage && (
        <div
          className="review-image-lightbox"
          onClick={() => setSelectedReviewImage(null)}
        >
          <button
            type="button"
            className="review-image-close"
            onClick={() => setSelectedReviewImage(null)}
            aria-label="Close image"
          >
            ×
          </button>

          <img
            src={selectedReviewImage}
            alt="Full customer travel memory"
            className="review-image-lightbox-img"
            onClick={(event) => event.stopPropagation()}
          />
        </div>
      )}

      {/* GALLERY */}

      <section id="gallery" className="gallery-section">
        <div className="gallery-inner">
          <div className="section-head gallery-head">
            <div>
              <span className="kicker">01 / ROAMORA GALLERY</span>

              <h2>
                Journeys,
                <br />
                <span>captured.</span>
              </h2>
            </div>

            <div className="gallery-head-side">
              <p>
                Real moments from Sri Lanka, captured by the travellers who
                experienced them. Browse each collection as their island story
                unfolds.
              </p>

              <span className="gallery-admin-note">
                {galleryCountryConfig.length} DESTINATIONS ·{" "}
                {roamoraGallery.length} ITEMS
              </span>
            </div>
          </div>

          <div className="gallery-country-filter">
            <div className="gallery-filter-label">
              <span>TRAVELLER COLLECTIONS</span>
              <small>
                {galleryCountryConfig.find(
                  (country) => country.id === activeGalleryCountry
                )?.total || 0}{" "}
                items selected
              </small>
            </div>

            <div
              className="gallery-country-tabs"
              role="tablist"
              aria-label="Gallery countries"
            >
              {galleryCountryConfig.map((country) => (
                <button
                  key={country.id}
                  type="button"
                  role="tab"
                  aria-selected={activeGalleryCountry === country.id}
                  className={`gallery-country-tab ${
                    activeGalleryCountry === country.id ? "active" : ""
                  }`}
                  onClick={() => setActiveGalleryCountry(country.id)}
                >
                  {country.name}
                  <span>{country.total}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="gallery-country-cards">
            {galleryCountryConfig.map((country) => {
              const previewImages = roamoraGallery
                .filter(
                  (item) =>
                    item.country === country.id &&
                    item.type === "image" &&
                    !brokenSrcs.includes(item.src)
                )
                .slice(0, 5);

              return (
                <button
                  key={country.id}
                  type="button"
                  className={`gallery-country-card ${
                    activeGalleryCountry === country.id ? "active" : ""
                  }`}
                  onClick={() => {
                    setActiveGalleryCountry(country.id);
                    setGalleryOpen(country);
                  }}
                >
                  <div className="gallery-country-preview">
                    {previewImages.map((item, index) => (
                      <img
                        key={item.src}
                        className={`gallery-preview-image gallery-preview-${
                          index + 1
                        }`}
                        src={item.src}
                        alt={`${country.name} preview ${index + 1}`}
                        loading="lazy"
                        onError={() => markBroken(item.src)}
                      />
                    ))}

                    <div className="gallery-country-overlay" />
                  </div>

                  <div className="gallery-country-card-copy">
                    <div>
                      <span>
                        ROAMORA / {String(country.total).padStart(2, "0")} ITEMS
                      </span>

                      <h3>{country.name}</h3>

                      <p>{country.description}</p>
                    </div>

                    <div className="gallery-country-arrow">
                      <ArrowRight size={18} />
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* AIRPORT PICKUP */}

      <section id="airport" className="airport-section airport-top-section">
        <div className="airport-content">
          <span className="kicker light">ROAMORA / AIRPORT PICKUP</span>

          <h2>
            Land in Sri Lanka.
            <br />
            <em>We'll take it from here.</em>
          </h2>

          <p>
            Your first Sri Lankan experience should feel effortless. Tell us
            your arrival details and we'll arrange a comfortable private
            transfer to your hotel or first destination.
          </p>

          <div className="airport-service-points">
            <span>
              <Check size={15} />
              Meet & greet
            </span>

            <span>
              <Check size={15} />
              Private vehicles
            </span>

            <span>
              <Check size={15} />
              Hotel transfers
            </span>

            <span>
              <Check size={15} />
              WhatsApp support
            </span>
          </div>

          <button
            className="primary-btn airport-main-btn"
            onClick={() => {
              setAirportStatus("");
              setModal({ type: "airport" });
            }}
          >
            Request airport pickup
            <ArrowRight size={17} />
          </button>
        </div>

        <div className="airport-visual-card">
          <span>YOUR ARRIVAL</span>

          <strong>Airport → Hotel</strong>

          <small>Comfortable. Private. Simple.</small>

          <div className="airport-route-line">
            <span />
            <div />
            <span />
          </div>
        </div>
      </section>

      {/* DISCOVER */}

      <section id="discover" className="section discover">
        <div className="section-head">
          <div>
            <span className="kicker">02 / DISCOVER</span>

            <h2>
              One island.
              <br />
              <span>Endless stories.</span>
            </h2>
          </div>

          <p>
            From misty tea country to reef-blue beaches, Sri Lanka is small
            enough to explore deeply and wild enough to surprise you every day.
          </p>
        </div>

        <div className="place-showcase">
          <div className="feature-place" onClick={() => openPlace(activePlace)}>
            <img
              src={places[activePlace].image}
              alt={places[activePlace].name}
            />

            <div className="feature-overlay">
              <span>{places[activePlace].accent}</span>

              <h3>{places[activePlace].name}</h3>

              <p>{places[activePlace].tag}</p>

              <button
                onClick={(event) => {
                  event.stopPropagation();
                  openPlace(activePlace);
                }}
              >
                Explore place
                <ArrowRight size={16} />
              </button>
            </div>
          </div>

          <div className="place-list">
            {places.map((place, index) => (
              <button
                key={place.name}
                className={
                  index === activePlace ? "place-item active" : "place-item"
                }
                onClick={() => {
                  setActivePlace(index);
                  openPlace(index);
                }}
              >
                <span className="place-number">
                  {String(index + 1).padStart(2, "0")}
                </span>

                <span className="place-copy">
                  <strong>{place.name}</strong>
                  <small>{place.tag}</small>
                </span>

                <ArrowRight size={17} />
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* STORIES */}

      <section id="stories" className="cinema-section">
        <div className="cinema-image">
          <img
            src="https://images.unsplash.com/photo-1539367628448-4bc5c9d171c8?auto=format&fit=crop&w=2200&q=90"
            alt="Sri Lanka coast"
          />

          <div className="cinema-overlay" />
        </div>

        <div className="cinema-content">
          <span className="kicker light">ROAMORA / ISLAND STORIES</span>

          <h2>
            Not just a place
            <br />
            to <em>visit.</em>
          </h2>

          <p>
            Let the train windows frame your morning. Let a village kitchen
            feed you. Let the monsoon change your plans.
          </p>

          <button
            className="circle-play"
            onClick={() => setModal({ type: "film" })}
            aria-label="Play island film"
          >
            <Play size={20} fill="currentColor" />
          </button>

          <span className="watch">ROAMORA FILM / 01:48</span>
        </div>
      </section>

      {/* EXPERIENCES */}

      <section id="experiences" className="section experiences">
        <div className="section-head compact">
          <div>
            <span className="kicker">03 / EXPERIENCES</span>

            <h2>
              Travel with
              <br />
              <span>intention.</span>
            </h2>
          </div>

          <button
            className="text-btn"
            onClick={() => setModal({ type: "experiences" })}
          >
            View all experiences
            <ArrowRight size={16} />
          </button>
        </div>

        <div className="experience-grid">
          {experiences.map((experience) => (
            <article
              className="experience-card"
              key={experience.title}
              onClick={() => setModal({ type: "experience", data: experience })}
            >
              <span className="exp-num">{experience.num}</span>

              <div
                className="exp-art"
                style={{ backgroundImage: `url(${experience.image})` }}
              />

              <div className="exp-body">
                <h3>{experience.title}</h3>

                <p>{experience.text}</p>

                <button
                  onClick={(event) => {
                    event.stopPropagation();
                    setModal({ type: "experience", data: experience });
                  }}
                >
                  <ArrowRight size={16} />
                </button>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* VEHICLES */}

      <section id="vehicles" className="section vehicles-section">
        <div className="section-head">
          <div>
            <span className="kicker">04 / TRAVEL WITH US</span>

            <h2>
              Your journey.
              <br />
              <span>Our wheels.</span>
            </h2>
          </div>

          <p>
            Comfortable cars, tourist vans and buses for private trips,
            families, friends and larger groups.
          </p>
        </div>

        <div className="vehicle-grid">
          {vehicles.map((vehicle) => (
            <article className="vehicle-card" key={vehicle.name}>
              <div className="vehicle-image">
                <img src={vehicle.image} alt={vehicle.name} />
              </div>

              <div className="vehicle-content">
                <span>{vehicle.type}</span>

                <h3>{vehicle.name}</h3>

                <p>
                  {vehicle.passengers} · {vehicle.luggage}
                </p>

                <button
                  onClick={() =>
                    setModal({
                      type: "message",
                      title: vehicle.name,
                      text: `Request ${vehicle.name} for your Sri Lankan journey.`,
                    })
                  }
                >
                  Request vehicle
                  <ArrowRight size={15} />
                </button>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* TOUR PACKAGES */}

      <section className="section packages-section">
        <div className="section-head">
          <div>
            <span className="kicker">05 / TOUR STYLES</span>

            <h2>
              Travel your
              <br />
              <span>way.</span>
            </h2>
          </div>

          <p>
            Choose a ready-made style or start a custom journey with your
            family, friends or partner.
          </p>
        </div>

        <div className="package-grid">
          {tourPackages.map((pkg) => (
            <button
              className="package-card"
              key={pkg.title}
              onClick={() => {
                setTravelType(
                  pkg.title
                    .replace(" Escape", "")
                    .replace(" Getaway", "")
                    .replace(" Sri Lanka", "")
                );

                scrollTo("plan");
              }}
            >
              <span className="package-icon">{pkg.icon}</span>

              <strong>{pkg.title}</strong>

              <p>{pkg.text}</p>

              <ArrowRight size={18} />
            </button>
          ))}
        </div>
      </section>

      {/* QUOTE */}

      <section className="quote-section">
        <div className="quote-mark">“</div>

        <blockquote>
          The island teaches you
          <br />
          <span>to slow down.</span>
        </blockquote>

        <p>— A different kind of luxury</p>
      </section>

      {/* PLAN */}

      <section id="plan" className="plan">
        <div className="plan-inner">
          <span className="kicker light">03 / PLAN YOUR ESCAPE</span>

          <h2>
            Where will
            <br />
            <em>you go?</em>
          </h2>

          <div className="planner">
            {/* DESTINATION */}

            <div className="planner-field">
              <MapPin size={17} />

              <span>
                <small>DESTINATION</small>

                <select
                  value={destination}
                  onChange={(event) => setDestination(event.target.value)}
                >
                  <option>Anywhere in Sri Lanka</option>

                  {places.map((place) => (
                    <option key={place.name} value={place.name}>
                      {place.name}
                    </option>
                  ))}
                </select>
              </span>

              <ChevronDown size={17} />
            </div>

            {/* DATE */}

            <div className="planner-field">
              <CalendarDays size={17} />

              <span>
                <small>WHEN</small>

                <input
                  type="date"
                  value={date}
                  onChange={(event) => setDate(event.target.value)}
                />
              </span>
            </div>

            {/* TRAVEL STYLE */}

            <div className="planner-field">
              <Compass size={17} />

              <span>
                <small>TRAVEL STYLE</small>

                <select
                  value={travelStyle}
                  onChange={(event) => setTravelStyle(event.target.value)}
                >
                  {travelStyles.map((style) => (
                    <option key={style}>{style}</option>
                  ))}
                </select>
              </span>

              <ChevronDown size={17} />
            </div>

            {/* TRAVELLERS */}

            <div className="planner-field">
              <Heart size={17} />

              <span>
                <small>TRAVELLERS</small>

                <select
                  value={travellers}
                  onChange={(event) => setTravellers(event.target.value)}
                >
                  <option value="1">1 Traveller</option>
                  <option value="2">2 Travellers</option>
                  <option value="4">4 Travellers</option>
                  <option value="6">6 Travellers</option>
                  <option value="8">8 Travellers</option>
                  <option value="10+">10+ Travellers</option>
                </select>
              </span>

              <ChevronDown size={17} />
            </div>

            {/* VEHICLE */}

            <div className="planner-field">
              <Compass size={17} />

              <span>
                <small>VEHICLE</small>

                <select
                  value={vehicleType}
                  onChange={(event) => setVehicleType(event.target.value)}
                >
                  {vehicles.map((vehicle) => (
                    <option key={vehicle.name}>{vehicle.name}</option>
                  ))}
                </select>
              </span>

              <ChevronDown size={17} />
            </div>

            <button className="search-btn" onClick={findRoute}>
              <Search size={18} />

              <span>Find my route</span>
            </button>
          </div>

          {/* ROUTE RESULT */}

          {routeResult && (
            <div className="route-result">
              <div className="route-image">
                <img
                  src={routeResult.place.image}
                  alt={routeResult.destination}
                />
              </div>

              <div className="route-content">
                <span className="kicker">YOUR PERSONAL ROUTE</span>

                <h3>{routeResult.destination}</h3>

                <div className="route-meta">
                  <span>
                    <CalendarDays size={15} />
                    {routeResult.date}
                  </span>

                  <span>
                    <Compass size={15} />
                    {routeResult.style}
                  </span>

                  <span>
                    <Clock size={15} />
                    {routeResult.place.duration}
                  </span>
                </div>

                <p>{routeResult.place.description}</p>

                <button
                  className="route-explore"
                  onClick={() => {
                    const index = places.findIndex(
                      (place) => place.name === routeResult.place.name
                    );

                    if (index >= 0) {
                      openPlace(index);
                    }
                  }}
                >
                  Explore this route
                  <ArrowRight size={16} />
                </button>

                <button className="pickup-route-btn" onClick={openPickupRequest}>
                  Pick me up for this trip
                  <Car size={16} />
                </button>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* FOOTER */}

      <footer>
        <div className="footer-brand">
          ROAMORA
          <span>/TOURS</span>
        </div>

        <p>Curated journeys. Local knowledge. Sri Lanka, your way.</p>

        <div className="footer-links">
          <a
            className="footer-social-link"
            href="https://www.instagram.com/roamora_tours?stkn=MW1qcjJjdHEwMXY3dg=="
            target="_blank"
            rel="noreferrer"
          >
            Instagram
          </a>

          <a
            className="footer-social-link"
            href="https://www.facebook.com/share/1DKpDvdX2k/"
            target="_blank"
            rel="noreferrer"
          >
            Facebook
          </a>

          <button onClick={() => scrollTo("stories")}>Journal</button>

          <a
            className="footer-social-link footer-whatsapp-link"
            href={`https://wa.me/${OWNER_WHATSAPP}`}
            target="_blank"
            rel="noreferrer"
            aria-label="Open ROAMORA WhatsApp"
          >
            <MessageCircle size={13} />
            WhatsApp
          </a>
        </div>

        <span className="copyright">© 2026 ROAMORA TOURS</span>
      </footer>

      {/* REVIEW SUBMISSION MODAL */}

      {reviewOpen && (
        <div
          className="modal-backdrop review-modal-backdrop"
          onClick={() => setReviewOpen(false)}
        >
          <div
            className="review-modal-card"
            onClick={(event) => event.stopPropagation()}
          >
            <button
              className="modal-close review-close"
              onClick={() => setReviewOpen(false)}
              aria-label="Close review form"
            >
              <X size={20} />
            </button>

            <div className="review-modal-copy">
              <span className="kicker">SHARE YOUR ROAMORA STORY</span>

              <h2>Your journey.</h2>

              <p>
                Tell future travellers what your Sri Lankan experience was
                like. Add a photo or short video from your trip.
              </p>
            </div>

            <form className="review-form" onSubmit={submitReview}>
              <div className="review-form-grid">
                <label>
                  <span>Your name *</span>

                  <input
                    required
                    value={reviewForm.name}
                    onChange={(event) =>
                      setReviewForm({ ...reviewForm, name: event.target.value })
                    }
                    placeholder="Full name"
                  />
                </label>

                <label>
                  <span>Country</span>

                  <input
                    value={reviewForm.country}
                    onChange={(event) =>
                      setReviewForm({
                        ...reviewForm,
                        country: event.target.value,
                      })
                    }
                    placeholder="e.g. Australia"
                  />
                </label>

                <label>
                  <span>Trip type</span>

                  <input
                    value={reviewForm.trip}
                    onChange={(event) =>
                      setReviewForm({ ...reviewForm, trip: event.target.value })
                    }
                    placeholder="Family / Honeymoon / Adventure..."
                  />
                </label>

                <label>
                  <span>Rating *</span>

                  <select
                    required
                    value={reviewForm.rating}
                    onChange={(event) =>
                      setReviewForm({
                        ...reviewForm,
                        rating: event.target.value,
                      })
                    }
                  >
                    <option value="5">★★★★★ — Excellent</option>
                    <option value="4">★★★★☆ — Very good</option>
                    <option value="3">★★★☆☆ — Good</option>
                    <option value="2">★★☆☆☆ — Fair</option>
                    <option value="1">★☆☆☆☆ — Needs improvement</option>
                  </select>
                </label>

                <label className="review-full-field">
                  <span>Your feedback *</span>

                  <textarea
                    required
                    rows="5"
                    value={reviewForm.text}
                    onChange={(event) =>
                      setReviewForm({ ...reviewForm, text: event.target.value })
                    }
                    placeholder="How was your ROAMORA experience?"
                  />
                </label>

                <label className="review-upload-field">
                  <span>Travel photo / video</span>

                  <input
                    type="file"
                    accept="image/*,video/*"
                    onChange={handleReviewMedia}
                  />

                  <small>JPG, PNG, WEBP or MP4 · max 25MB</small>

                  {reviewForm.media && (
                    <strong>Selected: {reviewForm.media.name}</strong>
                  )}
                </label>
              </div>

              {reviewStatus && (
                <div className="review-status">{reviewStatus}</div>
              )}

              <div className="review-form-actions">
                <button className="primary-btn" type="submit">
                  Publish review
                  <ArrowRight size={16} />
                </button>

                <button
                  type="button"
                  className="review-cancel-btn"
                  onClick={() => setReviewOpen(false)}
                >
                  Cancel
                </button>
              </div>

              <small className="review-approval-note">
                For the production version, uploaded photos/videos should be
                stored in a media service and reviews should be approved by the
                ROAMORA team before becoming public.
              </small>
            </form>
          </div>
        </div>
      )}

      {/* COUNTRY GALLERY MODAL */}

      {galleryOpen && (
        <div
          className="modal-backdrop gallery-lightbox"
          onClick={() => {
            setGalleryOpen(null);
            setGalleryLightboxIndex(null);
          }}
        >
          <button
            className="modal-close"
            onClick={() => {
              setGalleryOpen(null);
              setGalleryLightboxIndex(null);
            }}
            aria-label="Close gallery"
          >
            <X size={20} />
          </button>

          <div
            className="gallery-country-modal"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="gallery-modal-head">
              <div>
                <span>ROAMORA / {galleryOpen.name}</span>

                <h3>
                  {galleryOpen.name}
                  <small>{galleryOpen.total} ITEMS</small>
                </h3>

                <p>{galleryOpen.description}</p>
              </div>

              <button
                type="button"
                className="gallery-modal-close"
                onClick={() => {
                  setGalleryOpen(null);
                  setGalleryLightboxIndex(null);
                }}
                aria-label="Close country gallery"
              >
                <X size={18} />
              </button>
            </div>

            <div className="gallery-modal-grid">
              {galleryItems.map((item, idx) => (
                <button
                  key={item.src}
                  type="button"
                  className="gallery-modal-item"
                  onClick={() => setGalleryLightboxIndex(idx)}
                >
                  {item.type === "video" ? (
                    <>
                      <video
                        src={`${item.src}#t=0.5`}
                        muted
                        playsInline
                        preload="metadata"
                        onError={() => markBroken(item.src)}
                      />
                      <em className="gallery-video-badge">
                        <Play size={14} fill="currentColor" />
                      </em>
                    </>
                  ) : (
                    <img
                      src={item.src}
                      alt={`${item.title} photo ${idx + 1}`}
                      loading="lazy"
                      onError={() => markBroken(item.src)}
                    />
                  )}

                  <span>{String(idx + 1).padStart(2, "0")}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* GALLERY ITEM VIEWER (next / prev / swipe) */}

      {activeGalleryItem && (
        <div
          className="modal-backdrop gallery-image-viewer"
          onClick={() => setGalleryLightboxIndex(null)}
        >
          <button
            className="modal-close"
            onClick={() => setGalleryLightboxIndex(null)}
            aria-label="Close viewer"
          >
            <X size={20} />
          </button>

          <button
            type="button"
            className="gallery-nav-btn gallery-nav-prev"
            onClick={(event) => {
              event.stopPropagation();
              showPrevGallery();
            }}
            aria-label="Previous"
          >
            <ChevronLeft size={26} />
          </button>

          <button
            type="button"
            className="gallery-nav-btn gallery-nav-next"
            onClick={(event) => {
              event.stopPropagation();
              showNextGallery();
            }}
            aria-label="Next"
          >
            <ChevronRight size={26} />
          </button>

          <div
            className="gallery-image-viewer-content"
            onClick={(event) => event.stopPropagation()}
            onTouchStart={handleGalleryTouchStart}
            onTouchEnd={handleGalleryTouchEnd}
          >
            {activeGalleryItem.type === "video" ? (
              <video
                key={activeGalleryItem.src}
                src={activeGalleryItem.src}
                controls
                autoPlay
                playsInline
                onError={() => markBroken(activeGalleryItem.src)}
              />
            ) : (
              <img
                key={activeGalleryItem.src}
                src={activeGalleryItem.src}
                alt={activeGalleryItem.title}
                draggable={false}
                onError={() => markBroken(activeGalleryItem.src)}
              />
            )}

            <div>
              <span>ROAMORA / {activeGalleryItem.title}</span>

              <strong>
                {activeGalleryItem.type === "video" ? "Video" : "Photo"}{" "}
                {galleryLightboxIndex + 1} of {galleryItems.length}
              </strong>
            </div>
          </div>
        </div>
      )}

      {/* SEARCH MODAL */}

      {searchOpen && (
        <div className="modal-backdrop" onClick={() => setSearchOpen(false)}>
          <div
            className="search-panel"
            onClick={(event) => event.stopPropagation()}
          >
            <button
              className="modal-close"
              onClick={() => setSearchOpen(false)}
              aria-label="Close search"
            >
              <X />
            </button>

            <span className="kicker">SEARCH SRI LANKA</span>

            <h2>Where do you want to go?</h2>

            <div className="search-input">
              <Search size={20} />

              <input
                autoFocus
                value={searchText}
                onChange={(event) => setSearchText(event.target.value)}
                placeholder="Try Ella, Sigiriya..."
              />
            </div>

            <div className="search-results">
              {filteredPlaces.length > 0 ? (
                filteredPlaces.map((place) => (
                  <button
                    key={place.name}
                    onClick={() => {
                      const index = places.findIndex(
                        (item) => item.name === place.name
                      );

                      setSearchOpen(false);
                      openPlace(index);
                      scrollTo("discover");
                    }}
                  >
                    <img src={place.image} alt={place.name} />

                    <span>
                      <strong>{place.name}</strong>
                      <small>{place.tag}</small>
                    </span>

                    <ArrowRight size={18} />
                  </button>
                ))
              ) : (
                <p className="no-results">No destination found.</p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* GENERAL MODALS */}

      {modal && (
        <div className="modal-backdrop" onClick={() => setModal(null)}>
          <div
            className={`modal-card ${modal.type === "film" ? "film-modal" : ""}`}
            onClick={(event) => event.stopPropagation()}
          >
            <button
              className="modal-close"
              onClick={() => setModal(null)}
              aria-label="Close modal"
            >
              <X />
            </button>

            {/* PLACE MODAL */}

            {modal.type === "place" && (
              <>
                <div className="modal-place-image">
                  <img src={modal.data.image} alt={modal.data.name} />

                  <div>
                    <span>{modal.data.accent}</span>

                    <h2>{modal.data.name}</h2>
                  </div>
                </div>

                <div className="modal-place-content">
                  <span className="kicker">{modal.data.tag}</span>

                  <p>{modal.data.description}</p>

                  <div className="place-facts">
                    <div>
                      <Clock size={18} />

                      <span>
                        <small>Recommended</small>
                        <strong>{modal.data.duration}</strong>
                      </span>
                    </div>

                    <div>
                      <Compass size={18} />

                      <span>
                        <small>Perfect for</small>
                        <strong>{modal.data.bestFor}</strong>
                      </span>
                    </div>
                  </div>

                  <h4>Must experience</h4>

                  <div className="highlight-list">
                    {modal.data.highlights.map((highlight) => (
                      <span key={highlight}>
                        <Check size={15} />
                        {highlight}
                      </span>
                    ))}
                  </div>

                  <button
                    className="modal-primary"
                    onClick={() => {
                      setDestination(modal.data.name);
                      setModal(null);
                      scrollTo("plan");
                    }}
                  >
                    Plan {modal.data.name}
                    <ArrowRight size={17} />
                  </button>
                </div>
              </>
            )}

            {/* FILM MODAL */}

            {modal.type === "film" && (
              <div className="film-content">
                <div className="film-screen">
                  <video src="/srilanka.mp4" controls autoPlay playsInline />

                  <span>ROAMORA / ISLAND STORIES</span>
                </div>

                <div className="film-copy">
                  <span className="kicker">ISLAND STORIES</span>

                  <h2>Into the island.</h2>

                  <p>
                    A cinematic journey through Sri Lanka's mountains, beaches,
                    ancient cities and wild places.
                  </p>

                  <div className="film-progress">
                    <span />
                  </div>

                  <small>00:00 / 01:48</small>
                </div>
              </div>
            )}

            {/* AIRPORT PICKUP MODAL */}

            {modal.type === "airport" && (
              <div className="airport-modal airport-pickup-modal">
                <div className="airport-modal-header">
                  <div className="airport-modal-icon">
                    <Plane size={28} />
                  </div>

                  <div>
                    <span className="kicker">AIRPORT TRANSFER</span>

                    <h2>Start your journey smoothly.</h2>

                    <p>
                      Tell us about your arrival and we'll arrange a
                      comfortable transfer to your hotel or first destination.
                    </p>
                  </div>
                </div>

                {airportStatus === "success" ? (
                  <div className="airport-success-box">
                    <div className="airport-success-icon">
                      <Check size={28} />
                    </div>

                    <h3>Request sent successfully!</h3>

                    <p>
                      Your airport pickup request has been sent to the ROAMORA
                      TOURS team.
                    </p>

                    <div className="airport-success-actions">
                      <button
                        className="whatsapp-btn"
                        onClick={sendAirportWhatsApp}
                      >
                        <MessageCircle size={17} />
                        Also send on WhatsApp
                      </button>

                      <button
                        className="modal-primary"
                        onClick={() => setModal(null)}
                      >
                        Done
                        <Check size={17} />
                      </button>
                    </div>
                  </div>
                ) : (
                  <form
                    className="airport-pickup-form"
                    onSubmit={sendAirportEmail}
                  >
                    <div className="airport-form-grid">
                      <label>
                        <span>Arrival airport *</span>

                        <select
                          required
                          value={airportForm.airport}
                          onChange={(event) =>
                            setAirportForm({
                              ...airportForm,
                              airport: event.target.value,
                            })
                          }
                        >
                          {airports.map((airport) => (
                            <option key={airport} value={airport}>
                              {airport}
                            </option>
                          ))}
                        </select>
                      </label>

                      <label>
                        <span>Hotel / destination *</span>

                        <input
                          required
                          value={airportForm.destination}
                          onChange={(event) =>
                            setAirportForm({
                              ...airportForm,
                              destination: event.target.value,
                            })
                          }
                          placeholder="Hotel, city or destination"
                        />
                      </label>

                      <label>
                        <span>Arrival date *</span>

                        <input
                          required
                          type="date"
                          value={airportForm.arrivalDate}
                          onChange={(event) =>
                            setAirportForm({
                              ...airportForm,
                              arrivalDate: event.target.value,
                            })
                          }
                        />
                      </label>

                      <label>
                        <span>Arrival time *</span>

                        <input
                          required
                          type="time"
                          value={airportForm.arrivalTime}
                          onChange={(event) =>
                            setAirportForm({
                              ...airportForm,
                              arrivalTime: event.target.value,
                            })
                          }
                        />
                      </label>

                      <label>
                        <span>Your name *</span>

                        <input
                          required
                          value={airportForm.name}
                          onChange={(event) =>
                            setAirportForm({
                              ...airportForm,
                              name: event.target.value,
                            })
                          }
                          placeholder="Full name"
                        />
                      </label>

                      <label>
                        <span>Phone / WhatsApp *</span>

                        <input
                          required
                          value={airportForm.phone}
                          onChange={(event) =>
                            setAirportForm({
                              ...airportForm,
                              phone: event.target.value,
                            })
                          }
                          placeholder="+94 77 123 4567"
                        />
                      </label>

                      <label className="airport-full-field">
                        <span>Email</span>

                        <input
                          type="email"
                          value={airportForm.email}
                          onChange={(event) =>
                            setAirportForm({
                              ...airportForm,
                              email: event.target.value,
                            })
                          }
                          placeholder="you@example.com"
                        />
                      </label>

                      <label className="airport-full-field">
                        <span>Special request</span>

                        <textarea
                          rows="4"
                          value={airportForm.notes}
                          onChange={(event) =>
                            setAirportForm({
                              ...airportForm,
                              notes: event.target.value,
                            })
                          }
                          placeholder="Flight number, luggage, child seat, hotel details..."
                        />
                      </label>
                    </div>

                    {airportStatus && airportStatus !== "success" && (
                      <div className="airport-form-warning">{airportStatus}</div>
                    )}

                    <div className="airport-request-actions">
                      <button
                        className="submit-email airport-email-btn"
                        type="submit"
                        disabled={airportSending}
                      >
                        <Mail size={17} />

                        {airportSending
                          ? "Sending request..."
                          : "Send request to Gmail"}
                      </button>

                      <button
                        className="whatsapp-btn airport-whatsapp-btn"
                        type="button"
                        onClick={sendAirportWhatsApp}
                      >
                        <MessageCircle size={17} />
                        Send via WhatsApp
                      </button>
                    </div>

                    <p className="airport-privacy-note">
                      Your arrival details are used only to arrange your
                      airport transfer.
                    </p>
                  </form>
                )}
              </div>
            )}

            {/* EXPERIENCE MODAL */}

            {modal.type === "experience" && (
              <div className="experience-modal">
                <img src={modal.data.image} alt={modal.data.title} />

                <div>
                  <span className="kicker">EXPERIENCE {modal.data.num}</span>

                  <h2>{modal.data.title}</h2>

                  <p>{modal.data.text}</p>

                  <button
                    className="modal-primary"
                    onClick={() => {
                      setModal(null);
                      scrollTo("plan");
                    }}
                  >
                    Add to my journey
                    <ArrowRight size={17} />
                  </button>
                </div>
              </div>
            )}

            {/* ALL EXPERIENCES */}

            {modal.type === "experiences" && (
              <div className="all-experiences">
                <span className="kicker">02 / EXPERIENCES</span>

                <h2>
                  Choose your
                  <br />
                  <em>experience.</em>
                </h2>

                <div className="all-experience-list">
                  {experiences.map((experience) => (
                    <button
                      key={experience.title}
                      onClick={() =>
                        setModal({ type: "experience", data: experience })
                      }
                    >
                      <img src={experience.image} alt={experience.title} />

                      <span>
                        <small>{experience.num}</small>
                        <strong>{experience.title}</strong>
                      </span>

                      <ArrowRight size={18} />
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* MESSAGE MODAL */}

            {modal.type === "message" && (
              <div className="message-modal">
                <Sparkles size={30} />

                <h2>{modal.title}</h2>

                <p>{modal.text}</p>

                <button className="modal-primary" onClick={() => setModal(null)}>
                  Got it
                  <Check size={17} />
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* PICKUP REQUEST MODAL */}

      {pickupOpen && (
        <div
          className="modal-backdrop pickup-backdrop"
          onClick={() => setPickupOpen(false)}
        >
          <div
            className="pickup-modal"
            onClick={(event) => event.stopPropagation()}
          >
            <button
              className="modal-close"
              onClick={() => setPickupOpen(false)}
              aria-label="Close pickup form"
            >
              <X />
            </button>

            <div className="pickup-heading">
              <span className="kicker">REQUEST YOUR RIDE</span>

              <h2>
                We'll pick you up
                <br />
                <em>and take you there.</em>
              </h2>

              <p>
                Send your trip details to our travel team. No online payment is
                required at this stage.
              </p>
            </div>

            <div className="request-summary">
              <div>
                <MapPin size={17} />

                <span>
                  <small>DESTINATION</small>

                  <strong>
                    {routeResult?.destination ||
                      (destination === "Anywhere in Sri Lanka"
                        ? places[activePlace].name
                        : destination)}
                  </strong>
                </span>
              </div>

              <div>
                <CalendarDays size={17} />

                <span>
                  <small>DATE</small>

                  <strong>
                    {routeResult?.date || date || "Flexible dates"}
                  </strong>
                </span>
              </div>

              <div>
                <Car size={17} />

                <span>
                  <small>VEHICLE</small>

                  <strong>{routeResult?.vehicleType || vehicleType}</strong>
                </span>
              </div>

              <div>
                <Users size={17} />

                <span>
                  <small>TRAVELLERS</small>

                  <strong>{routeResult?.travellers || travellers}</strong>
                </span>
              </div>
            </div>

            {pickupStatus === "success" ? (
              <div className="success-box">
                <div className="success-icon">
                  <Check size={25} />
                </div>

                <h3>Request sent successfully.</h3>

                <p>Your tour/pickup request has been sent to the owner's Gmail.</p>

                <div className="success-actions">
                  <button className="whatsapp-btn" onClick={sendWhatsAppRequest}>
                    <MessageCircle size={17} />
                    Also send on WhatsApp
                  </button>

                  <button
                    className="modal-primary"
                    onClick={() => setPickupOpen(false)}
                  >
                    Done
                    <Check size={17} />
                  </button>
                </div>
              </div>
            ) : (
              <form className="pickup-form" onSubmit={sendPickupRequest}>
                <div className="form-grid">
                  <label>
                    <span>Your name *</span>

                    <input
                      required
                      value={pickupForm.name}
                      onChange={(event) =>
                        setPickupForm({ ...pickupForm, name: event.target.value })
                      }
                      placeholder="Full name"
                    />
                  </label>

                  <label>
                    <span>Phone / WhatsApp *</span>

                    <input
                      required
                      value={pickupForm.phone}
                      onChange={(event) =>
                        setPickupForm({
                          ...pickupForm,
                          phone: event.target.value,
                        })
                      }
                      placeholder="+94 77 123 4567"
                    />
                  </label>

                  <label>
                    <span>Email</span>

                    <input
                      type="email"
                      value={pickupForm.email}
                      onChange={(event) =>
                        setPickupForm({
                          ...pickupForm,
                          email: event.target.value,
                        })
                      }
                      placeholder="you@example.com"
                    />
                  </label>

                  <label>
                    <span>Pickup time</span>

                    <input
                      type="time"
                      value={pickupForm.time}
                      onChange={(event) =>
                        setPickupForm({ ...pickupForm, time: event.target.value })
                      }
                    />
                  </label>
                </div>

                {/* PICKUP LOCATION */}

                <div className="pickup-location-section">
                  <div className="pickup-location-title">
                    <MapPin size={18} />

                    <span>
                      <strong>Pickup location</strong>
                      <small />
                    </span>
                  </div>

                  <label className="full-label">
                    <span />

                    <input
                      value={pickupLocation.address}
                      onChange={(event) =>
                        setPickupLocation({
                          ...pickupLocation,
                          address: event.target.value,
                        })
                      }
                      placeholder="Hotel name, house address, street, city..."
                    />
                  </label>

                  <div className="location-actions">
                    <button
                      type="button"
                      className="location-btn"
                      onClick={getCurrentLocation}
                      disabled={gettingLocation}
                    >
                      <MapPin size={17} />

                      {gettingLocation
                        ? "Getting live location..."
                        : pickupLocation.mapsLink
                        ? "Location added"
                        : "Share my live location"}
                    </button>

                    {(pickupLocation.mapsLink || pickupLocation.address) && (
                      <button
                        type="button"
                        className="clear-location-btn"
                        onClick={clearPickupLocation}
                      >
                        Clear
                      </button>
                    )}
                  </div>

                  {pickupLocation.mapsLink && (
                    <div className="location-preview">
                      <Check size={16} />

                      <div>
                        <strong>Live location ready</strong>

                        <small>
                          Coordinates: {pickupLocation.latitude},{" "}
                          {pickupLocation.longitude}
                        </small>

                        <a
                          href={pickupLocation.mapsLink}
                          target="_blank"
                          rel="noreferrer"
                        >
                          Open location in Google Maps
                        </a>
                      </div>
                    </div>
                  )}

                  {locationStatus && (
                    <div className="location-status">{locationStatus}</div>
                  )}
                </div>

                {/* SPECIAL REQUEST */}

                <label className="full-label">
                  <span>Special request</span>

                  <textarea
                    rows="3"
                    value={pickupForm.notes}
                    onChange={(event) =>
                      setPickupForm({ ...pickupForm, notes: event.target.value })
                    }
                    placeholder="Airport arrival, hotel name, extra luggage, child seat..."
                  />
                </label>

                {pickupStatus && (
                  <div className="form-warning">{pickupStatus}</div>
                )}

                {/* ACTIONS */}

                <div className="pickup-actions">
                  <button
                    className="submit-email"
                    type="submit"
                    disabled={sendingPickup}
                  >
                    <Mail size={17} />

                    {sendingPickup
                      ? "Sending request..."
                      : "Send request to Gmail"}
                  </button>

                  <button
                    className="whatsapp-btn"
                    type="button"
                    onClick={sendWhatsAppRequest}
                  >
                    <MessageCircle size={17} />
                    WhatsApp instead
                  </button>
                </div>

                <small className="privacy-note">
                  Your details and pickup location are used only to respond to
                  this travel request.
                </small>
              </form>
            )}
          </div>
        </div>
      )}
    </main>
  );
}

// ============================================================
// REACT ROOT
// ============================================================

const rootElement = document.getElementById("root");

if (rootElement) {
  createRoot(rootElement).render(<App />);
}
