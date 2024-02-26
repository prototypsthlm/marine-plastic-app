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

export const baseEntityModule = {
  upsertEntities(
    payloadArray: EntityPayload,
    entityType: EntityType,
    isSynced: boolean,
    campaignId: string | null = null,
    observationId: string | null = null,
    measurementId: string | null = null
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
