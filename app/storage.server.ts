import { readFileSync, writeFileSync } from "fs";

export type StorageData = {
  [eventId: string]: number;
};

export const getStorageData = (): StorageData => {
  return JSON.parse(readFileSync("./storage/data.json").toString());
};

export const setStorageData = (data: StorageData): void => {
  writeFileSync("./storage/data.json", JSON.stringify(data, null, 2));
};
