import { Injectable } from '@angular/core';

import { Plugins } from '@capacitor/core';
import * as CapacitorSQLPlugin from 'capacitor-sqlite';
import { BehaviorSubject } from "rxjs";
import { Platform } from "@ionic/angular";
import {HttpClient} from "@angular/common/http";
const { CapacitorSQLite, Device } = Plugins;

const DB_NAME:string = "messengerDB";

@Injectable({
  providedIn: 'root'
})
export class SQLiteService {
  sqlite: any;
  databaseReady: BehaviorSubject<boolean>;
  isService: boolean = false;

  constructor(private platform: Platform, private httpClient: HttpClient) {
    this.databaseReady = new BehaviorSubject(false);
    this.platform.ready().then(() => {
      this.initializePlugin().then(() => {
        this.isDBExists(DB_NAME).then(isBDExists => {
          if (isBDExists.result) {
            this.openDB(DB_NAME);
          } else {
            this.createDB();
          }
        });
      });
    });
  }

  /**
   * Plugin Initialization
   */
  async initializePlugin(): Promise<void> {
    return Device.getInfo().then(info => {
      if (info.platform === "ios" || info.platform === "android") {
        this.sqlite = CapacitorSQLite;
        this.isService = true;
      } else if (info.platform === "electron") {
        this.sqlite = CapacitorSQLPlugin.CapacitorSQLiteElectron;
        this.isService = true;
      } else {
        this.sqlite = CapacitorSQLPlugin.CapacitorSQLite;
      }
    })
  }

  /**
   * Open a Database
   * @param dbName string
   */
  async openDB(dbName: string) {
    this.sqlite.open({database: dbName, encrypted: false, mode: "no-encryption"}).
      then((result) => {
        if (!result) {
          console.log('ERROR opening DB')
        }
        this.run('UPDATE chat SET last_read_message_id = 1, last_message_id = 5 WHERE id = 1')
        this.run('UPDATE chat SET last_read_message_id = 2, last_message_id = 10 WHERE id = 2')
        this.run('UPDATE chat SET last_read_message_id = 6, last_message_id = 7 WHERE id = 3')
        this.databaseReady.next(true)
    });

  }

  /**
   * Import DB from json
   */
  async createDB() {
    this.httpClient.get('assets/databaseStructure.json').subscribe(data => {
      this.sqlite.importFromJson({jsonstring: JSON.stringify(data)}).then(() => {
        this.openDB(DB_NAME);
      }).catch(error => console.log(JSON.stringify(error)));
    });

  }

  /**
   * Check if the Database file exists
   * @param dbName string
   */
  async isDBExists(dbName: string): Promise<any> {
    if (this.isService) {
      return await this.sqlite.isDBExists({database: dbName});
    } else {
      console.log("Service not started");
      return Promise.resolve({result: false, message: "Service not started"});
    }
  }

  getDatabaseState() {
    return this.databaseReady.asObservable();
  }

  /**
   * Execute a set of Raw Statements
   * @param statements string
   */
  async execute(statements: string): Promise<any> {
    if (this.isService && statements.length > 0) {
      return await this.sqlite.execute({statements: statements});
    } else {
      console.log("Service not started");
      return Promise.resolve({changes: -1, message: "Service not started"});
    }
  }

  /**
   * Execute a Single Raw Statement
   * @param statement string
   * @param _values
   */
  async run(statement: string, _values?: Array<any>): Promise<any> {
    if (this.isService && statement.length > 0) {
      const values: Array<any> = _values ? _values : [];
      return await this.sqlite.run({statement: statement, values: values});
    } else {
      console.log("Service not started");
      return Promise.resolve({changes: -1, message: "Service not started"});
    }
  }

  /**
   * Query a Single Raw Statement
   * @param statement string
   * @param _values
   */
  async query(statement: string, _values?: Array<string>): Promise<any> {
    const values: Array<any> = _values ? _values : [];
    if (this.isService && statement.length > 0) {
      return await this.sqlite.query({statement: statement, values: values});
    } else {
      console.log("Service not started");
      return Promise.resolve({values: [], message: "Service not started"});
    }

  }

  /**
   * Close the Database
   * @param dbName string
   */
  async close(dbName: string): Promise<any> {
    if (this.isService) {
      return await this.sqlite.close({database: dbName});
    } else {
      console.log("Service not started");
      return Promise.resolve({result: false, message: "Service not started"});
    }
  }

  /**
   * Delete the Database file
   * @param dbName string
   */
  async deleteDB(dbName: string): Promise<any> {
    if (this.isService) {
      return await this.sqlite.deleteDatabase({database: dbName});
    } else {
      console.log("Service not started");
      return Promise.resolve({result: false, message: "Service not started"});
    }
  }
}
