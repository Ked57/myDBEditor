
/**
 * Classe: Column
 * Modélise une colonne
 */

export class Column {
    name: string;
    type: number;//On stockera le type sous forme de nombre
    pk: boolean;

    constructor(name: string, type: number) {
        this.name = name;
        this.type = type;
        this.pk = false;
    }
}