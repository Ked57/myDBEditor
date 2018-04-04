import { Db } from '../../model/db';
import { Table } from '../../model/table';
import { Column } from '../../model/column';
import { Wrapper } from './wrapper';

import event = require('events');
import util = require('util');
import mysql_package = require('mysql');

/**
 * Classe MysqlWrapper
    Sert à encapsuler les actions liées à Mysql
 */

export class MysqlWrapper implements Wrapper {
    con: mysql_package.Connection; //La connexion à Mysql
    events: event.EventEmitter;//Le gestionnaire d'event de nodejs
    conf: any;

    constructor(conf: any, events: event.EventEmitter) {
        this.conf = conf;
        this.events = events;

        this.con = mysql_package.createConnection(conf);
        this.con.connect(this.initialize.bind(this));  //Connexion à la base de données, avec la fonction initialize comme callback
    }

    //Fonction call pour l'initialisation
    initialize(err) {
        if (err) throw err;
        console.log("Connected to mysql");
        this.useDatabase("test", this.conf, this.events);
    }

    //Déconnexion de la base de données
    disconnect() {
        this.con.destroy();
    }
    //Pour changer de base de données
    useDatabase(database: string, conf, events: event.EventEmitter) {
        this.con.query("USE " + database + ";", function (err, result, fields) {
            if (err) throw err;
            console.log(result);
            events.emit("useDatabase", database);
        });
    }
    //Pour éxécuer une requête et déclencher un event ensuite, on passe en argument le nom de l'event
    queryWithEvent(sql: string, event: string, eventEmitter: event.EventEmitter) {
        this.con.query(sql, function (err, result, fields) {
            if (err) eventEmitter.emit(event, err);
            eventEmitter.emit(event, result);
        });
    }
    //Pour éxécuter une requête sans event
    query(sql: string) {
        this.con.query(sql, function (err, result, fields) {
            if (err) throw err;
        });
    }
    //Pour initialiser une table
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
        //Cette partie sert à récupérer les clées primaires
        sql = "SHOW KEYS FROM "+tableName+" WHERE Key_name = 'PRIMARY'"
        this.con.query(sql, function (err, result, fields) {
            if (err) throw err;
            let pk;
            pk = [];
            pk["table"] = tableName;
            pk["keys"] = [];
            result.forEach(function (elem) {
                console.log("found primary key " + elem.Column_name + " for table " + tableName);
                pk["keys"].push(elem.Column_name);
            });
            console.log(pk);
            e.emit("pkInit", pk);
        });
    }
    //Pour récupérer le schéma de la base de données
    getInformationSchema(database: string, events: event.EventEmitter) {
        this.queryWithEvent("SELECT * FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_SCHEMA= '" + database + "';", "tablesListed", events);
    }
    //Pour réaliser une requête update
    update(table: string, valueCol: string, value: string, valueType: number, conditionCol: string, condition : string, conditionType: number) {
        if (valueType != 3) value = '"' + value + '"';
        if (conditionType != 3) condition = '"' + condition + '"';
        this.query("UPDATE " + table + " SET " + valueCol + "=" + value + " WHERE " + conditionCol+ "=" + condition);
    }
}