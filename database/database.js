import * as SQLite from 'expo-sqlite';

export const Instapay = {
  getOneci: () => SQLite.openDatabase("oneci.db"),
};