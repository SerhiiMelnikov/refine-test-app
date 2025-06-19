import { EEntities } from 'src/shared-components/enums/entities.enum';
import { Column, Entity, PrimaryGeneratedColumn, VirtualColumn } from 'typeorm';
import { EUserRole } from '../enums/user-role.enum';

@Entity(EEntities.USERS)
export class UserEntity {
  @PrimaryGeneratedColumn('uuid')
  public id: string;

  @Column({
    type: 'enum',
    enum: EUserRole,
    enumName: 'user_role_enum',
    nullable: false,
  })
  public role: EUserRole;

  @Column({ type: 'varchar', nullable: false, unique: true })
  public email: string;

  @Column({
    type: 'varchar',
    nullable: true,
    unique: true,
    default: null,
  })
  public phone: string;

  @Column({ type: 'varchar', default: null, nullable: true })
  public firstName: string;

  @Column({ type: 'varchar', default: null, nullable: true })
  public lastName: string;

  @VirtualColumn({
    type: 'varchar',
    query: (aliasOrig: string) => {
      const alias = aliasOrig[0] === '"' ? aliasOrig : `"${aliasOrig}"`;
      return `${alias}."firstName" || ' ' || ${alias}."lastName"`;
    },
  })
  public fullName: string;

  @Column({ type: 'varchar', default: null, nullable: true })
  public password: string;
}
