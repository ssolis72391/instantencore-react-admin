import { Remove } from "api-shared";
import * as mysql2 from "mysql2";
import { Model, Sequelize, Transaction } from "sequelize";
import { ofType, truthy, validate } from "../core";

const sequelize = new Sequelize({
  username: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  dialect: "mysql",
  dialectModule: mysql2,
  port: +process.env.DB_PORT,
  password: process.env.DB_PASSWORD,
  dialectOptions: {
    ssl: process.env.DB_SSL,
    dateStrings: false,
    timezone: "Z",
  },
});

type SequelizeModelDefaultProps = keyof Model;
export type RemoveSequelizeModelProps<
  M extends Model,
  AdditionalKeys extends keyof Remove<M, Keys> = never,
  Keys extends SequelizeModelDefaultProps = SequelizeModelDefaultProps
> = Remove<M, Keys | AdditionalKeys>;

export type SequelizeModelAttributes<M extends Model> = M["_attributes"];

/**
 * @deprecated
 */
export async function runAsTransaction<T1, T2>(
  transactionFactory: () => Promise<Transaction>,
  actions: [
    (transaction: Transaction) => Promise<T1>,
    (transaction: Transaction) => Promise<T2>
  ]
) {
  validate("transactionFactory", "argument", transactionFactory, [
    truthy(),
    ofType("function"),
  ]);
  validate("actions", "argument", actions, [truthy(), ofType("object")]);

  const transaction = await transactionFactory();
  const results: any[] = [];
  try {
    actions.forEach(async (item) => {
      const result = await item(transaction);
      results.push(result);
    });
    transaction.commit();
  } catch (error) {
    transaction.rollback();
    throw error;
  }
  return results as [T1, T2];
}

export { sequelize, Model };
/**
 * @deprecated use named export
 */
export default sequelize;
