import {Index,Entity, PrimaryColumn, Column, OneToOne, OneToMany, ManyToOne, JoinColumn} from "typeorm";


@Entity("test")
export class test {

    @Column("int",{ 
        generated:true,
        nullable:false,
        primary:true,
        name:"testid"
        })
    testid:number;
        

    @Column("varchar",{ 
        nullable:false,
        length:50,
        name:"test1"
        })
    test1:string;
        

    @Column("varchar",{ 
        nullable:false,
        length:50,
        name:"test2"
        })
    test2:string;
        
}
