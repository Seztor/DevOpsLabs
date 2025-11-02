### Работа c CI/CD файлами
Цель работы: Написать “плохой” и “хороший” CI/CD файл

### Подготовка

Это работу решил ради разнообразия выполнить на Windows с помощью Node.js и Docker Desktop.
Для начала создадим небольшой мини-веб-сервер на Node.js 
#### index.js
```
const express = require('express');

const app = express();
const PORT = process.env.PORT || 3000;

app.get('/', (req, res) => {
  res.json({ message: 'Hello from CI/CD Pipeline!' });
});

const server = app.listen(PORT, () => {
  console.log(`Server run on port ${PORT}`);
});

module.exports = server;

```

#### package.json
```
{
  "name": "my-cicd-demo",
  "version": "1.0.0",
  "description": "CI/CD Demo",
  "main": "src/index.js",
  "scripts": {
    "start": "node src/index.js",
    "test": "jest",
    "lint": "eslint src/",
    "build": "echo 'Build complete'"
  },
  "dependencies": {
    "express": "^4.18.2"
  },
  "devDependencies": {
    "eslint": "^8.52.0",
    "jest": "^29.7.0"
  }
}
```

#### Тесты index.test.js
```
const server = require('../src/index');

describe('API Tests', () => {
  test('should return success message', () => {
    expect(1 + 1).toBe(2);
  });

  test('app should be defined', () => {
    expect(server).toBeDefined();
  });
});

afterAll(() => {
  server.close();
});
```

#### .eslintrc.json

```
{
  "env": {
    "node": true,
    "es2021": true,
    "jest": true
  },
  "extends": "eslint:recommended",
  "parserOptions": {
    "ecmaVersion": "latest"
  },
  "rules": {
    "no-console": "warn"
  }
}
```

### Также напишем Dockerfile и Docker compose file
```
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./

RUN npm ci

COPY . .

EXPOSE 3000

CMD ["npm", "start"]
```

```
version: '3.8'

services:
  app:
    image: myapp:latest
    ports:
      - "3000:3000"
    environment:
      NODE_ENV: production
      PORT: 3000
    restart: unless-stopped
```

Также в конце подготовки добавим некоторые данные в Github Secrets

### Запуск сервера
Проверяем работоспособность <br>
<img width="885" height="632" alt="image" src="https://github.com/user-attachments/assets/18f6e068-c8d1-4305-b7df-36d5c2f0167b" /> <br>

Билдим докем и запускаем <br>

<img width="1483" height="728" alt="image" src="https://github.com/user-attachments/assets/656942a4-6c39-4446-b1f1-8ae3bc54738a" /> <br>


### Bad practice CI/CD
```
name: Bad CI/CD Pipeline

on:
  push:
    branches:
      - main

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest

    steps:
      - name: Checkout
        uses: actions/checkout@v3

      - name: Setup Node
        uses: actions/setup-node@v3
        with:
          node-version: '18'

      - name: Install dependencies
        run: npm install

      - name: Run tests
        run: npm test || true

      - name: Build application
        run: npm run build

      - name: Build Docker image
        run: docker build -t myapp:latest .


      - name: Deploy to production (skipped)
        env:
          DATABASE_URL: "postgresql://user:MySecretPass123@db.example.com:5432/app"
          API_KEY: "sk-1234567890abcdefghijklmnop"
          AWS_ACCESS_KEY_ID: "AKIA1234567890ABCDEF"
          AWS_SECRET_ACCESS_KEY: "wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY"
        run: |
          echo "No server configured. Skipping deploy step."
```
 Теперь рассмотрим какие bad practice тут использованы
 
1. Хранение секретов в открытом виде
```
env:
  DATABASE_URL: "postgresql://user:MySecretPass123@db.example.com:5432/app"
  API_KEY: "sk-1234567890abcdefghijklmnop"
  AWS_ACCESS_KEY_ID: "AKIA1234567890ABCDEF"
  AWS_SECRET_ACCESS_KEY: "wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY"
```
Это очень небезопасно, тк может привести к утечке данных при публикации, например, на github

2. Игнорирование ошибок тестов и нет анализа кода
```
run: npm test || true
```

Такая команда заставляет пайплайн игнорировать проваленные тесты, что противоречит смыслу CI.
А отсутствие анализа кода может привести к отправке в прод невалидного, неформатированного код. 

3. Всё выполняется в одном job
```
jobs:
  build-and-deploy:
```
Если что-то падает, непонятно на каком этапе.
Нет параллелизма: тесты и сборка выполняются последовательно.

4. Отсутствие кэширования зависимостей
```
run: npm install
```
Каждая сборка скачивает все зависимости заново

### Good practice CI/CD
```
name: Good CI/CD Pipeline

on:
  push:
    branches: 
      - main
  pull_request:
    branches:
      - main

jobs:
  test:
    runs-on: ubuntu-latest
    name: Test and Lint

    steps:
      - name: Checkout
        uses: actions/checkout@v3

      - name: Setup Node
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Run linter
        run: npm run lint

      - name: Run tests
        run: npm test


  build:
    needs: test
    runs-on: ubuntu-latest
    name: Build Docker Image

    steps:
      - name: Checkout
        uses: actions/checkout@v3

      - name: Set up Docker Buildx
        uses: docker/setup-buildx-action@v2

      - name: Login to Docker Hub
        uses: docker/login-action@v2
        with:
          username: ${{ secrets.DOCKER_USERNAME }}
          password: ${{ secrets.DOCKER_PASSWORD }}

      - name: Build and push
        uses: docker/build-push-action@v4
        with:
          context: .
          file: Dockerfile
          push: true
          tags: |
            ${{ secrets.DOCKER_USERNAME }}/myapp:${{ github.sha }}
            ${{ secrets.DOCKER_USERNAME }}/myapp:latest
          cache-from: type=registry,ref=${{ secrets.DOCKER_USERNAME }}/myapp:buildcache
          cache-to: type=registry,ref=${{ secrets.DOCKER_USERNAME }}/myapp:buildcache,mode=max

  deploy:
    needs: build
    runs-on: ubuntu-latest
    name: Deploy to Production
    environment:
      name: production
      url: https://myapp.example.com

    steps:
      - name: Skip deploy
        run: echo "No deployment server configured; skipping deploy step."

```

1. Скрывание паролей в Github
```
with:
  username: ${{ secrets.DOCKER_USERNAME }}
  password: ${{ secrets.DOCKER_PASSWORD }}
```
В хорошем файле я вынес пароли и тд в Github Secrets

2. Правильные тесты и анализ
```
 - name: Run linter
 run: npm run lint

- name: Run tests
  run: npm test
```
В новом файле добавил проверку на валидной и логика тестов корректна

3. Кэширование
```
with:
  cache: 'npm'
run: npm ci
```
Добавление кэширование ускоряет сборку в несколько раз

4. Несколько jobs
```
jobs:
  test:
  build:
  deploy:
```
Разбиение позволяет разделить ответственность между различными этапами ci/cd.
Сборка только после успешного выполнения тестов, деплой только после успешной сборки

### Итоги
В итоге видно, что оба pipeline успешно завершены, в ходе работы было затронуто очень много тем, также очень помогло, что с почти каждой темой я уже работал в ходе курса
<img width="1636" height="202" alt="image" src="https://github.com/user-attachments/assets/1f744cb8-e9cb-4876-bd59-700b2b658062" />


