# REST-приложение управления библиотекой
Web-приложения для управления домашней библиотекой, которое предоставляет список книг. Их можно фильтровать по
признакам "в наличии", "возврат просрочен". Есть возможность выдать книгу для чтения и вернуть её.

* Список книг хранится в JSON файле на сервере;
* В качестве backend'а используется **ExpressJS**;
* Для шаблонизации HTML-страниц используется **Pug**;
* Предусмотрена страница для просмотра списка книг (с фильтрацией);
* Также имеется страница с карточкой книги. Предоставлена основная информация: название, автор, дата выпуска, имеется ли в наличии (если нет, то кто взял и когда должен вернуть) - которую можно отредактировать;
* Аутентификация не предусмотрена;
* Оформление страниц выполнено с использованием **CSS**;
* Взаимодействие между клиентом и сервером осуществляется с помощью **REST**;
* Фильтрация списка книг осуществляется с использованием **AJAX**;
* Логика приложения реализована на **JavaScript**.