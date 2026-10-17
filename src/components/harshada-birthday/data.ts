export const SECTIONS = [
  { id: "hey-you", label: "Hey You" },
  { id: "nine-years", label: "Our Story" },
  { id: "little-memories", label: "Little Memories" },
  { id: "finding-our-way-back", label: "Finding Magic" },
  { id: "looking-forward", label: "Looking Forward" },
] as const;

export type SectionId = (typeof SECTIONS)[number]["id"];

export const PHOTO_MEMORIES = [
  {
    src: "/photo1.jpg",
    alt: "Love in Europe",
    caption: "Looking so stylish and beautiful. A moment that stops time. ❤️",
  },
  {
    src: "/photo2.jpg",
    alt: "Love blue dress",
    caption: "That mirror selfie in blue — my absolute favourite version of you. ✨",
  },
  {
    src: "/photo3.jpeg",
    alt: "Love car smile",
    caption: "Late car rides and video calls. You make every ordinary day brighter.",
  },
  {
    src: "/photo4.jpeg",
    alt: "Love close up",
    caption: "April 6, 2025 — that one small snap that changed everything. 🥹❤️",
  },
  {
    src: "/photo5.jpeg",
    alt: "Love funny face",
    caption: "The goofy moments. You bring so much joy and laughter into my life. 😂❤️",
  },
  {
    src: "/photo6.jpeg",
    alt: "Love candid",
    caption: "Talking every single day. Without realising it, you became my world.",
  },
  {
    src: "/photo7.jpeg",
    alt: "Love bangles",
    caption: "The green bangles and purple nails — every little detail I notice. 💚",
  },
  {
    src: "/photo8.jpeg",
    alt: "Love portrait",
    caption: "My babuuu, my special person. I'm so grateful to have you. ❤️🫂",
  },
  {
    src: "/photo9.jpeg",
    alt: "Love out and about",
    caption: "September 16 — when your flight landed in Aurangabad. ✈️❤️",
  },
  {
    src: "/photo10.jpeg",
    alt: "Love smiling",
    caption: "And I wouldn't want to change the way our story began for anything. ❤️✨",
  },
] as const;
