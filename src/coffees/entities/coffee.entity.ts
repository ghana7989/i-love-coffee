import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Flavor } from './flavor.entity';

@Entity()
export class Coffee {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  brand: string;

  @JoinTable()
  @ManyToMany((type) => Flavor, (flavor) => flavor.coffees, {
    // when user adds a new flavor that doesn't exist in flavors table,
    // it will create a new flavor and add it to the table
    cascade: true,
  })
  flavors: Flavor[];

  @Column({
    default: 0,
  })
  recommendations: number;
}
