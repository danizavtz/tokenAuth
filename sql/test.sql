--removing colateral effects for test running
CREATE TABLE IF NOT EXISTS employee(
	employee_id SERIAL PRIMARY KEY ,
	login VARCHAR(20) NOT NULL,
	password BYTEA
);
INSERT INTO employee(employee_id,login, password) VALUES (10,'admin', '\x736372797074000b00000008000000017712a8c320fd8b8fb89f8f56333393847dc63b5a03780aa5226d2f8aa6fd45bf9327bebe248e12c49c4e153d05fd48affc7c06e277cdcfb3cba5a80404d9a1baf8e0a12b1cf1ab384ae462474aa8a240');
DELETE FROM employee;