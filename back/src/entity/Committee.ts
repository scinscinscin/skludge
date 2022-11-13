import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { v4 } from "uuid";
import { Division } from "./Division";

@Entity()
export class Committee {
	@PrimaryGeneratedColumn()
	id: number;

	@Column()
	uuid: string = v4();

	@Column()
	name: string;

	@ManyToOne(() => Division, (div) => div.committees)
	division: Division;
}
