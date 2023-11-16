# Применение JWT в авторизации

## Необходимые пакеты и модули

- `bcrypt`: хэширование и сравнивание паролей
- `cookie-parser`: работа с куками на стороне сервера
- `dotenv`: работа с переменными окружения из файла .env
- `jsonwebtoken`: формирование JWT

## Алгоритм работы

1. Пользователь c помощью почты и пароля успешно проходит аутентификацию
2. После успешной аутентификации сервер подписывает два токена: `refresh` и `access` (полезной нагрузкой будут объект с необходимыми полями из БД), после отправляет их в виде `http-only cookie` с разным временем срока годности (в моём примере 5 минут и 12 часов),
3. Все последующие запросы от клиента сервер проверяет на наличие куки с `access` токеном через `middleware`, если он есть, наполняем `res.locals.user` полезной нагрузкой из токена и отдаём ответ как аутентифицированному пользователю
4. Если `access` токен истёк, `middleware` это фиксирует и делает проверку наличия `refresh` токена из куки
5. Если `refresh` токен валиден, подписывается новая пара токенов (полезной нагрузкой будет `res.locals.user`) и новая пара кук
6. При запросе на `/logout` очищаем обе куки с `refresh` и `access` токенами
7. На каждый токен используется своё секретное слово и которое хранится в `.env`

## Используемые middleware

Проверка авторизации `auth.js`:
```js
const ifAuthRedirect = (url) => (req, res, next) => {
  if (res.locals.user) {
    res.redirect(url);
  } else {
    next();
  }
};

module.exports = ifAuthRedirect;
```

Проверка токена доступа (`access token`) `verifyTokens.js`:

```js
function verifyAccessToken(req, res, next) {
  try {
    const { access } = req.cookies;
    const { user } = jwt.verify(access, process.env.ACCESS_TOKEN_SECRET);

    res.locals.user = user;
    next();
  } catch (error) {
    verifyRefreshToken(req, res, next);
  }
}
```

Проверка токена обновления (`refresh token`) `verifyTokens.js`:

```js
function verifyRefreshToken(req, res, next) {
  try {
    const { refresh } = req.cookies;
    const { user } = jwt.verify(refresh, process.env.REFRESH_TOKEN_SECRET);
    const { accessToken, refreshToken } = generateTokens({ user: { id: user.id, email: user.email, name: user.name } });

    res.locals.user = user;

    // Возвращаем пару токенов в http-only cookie при ответе
    res
      .cookie(cookiesConfig.refresh, refreshToken, { maxAge: cookiesConfig.maxAgeRefresh, httpOnly: true })
      .cookie(cookiesConfig.access, accessToken, { maxAge: cookiesConfig.maxAgeAccess, httpOnly: true });

    next();
  } catch (error) {
    res
      .clearCookie(cookiesConfig.access)
      .clearCookie(cookiesConfig.refresh);

    next();
  }
}
```

## Формирование токенов

Подписание токенов `utils/authUtils.js`:

```js
require('dotenv').config();
const jwt = require('jsonwebtoken');
const jwtConfig = require('../config/jwtConfig');

const generateTokens = (payload) => ({
  accessToken: jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, { expiresIn: jwtConfig.access.expiresIn }),
  refreshToken: jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET, { expiresIn: jwtConfig.refresh.expiresIn }),
});

module.exports = { generateTokens };
```

# Конфигурацию кук и токенов

Конфигурация токенов `config/jwtConfig.js`:

```js
const jwtConfig = {
  access: {
    type: 'access',
    expiresIn: `${1000 * 60 * 5}`,
  },
  refresh: {
    type: 'refresh',
    expiresIn: `${1000 * 60 * 60 * 12}`,
  },
};

module.exports = jwtConfig;
```

Конфигурация кук `config/cookiesConfig.js`:

```js
const jwtConfig = require('./jwtConfig');

const cookiesConfig = {
  refresh: 'refresh',
  access: 'access',
  httpOnly: true,
  maxAgeRefresh: jwtConfig.refresh.expiresIn,
  maxAgeAccess: jwtConfig.access.expiresIn,
};

module.exports = cookiesConfig;
```