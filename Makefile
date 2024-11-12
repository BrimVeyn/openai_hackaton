build:
	docker build -t hackaton .

run:
	docker run -d -p 8080:8080 hackaton

stop:
	docker stop $$(docker ps -q | head -n 1)


clean: stop
	docker system prune -af
