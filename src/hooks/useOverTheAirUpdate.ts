import * as Updates from "expo-updates";
import { useEffect, useState } from "react";
import { Alert, AppState } from "react-native";

async function checkForUpdate(showAlert: boolean) {
  try {
    const result = await Updates.checkForUpdateAsync();
    if (result.isAvailable) {
      const update = await Updates.fetchUpdateAsync();
      if (update.isNew) {
        if (showAlert) {
          Alert.alert(
            "Update available",
            "A new update is available. Do you want to restart now to apply it?",
            [
              {
                text: "No",
              },
              {
                text: "Yes",
                onPress: () => {
                  Updates.reloadAsync();
                },
              },
            ]
          );
        } else {
          Updates.reloadAsync();
        }
        return false;
      }
    }
  } catch {
    // Disregard errors
  }
  return true;
}

export function useOverTheAirUpdate(): boolean {
  const [lastChecked, setLastChecked] = useState(Date.now());
  const [isUpdated, setUpdated] = useState(false);

  useEffect(() => {
    checkForUpdate(false).then(setUpdated);
    AppState.addEventListener("change", (state) => {
      if (state === "active") {
        const now = Date.now();
        const diff = now - lastChecked;
        const minimumTimeBetweenUpdateChecks = 30 * 60 * 30 * 1000; // 30 minutes
        if (diff > minimumTimeBetweenUpdateChecks) {
          setLastChecked(now);
          checkForUpdate(true);
        }
      }
    });
  });

  return isUpdated;
}
