build:
	docker-compose build 

up: 
	make down
	-make rmi
	docker-compose up -d --build
	docker-compose logs --follow

up-dev: 
	docker-compose up -d --build
	docker-compose logs --follow

up-prod:
	docker-compose -f docker-compose.yml -f docker-compose.prod.yml up -d  --build
	docker-compose logs --follow

up-prod-backend:
	make down
	-make rmi
	docker-compose -f docker-compose.backend.yml up -d  --build 
	docker-compose logs --follow

down-prod-backend:
	docker-compose down backend
	docker-compose -f docker-compose.backend.yml up -d  --build 
down: 
	docker-compose down

run: 
	npm run dev

createnetwork:
	docker network create example-net

rmi:
	docker rmi -f $$(docker images --filter "reference=*linkcollect*" -q) 

rmiall: 
	docker rmi -f $$(docker images -q)

im-clean:
	docker rmi $$(docker images -f "dangling=true" -q)
