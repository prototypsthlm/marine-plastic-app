import { Campaign, Feature, FeatureImage, Observation } from "../../../models";
import { db } from "../db";
import { EntityType } from "../types";

type EntityPayload = Array<Observation | Feature | Campaign | FeatureImage>;

export const baseEntityModule = {
  upsertEntities(
    payloadArray: EntityPayload,
    entityType: EntityType,
    isSynced: boolean,
    campaignId: string | null = null,
    observationId: string | null = null,
    featureId: string | null = null
  ) {
    const insertValues = payloadArray.map(
      (payload) =>
        `('${payload.id}', ${isSynced ? "1" : "0"}, '${entityType}', '${
          campaignId || "null"
        }', '${observationId || "null"}', '${
          featureId || "null"
        }', '${JSON.stringify(payload)}')`
    );
    return new Promise<void>((resolve, reject) => {
      db.transaction(
        (tx) => {
          tx.executeSql(
            `insert into baseEntity (id, isSynced, type, campaignId, observationId, featureId, jsonObject) values ${insertValues.join(
              ", "
            )} on conflict(id) do update set isSynced=excluded.isSynced, jsonObject=excluded.jsonObject`
          );
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
    featureId: string | null = null
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
          featureId !== null ? `and featureId = '${featureId}'` : "";
        const filerByIsSynced =
          isSynced !== null
            ? `and isSynced = ${observationId ? "true" : "false"}`
            : "";
        tx.executeSql(
          `select * from baseEntity where type = ? ${filerByCampaign} ${filerByObservation} ${filerByFeature} ${filerByIsSynced}`,
          [entityType],
          (_, { rows }) => {
            let entities: Array<T> = [];
            for (let i = 0; i < rows.length; i++) {
              entities = [...entities, JSON.parse(rows.item(i).jsonObject)];
            }
            resolve(entities);
          }
        );
      }, reject);
    });
  },
  deleteEntities(payloadArray: Array<string>) {
    return new Promise<void>((resolve, reject) => {
      db.transaction(
        (tx) => {
          tx.executeSql(
            `delete from baseEntity where id in ("${payloadArray.join(
              '", "'
            )}")`
          );
        },
        reject,
        resolve
      );
    });
  },
};
