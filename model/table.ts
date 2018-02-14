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
}