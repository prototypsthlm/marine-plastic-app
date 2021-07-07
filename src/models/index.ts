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

export enum ClassVisualInspectionEnum {
  NO_LITTER_PRESENT = "NO_LITTER_PRESENT",
  SINGLE_ITEM = "SINGLE_ITEM",
  SMALL_GROUP = "SMALL_GROUP",
  PATCH = "PATCH",
  FILAMENT = "FILAMENT",
}

export type ClassVisualInspection = string;

export interface Observation extends BaseEntity {
  campaignId: string | null;
  geometry: Geometry;
  timestamp: string;
  class?: ClassVisualInspection;
  estimatedAreaAboveSurfaceM2?: number;
  estimatedPatchAreaM2?: number;
  estimatedFilamentLengthM?: number;
  depthM?: number;
  comments?: string;
  measurements: Array<Measurement>;
  isControlled: boolean;
  isAbsence: boolean;
  imageUrl?: string; // TODO: is this used?
  images?: ObservationImage[];
  extra?: any; // TODO: is this used?
}

export interface Measurement extends BaseEntity {
  observationId: string;
  litterTypeId?: string;
  quantityKg?: number;
  quantityItemsPerM2?: number;
  quantityItemsPerM3?: number;
  quantityPercentOfSurface?: number;
  quantityPercentOfWeight?: number;
  quantityGramPerLiter?: number;
  isApproximate: boolean;
  isCollected: boolean;
  comments?: string;
  extra?: any; // TODO: is this used?
}

export enum UnitEnum {
  KG = "KG",
  ITEMS_PER_M2 = "ITEMS_PER_M2",
  ITEMS_PER_M3 = "ITEMS_PER_M3",
  PERCENT_OF_SURFACE = "PERCENT_OF_SURFACE",
  PERCENT_OF_WEIGHT = "PERCENT_OF_WEIGHT",
  GRAM_PER_LITER = "GRAM_PER_LITER",
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
