import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { USER_ROLE } from './enum/user-role.enum';
import * as argon2 from 'argon2';


@Entity()
export class UserEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

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
