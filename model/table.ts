import { Element } from './element';

/**
 * Classe: Table
 * Modélise une table
 */

export class Table {
    rows: Element[][];

    constructor(rows: Element[][]) {
        this.rows = rows;
    }
}