# node8-doker
   version nodejs 8.10
## react:  


#### $ cd clente/app-regg/
#### $ npm i



## express, 

### tiene un aparente porblema de cors,    se ve que no se soluciona como en la ersion 3 

## acceder al contenedor

#### $ docker exec  -it  entega_webapp_1  /bin/bash

te encuentras ubicado en /opt/

####  se puede hacer un post a http://172.23.18.10:8080/texto
 hay un get harcodeado con la misma url




# levantar el contenedor


rodrigo@rodrigo-ZERO-G0505:~/Documentos/entega$ docker-compose up
Starting entega_webapp_1 ... 
Starting entega_webapp_1 ... done
Attaching to entega_webapp_1
webapp_1  | My http server listening on port 8080...
webapp_1  | Time: 1533844971805
webapp_1  | Time: 1533844971866
webapp_1  | {"text":"integration test"}
webapp_1  | exito
webapp_1  | exito
