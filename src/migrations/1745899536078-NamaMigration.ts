import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateUserAndOrderTables implements MigrationInterface {
    name = 'CreateUserAndOrderTables'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE TABLE "user" (
                "id" SERIAL PRIMARY KEY,
                "username" VARCHAR(255) NOT NULL UNIQUE,
                "email" VARCHAR(255) NOT NULL UNIQUE,
                "password" VARCHAR(255) NOT NULL,
                "role" VARCHAR(20) NOT NULL,
                "skills" TEXT[],
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
                "farmerId" INTEGER,
                "laborerId" INTEGER,
                "created_at" TIMESTAMP DEFAULT now(),
                "updated_at" TIMESTAMP DEFAULT now(),
                CONSTRAINT "FK_order_farmerId" FOREIGN KEY ("farmerId") REFERENCES "user" ("id") ON DELETE SET NULL,
                CONSTRAINT "FK_order_laborerId" FOREIGN KEY ("laborerId") REFERENCES "user" ("id") ON DELETE SET NULL
            )
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "order"`);
        await queryRunner.query(`DROP TABLE "user"`);
    }
}
