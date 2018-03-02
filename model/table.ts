﻿import { Column } from './column';
import util = require('util');//Pour le developpement

/**
 * Classe: Table
 * Modélise une table rows[row][column]
 */

export class Table {
    rows: any[][];
    columns: Column[];
    name: string;

    constructor(rows: any[][], columns: Column[], name: string) {
        this.rows = rows;
        this.columns = columns;
        this.name = name;
    }

    setValue(table: string, valueCol: string, value: string, conditionCol: string, condition: string) {

        let columns: Column[];
        columns = this.columns;
        let i: number;
        i = 0;
        let rows: any[][];
        rows = this.rows;

        this.rows.some(function (row) {
            let j: number;
            j = -1;
            let conditionOk: boolean;
            conditionOk = row.some(function (elem) {
                ++j;
                console.log(conditionCol +" == "+ columns[j].name +" && "+ condition +" == "+ elem);
                return (conditionCol == columns[j].name && condition == elem);
            });
            j = 0;
            console.log(conditionOk);
            if (conditionOk == true) {
                return row.some(function (elem) {
                    console.log("third some");
                    if (valueCol == columns[j].name) {
                        rows[i][j] = value;
                        console.log("Value " + value + " set at [" + i + "][" + j + "]=" + rows[i][j]);
                        return true;
                    }
                    ++j;
                });
            }
            else return false;
        });
    }
    
    getInterval(str) {
        let strTab: string[];
        console.log(str);
        strTab = str.split(";");
        let interval: number, fromZero: number;
        interval = Number(strTab[1]) - Number(strTab[0]);
        fromZero = Number(strTab[0]);
        let i: number;
        i = 0;
        let table;
        table = {
            name: this.name,
            columns: this.columns,
            rows: []
        };
        this.rows.some(function (row) {
            if (fromZero > 0) {
                fromZero--;
            }
            else if (i < interval) {
                table.rows.push(row);
                ++i;
            } else return true;
        });
        console.log(table.rows);
        return table;
    }

    getColumn(col: string): Column {
        let c: Column;
        c = new Column("error", 0);
        this.columns.some(function (column) {
            if (column.name == col) {
                c = column;
                return true;
            }
        });
        return c;
    }
}