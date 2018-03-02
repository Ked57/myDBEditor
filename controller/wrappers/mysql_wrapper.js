"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var table_1 = require("../../model/table");
var column_1 = require("../../model/column");
var util = require("util");
var mysql_package = require("mysql");
var MysqlWrapper = /** @class */ (function () {
    function MysqlWrapper(conf, events) {
        this.conf = conf;
        this.events = events;
        this.con = mysql_package.createConnection(conf);
        this.con.connect(this.initialize.bind(this));
    }
    MysqlWrapper.prototype.initialize = function (err) {
        if (err)
            throw err;
        console.log("Connected to mysql");
        this.useDatabase("test", this.conf, this.events);
    };
    MysqlWrapper.prototype.disconnect = function () {
        this.con.destroy();
    };
    MysqlWrapper.prototype.useDatabase = function (database, conf, events) {
        this.con.query("USE " + database + ";", function (err, result, fields) {
            if (err)
                throw err;
            console.log(result);
            events.emit("useDatabase", database);
        });
    };
    MysqlWrapper.prototype.query = function (sql, event, eventEmitter) {
        this.con.query(sql, function (err, result, fields) {
            if (err)
                throw err;
            eventEmitter.emit("tablesListed", result);
        });
    };
    MysqlWrapper.prototype.select = function (sql) {
        this.con.query(sql, function (err, result, fields) {
            var res;
            res = new table_1.Table([], [], "");
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
    };
    MysqlWrapper.prototype.initTable = function (tableName) {
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
        sql = "SHOW KEYS FROM " + tableName + " WHERE Key_name = 'PRIMARY'";
        this.con.query(sql, function (err, result, fields) {
            if (err)
                throw err;
            var pk;
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
    };
    return MysqlWrapper;
}());
exports.MysqlWrapper = MysqlWrapper;
//# sourceMappingURL=mysql_wrapper.js.map