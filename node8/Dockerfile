FROM ubuntu:24.04




RUN apt-get update && apt-get install -y curl 


RUN cd ~ && curl -sL https://deb.nodesource.com/setup_16.x -o /tmp/nodesource_setup.sh

RUN bash /tmp/nodesource_setup.sh
RUN  apt install -y nodejs  
RUN  apt install -y build-essential 
RUN npm install -g npm@9.2.0
RUN npm install -g npm@9.6.6
#RUN npm install -g npm@11.12.1
RUN apt-get update && apt-get install -y net-tools iputils-ping
RUN touch  /var/log/syslog
RUN echo "hola"> t.log
#CMD tail -f t.log
CMD mkdir /install/
CMD mkdir /servidor/
CMD mkdir /cliente/
COPY install_1.sh /install/install_1.sh
COPY install_server.sh  /install/install_server.sh
CMD chmod 777 /install/install_1.sh
CMD chmod 777 /install/install_server.sh
##CMD bash /install/install_1.sh
CMD bash /install/install_server.sh

##CMD tail -f /dev/null
