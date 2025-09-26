# Лабораторная 1  
Изначально я думал делать лабу на Linux VM, тк гайдов на nginx находил больше именно для unix систем
Однако все же остановился на Windows

- Пункт 1 Установка ПО   <br>
Посмотрев задания я решил сначала установить сначало нужное ПО: сам `nginx` и `openssl`, скачал все без проблем, с этим к счастью проблем не возникло
- Пункт 2 Разбирался в nginx   <br>
Изначально для теста решил запустить просто localhost с чем почти сразу справился
<img width="741" height="284" alt="image" src="https://github.com/user-attachments/assets/b268d154-a01b-4fa8-8e3d-b39dca16d81a" /> <br>      
Далее изучал что за что отвечает в конфиге nginx-а.
Для этого сделал маленький сайт который открывается на localhost
<img width="1402" height="861" alt="image" src="https://github.com/user-attachments/assets/8761b88c-39b0-4e92-8846-806a93f0eeec" />  <br>
<img width="795" height="343" alt="image" src="https://github.com/user-attachments/assets/821deca6-a2aa-416d-a991-7283515e2b70" /> <br>
- Пункт 3 Сертификаты безопасности <br>
Их я создал через openssl, но получилось не сразу, cmd не разпознавал такую команду, после добавления в Path, все стало - ок <br>
<img width="1443" height="51" alt="image" src="https://github.com/user-attachments/assets/6a5bcdd3-a370-4a2b-b765-bfa62219562b" /> <br>
<img width="499" height="642" alt="image" src="https://github.com/user-attachments/assets/71b21ee2-f22f-4354-a569-40bcc17b99a0" /> <br>
И вот 2 сертификата готовы
- Пункт 4 Добавление доменных имен<br> 
В файл hosts я добавил 2 домена, которые указывают на `127.0.0.1` <br>
<img width="284" height="49" alt="image" src="https://github.com/user-attachments/assets/f970e6ad-02b8-4791-b545-8eed2da5dcc0" /> <br>
- Пункт 5 HTTPS <br>
Немного доработав конфиг он стал принудительно перебрасывать пользователя на https, что нам и было нужно. Вместе с этим я сделал все аналогичное и для 2 сайта
<img width="503" height="188" alt="image" src="https://github.com/user-attachments/assets/a2ce25e6-3cf8-434e-a0f0-7e4768cb7027" /> <br>
<img width="943" height="497" alt="image" src="https://github.com/user-attachments/assets/71355490-ba11-4bdb-9dd1-2da33a1d3236" /> <br>
Однако возникла проблема - сайт нам не доверяет :(
<img width="836" height="321" alt="image" src="https://github.com/user-attachments/assets/7cb3401a-b3a3-4451-b36b-4cadeee1a37c" /> <br>
Как решение проблемы, я решил генерировать сертификат через `mkcert`, которому по идее наш компьютер должен доверять
<img width="1071" height="80" alt="image" src="https://github.com/user-attachments/assets/9780e0d9-2b07-4971-8f7f-e5b25b0dedcf" /><br>
В итоге вписав новые сертификаты браузер стал оценивать подключение как защищенное, УРА!
<img width="401" height="112" alt="image" src="https://github.com/user-attachments/assets/4a538a12-3e79-435b-bc69-3b31b2a1107c" /><br>
Тестируем, что оба сайта работают
<img width="2529" height="1304" alt="image" src="https://github.com/user-attachments/assets/d58d8106-0ac3-4908-ab9d-953eaa4154f4" /> <br>
- Пункт 5 Alias <br>
Создаем папку `images` и указываем ее в конфиге, чтобы из нее брались файлы
<img width="870" height="102" alt="image" src="https://github.com/user-attachments/assets/a87b016f-51e0-42b2-9f7d-91521c859164" /> <br>
В итоге при клике на кнопки нас перекидывает на картинки
<img width="2511" height="1323" alt="image" src="https://github.com/user-attachments/assets/44a15034-c1ee-40cb-872c-f9087adab50b" />









 

