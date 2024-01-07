import { Task } from 'src/tasks/task.entity';
import { Column, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { Entity, JoinColumn, OneToOne } from 'typeorm';
@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  username: string;

  @Column()
  password: string;
  
  @OneToMany((_type) => Task, (task) => task.user, { eager: true })
  tasks: Task[];

}

