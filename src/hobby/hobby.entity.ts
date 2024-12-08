import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Hobby {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  type: string;

  @Column()
  description: string;

  @Column()
  interestFact: string;

  @Column()
  neededThing: string;
}
