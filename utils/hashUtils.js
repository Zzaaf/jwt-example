const crypto = require('crypto');

// Функция для хеширования строки (пароля)
function hashString(string) {
  // Генерируем соль
  const salt = crypto.randomBytes(16).toString('hex');

  // Создаем хеш с использованием соли и строки
  const hash = crypto.pbkdf2Sync(string, salt, 10000, 32, 'sha512').toString('hex');

  // Возвращаем соль и хеш в формате 'соль:хеш'
  return `${salt}:${hash}`;
}

// Функция для сравнения строки с хешем
function compareString(string, hash) {
  // Разделяем соль и хеш
  const [salt, originalHash] = hash.split(':');

  // Создаем новый хеш с использованием соли и строки
  const newHash = crypto.pbkdf2Sync(string, salt, 10000, 32, 'sha512').toString('hex');

  // Сравниваем новый хеш с оригинальным хешем и возвращаем результат
  return newHash === originalHash;
}

// Пример использования
const originalString = 'myPassword';

// Хешируем строку
const hashedString = hashString(originalString);
console.log('Хеш строки:', hashedString);

// Проверяем строку на соответствие хешу
const isMatch = compareString(originalString, hashedString);
console.log('Строка соответствует хешу:', isMatch);