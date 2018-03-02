import { Element } from './element';
import { Column } from './column';
import util = require('util');//Pour le developpement

/**
 * Classe: Table
 * Modélise une table rows[row][column]
 */

export class Table {
    rows: Element[][];
    columns: Column[];
    name: string;

    constructor(rows: Element[][], columns: Column[], name: string) {
        this.rows = rows;
        this.columns = columns;
        this.name = name;
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
        this.rows.forEach(function (row) {
            if (fromZero > 0) {
                fromZero--;
            }
            else if (i < interval) {
                table.rows.push(row);
                ++i;
            } else return;
        });
        console.log(table.rows);
        return table;
    }
}