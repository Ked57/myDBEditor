"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var debug = require("debug");
var express = require("express");
var path = require("path");
var mysql_wrapper_1 = require("./model/mysql_wrapper");
var db_1 = require("./model/db");
var index_1 = require("./routes/index");
var app = express();
var conf = {
    host: "127.0.0.1",
    user: "test",
    password: "test"
};
//Connection à mysql
var mysql = new mysql_wrapper_1.Mysql(conf);
mysql.connect();
var db = new db_1.Db([], conf, 'test');
//Démarrage du moteur de vues
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');
app.use(express.static(path.join(__dirname, 'public')));
app.use('/', index_1.default);
//Catch des erreurs 404
app.use(function (req, res, next) {
    var err = new Error('Not Found');
    err['status'] = 404;
    next(err);
});
//Handler d'erreurs
//Handler de développement
//Ecrit les stacktraces
if (app.get('env') === 'development') {
    app.use(function (err, req, res, next) {
        res.status(err['status'] || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}
//Handler de production
//Pas de stacktraces pour l'utilisateur
app.use(function (err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});
app.set('port', process.env.PORT || 3000);
var server = app.listen(app.get('port'), function () {
    debug('Express server listening on port ' + server.address().port);
});
//# sourceMappingURL=app.js.map