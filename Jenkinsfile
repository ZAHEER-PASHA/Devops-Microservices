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
        stage('Check Docker Environment') {
    steps {
        bat '''
            echo === USER ===
            whoami

            echo === DOCKER CONTEXT ===
            docker context show

            echo === DOCKER INFO ===
            docker info --format "{{.Name}}"

            echo === DOCKER CONFIG ===
            if defined DOCKER_CONFIG (
                echo DOCKER_CONFIG=%DOCKER_CONFIG%
            ) else (
                echo DOCKER_CONFIG is not set
            )
        '''
    }
}

        stage('Compare Docker Hub Credential') {
    steps {
        withCredentials([
            usernamePassword(
                credentialsId: 'dockerhub-credentials',
                usernameVariable: 'DOCKER_USERNAME',
                passwordVariable: 'DOCKER_PASSWORD'
            )
        ]) {
            powershell '''
                Write-Host "Jenkins username: $env:DOCKER_USERNAME"
                Write-Host "Jenkins token length: $($env:DOCKER_PASSWORD.Length)"

                $bytes = [System.Text.Encoding]::UTF8.GetBytes($env:DOCKER_PASSWORD)
                $hash = [System.Security.Cryptography.SHA256]::Create().ComputeHash($bytes)
                $hashString = [BitConverter]::ToString($hash).Replace("-", "").ToLower()

                Write-Host "Jenkins token SHA256: $hashString"
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