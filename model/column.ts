
/**
 * Classe: Column
 * Modélise une colonne
 */

export class Column {
    name: string;
    type: number;//On stockera le type sous forme de nombre

    constructor(name: string, type: number) {
        this.name = name;
        this.type = type;
    }
}