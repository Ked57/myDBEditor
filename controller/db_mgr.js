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
        this.db = new db_1.Db([], this.conf, database);
        var e = this.events;
        console.log("Using database :" + database);
        this.wrapper.query("SELECT * FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_SCHEMA= '" + database + "';", "tablesListed", this.events);
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
    DbMgr.prototype.pkInitHandler = function (pk) {
        console.log("initializing primary key(s) " + pk["keys"] + " for table " + pk["table"]);
        this.db.tables.forEach(function (table) {
            console.log(pk["table"]);
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
    return DbMgr;
}());
exports.DbMgr = DbMgr;
//# sourceMappingURL=db_mgr.js.map