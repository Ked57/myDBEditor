
/**
 * Classe: Column
 * Modélise une colonne
 */

export class Column {
    name: string;
    type: string;//On stockera le type dans une chaine de caractères

    constructor(name: string, type: string) {
        this.name = name;
        this.type = type;
    }
}