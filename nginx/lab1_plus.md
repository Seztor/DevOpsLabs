# 1 Лабораторная со звездочкой

Выполнение работы я начал со скачивания ffuf, получилось не сразу, тк я не заметил что для работы требуется Go. <br>
<img width="327" height="41" alt="image" src="https://github.com/user-attachments/assets/01ea2e7b-6015-4109-bb12-df63822aafca" /> <br>

После установки я начал выбирать сайт, который станет моей жертвой 🙃 <br>
Решил, что нужно взять сайт организации, с которой я знаком и хоть раз посещал их сайт <br>
В общем взял сайт моей школы <br>
<img width="1646" height="844" alt="image" src="https://github.com/user-attachments/assets/5827b5bb-2afe-47ce-adac-556a41c3f270" /> <br>

Для работы ffuf нашел на гитхабе wordlist и также установил его себе, далее запускаем сам ffuf
<img width="1167" height="529" alt="image" src="https://github.com/user-attachments/assets/098c5b0b-bda7-48f8-9eaf-9c58f808decc" />
Решил искать только на 200-ках, тк ответов было и так ОЧЕНЬ много <br>
Сначала из интересного я находил различные страницы входа в админ панель (логин пароль admin:admin не подошел к сожалению 😞) <br>
<img width="618" height="664" alt="image" src="https://github.com/user-attachments/assets/90f90e0c-e1d7-4190-91d1-babc9311e9d7" />
<img width="550" height="512" alt="image" src="https://github.com/user-attachments/assets/b81eb3da-e6ab-48eb-9fe0-186b2a53f887" /> <br>
Также различные статистики, инфо о php, web.config
<img width="1240" height="1211" alt="image" src="https://github.com/user-attachments/assets/26c8e40e-d91b-4c26-abd2-72329c49a10b" />
<img width="935" height="761" alt="image" src="https://github.com/user-attachments/assets/e3e1be63-3eac-4332-a34f-6fb974a6c45a" />
<img width="1284" height="695" alt="image" src="https://github.com/user-attachments/assets/5cde0327-9450-494e-93bb-5e5f2f6c977d" />
Дальше решил посмотреть есть ли среди найденных эндпоинтов, что-то с большим весом и оказалось не зря....
<img width="1156" height="98" alt="image" src="https://github.com/user-attachments/assets/9c73dd44-45a0-429a-a056-fd5dec7f9a09" /> 
ЦЕЛЫХ 3 гб данных сайта 😲
<img width="1955" height="485" alt="image" src="https://github.com/user-attachments/assets/cbfa0e0b-40ab-4338-943a-a621ea95d358" />
Как мне подсказал умный товарищ (уж точно не GPT), это очень похоже на полный архив сайта, скорее всего созданный на базе CMS (Joomla)  <br>
Поискав по папкам я нашел много картинок, видео, таблиц excel <br>
Также там было очень много Php файлов, в которых я к сожалению вообще не разбираюсь <br>
Интересно было также заглянуть в дамп базы данных, скорее всего продвинутые в этом деле люди нашли бы много всего полезного, но я просто поискал что-то интересное и закрыл

- Подводя итог, я понял, что работа в кибербезопасности это не мое)) Тк нужно знать очень много тонкостей во многих сферах IT
Свой опыт я оцениваю как удачный, тк получил намного больше, чем планировал, с нужными знаниями, возможно я бы нашел какие-то критические уязвимости, но есть что есть




