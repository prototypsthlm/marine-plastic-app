function parseExifDate(s: any) {
  var b = s.split(/\D/);
  return new Date(b[0],b[1]-1,b[2],b[3],b[4],b[5]);
}

export function getImageTimestamp(image: any) {
  if (image.exif && image.exif.DateTimeOriginal) {

    const parsedDate = parseExifDate(image.exif.DateTimeOriginal);  
    return new Date(parsedDate);

  } else return undefined;
}