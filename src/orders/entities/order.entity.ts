import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { User } from '../../users/entities/user.entity';

export enum OrderStatus {
  PENDING = 'PENDING',
  ACCEPTED = 'ACCEPTED',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
}

@Entity()
export class Order {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  farmerId: number;

  @Column()
  laborerId: number;

  @Column({
    type: 'enum',
    enum: OrderStatus,
    default: OrderStatus.PENDING,
  })
  status: OrderStatus;

  @Column()
  description: string;

  @Column({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
  })
  createdDate: Date;

  @Column({
    type: 'timestamp',
    nullable: true,
  })
  dueDate: Date | null;

  @ManyToOne(() => User, { nullable: false })
  @JoinColumn({ name: 'farmerId' })
  farmer: User;

  @ManyToOne(() => User, { nullable: false })
  @JoinColumn({ name: 'laborerId' })
  laborer: User;
}
