import "react-native-get-random-values"; // https://github.com/LinusU/react-native-get-random-values#usage
import { v4 as uuidv4 } from "uuid";

export function generateUUIDv4(): string {
  return String(uuidv4());
}
