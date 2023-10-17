require('dotenv').config();
const router = require('express').Router();
const bcrypt = require('bcrypt');
const { User } = require('../../db/models');
const cookiesConfig = require('../../config/cookiesConfig');
const { generateTokens } = require('../../utils/authUtils');

router.post('/auth/register', async (req, res) => {
  try {
    // Получаем данные пользователя из запроса
    const { name, email, password } = req.body;

    if (name && email && password) {
      const userInDb = await User.findOne({ where: { email } });

      if (!userInDb) {
        // Хэшируем пароль
        const hashedPassword = await bcrypt.hash(password, 10);

        // Сохраняем пользователя в базу данных
        await User.create({ name, email, password: hashedPassword });

        // Возвращаем успешный ответ
        return res.status(201).json({ registration: true, url: '/auth', message: 'User successfully registered' });
      }

      // Возвращаем ответ в случае вторичного использования почты
      return res.status(400).json({ registration: false, url: '/auth', message: 'This email is already in use' });
    }
  } catch (error) {
    // Обрабатываем возможные ошибки
    res.status(500).json({ message: 'Registration failed' });
  }
});

router.post('/auth/login', async (req, res) => {
  try {
    // Получаем данные пользователя из запроса
    const { email, password } = req.body;

    if (email && password) {
      // Ищем пользователя в базе данных по имени пользователя
      const userInDb = await User.findOne({ where: { email }, raw: true });

      // Если пользователь не найден, вернуть ошибку
      if (!userInDb) {
        return res.status(404).json({ message: 'User is not found' });
      }

      // Проверяем правильность пароля
      const passwordMatch = await bcrypt.compare(password, userInDb.password);

      // Если пароль не совпадает, вернуть ошибку
      if (!passwordMatch) {
        return res.status(401).json({ message: 'Incorrect password' });
      }

      const { accessToken, refreshToken } = generateTokens(userInDb.name);

      // Возвращаем токены в httpOnly cookie при ответе
      res
        .cookie(cookiesConfig.refresh, refreshToken, { maxAge: cookiesConfig.maxAgeRefresh, httpOnly: true })
        .cookie(cookiesConfig.access, accessToken, { maxAge: cookiesConfig.maxAgeAccess, httpOnly: true })
        .json({ login: true, url: '/dashboard' });
    } else {
      return res.status(400).json({ message: 'All fields were not sent' });
    }
  } catch (error) {
    // Обрабатываем возможные ошибки
    res.status(500).json({ message: 'Authentication Error', error: error.message });
  }
});

router.get('/auth/logout', async (req, res) => {
  try {
    const { access } = req.cookies;

    if (access) {
      res.locals.user = {};
      res
        .clearCookie(cookiesConfig.refresh)
        .clearCookie(cookiesConfig.access)
        .redirect('/');
    }
  } catch (error) {
    console.log(error.message);
  }
});

module.exports = router;
