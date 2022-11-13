import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { v4 } from "uuid";
import { Committee } from "./Committee";
import { User } from "./User";

@Entity()
export class Division {
	@PrimaryGeneratedColumn()
	id: number;

	@Column()
	uuid: string = v4();

	@Column()
	name: string;

	@OneToMany(() => User, (user) => user.division, { eager: true })
	members: User[];

	@OneToMany(() => Committee, (comm) => comm.division, { eager: true })
	committees: Committee[];
}
