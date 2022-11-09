import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";
import { v4 } from "uuid";

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

  async cleanse() {
    return {
      username: this.username,
      uuid: this.uuid,
    };
  }
}
