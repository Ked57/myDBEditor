import mysql_package = require('mysql');
import mysql_events = require('mysql-events');


/**
 * Classe: Mysql
 * Encapsule les actions liées à Mysql comme la connexion ou les différentes requêtes
 */

class Mysql {
    con: mysql_package.Connection;
    host: string;
    user: string;
    password: string;
    initialized: boolean;
    constructor(host: string, user: string, password: string) {
        this.host = host;
        this.user = user;
        this.password = password;
        this.initialized = false;
    }

    connect() {
        this.con = mysql_package.createConnection({
            host: this.host,
            user: this.user,
            password: this.password
        });
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


let mysql = new Mysql("127.0.0.1", "test", "test");
export default mysql;