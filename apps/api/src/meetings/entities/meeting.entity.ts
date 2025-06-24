import { EEntities } from 'src/shared-components/enums/entities.enum';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { EMeetingPriority } from '../enums/meeting-priority.enum';
import { UserEntity } from 'src/users/entities/user.entity';

@Entity(EEntities.MEETINGS)
export class MeetingEntity {
  @PrimaryGeneratedColumn('uuid')
  public id: string;

  @Column({ type: 'varchar', nullable: false })
  public title: string;

  @Column({ type: 'timestamp', nullable: true, default: null })
  public date: Date;

  @Column({
    type: 'enum',
    enum: EMeetingPriority,
    enumName: 'meetings_priority_enum',
    nullable: true,
    default: EMeetingPriority.PENDING,
  })
  public priority: EMeetingPriority;

  @Column({ type: 'varchar', nullable: true, default: null })
  public description: string;

  @Column({ type: 'uuid', nullable: false })
  public createdById: string;

  @ManyToOne(() => UserEntity, { nullable: false })
  @JoinColumn({ name: 'createdById' })
  public createdBy: Partial<UserEntity>;

  @Column('uuid', { array: true, nullable: true, default: () => "'{}'" })
  public invitedUserIds: string[];

  public invitedUsers?: Partial<UserEntity>[];
}
