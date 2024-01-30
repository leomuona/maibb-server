/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
	const query = `CREATE TABLE \`users\` (
		\`id\` VARCHAR(36) NOT NULL,
		\`name\` VARCHAR(255) NOT NULL,
		\`username\` VARCHAR(100) NOT NULL,
		\`password\` VARCHAR(255) NOT NULL,
		\`active\` BOOLEAN NOT NULL DEFAULT true,
		PRIMARY KEY (\`id\`)
	);`

  return knex.schema.raw(query)
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  return knex.schema.dropTable("users");
};
