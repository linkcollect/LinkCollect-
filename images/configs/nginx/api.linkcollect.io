server {
    # listen 443 ssl;
    listen 80;

    root /var/www/certbot;
    server_name api.linkcollect.io www.api.linkcollect.io;

        location ~ /.well-known/acme-challenge {
                allow all;
                root /var/www/html;
        }

        location / {
                  proxy_pass http://ts-node-docker:7000;
                  proxy_http_version 1.1;
                  proxy_set_header Upgrade $http_upgrade;
                  proxy_set_header Connection 'upgrade';
                  proxy_set_header Host $host;
                  proxy_set_header X-Real-IP $remote_addr;
                  proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
                  proxy_cache_bypass $http_upgrade;
        }
 
}