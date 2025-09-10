import { MigrationInterface, QueryRunner } from "typeorm";

export class Init1757500338302 implements MigrationInterface {
    name = 'Init1757500338302'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "movies" ADD "videoUrl" character varying`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "movies" DROP COLUMN "videoUrl"`);
    }

}
