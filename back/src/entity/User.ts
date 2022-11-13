import { Entity, PrimaryGeneratedColumn, Column, OneToMany, ManyToOne } from "typeorm";
import { v4 } from "uuid";
import { Division } from "./Division";
import { Task } from "./Task";

export enum PERMISSION {
	NONE = 0,
	STAFF,
	EXECUTIVE_HEAD,
	EXECUTIVE_COORDINATOR,
	EXECUTIVE_BOARD,
	ADMIN = 100,
}

@Entity()
export class User {
	@PrimaryGeneratedColumn()
	id: number;

	@Column({ unique: true })
	username: string;

	@Column()
	hashedPassword: string;

	@Column({ unique: true })
	uuid: string = v4();

	@Column()
	permissionLevel: number = PERMISSION.NONE;

	@OneToMany(() => Task, (task) => task.author)
	authoredTasks: Task[];

	@ManyToOne(() => Division, (division) => division.members, { nullable: true })
	division: Division | null;
}
