import { MigrationInterface, QueryRunner } from "typeorm";

export class Init1757496085274 implements MigrationInterface {
    name = 'Init1757496085274'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "movies" DROP COLUMN "createdAt"`);
        await queryRunner.query(`ALTER TABLE "movies" DROP COLUMN "updatedAt"`);
        await queryRunner.query(`ALTER TABLE "episodes" ADD "created_at" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "episodes" ADD "updated_at" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "episodes" ADD "deleted_at" TIMESTAMP`);
        await queryRunner.query(`ALTER TABLE "genres" ADD "created_at" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "genres" ADD "updated_at" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "genres" ADD "deleted_at" TIMESTAMP`);
        await queryRunner.query(`ALTER TABLE "casts" ADD "created_at" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "casts" ADD "updated_at" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "casts" ADD "deleted_at" TIMESTAMP`);
        await queryRunner.query(`ALTER TABLE "movies" ADD "created_at" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "movies" ADD "updated_at" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "movies" ADD "deleted_at" TIMESTAMP`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "movies" DROP COLUMN "deleted_at"`);
        await queryRunner.query(`ALTER TABLE "movies" DROP COLUMN "updated_at"`);
        await queryRunner.query(`ALTER TABLE "movies" DROP COLUMN "created_at"`);
        await queryRunner.query(`ALTER TABLE "casts" DROP COLUMN "deleted_at"`);
        await queryRunner.query(`ALTER TABLE "casts" DROP COLUMN "updated_at"`);
        await queryRunner.query(`ALTER TABLE "casts" DROP COLUMN "created_at"`);
        await queryRunner.query(`ALTER TABLE "genres" DROP COLUMN "deleted_at"`);
        await queryRunner.query(`ALTER TABLE "genres" DROP COLUMN "updated_at"`);
        await queryRunner.query(`ALTER TABLE "genres" DROP COLUMN "created_at"`);
        await queryRunner.query(`ALTER TABLE "episodes" DROP COLUMN "deleted_at"`);
        await queryRunner.query(`ALTER TABLE "episodes" DROP COLUMN "updated_at"`);
        await queryRunner.query(`ALTER TABLE "episodes" DROP COLUMN "created_at"`);
        await queryRunner.query(`ALTER TABLE "movies" ADD "updatedAt" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "movies" ADD "createdAt" TIMESTAMP NOT NULL DEFAULT now()`);
    }

}
