import mysql_package = require('mysql');
import util = require('util');


/**
 * Classe: Mysql
 * Encapsule les actions liées à Mysql comme la connexion ou les différentes requêtes
 */

export class Mysql {
    con: mysql_package.Connection;
    initialized: boolean;
    conf;

    constructor(conf) {
        this.conf = conf;
        this.initialized = false;
    }

    connect() {
        this.con = mysql_package.createConnection(this.conf);

        this.con.connect(function (err) {
            if (err) throw err;
            console.log("Connected to mysql");
            this.initialized = true;
        });        
    }

    disconnect() {
        this.con.destroy();
        this.initialized = false;
    }

    isInitialized() {
        return this.initialized;
    }

    useDatabase(database: string) {
        this.query("USE " + database + ";");
    }

    query(sql: string) {
        this.con.query(sql, function (err, result) {
            if (err) throw err;
            return result;
        });
    }
}