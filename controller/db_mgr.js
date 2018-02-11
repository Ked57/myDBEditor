"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
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
        this.initialized = false;
        this.con = mysql_package.createConnection(this.conf);
        this.con.connect(this.initialize.bind(this));
    }
    DbMgr.prototype.initialize = function (err) {
        if (err)
            throw err;
        console.log("Connected to mysql");
        this.initialized = true;
        this.useDatabase('test');
        console.log(this.query("SELECT test FROM test WHERE idtest=1;"));
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
    DbMgr.prototype.useDatabase = function (database) {
        this.query("USE " + database + ";");
    };
    DbMgr.prototype.query = function (sql) {
        this.con.query(sql, function (err, result) {
            if (err)
                throw err;
            if (result)
                return result;
        });
        //return {};
    };
    return DbMgr;
}());
exports.DbMgr = DbMgr;
//# sourceMappingURL=db_mgr.js.map