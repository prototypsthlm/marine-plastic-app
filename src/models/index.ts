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
  imageUrl?: string;
  images?: ObservationImage[];
  extra?: any;
  isMatched: boolean;
  isAbsence: boolean;
  measurements: Array<Measurement>;
}

export interface Measurement extends BaseEntity {
  observationId: string;
  litterTypeId?: string;

  quantity?: number;
  quantityUnits?: string;
  estimatedWeightKg?: number;
  estimatedSizeM2?: number;
  estimatedVolumeM3?: number;
  depthM?: number;
  isCollected: boolean;

  comments?: string;
}

export interface ObservationImage extends BaseEntity {
  observationId: string;
  url?: string;
  status?: string;
}

export enum EnvCompartmentsEnum {
  BEACH = "BEACH",
  SEAFLOOR = "SEAFLOOR",
  FLOATING = "FLOATING",
  BIOTA = "BIOTA",
  MICRO = "MICRO",
}

export type EnvCompartments = Array<string>;

export interface LitterType {
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
  targetGeometry?: Geometry | null;
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
