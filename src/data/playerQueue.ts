export type PlayerQueueTrack = {
  title: string;
  subtitle: string;
  artist: string;
  cover: string;
  elapsed: string;
  duration: string;
  progress: number;
};

// 只需要在这里维护播放器顺序、图片和名称。
export const PLAYER_QUEUE: PlayerQueueTrack[] = [
  {
    title: "凌晨四点",
    subtitle: "霓虹灯下的城市独白",
    artist: "Eeeeaasy Nights",
    cover: "/pictures/player/picture1.jpg",
    elapsed: "01:12",
    duration: "02:14",
    progress: 58,
  },
  {
    title: "给星星浇灌",
    subtitle: "夜空下的温柔守候",
    artist: "Cityline Radio",
    cover: "/pictures/player/picture2.jpg",
    elapsed: "00:48",
    duration: "03:06",
    progress: 26,
  },
  {
    title: "月光落在柏油路",
    subtitle: "静谧街头的月色流淌",
    artist: "Velvet District",
    cover: "/pictures/player/picture3.jpg",
    elapsed: "02:03",
    duration: "03:52",
    progress: 53,
  },
  {
    title: "把夏天留在副歌",
    subtitle: "旋律里藏着盛夏",
    artist: "Warm Tape Club",
    cover: "/pictures/player/picture4.jpg",
    elapsed: "00:36",
    duration: "02:58",
    progress: 20,
  },
  {
    title: "晚风与旧胶片",
    subtitle: "风吹过的回忆泛黄",
    artist: "Analog Bloom",
    cover: "/pictures/player/picture5.jpg",
    elapsed: "01:04",
    duration: "03:14",
    progress: 33,
  },
  {
    title: "最后一班地铁之前",
    subtitle: "归途的最后一站",
    artist: "Afterlight Relay",
    cover: "/pictures/player/face2.jpg",
    elapsed: "00:52",
    duration: "02:47",
    progress: 31,
  },
];
