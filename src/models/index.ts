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
  creatorApp?: CreatorApps;
  createdAt?: string;
  updatedAt?: string;
  isDeleted?: boolean;
  deletedAt?: string;
}

export type GPSLocation = {
  longitude: number;
  latitude: number;
};

export interface Geometry {
  type: string;
  coordinates: number[] | number[][] | number[][][];
}

export interface Observation extends BaseEntity {
  campaignId: string | null;
  geometry: Geometry;
  timestamp: string;
  comments?: string;
  extra?: any;
  isMatched: boolean;
  features: Array<Feature>;
}

export interface Feature extends BaseEntity {
  observationId: string;
  featureTypeId: string;
  imageUrl?: string;

  quantity?: number;
  quantityUnits?: string;
  estimatedWeightKg?: number;
  estimatedSizeM2?: number;
  estimatedVolumeM3?: number;
  depthM?: number;

  isAbsence: boolean;
  isCollected: boolean;

  comments?: string;
}

export enum EnvCompartmentsEnum {
  BEACH = "BEACH",
  SEAFLOOR = "SEAFLOOR",
  FLOATING = "FLOATING",
  BIOTA = "BIOTA",
  MICRO = "MICRO",
}

export type EnvCompartments = Array<string>;

export interface FeatureType {
  id: string;
  name: string;
  tsgMlCode: string | null;
  osparCode: string | null;
  unepCode: string | null;
  material: string | null;
  isCore: boolean;
  environmentalCompartments: EnvCompartments;
}

export interface Campaign extends BaseEntity {
  name: string;
  isDataPublic?: boolean;
  environmentalCompartments: EnvCompartments;
  doi?: string | null;
  targetGeometry: Geometry;
  targetStart?: string | null;
  targetEnd?: string | null;
  tSort: string;
  keywords: Array<string>;
  description?: string | null;
  comments?: string | null;
  source?: string | null;
  isControlled?: boolean;
  isSynthetic?: boolean;
  isClosed: boolean;
  extra?: any;
}
