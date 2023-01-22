FROM ubuntu:20.04




RUN apt-get update && apt-get install -y curl 
ENV foo /opt
WORKDIR ${foo}

RUN cd ~ && curl -sL https://deb.nodesource.com/setup_16.x -o /tmp/nodesource_setup.sh

RUN bash /tmp/nodesource_setup.sh
RUN  apt install -y nodejs  
RUN  apt install -y build-essential 
RUN npm install -g npm@9.2.0

RUN apt-get update && apt-get install -y net-tools iputils-ping
RUN touch  /var/log/syslog
RUN echo "hola"> t.log
#CMD tail -f t.log
CMD mkdir /server/

COPY install_1.sh /server/install_1.sh
COPY install_server.sh  /server/install_server.sh
CMD chmod 777 /server/install_1.sh
CMD chmod 777 /server/install_server.sh
CMD bash /server/install_1.sh
CMD bash /server/install_server.sh

##CMD tail -f /dev/null