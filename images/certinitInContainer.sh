#!/bin/bash
email="harshsingh.eth@gmail.com" # Adding a valid address is strongly recommended
staging=1 # Set to 1 if you're testing your setup to avoid hitting request limits
domains=("backup.linkcollect.io") # Use an array to define multiple domains
rsa_key_size=4096

domain_args=""
for domain in "${domains[@]}"; do
  domain_args="$domain_args -d $domain"
done

# Select appropriate email arg
case "$email" in
  "") email_arg="--register-unsafely-without-email" ;;
  *) email_arg="--email $email" ;;
esac

# Enable staging mode if needed
if [ $staging != "0" ]; then staging_arg="--staging"; fi

# certbot $staging_arg $email_arg $domain_args --rsa-key-size $rsa_key_size --agree-tos --force-renewal --redirect --nginx
# echo

certbot --nginx $staging_arg $domain_args $email_arg --rsa-key-size $rsa_key_size --agree-tos --force-renewal --non-interactive --redirect

echo "### Done nginx ..."

# echo "### Reloading nginx ..."
nginx -s reload

# run this inside nginx to get ssh access
# certbot --nginx  -d backup.linkcollect.io --email harshsingh.eth@gmail.com --rsa-key-size 4096 --agree-tos --force-renewal --non-interactive