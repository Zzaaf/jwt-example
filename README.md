# Применение JWT в авторизации

## Необходимые пакеты и модули

- `bcrypt`: хэширование и сравнивание паролей
- `cookie-parser`: работа с куками на стороне сервера
- `dotenv`: работа с переменными окружения из файла .env
- `jsonwebtoken`: формирование JWT

## Алгоритм работы

1. Пользователь c помощью почты и пароля успешно проходит аутентификацию
2. После успешной аутентификации сервер подписывает два токена: `refresh` и `access` (полезной нагрузкой будет имя пользователя из БД), после отправляет их в виде `http-only cookie` с разным временем срока годности (в моём примере 5 минут и 12 часов),
3. Все последующие запросы от клиента сервер проверяет на наличие куки с `access` токеном через `middleware`, если он есть, наполняем `res.locals.user` полезной нагрузкой из токена и отдаём ответ как аутентифицированному пользователю
4. Если `access` токен истёк, `middleware` это фиксирует и делает редирект на обработчик, который проверяет наличие `refresh` токена из куки
5. Если `refresh` токен валиден, формируется новая пара токенов (полезной нагрузкой будет `res.locals.user`) и новая пара кук
6. При запросе на `/logout` очищаем обе куки с `refresh` и `access` токенами
7. На каждый токен используется своё секретное слово и которое хранится в `.env`