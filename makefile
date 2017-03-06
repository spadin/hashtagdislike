build-extension:
	zip -r build/hashtagdislike-extension.zip extension

db-migrate:
	docker-compose run store yarn run db-migrate up
