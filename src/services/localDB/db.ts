import * as SQLite from "expo-sqlite";

function initDB() {
  const db = SQLite.openDatabase("ocean_scan.db");

  db.transaction((tx) => {
    tx.executeSql(
      "create table if not exists baseEntity (id text primary key not null, isSynced int, type text, campaignId text, observationId text, measurementId text, jsonObject text);"
    );
  });

  return db;
}

export const db = initDB();
