import { Column, CreateDateColumn, DeleteDateColumn, Entity, PrimaryColumn, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Exclude } from 'class-transformer';
import { AccountRole } from './account-role.enum'

@Entity()
export class Account {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    email: string;

    @Exclude()
    @Column()
    password_hash: string;

    @Column({
        type: 'enum',
        enum: AccountRole,
        default: AccountRole.USER,
    })
    role: AccountRole;

    @CreateDateColumn({ type: 'timestamptz' })
    createdAt: Date;

    @UpdateDateColumn({ type: 'timestamptz' })
    updatedAt: Date | null;

    @DeleteDateColumn({ type: 'timestamptz' })
    deletedAt?: Date | null;
}