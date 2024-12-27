import { UserEntity } from 'src/user/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class ChallangeEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @CreateDateColumn({ type: 'timestamp' })
  createDate: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updateDate: Date;

//   @ManyToMany(() => UserEntity, (user) => user.challanges, {
//     nullable: true,
//     onDelete: 'SET NULL',
//   })
//   users: UserEntity[];

  @ManyToOne(() => UserEntity, (user) => user.createdChallange, {
    nullable: true,
  })
  creator: UserEntity;

  @Column()
  text: string;

//   @Column({ default: false, nullable: true })
//   status: boolean;

  @Column({ nullable: true })
  deadline: Date;

  @Column({name:"userstatuses", type: 'jsonb', default: {} })
  userStatuses: Record<
    string, // userId
    { isCompleted: boolean; completionDate: Date | null }
  >;
}
