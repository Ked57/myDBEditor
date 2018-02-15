﻿import { Db } from '../../model/db';
import { Table } from '../../model/table';
import { Column } from '../../model/column';
import { Element } from '../../model/element';
import { Wrapper } from './wrapper';

import event = require('events');
import util = require('util');
import mysql_package = require('mysql');

export class MysqlWrapper implements Wrapper {
    con: mysql_package.Connection;
    events: event.EventEmitter;
    conf: any;

    constructor(conf: any, events: event.EventEmitter) {
        this.conf = conf;
        this.events = events;

        this.con = mysql_package.createConnection(conf);
        this.con.connect(this.initialize.bind(this));  
    }

    initialize(err) {
        if (err) throw err;
        console.log("Connected to mysql");
        this.useDatabase("test", this.conf, this.events);
    }

    disconnect() {
        this.con.destroy();
    }

    useDatabase(database: string, conf, events: event.EventEmitter) {
        this.con.query("USE " + database + ";", function (err, result, fields) {
            if (err) throw err;
            console.log(result);
            events.emit("useDatabase", database);
        });
    }

    query(sql: string, event: string, eventEmitter: event.EventEmitter) {
        this.con.query(sql, function (err, result, fields) {
            if (err) throw err;
            eventEmitter.emit("tablesListed", result);
        });
    }

    select(sql: string) {
        this.con.query(sql, function (err, result, fields) {
            let res: Table;
            res = new Table([], [], "");
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
                e.emit("tableInit", res);
            }
        });
    }
}