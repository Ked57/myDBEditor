import { Db } from '../model/db';
import { Table } from '../model/table';
import { Column } from '../model/column';
import { Element } from '../model/element';
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
  
    }

    useDatabaseHandler(database: string) {
        this.db = new Db([], this.conf, database);
        let e = this.events;
        console.log("Using database :" + database);
        this.wrapper.query("SELECT * FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_SCHEMA= '" + database + "';", "tablesListed", this.events);
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

    pkInitHandler(pk: any) {
        console.log("initializing primary key(s) " + pk["keys"] + " for table " + pk["table"]);
        this.db.tables.forEach(function (table) {
            console.log(pk["table"]);
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
}