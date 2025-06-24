import { MigrationInterface, QueryRunner } from "typeorm";

export class AddMeetingsTable1750748368274 implements MigrationInterface {
    name = 'AddMeetingsTable1750748368274'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."meetings_priority_enum" 
            AS ENUM('pending', 'low', 'medium', 'high', 'very-high')`
        );
        await queryRunner.query(`CREATE TABLE "meetings" (
            "id" uuid NOT NULL DEFAULT uuid_generate_v4(), 
            "title" character varying NOT NULL, 
            "date" TIMESTAMP, 
            "priority" "public"."meetings_priority_enum" DEFAULT 'pending', 
            "description" character varying, 
            "createdById" uuid NOT NULL, 
            "invitedUserIds" uuid array DEFAULT '{}', 
            CONSTRAINT "PK_aa73be861afa77eb4ed31f3ed57" PRIMARY KEY ("id"))`
        );
        await queryRunner.query(`ALTER TABLE "meetings" 
            ADD CONSTRAINT "FK_72dde91307ae781a66625c087e4" FOREIGN KEY ("createdById")
            REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "meetings" DROP CONSTRAINT "FK_72dde91307ae781a66625c087e4"`);
        await queryRunner.query(`DROP TABLE "meetings"`);
        await queryRunner.query(`DROP TYPE "public"."meetings_priority_enum"`);
    }

}
