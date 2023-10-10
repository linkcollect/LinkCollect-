#!/bin/bash
email="harshsingh.eth@gmail.com" # Adding a valid address is strongly recommended
staging=1 # Set to 1 if you're testing your setup to avoid hitting request limits
domains=("backup.linkcollect.io") # Use an array to define multiple domains
rsa_key_size=4096

domain_args=""
for domain in "${domains[@]}"; do
  domain_args="$domain_args -d $domain"
done

if ! [ -x "$(command -v docker-compose)" ]; then
  echo 'Error: docker-compose is not installed.' >&2
  exit 1
fi

# Select appropriate email arg
case "$email" in
  "") email_arg="--register-unsafely-without-email" ;;
  *) email_arg="--email $email" ;;
esac

# Enable staging mode if needed
if [ $staging != "0" ]; then staging_arg="--staging"; fi

docker-compose -f docker-compose.backend.yml run --rm --entrypoint "\
  certbot \
    $staging_arg \
    $email_arg \
    $domain_args \
    --rsa-key-size $rsa_key_size \
    --agree-tos \
    --force-renewal \
    -n \
    --redirect \
    --nginx" nginx
echo

echo "### Reloading nginx ..."
docker-compose -f docker-compose.backend.yml exec nginx nginx -s reload
