<h1 align="center"> LPlan </h1>

<p align="center">
  <img width="138" height="150" src="https://grupo3ea.files.wordpress.com/2023/02/lamasia.png">
</p>

### Commits de Referencia

Antes del Mínimo 1 hice algunas pruebas. Estos commits se llaman '(Pràctica Prèvia al Mínimo 1)'. 
El del exámen es el siguiente.

### Estado del Mínimo 2 🔧

¿Qué está hecho?

* _En el BackEnd se han creado el modelo, la interface, el controller, las rutas, los servicios, ... de la "Session"._
* _En el BackOffice también se ha creado el modelo, la interface, el service, ... y se han generado los componentes para poder listar, ver y editar una "Session"._
* _Cuando se hace el Login, se ha añadido un campo obligatorio para poner el motivo por el que se inicia la "Session". Una vez hecho el login correctamente, se guarda esta "Session" con el ID de usuario, el motivo de la sesión y la fecha de creación._

¿Qué falta por hacer?

* _Lo que quiero hacer es que, cuando se haga el "Logout", se actualize la "Session" poniendo la hora a la que ésta se ha cerrado. Para ello, he creado un servicio compartido entre el "Login" y el "Navigation" (que es donde está el botón de Logout) para que se pueda pasar la información de la sesión y simplemente, al pulsar el botón "Logout", se actualize con la fecha de finalización. He conseguido que se pase la información bien (por lo tanto navigation tiene la info de la "Session") pero no me ha dado tiempo a completar que se guarde bien la fecha de fin se "Session" cuando le doy a "Logout")._