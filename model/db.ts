import mysql_events = require('mysql-events');
import util = require('util');//Pour le developpement
import { Table } from './table';

/**
 * Classe: Db
 * Modélise une base de données
 */

export class Db {
    tables: Table[];
    name: string;
    mysqlEventWatcher;
    watcher;

    constructor(tables, conf, name) {
        this.tables = tables;
        this.name = name;
        this.mysqlEventWatcher = mysql_events(conf);

        this.watcher = this.mysqlEventWatcher.add(
            name,
            function (oldRow, newRow, event) {
                //row inserted 
                if (oldRow === null) {
                    //insert code goes here 
                    console.log("insert");
                }

                //row deleted 
                if (newRow === null) {
                    //delete code goes here 
                    console.log("update");
                }

                //row updated 
                if (oldRow !== null && newRow !== null) {
                    //update code goes here 
                    console.log(util.inspect(newRow, false, null))
                }

                //detailed event information 
                //console.log(event)
            },
            ''
        );
    }

}