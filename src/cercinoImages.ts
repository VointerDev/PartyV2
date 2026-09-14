const BASE = "https://cercino.se";

/** Student / event photos from cercino.se */
export function cercinoStudent(file: string) {
  return `${BASE}/images/%20WEBSITEIMAGES/studenter/${file}`;
}

export const cercinoPhotos = {
  hero: `${BASE}/images/EventsHero.webp`,
  web: `${BASE}/images/WebDesignHero.webp`,
  inspark1: `${BASE}/images/inspark/Artboard%201.png`,
  inspark4: `${BASE}/images/inspark/Artboard%204.png`,
  party: cercinoStudent("DSC_4769.jpg"),
  dj: cercinoStudent("DSC_6541.jpg"),
  crowd: cercinoStudent("DSC_7692.jpg"),
  stage: cercinoStudent("IMG_8856.jpg"),
  concert: cercinoStudent("DSC_5049.jpg"),
  hands: cercinoStudent("P1074758.jpg"),
  dance: cercinoStudent("IMG_0310.jpg"),
  club: cercinoStudent("DSC_5781.jpg"),
  extra1: cercinoStudent("IMG_6728.jpg"),
  extra2: cercinoStudent("DSC_1159.jpg"),
  extra3: cercinoStudent("P1047853.jpg"),
  extra4: cercinoStudent("IMG_3424.jpg"),
  extra5: cercinoStudent("DSC_8333.jpg"),
  extra6: cercinoStudent("IMG_2218.jpg"),
  extra7: cercinoStudent("DSC_5291.jpg"),
  extra8: cercinoStudent("P1026063.jpg"),
  extra9: cercinoStudent("IMG_6557.jpg"),
  extra10: cercinoStudent("IMG_0263.jpg"),
  extra11: cercinoStudent("DSC_8243.jpg"),
  extra12: cercinoStudent("P1073610.jpg"),
  extra13: cercinoStudent("IMG_6087.jpg"),
  extra14: cercinoStudent("DSC_5950.jpg"),
  rooftop: `${BASE}/images/%20WEBSITEIMAGES/studenter/DSC_4558.png`,
} as const;

/** Pool for flashback galleries */
export const cercinoGalleryPool = [
  cercinoPhotos.party,
  cercinoPhotos.dj,
  cercinoPhotos.crowd,
  cercinoPhotos.stage,
  cercinoPhotos.concert,
  cercinoPhotos.hands,
  cercinoPhotos.dance,
  cercinoPhotos.club,
  cercinoPhotos.extra1,
  cercinoPhotos.extra2,
  cercinoPhotos.extra3,
  cercinoPhotos.extra4,
  cercinoPhotos.extra5,
  cercinoPhotos.extra6,
  cercinoPhotos.extra7,
  cercinoPhotos.extra8,
  cercinoPhotos.extra9,
  cercinoPhotos.extra10,
  cercinoPhotos.extra11,
  cercinoPhotos.extra12,
  cercinoPhotos.hero,
  cercinoPhotos.inspark1,
];
