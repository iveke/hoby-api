import {
  Column,
  CreateDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { USER_ROLE } from './enum/user-role.enum';
import * as argon2 from 'argon2';
import { HobbyEntity } from 'src/hobby/hobby.entity';
import { ReviewsEntity } from 'src/reviews/reviews.entity';
import { ChallangeEntity } from 'src/challange/challange.entity';

@Entity()
export class UserEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @CreateDateColumn({ type: 'timestamp' })
  createDate: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updateDate: Date;

  @ManyToMany(() => HobbyEntity, (hobby) => hobby.users)
  @JoinTable()
  hobbies: HobbyEntity[];

  // @ManyToMany(() => ChallangeEntity, (challange) => challange.users)
  // @JoinTable()
  // challanges: ChallangeEntity[];

  @OneToMany(() => ChallangeEntity, (challange) => challange.creator)
  createdChallange: ChallangeEntity[]; // Всі хобі, створені користувачем

  @OneToMany(() => ReviewsEntity, (review) => review.creator)
  reviews: ReviewsEntity[]; // Всі хобі, створені користувачем

  @OneToMany(() => HobbyEntity, (hobby) => hobby.creator)
  createdHobbies: HobbyEntity[]; // Всі хобі, створені користувачем

  @Column()
  email: string;

  @Column({ nullable: true })
  phone?: string;

  @Column()
  password: string;

  @Column({ nullable: true })
  name?: string;

  @Column({ nullable: true })
  birthDay?: Date;

  @Column({
    type: 'enum',
    enum: USER_ROLE,
    default: USER_ROLE.USER,
    nullable: true,
  })
  role: USER_ROLE;

  // @Column({nullable: true})
  // savedHobbies: HobbyEntity[];

  // Хешування пароля
  static async hashPassword(password: string): Promise<string> {
    return await argon2.hash(password);
  }

  // Валідація пароля
  async validatePassword(password: string): Promise<boolean> {
    return await argon2.verify(this.password, password);
  }

  // Оновлення пароля
  async updatePassword(password: string): Promise<void> {
    this.password = await UserEntity.hashPassword(password);
  }
}
