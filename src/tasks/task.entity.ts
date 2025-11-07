import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { TaskStatus } from './task.model';
import { User } from 'src/users/user.entity';
import { TaskLabel } from './task-label.entity';

@Entity({ name: 'tasks' })
export class Task {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    type: 'varchar',
    length: 100,
    nullable: false,
  })
  title: string;

  @Column({
    type: 'text',
    nullable: false,
  })
  description: string;

  @Column({
    type: 'enum',
    enum: TaskStatus,
    default: TaskStatus.OPEN,
  })
  status: TaskStatus;

  @Column()
  userId: string;

  @ManyToOne(() => User, (user) => user.tasks, {
    nullable: false,
    onDelete: 'CASCADE',
  })
  user: User;

  @OneToMany(() => TaskLabel, (taskLabel) => taskLabel.task, {
    cascade: true,
  })
  labels: TaskLabel[];
}
