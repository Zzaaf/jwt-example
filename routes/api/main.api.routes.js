const router = require('express').Router();
const bcrypt = require('bcrypt');
const { User } = require('../../db/models');

router.post('/register', async (req, res) => {
  try {
    // Получаем данные пользователя из запроса
    const { email, password } = req.body;

    // Хэшируем пароль
    const hashedPassword = await bcrypt.hash(password, 10);

    // Сохраняем пользователя в базу данных
    await User.create({ email, password: hashedPassword });

    // Возвращаем успешный ответ
    res.status(200).json({ message: 'Пользователь успешно зарегистрирован' });
  } catch (error) {
    // Обрабатываем возможные ошибки
    res.status(500).json({ message: 'Ошибка регистрации' });
  }
});

router.post('/login', async (req, res) => {
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
