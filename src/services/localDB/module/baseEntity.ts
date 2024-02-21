import { Platform } from "react-native";
import {
  Campaign,
  Measurement,
  Observation,
  ObservationImage,
} from "../../../models";
import { db } from "../db";
import { EntityType } from "../types";

type Entity = Observation | Measurement | Campaign | ObservationImage;
type EntityPayload = Array<Entity>;

async function upsertOldSqlite(
  isSynced: boolean,
  entityType: EntityType,
  campaignId: string | null,
  observationId: string | null,
  measurementId: string | null,
  payloadArray: Array<Entity>
) {
  const updateQuery = `UPDATE baseEntity SET isSynced = ?, jsonObject = ? WHERE id = ?`;
  const insertQuery = `INSERT INTO baseEntity (id, isSynced, type, campaignId, observationId, measurementId, jsonObject) VALUES (?, ?, ?, ?, ?, ?, ?)`;

  return new Promise<void>((resolve, reject) => {
    // Start a single transaction for all upsert operations
    db.transaction(
      (tx) => {
        payloadArray.forEach((payload) => {
          // Step 1: Attempt to update the existing payload
          tx.executeSql(
            updateQuery,
            [isSynced ? "1" : "0", JSON.stringify(payload), payload.id],
            function (tx, res) {
              // If the update affected 0 rows, try to insert the payload
              if (res.rowsAffected === 0) {
                // Step 2: Insert the new payload
                tx.executeSql(
                  insertQuery,
                  [payload.id, isSynced ? "1" : "0", entityType, campaignId, observationId, measurementId, JSON.stringify(payload)],
                  function (tx, res) {
                    // console.log("Insert successful for payload with id:", payload.id);
                  },
                  function (tx, err) {
                    console.error("Insert failed for payload with id:", payload.id, err);
                    return false;
                  }
                );
              } else {
                // console.log("Update successful for payload with id:", payload.id);
              }
            },
            function (tx, err) {
              console.error("Update failed for payload with id:", payload.id, err);
              return false;
            }
          );
        });
      },
      reject,
      resolve
    );
  });
}

async function upsert(
  isSynced: boolean,
  entityType: EntityType,
  campaignId: string | null,
  observationId: string | null,
  measurementId: string | null,
  payloadArray: Array<Entity>
) {
  const toInsertValue = (payload: Entity): string =>
    `('${payload.id}', 
    ${isSynced ? "1" : "0"}, 
    '${entityType}', 
    '${campaignId || "null"}',
    '${observationId || "null"}', 
    '${measurementId || "null"}', 
    '${JSON.stringify(payload)}'
    )`;
  const insertValues = payloadArray.map(toInsertValue);
  return new Promise<void>((resolve, reject) => {
    db.transaction(
      (tx) => {
        tx.executeSql(`insert into baseEntity (id, isSynced, type, campaignId, observationId, measurementId, jsonObject)
                       values ${insertValues.join(", ")} on conflict(id) do
                       update set isSynced=excluded.isSynced, jsonObject=excluded.jsonObject;`);
      },
      reject,
      resolve
    );
  });
}

export const baseEntityModule = {
  upsertEntities(
    payloadArray: EntityPayload,
    entityType: EntityType,
    isSynced: boolean,
    campaignId: string | null = null,
    observationId: string | null = null,
    measurementId: string | null = null
  ) {
    // upsert is only supported from SQL 3.24 which is not available on Android 10 or earlier.
    return Platform.OS === "android" && Platform.Version < 30
      ? upsertOldSqlite(
          isSynced,
          entityType,
          campaignId,
          observationId,
          measurementId,
          payloadArray
        )
      : upsert(
          isSynced,
          entityType,
          campaignId,
          observationId,
          measurementId,
          payloadArray
        );
  },
  getEntities<T>(
    entityType: EntityType,
    isSynced: boolean | null = null,
    campaignId: string | null = null,
    observationId: string | null = null,
    measurementId: string | null = null
  ): Promise<Array<T>> {
    return new Promise<Array<T>>((resolve, reject) => {
      db.transaction(
        (tx) => {
          const filerByCampaign =
            campaignId !== null ? `and campaignId = '${campaignId}'` : "";
          const filerByObservation =
            observationId !== null
              ? `and observationId = '${observationId}'`
              : "";
          const filerByFeature =
            measurementId !== null
              ? `and measurementId = '${measurementId}'`
              : "";
          const filerByIsSynced =
            isSynced !== null ? `and isSynced = ${observationId ? 1 : 0}` : "";
          const query = `select *
                       from baseEntity
                       where type = ? ${filerByCampaign} ${filerByObservation} ${filerByFeature} ${filerByIsSynced}`;
          tx.executeSql(query, [entityType], (_, { rows }) => {
            let entities: Array<T> = [];
            for (let i = 0; i < rows.length; i++) {
              entities = [...entities, JSON.parse(rows.item(i).jsonObject)];
            }
            resolve(entities);
          });
        },
        (e) => {
          console.error("baseEntity.ts", "getEntities", "error:", e);
          reject(e);
        }
      );
    });
  },
  deleteEntities(payloadArray: Array<string>) {
    return new Promise<void>((resolve, reject) => {
      db.transaction(
        (tx) => {
          tx.executeSql(
            `delete
                 from baseEntity
                 where id in ("${payloadArray.join('", "')}")`
          );
        },
        (e) => {
          console.error("baseEntity.ts", "deleteEntities", "error:", e);
          reject(e);
        },
        resolve
      );
    });
  },
};
