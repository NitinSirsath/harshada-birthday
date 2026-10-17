export const SECTIONS = [
  { id: "hey-you", label: "Hey You" },
  { id: "nine-years", label: "Our Story" },
  { id: "little-memories", label: "Little Memories" },
  { id: "finding-our-way-back", label: "Finding Rhythm" },
  { id: "looking-forward", label: "Looking Forward" },
] as const;

export type SectionId = (typeof SECTIONS)[number]["id"];

export const PHOTO_MEMORIES = [
  {
    src: "/photo1.jpg",
    alt: "Dipali photo 1",
    caption: "From a random snap to the beginning of something beautiful. ❤️",
  },
  {
    src: "/photo2.jpg",
    alt: "Dipali photo 2",
    caption: "Every conversation became a part of my daily life.",
  },
  {
    src: "/photo3.jpeg",
    alt: "Dipali photo 3",
    caption: "You had secretly planned everything, like a little mastermind. 😂🥹",
  },
  {
    src: "/photo4.jpeg",
    alt: "Dipali photo 4",
    caption:
      "April 6, 2025 — one small snap changed everything. 🥹❤️",
  },
  {
    src: "/photo5.jpeg",
    alt: "Dipali photo 5",
    caption: "My babuuu. 😘🥰",
  },
  {
    src: "/photo6.jpeg",
    alt: "Dipali photo 6",
    caption:
      "September 16 — when your flight landed in Aurangabad. ❤️✈️",
  },
  {
    src: "/photo7.jpeg",
    alt: "Dipali photo 7",
    caption: "From strangers to someone I'm so grateful to have in my life. ❤️🫂",
  },
  {
    src: "/photo8.jpeg",
    alt: "Dipali photo 8",
    caption: "You're my special person. 🥹❤️",
  },
  {
    src: "/photo9.jpeg",
    alt: "Dipali photo 9",
    caption: "Some stories are written long before we realise they've begun. ❤️♾️",
  },
  {
    src: "/photo10.jpeg",
    alt: "Dipali photo 10",
    caption: "And I wouldn't want to change the way our story began for anything. ❤️✨",
  },
] as const;
