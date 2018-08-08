FROM ubuntu:18.04




RUN apt-get update && apt-get install -y curl 
ENV foo /opt
WORKDIR ${foo}

RUN cd ~ && curl -sL https://deb.nodesource.com/setup_8.10 -o | bash 
RUN  apt install -y nodejs  
RUN  apt install -y build-essential 
RUN apt install npm -y npm
RUN nodejs -v
 
RUN touch  /var/log/syslog

CMD tail -f /var/log/syslog
