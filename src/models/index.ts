export interface User {
  id: string;
  createdAt: string;
  email: string;
  givenNames: string;
  familyName: string;
  affiliation?: string;
  profilePicUrl?: string;
  isAdmin: boolean;
  isTest: boolean;
}

export enum CreatorApps {
  DATA_COLLECTION_APP = "DATA_COLLECTION_APP",
  DATA_INGESTION_TOOL = "DATA_INGESTION_TOOL",
  WEB = "WEB",
  CORE = "CORE",
  DB_TOOLS = "DB_TOOLS",
}

export interface BaseEntity {
  id: string;
  creatorId: string; // Relation with "creator" (model User)
  creatorApp: CreatorApps;
  createdAt?: string;
  updatedAt?: string;
  isDeleted: boolean;
  deletedAt?: string;
}

export type GPSLocation = {
  longitude: number;
  latitude: number;
};

export interface Geometry {
  type: string;
  coordinates: number[] | number[][];
}

export interface Observation extends BaseEntity {
  geometry: Geometry;
  timestamp: string;
  comments?: string;
  extra?: any;
  isMatched: boolean;
  features: Array<Feature>;
}

export interface Feature extends BaseEntity {
  imageUrl?: string;
  comments?: string;
}
