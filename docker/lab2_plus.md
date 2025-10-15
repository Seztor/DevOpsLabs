### Работа с docker compose
С данной технологией я столкнулся впервые, обычно мне хватало просто докера, да и его не часто изпользовал.
Цель разобраться с docker compose и попробывать написать, а затем отладить docker compose file
### Подготовка
Установили без проблем, проверяем и начинаем
<img width="2075" height="151" alt="image" src="https://github.com/user-attachments/assets/ca939d46-eb68-43e9-9bb0-421d5d81e7aa" />

### Bad practice docker compose
```
version: "3.9"

services:
  app:
    image: python:3.10
    container_name: my_app_container
    volumes:
      - .:/app
    working_dir: /app
    command: python app/app.py
    ports:
      - "80:80"
    environment:
      - DEBUG=True
    depends_on:
      - db

  db:
    image: mysql:5.7
    container_name: my_db_container
    restart: always
    environment:
      - MYSQL_ROOT_PASSWORD=sqlrootpass123
      - MYSQL_DATABASE=mydbtest
      - MYSQL_USER=user
      - MYSQL_PASSWORD=sqlpass123
    ports:
      - "3306:3306"
```

  Проверим, что запустилось
<img width="2373" height="508" alt="image" src="https://github.com/user-attachments/assets/b08b409f-1916-4ba8-acd9-8b203c730918" /> <br>
  Хм, написано created, но правда ли запущено? Проверим через `docker ps` и да, все запустилось
<img width="533" height="307" alt="image" src="https://github.com/user-attachments/assets/b653d72d-7ebf-47a2-84f1-66ead80f3a22" />

### 1 `container_name` задан вручную
Из-за того что имя прямо прописано, а не сгенерированно, мы можем запускать несколько копий проекта и использовать масштабирование, убрав имена, у нас получилось запустить вторую копию, но уже на другом порту <br>
<img width="557" height="124" alt="image" src="https://github.com/user-attachments/assets/79e88cbe-b174-4e2a-8977-3da082e63ab3" />

### 2 Проброс портов базы данных наружу
```
ports:
      - "3306:3306"
```
Открываем порт MySQL на компьютере, тогда к базе можно подключиться извне, а это не очень безопасно, уберем, чтобы БД была доступна только внутри Docker-сети.
### 3 Пароли "захардкожены" в `enviroment`
```
environment:
      - MYSQL_ROOT_PASSWORD=sqlrootpass123
      - MYSQL_DATABASE=mydbtest
      - MYSQL_USER=user
      - MYSQL_PASSWORD=sqlpass123
```
Проблема этого в том, что все благополучно отправится в гитхаб и все пароли будут как на ладони. Исправим это, добавив файл `.env` и пропишем пароли там <br>
<img width="546" height="143" alt="image" src="https://github.com/user-attachments/assets/18be3388-4781-4803-a9fc-47df83e25b09" />

### Good practice docker compose 
```
version: "3.9"

services:
  app:
    build: ./app
    ports:
      - "8080:80"
    env_file:
      - .env
    depends_on:
      - db
    networks:
      - app_net

  db:
    image: mysql:8.0
    restart: unless-stopped
    env_file:
      - .env
    volumes:
      - db_data:/var/lib/mysql
    networks:
      - db_net

volumes:
  db_data:

networks:
  app_net:
    internal: true
  db_net:
    internal: true
```
В этом файле поправил все предыдущие ошибки, а также добавил, чтобы каждая сеть была `internal` и контейнеры не видели друг друга.
Чтобы проверить изоляцию, сначала я узнал ip контейнера через `docker network`, а затем попросил у нейронки написать небольшой python скрипт проверки. Мы видим, что сеть недостижима, значит все успешно
<img width="1155" height="433" alt="image" src="https://github.com/user-attachments/assets/c9f3ec64-ae1a-4941-987c-c349df7acdc3" />

### Вывод
В ходе работы я не только научился базово работать с docker compose, но и освежил в памяти многие другие команды docker-а и даже самого linux, которые мне были нужны во время выполнения заданий
