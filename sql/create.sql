CREATE TABLE employee(
	employee_id SERIAL PRIMARY KEY ,
	login VARCHAR(20) UNIQUE NOT NULL,
	password BYTEA
);