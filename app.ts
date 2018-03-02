import debug = require('debug');
import express = require('express');
import bodyParser = require("body-parser");
import path = require('path');
import event = require('events');

//import routes from './routes/index';

import { DbMgr } from './controller/db_mgr';
import { Table } from './model/table';

var app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

var db_mgr: DbMgr;
db_mgr = new DbMgr();


//Démarrage du moteur de vues
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(express.static(path.join(__dirname, 'public')));

const routes = express.Router()

routes.get('/', (req: express.Request, res: express.Response) => {
    res.render('index', { title: 'Index' });
});

routes.post('/mydbeditor', function (req: express.Request, res: express.Response) {
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
    app.use((err: any, req, res, next) => {
        res.status(err['status'] || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

//Handler de production
//Pas de stacktraces pour l'utilisateur
app.use((err: any, req, res, next) => {
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
        db_mgr.db.tables.forEach(function (table) {
            console.log(request.table);
            if (table.name === request.table) {
                console.log(request.interval);
                socket.emit('table-loaded', table.getInterval(request.interval));
                return;
            }
        });
    });	
    socket.on('auto-update', function (modificationQueue) {
        console.log(modificationQueue);
    });
});

