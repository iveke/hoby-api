import { UserEntity } from 'src/user/user.entity';
import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

@Entity()
export class ReviewsEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @CreateDateColumn({ type: 'timestamp' })
  createDate: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updateDate: Date;

  @Column()
  description: string;

  @ManyToOne(() => UserEntity, (user) => user.reviews, {
    nullable: false,
    onDelete: 'CASCADE', // Відгуки видаляються разом із користувачем
  })
  creator: UserEntity; // Зв'язок із користувачем
 
}
