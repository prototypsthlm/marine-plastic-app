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
        image.exif &&
        formatGPSLocation(image.exif.GPSLongitude, image.exif.GPSLongitudeRef),
      latitude:
        image.exif &&
        formatGPSLocation(image.exif.GPSLatitude, image.exif.GPSLatitudeRef),
    };
}
