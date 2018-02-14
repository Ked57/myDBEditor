import { Db } from '../model/db';
import { Table } from '../model/table';
import { Column } from '../model/column';
import { Element } from '../model/element';

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
    initialized: boolean;

    constructor() {
        //A mettre dans un fichier de configuration à part
        this.conf = {
            host: "127.0.0.1",
            user: "test",
            password: "test"
        }
        this.events = new event.EventEmitter();

        //Initialisation des events
        this.events.addListener("useDatabase", this.useDatabaseHandler.bind(this));
        this.events.addListener("tablesListed", this.tablesListedHandler.bind(this));
        this.events.addListener("tableInit", this.tableInitHandler.bind(this));

        this.initialized = false;
        this.con = mysql_package.createConnection(this.conf);
        this.con.connect(this.initialize.bind(this));        
    }

    initialize(err) {
        if (err) throw err;
        console.log("Connected to mysql");
        this.initialized = true;
        this.useDatabase("test",this.conf,this.events);
    }

    disconnect() {
        this.con.destroy();
        this.initialized = false;
    }

    get isInitialized() {
        return this.initialized;
    }

    useDatabase(database: string, conf, events: event.EventEmitter) {
        this.con.query("USE " + database +";", function (err, result, fields) {
            if (err) throw err;
            console.log(result);
            events.emit("useDatabase", database);            
        });
    }

    select(sql: string){
        let res: Table;
        res = new Table([], [], "");
        this.con.query(sql, function (err, result, fields) {
            if (err) throw err;
            if (fields != undefined) {
                fields.forEach(function (elem) {
                    res.columns.push(new Column(elem.name, elem.type));
                });
                result.forEach(function (elem) {
                    var row: any[] = [];
                    fields.forEach(function (col) {
                        row.push(elem[col.name]);
                    });
                    res.rows.push(row);
                });
                console.log(util.format(res));
                res.name = "sucess";
            } else res.name = "error";
        });
        this.result = res;
    }

    initTable(tableName: string) {
        let e: event;
        e = this.events;
        let sql: string = "SELECT * FROM " + tableName;
        this.con.query(sql, function (err, result, fields) {
            if (err) throw err;
            if (fields != undefined) {
                let res: Table;
                res = new Table([], [], tableName);
                fields.forEach(function (elem) {
                    res.columns.push(new Column(elem.name, elem.type));
                });
                result.forEach(function (elem) {
                    var row: any[] = [];
                    fields.forEach(function (col) {
                        row.push(elem[col.name]);
                    });
                    res.rows.push(row);
                });
                console.log(util.format(res));
                e.emit("tableInit",res);
            }
        });
    }

    useDatabaseHandler(database: string) {
        this.db = new Db([], this.conf, database);
        let e = this.events;
        console.log("dbhandler :" + database);
        this.con.query("SELECT * FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_SCHEMA='" + database +"';", function (err, result, fields) {
            if (err) throw err;
            e.emit("tablesListed", result);    
        });
    }

    tablesListedHandler(result) {
        console.log("tablesListedHandler");
        console.log(result[0].TABLE_NAME);
        for (var k in result) {
            this.initTable(result[k].TABLE_NAME);
        }
    }

    tableInitHandler(table: Table) {
        console.log("tableInitHandler");
        this.db.tables.push(table);
    }
}