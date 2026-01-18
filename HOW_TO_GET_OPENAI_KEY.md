# Як отримати OpenAI API Key

## Крок 1: Створіть обліковий запис OpenAI

1. Перейдіть на https://platform.openai.com/signup
2. Зареєструйтесь за допомогою email або Google/Microsoft акаунту
3. Підтвердіть свій email

## Крок 2: Додайте платіжну інформацію

⚠️ **ВАЖЛИВО**: OpenAI вимагає додати платіжну інформацію для використання API

1. Перейдіть в Settings → Billing: https://platform.openai.com/account/billing/overview
2. Натисніть "Add payment method"
3. Додайте кредитну/дебетову картку
4. Встановіть ліміт витрат (рекомендується почати з $5-10)

## Крок 3: Створіть API Key

1. Перейдіть на https://platform.openai.com/api-keys
2. Натисніть "+ Create new secret key"
3. Дайте ключу назву (наприклад: "Tarot App")
4. **ВАЖЛИВО**: Скопіюйте ключ одразу! Він показується тільки один раз
5. Зберігайте ключ у безпечному місці

## Крок 4: Додайте ключ у проект

1. Відкрийте файл `server/.env`
2. Знайдіть рядок `OPENAI_API_KEY=your_openai_api_key_here`
3. Замініть `your_openai_api_key_here` на ваш ключ:
   ```
   OPENAI_API_KEY=sk-proj-xxxxxxxxxxxxxxxxxxxxxxxxxxxxx
   ```
4. Переконайтесь що `AI_PROVIDER=openai` (це за замовчуванням)
5. Збережіть файл та перезапустіть сервер

## Ціни OpenAI (станом на 2024)

**GPT-4o-mini** (використовується в проекті):
- Input: $0.150 / 1M tokens (~$0.00015 за 1000 токенів)
- Output: $0.600 / 1M tokens (~$0.0006 за 1000 токенів)

**Приклад**: Одна інтерпретація таро (~500 токенів input + 300 токенів output) коштує близько $0.0003 (0.3 цента)

**Початковий кредит**: Нові користувачі отримують $5 безкоштовних кредитів на 3 місяці

## Альтернатива: Google Gemini

Якщо ви хочете використовувати безкоштовний Gemini замість OpenAI:

1. Отримайте Gemini API key за інструкцією в `HOW_TO_GET_GEMINI_KEY.md`
2. У файлі `server/.env` змініть:
   ```
   AI_PROVIDER=gemini
   ```
3. Перезапустіть сервер

## Перевірка

Після додавання ключа:
1. Перезапустіть сервер: `cd server && npm start`
2. Відкрийте http://localhost:5174
3. Зробіть гадання з питанням
4. Натисніть "Отримати інтерпретацію AI"
5. Ви маєте отримати детальну відповідь від ChatGPT!

## Troubleshooting

**Помилка "Insufficient quota"**:
- Додайте кредити на балансі в OpenAI Billing

**Помилка "Invalid API key"**:
- Переконайтесь що скопіювали ключ повністю
- Ключ повинен починатись з `sk-`
- Перевірте що немає зайвих пробілів

**Помилка "Rate limit exceeded"**:
- Зачекайте 1 хвилину та спробуйте знову
- Безкоштовний рівень має ліміт ~3 запити за хвилину

## Безпека

⚠️ **НІКОЛИ** не публікуйте ваш API ключ в GitHub або інших публічних місцях!

- Файл `.env` додано в `.gitignore`
- Не діліться скріншотами файлу `.env`
- Якщо ключ було розкрито - негайно видаліть його в OpenAI Dashboard

## Корисні посилання

- OpenAI Platform: https://platform.openai.com
- API Documentation: https://platform.openai.com/docs
- Pricing: https://openai.com/api/pricing
- Usage Dashboard: https://platform.openai.com/usage
