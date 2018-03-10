"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var mysql_package = require("mysql");
/**
 * Classe: Mysql
 * Encapsule les actions liées à Mysql comme la connexion ou les différentes requêtes
 */
var Mysql = /** @class */ (function () {
    function Mysql(conf) {
        this.conf = conf;
        this.initialized = false;
    }
    Mysql.prototype.connect = function (eventEmitter) {
        this.con = mysql_package.createConnection(this.conf);
        this.con.connect(function (err) {
            if (err)
                throw err;
            this.initialized = true;
            console.log("connected");
        });
    };
    Mysql.prototype.disconnect = function () {
        this.con.destroy();
        this.initialized = false;
    };
    Mysql.prototype.isInitialized = function () {
        return this.initialized;
    };
    Mysql.prototype.useDatabase = function (database) {
        this.query("USE " + database + ";");
    };
    Mysql.prototype.query = function (sql) {
        this.con.query(sql, function (err, result) {
            if (err)
                throw err;
            return result;
        });
        return [];
    };
    return Mysql;
}());
exports.Mysql = Mysql;
//# sourceMappingURL=mysql_wrapper.js.map