pipeline {
    agent any

    environment {
        IMAGE_TAG = "build-${BUILD_NUMBER}"
        DOCKERHUB_USERNAME = 'zaheerpasha786'
    }

    stages {

        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Verify Docker') {
            steps {
                bat 'docker --version'
                bat 'docker ps'
            }
        }

        stage('Build Frontend') {
            steps {
                bat 'docker build -t %DOCKERHUB_USERNAME%/microservices-frontend:%IMAGE_TAG% ./frontend'
            }
        }

        stage('Build User Service') {
            steps {
                bat 'docker build -t %DOCKERHUB_USERNAME%/microservices-user:%IMAGE_TAG% ./user-service'
            }
        }

        stage('Build Product Service') {
            steps {
                bat 'docker build -t %DOCKERHUB_USERNAME%/microservices-product:%IMAGE_TAG% ./product-service'
            }
        }

        stage('Build Order Service') {
            steps {
                bat 'docker build -t %DOCKERHUB_USERNAME%/microservices-order:%IMAGE_TAG% ./order-service'
            }
        }

        stage('Docker Hub Credential Test') {
    steps {
        withCredentials([
            usernamePassword(
                credentialsId: 'dockerhub-credentials',
                usernameVariable: 'DOCKER_USERNAME',
                passwordVariable: 'DOCKER_PASSWORD'
            )
        ]) {
            bat '''
                echo Username=%DOCKER_USERNAME%
                docker logout
                docker login --username "%DOCKER_USERNAME%" --password-stdin < "%WORKSPACE%\\docker-password.txt"
            '''
        }
    }
}

        stage('Push Images to Docker Hub') {
    steps {
        script {
            docker.withRegistry(
                'https://index.docker.io/v1/',
                'dockerhub-credentials'
            ) {
                bat 'docker push %DOCKERHUB_USERNAME%/microservices-frontend:%IMAGE_TAG%'
                bat 'docker push %DOCKERHUB_USERNAME%/microservices-user:%IMAGE_TAG%'
                bat 'docker push %DOCKERHUB_USERNAME%/microservices-product:%IMAGE_TAG%'
                bat 'docker push %DOCKERHUB_USERNAME%/microservices-order:%IMAGE_TAG%'
            }
        }
    }
}

        stage('Deploy') {
            steps {
                bat '''
                    echo Deploying version %IMAGE_TAG%

                    set IMAGE_TAG=%IMAGE_TAG%

                    docker compose -f deploy\\docker-compose.prod.yml pull

                    docker compose -f deploy\\docker-compose.prod.yml up -d --remove-orphans
                '''
            }
        }

        stage('Health Check') {
            steps {
                bat '''
                    echo Checking Frontend...
                    curl.exe -f http://localhost:8090

                    echo Checking User Service...
                    curl.exe -f http://localhost:5001

                    echo Checking Product Service...
                    curl.exe -f http://localhost:5002/health

                    echo Checking Order Service...
                    curl.exe -f http://localhost:5003/health

                    echo Checking Order Database...
                    curl.exe -f http://localhost:5003/health/db

                    echo Checking Docker containers...
                    docker compose -f deploy\\docker-compose.prod.yml ps
                '''
            }
        }
    }
}