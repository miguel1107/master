# 1. PREPARANDO DOCKER
## Ejecute los siguientes comandos para el despliegue en Docker de mongoDB y nodeJs
### 1.Creamos la imagen
`docker-compose build`
### 2. Iniciamos los servicios
`docker-compose up`

## 2. APIS
## Insertamos data en el mongoDB
`GET: http://localhost:3000/setdata`
## Consultas todos los registros
`GET: http://localhost:3000/`
## Buscar documentos que pertenecen a un pais
~~~
De parametro le pasamos el país al que queremos ejemplo: PERU
~~~
`GET: http://localhost:3000/find/:country`
## Actualizar un documento
~~~
De parametro en la ruta le pasamos el nombre del documento que queremos actualizar
~~~
`PUT: http://localhost:3000/update/:name`
~~~
Para los nuevos datos la estructura que debe seguir es la siguiente:
{
    name: "nuevo nombre",
    country: "nuevo país
}
Si encuentra un documento con el nombre especificado en la ruta lo actualizará.
En caso no encuentre un documento lo registrará.
~~~
## Borrar un documento
~~~
De parametro le pasamos el nombre del registro que queremos borrar
~~~
`DELETE: http://localhost:3000/delete/:name`