# docker exec -it nginx bash ../../my-scripts/certinitInContainer.sh && -c 'while :; do ../../my-scripts/certinitInContainer.sh; sleep 12h; done;'


docker exec -it nginx bash -c 'while :; do ../../my-scripts/certinitInContainer.sh; sleep 12h; done;'

