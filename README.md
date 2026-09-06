create repositories in floci using
aws --endpoint-url http://localhost:4566 --region us-east-1 ecr create-repository --repository-name microservices-frontend
aws --endpoint-url http://localhost:4566 --region us-east-1 ecr create-repository --repository-name microservices-user
aws --endpoint-url http://localhost:4566 --region us-east-1 ecr create-repository --repository-name microservices-product
aws --endpoint-url http://localhost:4566 --region us-east-1 ecr create-repository --repository-name microservices-order

make sure all the repositories availabe
aws --endpoint-url http://localhost:4566 --region us-east-1 ecr describe-repositories
