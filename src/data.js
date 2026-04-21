export const PLAYERS = [
  {
    id: 1, name: "Arjun Sharma", age: 17, position: "Forward", state: "Maharashtra",
    city: "Mumbai", rating: 87, views: 4200, scoutInterests: 12,
    avatar: "https://i.pravatar.cc/150?img=11",
    bio: "Explosive forward with exceptional dribbling. Plays for Mumbai FC Academy. Top scorer in U-17 state league 2024.",
    stats: { pace: 92, shooting: 85, dribbling: 89, passing: 74, defending: 45, physical: 78 },
    highlights: [
      { id: 1, title: "Hat-trick vs Pune FC", views: 1800, likes: 320, date: "2024-12-10", thumb: "https://picsum.photos/seed/arjun1/400/225", videoId: "dQw4w9WgXcQ" },
      { id: 2, title: "State League Final Goals", views: 1500, likes: 280, date: "2024-11-22", thumb: "https://picsum.photos/seed/arjun2/400/225", videoId: "dQw4w9WgXcQ" },
      { id: 3, title: "Best Skills & Tricks 2024", views: 900, likes: 175, date: "2024-10-05", thumb: "https://picsum.photos/seed/arjun3/400/225", videoId: "dQw4w9WgXcQ" },
    ],
    badges: ["Top Scorer", "Fan Favourite"],
    joined: "2024-08-01"
  },
  {
    id: 2, name: "Ravi Krishnan", age: 19, position: "Midfielder", state: "Kerala",
    city: "Kochi", rating: 84, views: 3800, scoutInterests: 9,
    avatar: "https://i.pravatar.cc/150?img=15",
    bio: "Box-to-box midfielder from the heart of Kerala football. Known for vision and leadership.",
    stats: { pace: 78, shooting: 72, dribbling: 81, passing: 90, defending: 76, physical: 82 },
    highlights: [
      { id: 4, title: "Long Range Stunner", views: 2100, likes: 410, date: "2024-12-01", thumb: "https://picsum.photos/seed/ravi1/400/225", videoId: "dQw4w9WgXcQ" },
      { id: 5, title: "Midfield Masterclass", views: 1700, likes: 290, date: "2024-10-15", thumb: "https://picsum.photos/seed/ravi2/400/225", videoId: "dQw4w9WgXcQ" },
    ],
    badges: ["Playmaker", "Rising Star"],
    joined: "2024-07-15"
  },
  {
    id: 3, name: "Priya Mehta", age: 16, position: "Winger", state: "West Bengal",
    city: "Kolkata", rating: 82, views: 2900, scoutInterests: 7,
    avatar: "https://i.pravatar.cc/150?img=47",
    bio: "Lightning-fast winger breaking barriers in Kolkata's football scene. Youngest player in Bengal Premier League.",
    stats: { pace: 95, shooting: 78, dribbling: 86, passing: 79, defending: 52, physical: 70 },
    highlights: [
      { id: 6, title: "Pace & Goals Reel", views: 1600, likes: 330, date: "2024-11-18", thumb: "https://picsum.photos/seed/priya1/400/225", videoId: "dQw4w9WgXcQ" },
      { id: 7, title: "Wing Play Highlights", views: 1300, likes: 215, date: "2024-09-30", thumb: "https://picsum.photos/seed/priya2/400/225", videoId: "dQw4w9WgXcQ" },
    ],
    badges: ["Speedster", "Youngest Talent"],
    joined: "2024-09-01"
  },
  {
    id: 4, name: "Deepak Thapa", age: 18, position: "Goalkeeper", state: "Sikkim",
    city: "Gangtok", rating: 80, views: 2100, scoutInterests: 5,
    avatar: "https://i.pravatar.cc/150?img=52",
    bio: "Shot-stopper from the mountains with exceptional reflexes. Represented Sikkim in National U-18 championship.",
    stats: { pace: 62, shooting: 30, dribbling: 55, passing: 68, defending: 88, physical: 84 },
    highlights: [
      { id: 8, title: "Reflex Saves Compilation", views: 1200, likes: 198, date: "2024-12-05", thumb: "https://picsum.photos/seed/deepak1/400/225", videoId: "dQw4w9WgXcQ" },
      { id: 9, title: "National U-18 Knockouts", views: 900, likes: 145, date: "2024-10-20", thumb: "https://picsum.photos/seed/deepak2/400/225", videoId: "dQw4w9WgXcQ" },
    ],
    badges: ["Wall of Sikkim"],
    joined: "2024-10-10"
  },
  {
    id: 5, name: "Sneha Patil", age: 17, position: "Defender", state: "Karnataka",
    city: "Bangalore", rating: 83, views: 2600, scoutInterests: 8,
    avatar: "https://i.pravatar.cc/150?img=44",
    bio: "Commanding center-back. Leads Bangalore FC Women's Academy defence. Strong in the air and on the ground.",
    stats: { pace: 74, shooting: 55, dribbling: 68, passing: 78, defending: 91, physical: 85 },
    highlights: [
      { id: 10, title: "Defensive Masterclass", views: 1400, likes: 222, date: "2024-11-08", thumb: "https://picsum.photos/seed/sneha1/400/225", videoId: "dQw4w9WgXcQ" },
    ],
    badges: ["The Wall", "Captain Material"],
    joined: "2024-08-20"
  },
  {
    id: 6, name: "Amit Bora", age: 20, position: "Forward", state: "Assam",
    city: "Guwahati", rating: 85, views: 3500, scoutInterests: 11,
    avatar: "https://i.pravatar.cc/150?img=57",
    bio: "Clinical finisher from Northeast India. Plays for Guwahati City FC. Dreams of representing India.",
    stats: { pace: 88, shooting: 90, dribbling: 82, passing: 70, defending: 42, physical: 80 },
    highlights: [
      { id: 11, title: "Season Goals Compilation", views: 2200, likes: 390, date: "2024-12-15", thumb: "https://picsum.photos/seed/amit1/400/225", videoId: "dQw4w9WgXcQ" },
      { id: 12, title: "Northeast Cup Final", views: 1300, likes: 210, date: "2024-11-01", thumb: "https://picsum.photos/seed/amit2/400/225", videoId: "dQw4w9WgXcQ" },
    ],
    badges: ["Northeast Gem", "Clinical"],
    joined: "2024-06-15"
  }
];

export const SCOUTS = [
  { id: 1, name: "Rajesh Nair", club: "Mumbai City FC", role: "Head Scout", avatar: "https://i.pravatar.cc/150?img=33" },
  { id: 2, name: "Sunil Das", club: "ATK Mohun Bagan", role: "Youth Scout", avatar: "https://i.pravatar.cc/150?img=60" },
  { id: 3, name: "Pradeep Rao", club: "Bengaluru FC", role: "Technical Director", avatar: "https://i.pravatar.cc/150?img=25" },
];

export const POSITIONS = ["All", "Forward", "Midfielder", "Winger", "Defender", "Goalkeeper"];
export const STATES = ["All", "Maharashtra", "Kerala", "West Bengal", "Sikkim", "Karnataka", "Assam", "Goa", "Punjab", "Delhi", "Tamil Nadu"];
export const AGE_RANGES = ["All", "Under 16", "16-18", "18-21"];
