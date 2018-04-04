import util = require('util');//Pour le developpement
import event = require('events');
import { Table } from './table';

/**
 * Classe: Db
 * Modélise une base de données
 */

export class Db {
    tables: Table[];//Liste des tables
    name: string;
    events: event.EventEmitter;

    constructor(tables: Table[], name: string, events: event.EventEmitter) {
        this.tables = tables;
        this.name = name;
        this.events = events;
    }

    getTable(tableName: string): Table{
        let t: Table;
        t = new Table([], [], "error");//Si on ne trouve pas la table on renvoi une table nommée error
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