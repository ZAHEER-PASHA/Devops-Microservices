pipeline {
    agent any

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
    }
}