//npx typeorm migration:create -n TaskRefraction - create migration
//npx typeorm migration:run
//npx typeorm migration:revert
import { MigrationInterface, QueryRunner, TableColumn } from "typeorm";

export class TaskRefraction1692956116239 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.addColumn("user", new TableColumn({
            name: "age",
            type: "varchar",
            isNullable: false,
            default: 0, 
        }));
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropColumn("user", "age");
    }

}
