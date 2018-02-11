"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var mysql_package = require("mysql");
/**
 * Classe: Mysql
 * Encapsule les actions liées à Mysql comme la connexion ou les différentes requêtes
 */
var Mysql = /** @class */ (function () {
    function Mysql(host, user, password) {
        this.host = host;
        this.user = user;
        this.password = password;
        this.initialized = false;
    }
    Mysql.prototype.connect = function () {
        this.con = mysql_package.createConnection({
            host: this.host,
            user: this.user,
            password: this.password
        });
        this.con.connect(function (err) {
            if (err)
                throw err;
            console.log("Connected to mysql");
            this.initialized = true;
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
    };
    return Mysql;
}());
var mysql = new Mysql("127.0.0.1", "test", "test");
exports.default = mysql;
//# sourceMappingURL=mysql_wrapper.js.map