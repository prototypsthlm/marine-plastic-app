import { Platform } from "react-native"
import { Campaign, Measurement, Observation, ObservationImage } from "../../../models";
import { db } from "../db";
import { EntityType } from "../types";

type Entity = Observation | Measurement | Campaign | ObservationImage
type EntityPayload = Array<Entity>;

function getOsSpecificUpsertQuery(isSynced: boolean,
                   entityType: EntityType,
                   campaignId: string | null,
                   observationId: string | null,
                   measurementId: string | null,
                   payloadArray: Array<Entity>) {
  const toInsertValue = (payload: Entity): string =>
      Platform.select(
          {
            android:
                `('${payload.id}', 
                     COALESCE((select isSynced from baseEntity where id='${payload.id}'), ${isSynced ? "1" : "0"}), 
                    '${entityType}', 
                    '${campaignId || "null"}',
                    '${observationId || "null"}', 
                    '${measurementId || "null"}', 
                     COALESCE((select jsonObject from baseEntity where id='${payload.id}'), '${JSON.stringify(payload)}')
                    )`,
            default:
                `('${payload.id}', 
                     ${isSynced ? "1" : "0"}, 
                    '${entityType}', 
                    '${campaignId || "null"}',
                    '${observationId || "null"}', 
                    '${measurementId || "null"}', 
                    '${JSON.stringify(payload)}'
                    )`,
          })
  const insertValues = payloadArray.map(toInsertValue);
  return Platform.select(
      {
        // upsert is only supported from SQL 3.24 which is not available on Android 10 or earlier.
        android:
            `insert
              or replace into baseEntity 
                (id, isSynced, type, campaignId, observationId, measurementId, jsonObject) 
              values
              ${insertValues.join(", ")};`,
        default:
            `insert into baseEntity (id, isSynced, type, campaignId, observationId, measurementId, jsonObject)
               values ${insertValues.join(", ")} on conflict(id) do
              update
                  set isSynced=excluded.isSynced, jsonObject=excluded.jsonObject;`,
      })
}

export const baseEntityModule = {
  upsertEntities(
      payloadArray: EntityPayload,
      entityType: EntityType,
      isSynced: boolean,
      campaignId: string | null = null,
      observationId: string | null = null,
      measurementId: string | null = null,
  ) {
    const query = getOsSpecificUpsertQuery(isSynced, entityType, campaignId, observationId, measurementId, payloadArray)
    return new Promise<void>((resolve, reject) => {
      db.transaction(
          (tx) => {
            tx.executeSql(query);
          },
          reject,
          resolve,
      );
    });
  },
  getEntities<T>(
      entityType: EntityType,
      isSynced: boolean | null = null,
      campaignId: string | null = null,
      observationId: string | null = null,
      measurementId: string | null = null,
  ): Promise<Array<T>> {
    return new Promise<Array<T>>((resolve, reject) => {
      db.transaction((tx) => {
        const filerByCampaign =
            campaignId !== null ? `and campaignId = '${campaignId}'` : "";
        const filerByObservation =
            observationId !== null
                ? `and observationId = '${observationId}'`
                : "";
        const filerByFeature =
            measurementId !== null ? `and measurementId = '${measurementId}'` : "";
        const filerByIsSynced =
            isSynced !== null
                ? `and isSynced = ${observationId ? "true" : "false"}`
                : "";
        tx.executeSql(
            `select *
             from baseEntity
             where type = ? ${filerByCampaign} ${filerByObservation} ${filerByFeature} ${filerByIsSynced}`,
            [entityType],
            (_, {rows}) => {
              let entities: Array<T> = [];
              for (let i = 0; i < rows.length; i++) {
                entities = [...entities, JSON.parse(rows.item(i).jsonObject)];
              }
              resolve(entities);
            },
        );
      }, reject);
    });
  },
  deleteEntities(payloadArray: Array<string>) {
    return new Promise<void>((resolve, reject) => {
      db.transaction(
          (tx) => {
            tx.executeSql(
                `delete
                 from baseEntity
                 where id in ("${payloadArray.join(
                         "\", \"",
                 )}")`,
            );
          },
          reject,
          resolve,
      );
    });
  },
};
