export type InspirationCard = {
  id: number;
  notch: number;
  label?: string;
  darkLabel?: boolean;
  duration: number;
  delay: number;
};

export const INSPIRATION_CARDS: InspirationCard[] = [
  { id: 1, notch: 20, label: "晨光", duration: 8.6, delay: -1.8 },
  { id: 2, notch: 22, label: "微澜", duration: 9.1, delay: -2.4 },
  { id: 3, notch: 16, label: "星火", darkLabel: true, duration: 9.8, delay: -0.9 },
  { id: 4, notch: 18, label: "回响", duration: 10.3, delay: -1.5 },
  { id: 5, notch: 26, label: "远方", duration: 8.9, delay: -2.2 },
  { id: 6, notch: 23, label: "灵犀", duration: 9.5, delay: -1.1 },
  {
    id: 7,
    notch: 36,
    label: "破晓",
    duration: 10.8,
    delay: -2.8,
  },
  { id: 8, notch: 18, label: "余温", darkLabel: true, duration: 9.7, delay: -1.6 },
  { id: 9, notch: 20, label: "栖风", duration: 8.4, delay: -0.7 },
];

export const getAdjacentCardIds = (id: number) => {
  const index = INSPIRATION_CARDS.findIndex((card) => card.id === id);
  if (index < 0) return { prevId: INSPIRATION_CARDS[0].id, nextId: INSPIRATION_CARDS[0].id };

  const prev = INSPIRATION_CARDS[(index - 1 + INSPIRATION_CARDS.length) % INSPIRATION_CARDS.length];
  const next = INSPIRATION_CARDS[(index + 1) % INSPIRATION_CARDS.length];

  return { prevId: prev.id, nextId: next.id };
};
