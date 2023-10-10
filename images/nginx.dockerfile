# Use the nginx base image
# FROM nginx:latest as base

FROM ubuntu:18.04 as base


# install nginx
RUN apt-get update -y
RUN apt-get install -y software-properties-common
RUN add-apt-repository -y ppa:nginx/stable
RUN apt-get update -y
RUN apt-get install -y nginx

# install certbot
RUN add-apt-repository ppa:certbot/certbot
RUN apt-get update -y
RUN apt-get install -y certbot python-certbot-nginx

# deamon mode off
RUN chown -R www-data:www-data /var/lib/nginx

# expose ports
EXPOSE 80 443

# # add nginx staging conf
# ADD images/configs/nginx/backup.linkcollect.io /etc/nginx/sites-available/backup.linkcollect.io

# # create symlinks
# RUN ln -s /etc/nginx/sites-available/backup.linkcollect.io /etc/nginx/sites-enabled/backup.linkcollect.io

# work dir
WORKDIR /etc/nginx


# Copy the nginx configuration file to the container
# COPY images/configs/nginx.conf /etc/nginx/nginx.conf

# Start nginx
CMD ["nginx", "-g", "daemon off;"]


