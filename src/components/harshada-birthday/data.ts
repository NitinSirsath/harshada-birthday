export const SECTIONS = [
  { id: "hey-you", label: "Hey You" },
  { id: "nine-years", label: "Nine Years of Us" },
  { id: "little-memories", label: "Little Memories" },
  { id: "finding-our-way-back", label: "Finding Our Way Back" },
  { id: "looking-forward", label: "Looking Forward" },
] as const;

export type SectionId = (typeof SECTIONS)[number]["id"];

export const PHOTO_MEMORIES = [
  {
    src: "/photo1.jpg",
    alt: "Black and white portrait",
    caption:
      "A classic black and white portrait. You haven't changed much since college.",
  },
  {
    src: "/photo2.jpg",
    alt: "Candid looking down",
    caption:
      "Just a random candid shot. Sometimes the accidental photos turn out the clearest.",
  },
  {
    src: "/photo3.jpeg",
    alt: "Back of head view",
    caption: "Enjoying the view. Nice scenery.",
  },
  {
    src: "/photo4.jpeg",
    alt: "Talking outdoors",
    caption:
      "Catching up. It’s been a long time since we actually stood around and talked like this.",
  },
  {
    src: "/photo5.jpeg",
    alt: "Wearing sunglasses",
    caption: "The 'too cool for school' look. Sunglasses on, world off.",
  },
  {
    src: "/photo6.jpeg",
    alt: "In the car at night",
    caption:
      "Late night car rides. The commute is usually the only quiet time of the day.",
  },
  {
    src: "/photo7.jpeg",
    alt: "Blue dress outdoor",
    caption: "Out and about. The blue dress suits the vibe of the day.",
  },
  {
    src: "/photo8.jpeg",
    alt: "Fun filter with sunglasses",
    caption:
      "Goofy filters. We're never too old to mess around with these things.",
  },
  {
    src: "/photo9.jpeg",
    alt: "By the water",
    caption:
      "A quiet moment by the water. Sometimes it's just good to get out of the city.",
  },
  {
    src: "/photo10.jpeg",
    alt: "Green sweater in car",
    caption:
      "Mid-conversation in the car. Probably debating which song to play next.",
  },
] as const;
