"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var debug = require("debug");
var express = require("express");
var bodyParser = require("body-parser");
var path = require("path");
//import routes from './routes/index';
var db_mgr_1 = require("./controller/db_mgr");
var app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
var db_mgr;
db_mgr = new db_mgr_1.DbMgr();
//Démarrage du moteur de vues
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');
app.use(express.static(path.join(__dirname, 'public')));
var routes = express.Router();
routes.get('/', function (req, res) {
    res.render('index', { title: 'Index' });
});
routes.post('/mydbeditor', function (req, res) {
    //console.log('post got user: ' + req.body.user + " , pass : " + req.body.pwd);
    res.render('main', { title: "MyDBEditor", tables: db_mgr.db.tables });
});
app.use('/', routes);
app.use('/mydbeditor', routes);
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
//app.set('port', process.env.PORT || 3000);
app.set('port', 8080);
var server = app.listen(app.get('port'), function () {
    debug('Express server listening on port ' + server.address().port);
});
var io = require('socket.io').listen(server);
io.sockets.on('connection', function (socket) {
    console.log("New client connected");
    socket.on('load-table', function (request) {
        db_mgr.db.tables.some(function (table) {
            console.log(request.table);
            if (table.name === request.table) {
                console.log(request.interval);
                socket.emit('table-loaded', table.getInterval(request.interval));
                socket.currTable = request.table;
                return true;
            }
        });
    });
    socket.on('auto-update', function (modificationQueue) {
        db_mgr.handleModificationQueue(modificationQueue);
    });
    socket.on('req', function (request) {
        if (request != null && request != "") {
            console.log('received req event : ' + request);
            db_mgr.wrapper.queryWithEvent(request, 'req-result', db_mgr.events);
            var reqSplit = void 0;
            reqSplit = request.split(" ");
            if (reqSplit[0] == "ALTER" || reqSplit[0] == "INSERT") {
                db_mgr.updateTable(reqSplit[2]);
            }
            else if (reqSplit[0] == "UPDATE") {
                db_mgr.updateTable(reqSplit[1]);
            }
        }
    });
    db_mgr.events.addListener('db_update', function (table) {
    });
    db_mgr.events.addListener('req-result', function (result) {
        console.log('received and passed req-result with result = ');
        console.log(result);
        socket.emit('req-result', result);
    });
});
//# sourceMappingURL=app.js.map