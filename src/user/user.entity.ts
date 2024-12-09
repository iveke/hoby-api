import { Column, Entity, JoinTable, ManyToMany, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { USER_ROLE } from './enum/user-role.enum';
import * as argon2 from 'argon2';
import { HobbyEntity } from 'src/hobby/hobby.entity';


@Entity()
export class UserEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToMany(() => HobbyEntity, (hobby) => hobby.users)
  @JoinTable()
  hobbies: HobbyEntity[];

  @OneToMany(() => HobbyEntity, hobby => hobby.creator)
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

  @Column({ default: USER_ROLE.USER })
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
