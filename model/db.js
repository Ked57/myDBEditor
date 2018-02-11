"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var mysql_events = require("mysql-events");
var util = require("util"); //Pour le developpement
/**
 * Classe: Db
 * Modélise une base de données
 */
var Db = /** @class */ (function () {
    function Db(tables, conf, name) {
        this.tables = tables;
        this.name = name;
        this.mysqlEventWatcher = mysql_events(conf);
        this.watcher = this.mysqlEventWatcher.add(name, function (oldRow, newRow, event) {
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
                console.log(util.inspect(newRow, false, null));
            }
            //detailed event information 
            //console.log(event)
        }, '');
    }
    return Db;
}());
exports.Db = Db;
//# sourceMappingURL=db.js.map