import { Entity, PrimaryGeneratedColumn, Column, Index, CreateDateColumn, UpdateDateColumn } from 'typeorm';


export type MealType = 'breakfast' | 'lunch';


@Entity('menu_items')
@Index(['mealType', 'date', 'itemName'], { unique: true })
export class MenuItem {
@PrimaryGeneratedColumn()
id!: number;


@Column({ type: 'varchar' })
mealType!: MealType; 


@Column({ type: 'date' })
date!: string; 


@Column({ type: 'text' })
itemName!: string; 


@Column({ type: 'varchar', nullable: true })
sourceUrl?: string | null; 


@CreateDateColumn({ type: 'datetime' })
createdAt!: Date;


@UpdateDateColumn({ type: 'datetime' })
updatedAt!: Date;
}