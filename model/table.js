"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
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
        this.rows.forEach(function (row) {
            if (fromZero > 0) {
                fromZero--;
            }
            else if (i < interval) {
                table.rows.push(row);
                ++i;
            }
            else
                return;
        });
        console.log(table.rows);
        return table;
    };
    return Table;
}());
exports.Table = Table;
//# sourceMappingURL=table.js.map