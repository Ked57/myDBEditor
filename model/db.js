"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var util = require("util"); //Pour le developpement
var table_1 = require("./table");
/**
 * Classe: Db
 * Modélise une base de données
 */
var Db = /** @class */ (function () {
    function Db(tables, name, events) {
        this.tables = tables;
        this.name = name;
        this.events = events;
    }
    Db.prototype.getTable = function (tableName) {
        var t;
        t = new table_1.Table([], [], "error");
        this.tables.forEach(function (table) {
            if (table.name == tableName) {
                t = table;
            }
        });
        return t;
    };
    Db.prototype.toString = function () {
        return util.format(this.tables);
    };
    return Db;
}());
exports.Db = Db;
//# sourceMappingURL=db.js.map