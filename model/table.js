"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var column_1 = require("./column");
/**
 * Classe: Table
 * Modélise une table rows[row][column]
 */
var Table = /** @class */ (function () {
    function Table(rows, columns, name) {
        this.rows = rows;
        this.columns = columns;
        this.name = name;
    }
    Table.prototype.setValue = function (table, valueCol, value, conditionCol, condition) {
        var columns;
        columns = this.columns;
        var i;
        i = 0;
        var rows;
        rows = this.rows;
        this.rows.some(function (row) {
            var j;
            j = -1;
            var conditionOk;
            conditionOk = row.some(function (elem) {
                ++j;
                console.log(conditionCol + " == " + columns[j].name + " && " + condition + " == " + elem);
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
            else
                return false;
        });
    };
    Table.prototype.getInterval = function (str) {
        var strTab;
        console.log(str);
        strTab = str.split(";");
        var interval, fromZero;
        interval = Number(strTab[1]) - Number(strTab[0]);
        fromZero = Number(strTab[0]);
        var i;
        i = 0;
        var table;
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
            }
            else
                return true;
        });
        console.log(table.rows);
        return table;
    };
    Table.prototype.getColumn = function (col) {
        var c;
        c = new column_1.Column("error", 0);
        this.columns.some(function (column) {
            if (column.name == col) {
                c = column;
                return true;
            }
        });
        return c;
    };
    return Table;
}());
exports.Table = Table;
//# sourceMappingURL=table.js.map