CREATE TABLE Projetos (
proj_id INT PRIMARY KEY auto_increment,
proj_nome VARCHAR(100),
proj_desc TEXT,
proj_link VARCHAR(100));

CREATE TABLE Tecnologias (
tec_id INT PRIMARY KEY auto_increment,
tec_nome VARCHAR(100));

CREATE TABLE ProjetoTecnologias (
proj_id INT,
tec_id INT,
PRIMARY KEY (proj_id, tec_id),
FOREIGN KEY (proj_id) REFERENCES Projetos(proj_id),
FOREIGN KEY (tec_id) REFERENCES Tecnologias(tec_id));

INSERT INTO Projetos (proj_nome, proj_desc, proj_link) VALUES ('Desempenho de Vereadores', 'Desenvolvimento de uma página web responsiva com visualizações gráficas para representar a atuação geral da câmara.', 'https://github.com/Draco-Imperium/API_FATEC1');
INSERT INTO Projetos (proj_nome, proj_desc, proj_link) VALUES ('Dashboard de Indicadores', 'Desenvolvimento de um dashboard de indicadores para monitorar e visualizar o impacto da plataforma, fornecendo dados estratégicos para patrocinadores e stakeholders.', 'https://github.com/GeneSys-fatec/API-2DSM');
INSERT INTO Projetos (proj_nome, proj_desc, proj_link) VALUES ('Portfólio Pessoal', 'Desenvolvimento de um portfólio pessoal que reúne projetos e experiências.', 'https://github.com/anajgaspar/personal-portfolio');

INSERT INTO Tecnologias (tec_nome) VALUES 
('HTML5'),
('CSS3'),
('JavaScript'),
('TypeScript'),
('React'),
('Sass'),
('TailwindCSS'),
('NodeJS'),
('Express'),
('EJS'),
('Flask'),
('MySQL');

INSERT INTO ProjetoTecnologias (proj_id, tec_id) VALUES
(1, 1),
(1, 2),
(1, 3),
(1, 11),
(1, 12),
(2, 1),
(2, 2),
(2, 3),
(2, 4),
(2, 5),
(2, 6),
(2, 8),
(3, 1),
(3, 2),
(3, 4),
(3, 5),
(3, 7);


SELECT * FROM Projetos;
SELECT * FROM Tecnologias;
SELECT * FROM ProjetoTecnologias;

SELECT p.proj_nome, p.proj_desc, p.proj_link, t.tec_nome
FROM Projetos p
JOIN ProjetoTecnologias pt ON p.proj_id = pt.proj_id
JOIN Tecnologias t ON pt.tec_id = t.tec_id;