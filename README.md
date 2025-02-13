EJECUCION DEL BACKEND
1.	Para ejecutar el backend es necesario descargarlo o clonarlo, al descargarlo o clonarlo encontraras dos carpetas una llamada BackendMinimalAPI(backend), la otra ReactCrudRedux(frontend) y el README que contiene esta información.
2.	Como siguiente paso abre visual studio code(VSC) y arrastra  la  carpeta BackendMinimalAP.
3.	A continuación ve a appsettings.json  para configurar la conexión a  la base de datos de  acuerdo a los datos que  tienes  en  SQL Server.
4.	Ya configurado la conexión a la base de datos verifica en el proyecto backend que no se encuentre una carpeta llamada Migrations, si lo localizas elimínalo.
5.	Posteriormente abre una terminal en Visual Studio Code(VSC) y  por  la siguiente línea  de  código.
       dotnet ef migrations add InitialCreate  
     Cuando termine la ejecución debes poner la siguiente línea de código en la terminal.
     dotnet ef database update
Esto creará una   carpeta llamada Migrations en el proyecto y creará también la base de datos llamada WebApiCrud y una tabla llamada Users en Sql Server.
6.	Por último, para ejecutar el proyecto tienes que poner la siguiente línea de código en la teminal.  dotnet watch.
Con esto se abrirá el navegador y te mostrará las apis para hacer un CRUD. 



EJECUCION DEL FRONTEND

1.	 Como te comenté en el backen al descargar o clonar encontraste dos carpetas en este caso ReactCrudRedux   es el frontend.
2.	Ya que lo localizaste, abre visual studio  code  y arrastra la carpeta del frontend  ReactCrudRedux a visual studio  code.
3.	Posteriormente abre una terminal en visual studio code   y pon la siguiente línea de código.
npm install
4.	A continuación, dentro del proyecto frontend localiza el archivo userSlice.js y verifica que el localhost que está llamando sea el mismo localhost donde se está abriendo el backend, si no es así cambia o pon en el frontend la misma dirección localhost que tiene el backend.
5.	Por último, para poder ejecutar el frotend necesitas poner la siguiente línea de código.  npm run dev .
6.	Posicionarte sobre el link de   localhost y dar click en follow link.
7.	Se abrirá el navegador donde podrás hacer pruebas  con un CRUD de usuarios  utilizando axios.


 
