PRAGMA foreign_keys = ON;

INSERT INTO users (displayName, email, role) VALUES
  ('Іван Петренко', 'ivan.petrenko@example.com', 'student'),
  ('Марія Коваль', 'maria.koval@example.com', 'student'),
  ('Олег Бондар', 'oleh.bondar@example.com', 'teacher'),
  ('Адміністратор Лабораторії', 'lab.admin@example.com', 'admin');

INSERT INTO passReasons (name) VALUES
  ('Навчальне заняття'),
  ('Олімпіада'),
  ('Проєктна робота'),
  ('Консультація');

INSERT INTO passStatuses (name) VALUES
  ('Новий'),
  ('Погоджено'),
  ('Відхилено'),
  ('Використано'),
  ('Скасовано');

INSERT INTO passes (userId, reasonId, statusId, validDate, comment, issuer, createdAt, deletedAt) VALUES
  (1, 1, 2, '2026-04-10', 'Доступ на лабораторне заняття.', 'Адміністратор Лабораторії', '2026-04-07T10:00:00.000Z', NULL),
  (2, 3, 1, '2026-04-12', 'Потрібен доступ для роботи над проєктом.', 'Олег Бондар', '2026-04-07T10:10:00.000Z', NULL),
  (3, 4, 2, '2026-04-15', 'Консультація для студентів.', 'Адміністратор Лабораторії', '2026-04-07T10:20:00.000Z', NULL);

INSERT INTO passHistory (passId, action, createdAt) VALUES
  (1, 'CREATED', '2026-04-07T10:00:00.000Z'),
  (1, 'STATUS_CHANGED_TO_APPROVED', '2026-04-07T10:05:00.000Z'),
  (2, 'CREATED', '2026-04-07T10:10:00.000Z'),
  (3, 'CREATED', '2026-04-07T10:20:00.000Z'),
  (3, 'STATUS_CHANGED_TO_APPROVED', '2026-04-07T10:25:00.000Z');