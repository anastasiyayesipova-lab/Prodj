# Лабораторна робота №4

## Запуск

### Backend
```bash
cd backend
npm install
npm run dev

## Приклади запитів для перевірки API
- GET http://localhost:3000/api/v1/passes (Отримати всі пропуски)
- POST http://localhost:3000/api/v1/passes (Створити: {"userId": 1, "reasonId": 1, ...})
- DELETE http://localhost:3000/api/v1/passes/1 (Видалити пропуск з ID 1)