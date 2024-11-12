build:
	docker build -t hackaton .

run:
	docker run -d -p 8080:8080 hackaton

clean:
	docker system prune -af
