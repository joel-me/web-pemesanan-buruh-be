import { MigrationInterface, QueryRunner } from "typeorm";

export class NamaMigration1745899536078 implements MigrationInterface {
    name = 'NamaMigration1745899536078'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE TABLE "user" (
                "id" SERIAL PRIMARY KEY,
                "username" VARCHAR(255) NOT NULL UNIQUE,
                "password" VARCHAR(255) NOT NULL,
                "role" VARCHAR(20) NOT NULL, -- buruh atau petani
                "skills" TEXT[], -- array untuk daftar keahlian buruh, kalau petani bisa kosong
                "created_at" TIMESTAMP DEFAULT now(),
                "updated_at" TIMESTAMP DEFAULT now()
            )
        `);

        await queryRunner.query(`
            CREATE TABLE "order" (
                "id" SERIAL PRIMARY KEY,
                "description" TEXT NOT NULL,
                "price" INTEGER NOT NULL,
                "status" VARCHAR(20) DEFAULT 'pending',
                "farmer_id" INTEGER,
                "labor_id" INTEGER,
                "created_at" TIMESTAMP DEFAULT now(),
                "updated_at" TIMESTAMP DEFAULT now(),
                CONSTRAINT "FK_farmer" FOREIGN KEY ("farmer_id") REFERENCES "user" ("id") ON DELETE SET NULL,
                CONSTRAINT "FK_labor" FOREIGN KEY ("labor_id") REFERENCES "user" ("id") ON DELETE SET NULL
            )
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "order"`);
        await queryRunner.query(`DROP TABLE "user"`);
    }
}
