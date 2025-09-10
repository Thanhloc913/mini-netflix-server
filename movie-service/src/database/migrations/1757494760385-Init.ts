import { MigrationInterface, QueryRunner } from "typeorm";

export class Init1757494760385 implements MigrationInterface {
    name = 'Init1757494760385'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "episodes" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "seasonNumber" integer NOT NULL, "episodeNumber" integer NOT NULL, "title" character varying(255) NOT NULL, "videoUrl" character varying, "duration" integer, "movieId" uuid, CONSTRAINT "PK_6a003fda8b0473fffc39cb831c7" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "genres" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, CONSTRAINT "UQ_f105f8230a83b86a346427de94d" UNIQUE ("name"), CONSTRAINT "PK_80ecd718f0f00dde5d77a9be842" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "casts" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "role" character varying NOT NULL, CONSTRAINT "PK_a7f4a967c0ef1bed2585ff061b7" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "movies" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "title" character varying(255) NOT NULL, "description" text NOT NULL, "releaseDate" date, "duration" integer, "isSeries" boolean NOT NULL DEFAULT false, "posterUrl" character varying, "trailerUrl" character varying, "rating" numeric(2,1) NOT NULL DEFAULT '0', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_c5b2c134e871bfd1c2fe7cc3705" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "movie_genres" ("moviesId" uuid NOT NULL, "genresId" uuid NOT NULL, CONSTRAINT "PK_95881fc90bc59c23cc1e0a595af" PRIMARY KEY ("moviesId", "genresId"))`);
        await queryRunner.query(`CREATE INDEX "IDX_6414c430d7ed6fd0821e56964b" ON "movie_genres" ("moviesId") `);
        await queryRunner.query(`CREATE INDEX "IDX_13017cf7e6e979595b6032388c" ON "movie_genres" ("genresId") `);
        await queryRunner.query(`CREATE TABLE "movie_casts" ("moviesId" uuid NOT NULL, "castsId" uuid NOT NULL, CONSTRAINT "PK_203ef43c723ee2c9008964fe781" PRIMARY KEY ("moviesId", "castsId"))`);
        await queryRunner.query(`CREATE INDEX "IDX_cc5941c1ae7cbd24079de100c5" ON "movie_casts" ("moviesId") `);
        await queryRunner.query(`CREATE INDEX "IDX_8ce153f768dd51a453d1d5416e" ON "movie_casts" ("castsId") `);
        await queryRunner.query(`ALTER TABLE "episodes" ADD CONSTRAINT "FK_2fa02881032f28e7f1e30029fca" FOREIGN KEY ("movieId") REFERENCES "movies"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "movie_genres" ADD CONSTRAINT "FK_6414c430d7ed6fd0821e56964ba" FOREIGN KEY ("moviesId") REFERENCES "movies"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "movie_genres" ADD CONSTRAINT "FK_13017cf7e6e979595b6032388cd" FOREIGN KEY ("genresId") REFERENCES "genres"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "movie_casts" ADD CONSTRAINT "FK_cc5941c1ae7cbd24079de100c50" FOREIGN KEY ("moviesId") REFERENCES "movies"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "movie_casts" ADD CONSTRAINT "FK_8ce153f768dd51a453d1d5416e8" FOREIGN KEY ("castsId") REFERENCES "casts"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "movie_casts" DROP CONSTRAINT "FK_8ce153f768dd51a453d1d5416e8"`);
        await queryRunner.query(`ALTER TABLE "movie_casts" DROP CONSTRAINT "FK_cc5941c1ae7cbd24079de100c50"`);
        await queryRunner.query(`ALTER TABLE "movie_genres" DROP CONSTRAINT "FK_13017cf7e6e979595b6032388cd"`);
        await queryRunner.query(`ALTER TABLE "movie_genres" DROP CONSTRAINT "FK_6414c430d7ed6fd0821e56964ba"`);
        await queryRunner.query(`ALTER TABLE "episodes" DROP CONSTRAINT "FK_2fa02881032f28e7f1e30029fca"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_8ce153f768dd51a453d1d5416e"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_cc5941c1ae7cbd24079de100c5"`);
        await queryRunner.query(`DROP TABLE "movie_casts"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_13017cf7e6e979595b6032388c"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_6414c430d7ed6fd0821e56964b"`);
        await queryRunner.query(`DROP TABLE "movie_genres"`);
        await queryRunner.query(`DROP TABLE "movies"`);
        await queryRunner.query(`DROP TABLE "casts"`);
        await queryRunner.query(`DROP TABLE "genres"`);
        await queryRunner.query(`DROP TABLE "episodes"`);
    }

}
