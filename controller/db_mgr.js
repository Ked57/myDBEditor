"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var db_1 = require("../model/db");
var mysql_wrapper_1 = require("./wrappers/mysql_wrapper");
var event = require("events");
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
        this.wrapper = new mysql_wrapper_1.MysqlWrapper(this.conf, this.events);
        //Initialisation des events
        this.events.addListener("useDatabase", this.useDatabaseHandler.bind(this));
        this.events.addListener("tablesListed", this.tablesListedHandler.bind(this));
        this.events.addListener("tableInit", this.tableInitHandler.bind(this));
        this.events.addListener("pkInit", this.pkInitHandler.bind(this));
    }
    DbMgr.prototype.useDatabaseHandler = function (database) {
        this.db = new db_1.Db([], this.conf, database, this.events);
        var e = this.events;
        console.log("Using database :" + database);
        this.wrapper.getInformationSchema(database, this.events);
    };
    DbMgr.prototype.tablesListedHandler = function (result) {
        console.log("Table list recovered");
        console.log(result[0].TABLE_NAME);
        for (var k in result) {
            this.wrapper.initTable(result[k].TABLE_NAME);
        }
    };
    DbMgr.prototype.tableInitHandler = function (table) {
        console.log("table " + table.name + " initialized");
        this.db.tables.push(table);
    };
    DbMgr.prototype.updateTable = function (tableName) {
        var dbs;
        var wrap;
        dbs = this.db;
        wrap = this.wrapper;
        dbs.tables.some(function (table) {
            if (table.name == tableName) {
                dbs.tables.splice(dbs.tables.indexOf(table), 1);
                wrap.initTable(tableName);
                console.log('updating table : ' + tableName);
                return true;
            }
        });
    };
    DbMgr.prototype.pkInitHandler = function (pk) {
        console.log("initializing primary key(s) " + pk["keys"] + " for table " + pk["table"]);
        this.db.tables.forEach(function (table) {
            if (table.name === pk["table"]) {
                table.columns.forEach(function (col) {
                    pk["keys"].forEach(function (key) {
                        if (key == col.name) {
                            col.pk = true;
                        }
                    });
                });
                return;
            }
        });
    };
    DbMgr.prototype.handleModificationQueue = function (modificationQueue) {
        var table;
        var str;
        var mgr;
        mgr = this;
        table = modificationQueue.table;
        console.log("before table: " + table);
        modificationQueue.forEach(function (elem) {
            str = elem.split(";");
            mgr.update(str[0], str[2], str[1]);
        });
    };
    DbMgr.prototype.update = function (table, value, condition) {
        var valueStr, conditionStr;
        valueStr = value.split("=");
        conditionStr = condition.split("=");
        this.wrapper.update(table, valueStr[0], valueStr[1], this.db.getTable(table).getColumn(valueStr[0]).type, conditionStr[0], conditionStr[1], this.db.getTable(table).getColumn(conditionStr[0]).type);
        this.db.getTable(table).setValue(table, valueStr[0], valueStr[1], conditionStr[0], conditionStr[1]);
    };
    return DbMgr;
}());
exports.DbMgr = DbMgr;
//# sourceMappingURL=db_mgr.js.map