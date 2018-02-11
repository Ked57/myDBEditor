import { Db } from '../model/db';
import { Table } from '../model/table';
import { Column } from '../model/column';
import { Element } from '../model/element';

import events = require('events');
import util = require('util');
import mysql_package = require('mysql');

/**
 * Classe: DbMgr
 * Encapsule les actions liées aux bases de données
 */

export class DbMgr {
    conf;
    dbs: Db[];
    con: mysql_package.Connection;
    events: events.EventEmitter;
    initialized: boolean;

    constructor() {
        //A mettre dans un fichier de configuration à part
        this.conf = {
            host: "127.0.0.1",
            user: "test",
            password: "test"
        }
        this.initialized = false;
        this.con = mysql_package.createConnection(this.conf);
        this.con.connect(this.initialize.bind(this))        
    }

    initialize(err) {
        if (err) throw err;
        console.log("Connected to mysql");
        this.initialized = true;
        this.useDatabase('test');
        console.log(this.query("SELECT test FROM test WHERE idtest=1;"));
    }

    disconnect() {
        this.con.destroy();
        this.initialized = false;
    }

    get isInitialized() {
        return this.initialized;
    }

    useDatabase(database: string) {
        this.query("USE " + database + ";");
    }

    query(sql: string){
        this.con.query(sql, function (err, result) {
            if (err) throw err;
            //todo return as a table
        });
        return {};
    }
    
}