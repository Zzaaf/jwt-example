const router = require('express').Router();
const bcrypt = require('bcrypt');
const { User } = require('../../db/models');

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

    // Ищем пользователя в базе данных по имени пользователя

    // Если пользователь не найден, вернуть ошибку
    if (!user) {
      return res.status(404).json({ message: 'Пользователь не найден' });
    }

    // Проверяем правильность пароля
    const passwordMatch = await bcrypt.compare(password, user.password);

    // Если пароль не совпадает, вернуть ошибку
    if (!passwordMatch) {
      return res.status(401).json({ message: 'Неверный пароль' });
    }

    // Создаем JWT секретным ключом
    const token = jwt.sign({ username: user.username }, secretKey, { expiresIn: '1d' });

    // Возвращаем токен в ответе
    res.status(200).json({ token });
  } catch (error) {
    // Обрабатываем возможные ошибки
    res.status(500).json({ message: 'Ошибка аутентификации' });
  }
});

module.exports = router;
