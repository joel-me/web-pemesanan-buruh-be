import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, OneToMany } from "typeorm"
import { Order } from "../../orders/entities/order.entity"

export enum UserType {
  FARMER = "farmer",
  LABORER = "laborer",
}

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number

  @Column({ unique: true })
  username: string

  @Column()
  password: string

  @Column()
  email: string

  @Column({
    type: "enum",
    enum: UserType,
  })
  userType: UserType

  @Column({ type: "simple-array", nullable: true })
  skills: string[]

  @OneToMany(
    () => Order,
    (order) => order.farmer,
  )
  farmerOrders: Order[]

  @OneToMany(
    () => Order,
    (order) => order.laborer,
  )
  laborerOrders: Order[]

  @CreateDateColumn()
  createdAt: Date

  @UpdateDateColumn()
  updatedAt: Date
}
