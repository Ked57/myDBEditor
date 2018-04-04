
/**
 * Classe: Column
 * Modélise une colonne
 */

export class Column {
    name: string;
    type: number;//On stockera le type sous forme de nombre, valeurs venant de mysql
    pk: boolean;//Clé primaire

    constructor(name: string, type: number) {
        this.name = name;
        this.type = type;
        this.pk = false;
    }
}