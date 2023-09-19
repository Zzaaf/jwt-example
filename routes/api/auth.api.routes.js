require('dotenv').config();
const router = require('express').Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { User } = require('../../db/models');
const cookiesConfig = require('../../config/cookiesConfig');
const { generateAccessToken } = require('../../helpers/authHelpers');

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

      // Создаем JWT c секретным ключом (генерация цифровой подписи)
      // const token = jwt.sign({ user: userInDb.name, email }, process.env.SECRET_KEY, { expiresIn: '1m', algorithm: 'HS256' });
      const token = generateAccessToken(userInDb);

      // Возвращаем токен в cookie при ответе
      res.cookie(cookiesConfig.cookieName, token, cookiesConfig).json({ login: true, url: '/dashboard' });
    } else {
      return res.status(400).json({ message: 'All fields were not sent' });
    }
  } catch (error) {
    // Обрабатываем возможные ошибки
    res.status(500).json({ message: 'Authentication Error' });
  }
});

router.get('/auth/logout', async (req, res) => {
  try {
    const { uid } = req.cookies;

    if (uid) {
      res.locals.user = {};
      res.clearCookie(cookiesConfig.cookieName).redirect('/');
    }
  } catch (error) {
    console.log(error.message);
  }
});

module.exports = router;
