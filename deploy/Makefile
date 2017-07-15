deploy: stop delete pull run

stop:
		docker stop auth || echo "Stop AUTH"

delete:
		docker rm auth || echo "Delete AUTH"

pull:
		docker pull registry.gitlab.com/fernandocagale/seneca-service-auth:latest

run:
		docker run -d \
				--net=host \
				--name auth \
				--restart always \
				registry.gitlab.com/fernandocagale/seneca-service-auth:latest
