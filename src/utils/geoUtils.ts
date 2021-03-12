import { Geometry, Observation } from "../models";
import convex from "@turf/convex";
import rewind from "@turf/rewind";
import { point, featureCollection, lineString, Position } from "@turf/helpers";
import { NewObservationPayload } from "../store/slices/observations";
import { LatLng } from "react-native-maps";

export function formatGPSLocation(dd: number, ref: string) {
  if (ref == "S" || ref == "W") {
    dd = dd * -1;
  }
  return dd;
}

export function getImageLocation(image: any) {
  if (!image.exif?.GPSLongitude && image.location)
    return {
      longitude: image.location.coords.longitude,
      latitude: image.location.coords.latitude,
    };
  else
    return {
      longitude:
        image.exif && image.exif.GPSLongitude && image.exif.GPSLongitudeRef
          ? formatGPSLocation(
              image.exif.GPSLongitude,
              image.exif.GPSLongitudeRef
            )
          : image.location.coords.longitude,
      latitude:
        image.exif && image.exif.GPSLatitude && image.exif.GPSLatitudeRef
          ? formatGPSLocation(image.exif.GPSLatitude, image.exif.GPSLatitudeRef)
          : image.location.coords.latitude,
    };
}

export function getGeometryFromLocation(location: LatLng) {
  if(!location.latitude && !location.latitude || location === undefined) {
    return {
      type: "Point",
      coordinates: [0, 0],
    };
  }  

  return {
    type: "Point",
    coordinates: [
      (location.longitude as number) || 0,
      (location.latitude as number) || 0,
    ],
  };
}

// NOT USED RIGHT NOW: later on we could generate geometries from a list of images, not just a single image
export function getGeometryFromImages(
  features: Array<NewObservationPayload>
): Geometry {
  // If no feature just return Point at 0 0
  if (features.length === 0)
    return {
      type: "Point",
      coordinates: [0, 0],
    };

  if (features.length === 1) {
    return getPoint(features);
  } else if (features.length === 2) {
    return getLine(features);
  } else {
    return getConvexHullPolygon(features);
  }
}

function getPoint(features: Array<NewObservationPayload>) {
  return {
    type: "Point",
    coordinates: [
      (features[0].imageGPSLongitude as number) || 0,
      (features[0].imageGPSLatitude as number) || 0,
    ],
  };
}

function getLine(features: Array<NewObservationPayload>) {
  const point1: Position = [
    (features[0].imageGPSLongitude as number) || 0,
    (features[0].imageGPSLatitude as number) || 0,
  ];
  const point2: Position = [
    (features[1].imageGPSLongitude as number) || 0,
    (features[1].imageGPSLatitude as number) || 0,
  ];
  const line = lineString([point1, point2]);
  return line.geometry;
}

function getConvexHullPolygon(features: Array<NewObservationPayload>) {
  const coords: Array<Array<number>> = features.map((feature) => [
    (feature.imageGPSLongitude as number) || 0,
    (feature.imageGPSLatitude as number) || 0,
  ]);
  const points = featureCollection(coords.map((coord) => point(coord)));
  const hull = convex(points);
  return rewind(
    hull?.geometry || {
      type: "Polygon",
      coordinates: [],
    }
  );
}