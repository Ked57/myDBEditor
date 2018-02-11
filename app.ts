﻿import debug = require('debug');
import express = require('express');
import path = require('path');

import routes from './routes/index';

import { DbMgr } from './controller/db_mgr'

var app = express();

let db_mgr: DbMgr;
db_mgr = new DbMgr();


//Démarrage du moteur de vues
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);

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

app.set('port', process.env.PORT || 3000);

var server = app.listen(app.get('port'), function () {
    debug('Express server listening on port ' + server.address().port);
});
