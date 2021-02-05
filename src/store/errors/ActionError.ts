import { Alert } from "react-native";

export class ActionError extends Error {
  constructor(message?: string) {
    super(message); // 'Error' breaks prototype chain here
    Object.setPrototypeOf(this, new.target.prototype); // restore prototype chain

    const alertTitle = "Error";
    const alertMessage = message || "Something went wrong";
    Alert.alert(alertTitle, alertMessage);
  }
}
