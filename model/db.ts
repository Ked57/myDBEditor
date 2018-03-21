import mysql_events = require('mysql-events');
import util = require('util');//Pour le developpement
import event = require('events');
import { Table } from './table';

/**
 * Classe: Db
 * Modélise une base de données
 */

export class Db {
    tables: Table[];
    name: string;
    mysqlEventWatcher;
    events: event.EventEmitter;
    watcher;

    constructor(tables: Table[], conf, name: string, events: event.EventEmitter) {
        this.tables = tables;
        this.name = name;
        this.mysqlEventWatcher = mysql_events(conf);
        this.events = events;

        this.watcher = this.mysqlEventWatcher.add(
            name,
            function (oldRow, newRow, event) {
                //row inserted 
                if (oldRow === null) {
                    //insert code goes here 
                    console.log("insert");
                    events.emit('dbEventInsert', { newRow });
                }

                //row deleted 
                if (newRow === null) {
                    //delete code goes here 
                    console.log("delete");
                    events.emit('dbEventDelete', { oldRow });
                }

                //row updated 
                if (oldRow !== null && newRow !== null) {
                    //update code goes here 
                    events.emit('dbEventUpdate', { newRow });
                }

                //detailed event information 
                console.log(event)
            },
            ''
        );
    }

    getTable(tableName: string): Table{
        let t: Table;
        t = new Table([], [], "error");
        this.tables.forEach(function (table: Table) {
            if (table.name == tableName) {
                t = table;
            }
        });
        return t;
    }

    toString() {
        return util.format(this.tables);
    }
}