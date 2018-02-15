import { Db } from '../../model/db';
import { Table } from '../../model/table';
import { Column } from '../../model/column';
import { Element } from '../../model/element';

import event = require('events');
import util = require('util');
import mysql_package = require('mysql');

export interface Wrapper {
    con: mysql_package.Connection;
    events: event.EventEmitter;
    conf;

    //constructor(conf: any, con: mysql_package.Connection, events: event.EventEmitter)

    initialize(err);
    disconnect();
    useDatabase(database: string, conf, events: event.EventEmitter);
    select(sql: string);
    initTable(tableName: string);
    query(sql: string, event: string, eventEmitter: event.EventEmitter);
}