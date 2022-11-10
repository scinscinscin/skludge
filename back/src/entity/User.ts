import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";
import { v4 } from "uuid";
import { Task } from "./Task";

export enum Permissions {
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
	permissionLevel: number = Permissions.NONE;

	@OneToMany(() => Task, (task) => task.author)
	authoredTasks: Task[];

	cleanse() {
		return {
			username: this.username,
			uuid: this.uuid,
		};
	}
}
