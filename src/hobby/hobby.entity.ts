import { Column, Entity, ManyToMany,  ManyToOne,  PrimaryGeneratedColumn } from 'typeorm';
import { HOBBY_TYPE } from './enum/hobby-type.enum';
import { UserEntity } from 'src/user/user.entity';

@Entity()
export class HobbyEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToMany(() => UserEntity, (user) => user.hobbies, {
    nullable: true,
    onDelete: 'SET NULL',
  })
  users: UserEntity[];

  @Column()
  name: string;

  @Column({ enum: HOBBY_TYPE })
  type: HOBBY_TYPE;

  @Column({ nullable: true })
  description?: string;

  @Column({ nullable: true })
  interestFact?: string;

  @Column({ nullable: true })
  neededThing?: string;

  @ManyToOne(() => UserEntity, user => user.createdHobbies, { nullable: false })
  creator: UserEntity; // Зв'язок із користувачем

  @Column('uuid')
  creatorId: string; // Поле для зберігання UUID користувача
}
