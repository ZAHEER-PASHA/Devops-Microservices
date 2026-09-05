pipeline {
    agent any

    environment {
        AWS_REGION = 'us-east-1'
        ECR_REGISTRY = '000000000000.dkr.ecr.us-east-1.localhost:5100'
    }

    stages {

        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Verify Docker & AWS') {
    steps {
        bat 'docker --version'
        bat 'docker ps'

        withCredentials([
            usernamePassword(
                credentialsId: 'floci-aws',
                usernameVariable: 'AWS_ACCESS_KEY_ID',
                passwordVariable: 'AWS_SECRET_ACCESS_KEY'
            )
        ]) {
            bat 'aws --version'
            bat 'aws --endpoint-url http://localhost:4566 --region %AWS_REGION% sts get-caller-identity'
        }
    }
}

        stage('Build Frontend') {
            steps {
                bat 'docker build -t microservices-frontend:latest ./frontend'
            }
        }

        stage('Build User Service') {
            steps {
                bat 'docker build -t microservices-user:latest ./user-service'
            }
        }

        stage('Build Product Service') {
            steps {
                bat 'docker build -t microservices-product:latest ./product-service'
            }
        }

        stage('Build Order Service') {
            steps {
                bat 'docker build -t microservices-order:latest ./order-service'
            }
        }

        stage('Login to Floci ECR') {
    steps {
        withCredentials([
            usernamePassword(
                credentialsId: 'floci-aws',
                usernameVariable: 'AWS_ACCESS_KEY_ID',
                passwordVariable: 'AWS_SECRET_ACCESS_KEY'
            )
        ]) {
            bat '''
                aws --endpoint-url http://localhost:4566 --region %AWS_REGION% ecr get-login-password | docker login --username AWS --password-stdin %ECR_REGISTRY%
            '''
        }
    }
}

        stage('Push Images to Floci ECR') {
            steps {
                bat 'docker tag microservices-frontend:latest %ECR_REGISTRY%/microservices-frontend:latest'
                bat 'docker tag microservices-user:latest %ECR_REGISTRY%/microservices-user:latest'
                bat 'docker tag microservices-product:latest %ECR_REGISTRY%/microservices-product:latest'
                bat 'docker tag microservices-order:latest %ECR_REGISTRY%/microservices-order:latest'

                bat 'docker push %ECR_REGISTRY%/microservices-frontend:latest'
                bat 'docker push %ECR_REGISTRY%/microservices-user:latest'
                bat 'docker push %ECR_REGISTRY%/microservices-product:latest'
                bat 'docker push %ECR_REGISTRY%/microservices-order:latest'
            }
        }
        stage('Deploy') {
    steps {
        withCredentials([
            usernamePassword(
                credentialsId: 'floci-aws',
                usernameVariable: 'AWS_ACCESS_KEY_ID',
                passwordVariable: 'AWS_SECRET_ACCESS_KEY'
            )
        ]) {
            bat '''
                aws --endpoint-url http://localhost:4566 --region %AWS_REGION% ecr get-login-password | docker login --username AWS --password-stdin %ECR_REGISTRY%

                docker compose -f deploy\\docker-compose.prod.yml pull

                docker compose -f deploy\\docker-compose.prod.yml up -d --remove-orphans
            '''
        }
    }
}
    }
}