import { MigrationInterface, QueryRunner } from "typeorm";

export class Init1757572102327 implements MigrationInterface {
    name = 'Init1757572102327'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "video_assets" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "resolution" character varying NOT NULL, "format" character varying NOT NULL, "url" character varying NOT NULL, "status" character varying NOT NULL DEFAULT 'pending', "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "movieId" uuid, "episodeId" uuid, CONSTRAINT "PK_a7a9d01defe232a5f5180004a03" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "episodes" DROP COLUMN "videoUrl"`);
        await queryRunner.query(`ALTER TABLE "movies" DROP COLUMN "videoUrl"`);
        await queryRunner.query(`ALTER TABLE "video_assets" ADD CONSTRAINT "FK_737c9aefaa971fc1875395daee6" FOREIGN KEY ("movieId") REFERENCES "movies"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "video_assets" ADD CONSTRAINT "FK_f4e5a42f480d10dbf9261b0195b" FOREIGN KEY ("episodeId") REFERENCES "episodes"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "video_assets" DROP CONSTRAINT "FK_f4e5a42f480d10dbf9261b0195b"`);
        await queryRunner.query(`ALTER TABLE "video_assets" DROP CONSTRAINT "FK_737c9aefaa971fc1875395daee6"`);
        await queryRunner.query(`ALTER TABLE "movies" ADD "videoUrl" character varying`);
        await queryRunner.query(`ALTER TABLE "episodes" ADD "videoUrl" character varying`);
        await queryRunner.query(`DROP TABLE "video_assets"`);
    }

}
