import { MigrationInterface, QueryRunner } from "typeorm";

export class AddUserTable1750334153694 implements MigrationInterface {
    name = 'AddUserTable1750334153694'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."user_role_enum" AS ENUM('admin', 'user')`);
        await queryRunner.query(`CREATE TABLE "users" (
            "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
            "role" "public"."user_role_enum" NOT NULL, 
            "email" character varying NOT NULL, 
            "phone" character varying, 
            "firstName" character varying, 
            "lastName" character varying, "password" character varying,
            CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE ("email"), 
            CONSTRAINT "UQ_a000cca60bcf04454e727699490" UNIQUE ("phone"), 
            CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "users"`);
        await queryRunner.query(`DROP TYPE "public"."user_role_enum"`);
    }

}
