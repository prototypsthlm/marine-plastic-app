export type GPSLocation = {
  longitude: number;
  latitude: number;
};

export type Observation = {
  observer: string;
  comment?: string;
  image: string;
  timestamp: number;
  location?: GPSLocation;
};
