"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var db_1 = require("../model/db");
var table_1 = require("../model/table");
var column_1 = require("../model/column");
var event = require("events");
var util = require("util");
var mysql_package = require("mysql");
/**
 * Classe: DbMgr
 * Encapsule les actions liées aux bases de données
 */
var DbMgr = /** @class */ (function () {
    function DbMgr() {
        //A mettre dans un fichier de configuration à part
        this.conf = {
            host: "127.0.0.1",
            user: "test",
            password: "test"
        };
        this.events = new event.EventEmitter();
        //Initialisation des events
        this.events.addListener("useDatabase", this.useDatabaseHandler.bind(this));
        this.events.addListener("tablesListed", this.tablesListedHandler.bind(this));
        this.events.addListener("tableInit", this.tableInitHandler.bind(this));
        this.initialized = false;
        this.con = mysql_package.createConnection(this.conf);
        this.con.connect(this.initialize.bind(this));
    }
    DbMgr.prototype.initialize = function (err) {
        if (err)
            throw err;
        console.log("Connected to mysql");
        this.initialized = true;
        this.useDatabase("test", this.conf, this.events);
    };
    DbMgr.prototype.disconnect = function () {
        this.con.destroy();
        this.initialized = false;
    };
    Object.defineProperty(DbMgr.prototype, "isInitialized", {
        get: function () {
            return this.initialized;
        },
        enumerable: true,
        configurable: true
    });
    DbMgr.prototype.useDatabase = function (database, conf, events) {
        this.con.query("USE " + database + ";", function (err, result, fields) {
            if (err)
                throw err;
            console.log(result);
            events.emit("useDatabase", database);
        });
    };
    DbMgr.prototype.select = function (sql) {
        var res;
        res = new table_1.Table([], [], "");
        this.con.query(sql, function (err, result, fields) {
            if (err)
                throw err;
            if (fields != undefined) {
                fields.forEach(function (elem) {
                    res.columns.push(new column_1.Column(elem.name, elem.type));
                });
                result.forEach(function (elem) {
                    var row = [];
                    fields.forEach(function (col) {
                        row.push(elem[col.name]);
                    });
                    res.rows.push(row);
                });
                console.log(util.format(res));
                res.name = "sucess";
            }
            else
                res.name = "error";
        });
        this.result = res;
    };
    DbMgr.prototype.initTable = function (tableName) {
        var e;
        e = this.events;
        var sql = "SELECT * FROM " + tableName;
        this.con.query(sql, function (err, result, fields) {
            if (err)
                throw err;
            if (fields != undefined) {
                var res_1;
                res_1 = new table_1.Table([], [], tableName);
                fields.forEach(function (elem) {
                    res_1.columns.push(new column_1.Column(elem.name, elem.type));
                });
                result.forEach(function (elem) {
                    var row = [];
                    fields.forEach(function (col) {
                        row.push(elem[col.name]);
                    });
                    res_1.rows.push(row);
                });
                console.log(util.format(res_1));
                e.emit("tableInit", res_1);
            }
        });
    };
    DbMgr.prototype.useDatabaseHandler = function (database) {
        this.db = new db_1.Db([], this.conf, database);
        var e = this.events;
        console.log("dbhandler :" + database);
        this.con.query("SELECT * FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_SCHEMA='" + database + "';", function (err, result, fields) {
            if (err)
                throw err;
            e.emit("tablesListed", result);
        });
    };
    DbMgr.prototype.tablesListedHandler = function (result) {
        console.log("tablesListedHandler");
        console.log(result[0].TABLE_NAME);
        for (var k in result) {
            this.initTable(result[k].TABLE_NAME);
        }
    };
    DbMgr.prototype.tableInitHandler = function (table) {
        console.log("tableInitHandler");
        this.db.tables.push(table);
        console.log(this.db);
    };
    return DbMgr;
}());
exports.DbMgr = DbMgr;
//# sourceMappingURL=db_mgr.js.map