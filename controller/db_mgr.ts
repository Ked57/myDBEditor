import { Db } from '../model/db';
import { Table } from '../model/table';
import { Column } from '../model/column';
import { Wrapper } from './wrappers/wrapper'
import { MysqlWrapper } from './wrappers/mysql_wrapper';

import event = require('events');
import util = require('util');
import mysql_package = require('mysql');
import mysql_events = require('mysql-events');

/**
 * Classe: DbMgr
 * Encapsule les actions liées aux bases de données que ce soit le SGBD ou les objets javascript
 */

export class DbMgr {
    conf;
    db: Db;
    con: mysql_package.Connection;
    events: event.EventEmitter;
    wrapper: Wrapper;
    mysqlEventWatcher;
    watcher;


    constructor(name: string) {
        this.conf = {
            host: "localhost",
            user: "test",
            password: "test"
        }

        this.events = new event.EventEmitter();
        this.wrapper = new MysqlWrapper(this.conf, this.events);
        this.mysqlEventWatcher = mysql_events(this.conf); //Le module npm permettant de récupérer les events mysql
        this.watcher = this.mysqlEventWatcher.add(
            name,
            function (oldRow, newRow, event) {
                //row inserted 
                if (oldRow === null) {
                    console.log("insert");
                    this.events.emit('dbEventInsert', { newRow });
                }

                //row deleted 
                if (newRow === null) {
                    console.log("delete");
                    this.events.emit('dbEventDelete', { oldRow });
                }

                //row updated 
                if (oldRow !== null && newRow !== null) {
                    this.events.emit('dbEventUpdate', { newRow });
                }

                console.log(event)
            },
            ''
        );
        //Initialisation des events
        this.events.addListener("useDatabase", this.useDatabaseHandler.bind(this));
        this.events.addListener("tablesListed", this.tablesListedHandler.bind(this));
        this.events.addListener("tableInit", this.tableInitHandler.bind(this));
        this.events.addListener("pkInit", this.pkInitHandler.bind(this));
        this.events.addListener("dbEventUpdate", this.updateLocalDb.bind(this));
        this.events.addListener("dbEventDelete", this.deleteLocalDb.bind(this));
        this.events.addListener("dbEventInsert", this.insertLocalDb.bind(this));
  
    }
    //Handler de la fonction UseDatabase de Wrapper
    useDatabaseHandler(database: string) {
        this.db = new Db([], database,this.events);
        let e = this.events;
        console.log("Using database :" + database);
        this.wrapper.getInformationSchema(database, this.events);
    }
    //Handler de la fonction listant les tables
    tablesListedHandler(result) {
        console.log("Table list recovered");
        console.log(result[0].TABLE_NAME);
        for (var k in result) {
            this.wrapper.initTable(result[k].TABLE_NAME);
        }
    }
    //Handler de la fonction listant une table
    tableInitHandler(table: Table) {
        console.log("table " + table.name+" initialized");
        this.db.tables.push(table);
    }
    //Pour update une table
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
    //Handler de l'initialisation des clées primaires
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
    //Pour gérer la file de modifications
    handleModificationQueue(modificationQueue: any) {
        let table: string;
        let str: string[];
        table = modificationQueue.table;
        modificationQueue.forEach(function (elem) {
            str = elem.split(";")
            this.update(str[0], str[2], str[1]);
        },this);
    }
    //Pour réaliser un update local et en base de données
    update(table: string, value: string, condition: string) {
        let valueStr: string[], conditionStr: string[];
        valueStr = value.split("=");
        conditionStr = condition.split("=");
        this.wrapper.update(table, valueStr[0], valueStr[1], this.db.getTable(table).getColumn(valueStr[0]).type, conditionStr[0], conditionStr[1], this.db.getTable(table).getColumn(conditionStr[0]).type);
        this.db.getTable(table).setValue(valueStr[0], valueStr[1], conditionStr[0], conditionStr[1]);
    }
    //Pour update la base javascript
    updateLocalDb(table: string, value: string, condition: string) {
        let valueStr: string[], conditionStr: string[];
        valueStr = value.split("=");
        conditionStr = condition.split("=");
        console.log("updating local db");
        this.db.getTable(table).setValue(valueStr[0], valueStr[1], conditionStr[0], conditionStr[1]);
    }
    //Pour insérer dans la base de données javascript
    insertLocalDb(table: string, row: any[]) {
        this.db.getTable(table).rows.push(row);
    }
    //Pour supprimer dans la base de données javascript
    deleteLocalDb(table: string, condition: string) {
        let t: Table;
        t = this.db.getTable(table);
        let conditionStr: string[];
        conditionStr = condition.split("=");
        let i: number = 0;
        t.rows.forEach(function (row) {
            t.columns.some(function (column) {//Vérification de la condition
                if (column.name == conditionStr[0]) {
                    t.rows.splice(i, 1); // On supprime la ligne concernée
                    return true;
                }else return false;
            });
            i++;
        }, this);
    }
}