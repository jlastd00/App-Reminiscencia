Instrucciones para compilar y ejecutar la app (local):
  - Descpmprimir el archivo .zip del proyecto (App-Reminiscencia)
  - Ejecutar el servidor de mongodb:
    - Desde un terminal, si no esta instalado como servicio en el PC (ejecutando "mongod")
    - Si esta instalado como servicio, no hacer nada porque ya se estara ejecutando.
    - Para entrar como cliente hay dos formas: (1) Desde otro terminal ejecutar el comando "mongo"
      y (2) con el programa "Mongodb Compass" disponible en la web de mongodb.
  - Desde un terminal situarse en la carpeta raíz (App-Reminiscencia)
    - Ejecutar el comando "npm run dev" para arrancar el servidor de node
  - Desde otro terminal situarse en la carpeta raiz (App-Reminiscencia)
    - Ejecutar el comando "cd frontend"
    - Ejecutar el comando "ng serve" para arrancar el servidor de angular
  - Desde el navegador entrar en "http://localhost:4200" para acceder a la app

Notas:
  - La URL de la base de datos es: mongodb://localhost/db-app-reminiscencia
  - Para la validación de email utilizo "ethereal.mail" que es un servidor de correo 
    "ficticio" donde se puede enviar el email y aparece en la misma pagina. Esto evita que 
    para probar no estar enviando correos electronicos todo el rato.
    El email y la contraseña de ethereal estan en el código y son:
      - darwin.windler37@ethereal.email / W29RMQ3bdJxvGydBzu 
