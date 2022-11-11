import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { v4 } from "uuid";
import { User } from "./User";

@Entity()
export class Task {
	@PrimaryGeneratedColumn()
	id: number;

	@Column({ unique: true })
	uuid: string = v4();

	@Column()
	title: string;

	@Column()
	body: string;

	@ManyToOne(() => User, (user) => user.authoredTasks)
	author: User;

	@Column()
	finished: boolean = false;
}
