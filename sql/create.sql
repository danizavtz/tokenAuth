CREATE TABLE employee(
	employee_id SERIAL PRIMARY KEY ,
	login VARCHAR(20) NOT NULL,
	password BYTEA
);