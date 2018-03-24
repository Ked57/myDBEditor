import {Index,Entity, PrimaryColumn, Column, OneToOne, OneToMany, ManyToOne, JoinColumn} from "typeorm";


@Entity("test2")
export class test2 {

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
        

    @Column("varchar",{ 
        nullable:false,
        length:50,
        name:"test3"
        })
    test3:string;
        
}
