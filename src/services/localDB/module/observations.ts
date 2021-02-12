import { Observation } from "../../../models";
import { db } from "../db";
import { EntityType } from "../types";

export const observationsModule = {
  storeOfflineObservation(observationPayload: Observation) {
    db.transaction((tx) => {
      tx.executeSql(
        "insert into baseEntity (id, isSynced, type, jsonObject) values (?, 0, ?, ?)",
        [
          observationPayload.id,
          EntityType.Observation,
          JSON.stringify(observationPayload),
        ]
      );
    });
  },
  getAllOfflineObservations() {
    db.transaction((tx) => {
      tx.executeSql(
        "select * from baseEntity where type = ? and isSynced = 0",
        [EntityType.Observation],
        (_, { rows }) => {
          for (let i = 0; i < rows.length; i++) {
            console.log(rows.item(i));
          }
        }
      );
    });
  },
};
