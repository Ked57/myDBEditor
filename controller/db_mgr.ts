import { Db } from '../model/db';
import { Table } from '../model/table';
import { Column } from '../model/column';
import { Wrapper } from './wrappers/wrapper'
import { MysqlWrapper } from './wrappers/mysql_wrapper';

import event = require('events');
import util = require('util');
import mysql_package = require('mysql');

/**
 * Classe: DbMgr
 * Encapsule les actions liées aux bases de données
 */

export class DbMgr {
    conf;
    db: Db;
    result: Table;
    con: mysql_package.Connection;
    events: event.EventEmitter;
    wrapper: Wrapper;

    constructor() {
        //A mettre dans un fichier de configuration à part
        this.conf = {
            host: "127.0.0.1",
            user: "test",
            password: "test"
        }
        this.events = new event.EventEmitter();
        this.wrapper = new MysqlWrapper(this.conf, this.events);
        //Initialisation des events
        this.events.addListener("useDatabase", this.useDatabaseHandler.bind(this));
        this.events.addListener("tablesListed", this.tablesListedHandler.bind(this));
        this.events.addListener("tableInit", this.tableInitHandler.bind(this));
        this.events.addListener("pkInit", this.pkInitHandler.bind(this));
        this.events.addListener("dbEventUpdate", this.updateLocalDb.bind(this));
  
    }

    useDatabaseHandler(database: string) {
        this.db = new Db([], this.conf, database,this.events);
        let e = this.events;
        console.log("Using database :" + database);
        this.wrapper.getInformationSchema(database, this.events);
    }

    tablesListedHandler(result) {
        console.log("Table list recovered");
        console.log(result[0].TABLE_NAME);
        for (var k in result) {
            this.wrapper.initTable(result[k].TABLE_NAME);
        }
    }

    tableInitHandler(table: Table) {
        console.log("table " + table.name+" initialized");
        this.db.tables.push(table);
    }

    updateTable(tableName: string) {
        let dbs: Db;
        let wrap: Wrapper;
        dbs = this.db;
        wrap = this.wrapper;
        dbs.tables.some(function (table) {
            if (table.name == tableName) {
                dbs.tables.splice(dbs.tables.indexOf(table), 1);
                wrap.initTable(tableName);
                console.log('updating table : ' + tableName);
                return true;
            }
        });
    }

    pkInitHandler(pk: any) {
        console.log("initializing primary key(s) " + pk["keys"] + " for table " + pk["table"]);
        this.db.tables.forEach(function (table) {
            if (table.name === pk["table"]) {
                table.columns.forEach(function (col) {
                    pk["keys"].forEach(function (key) {
                        if (key == col.name) {
                            col.pk = true;
                        }
                    });
                });
                return;
            }
        });
    }

    handleModificationQueue(modificationQueue: any) {
        let table: string;
        let str: string[];
        table = modificationQueue.table;
        console.log("before table: " + table);
        modificationQueue.forEach(function (elem) {
            str = elem.split(";")
            this.update(str[0], str[2], str[1]);
        },this);
    }

    update(table: string, value: string, condition: string) {
        let valueStr: string[], conditionStr: string[];
        valueStr = value.split("=");
        conditionStr = condition.split("=");
        this.wrapper.update(table, valueStr[0], valueStr[1], this.db.getTable(table).getColumn(valueStr[0]).type, conditionStr[0], conditionStr[1], this.db.getTable(table).getColumn(conditionStr[0]).type);
        this.db.getTable(table).setValue(valueStr[0], valueStr[1], conditionStr[0], conditionStr[1]);
    }

    updateLocalDb(table: string, value: string, condition: string) {

    }

    insertLocalDb(table: string, row: any[]) {

    }

    deleteLocalDb(table: string, condition: string) {

    }
}