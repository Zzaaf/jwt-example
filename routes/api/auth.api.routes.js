require('dotenv').config();
const router = require('express').Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { User } = require('../../db/models');
const cookiesConfig = require('../../config/cookiesConfig');

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
      const { dataValues: userInDb } = await User.findOne({ where: { email } });

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
      const token = jwt.sign({ user: userInDb.name, email }, `${process.env.SECRET_KEY}`, { expiresIn: '1d', algorithm: 'HS256' });

      // Возвращаем токен в cookie при ответе
      res.cookie('uid', token, cookiesConfig).json({ token });
    } else {
      return res.status(400).json({ message: 'All fields were not sent' });
    }
  } catch (error) {
    console.log(error.message);
    // Обрабатываем возможные ошибки
    res.status(500).json({ message: 'Authentication Error' });
  }
});

module.exports = router;
