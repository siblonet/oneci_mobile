import * as SQLite from 'expo-sqlite';

export const Memory = {
  getCourier: () => SQLite.openDatabase("nuanceuser.db"),
};