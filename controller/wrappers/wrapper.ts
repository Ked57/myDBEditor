import { Db } from '../../model/db';
import { Table } from '../../model/table';
import { Column } from '../../model/column';

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
    initTable(tableName: string);
    getInformationSchema(database: string, events: event.EventEmitter);
    query(sql: string);
    queryWithEvent(sql: string, event: string, eventEmitter: event.EventEmitter);
    update(table: string, valueCol: string, value: string, valueType: number, condition: string, conditionCol: string, conditionType: number);
}