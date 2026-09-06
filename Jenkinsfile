pipeline {
    agent any

    environment {
        AWS_REGION = 'us-east-1'
        ECR_REGISTRY = 'localhost:5100'
        IMAGE_TAG = "build-${BUILD_NUMBER}"
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
                bat 'docker build -t microservices-frontend:%IMAGE_TAG% ./frontend'
            }
        }

        stage('Build User Service') {
            steps {
                bat 'docker build -t microservices-user:%IMAGE_TAG% ./user-service'
            }
        }

        stage('Build Product Service') {
            steps {
                bat 'docker build -t microservices-product:%IMAGE_TAG% ./product-service'
            }
        }

        stage('Build Order Service') {
            steps {
                bat 'docker build -t microservices-order:%IMAGE_TAG% ./order-service'
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
        stage('Create ECR Repositories') {
    steps {
        withCredentials([
            usernamePassword(
                credentialsId: 'floci-aws',
                usernameVariable: 'AWS_ACCESS_KEY_ID',
                passwordVariable: 'AWS_SECRET_ACCESS_KEY'
            )
        ]) {
            bat '''
                echo Creating Floci ECR repositories if they do not exist...

                aws --endpoint-url http://localhost:4566 --region %AWS_REGION% ecr describe-repositories --repository-names microservices-frontend >nul 2>&1 || aws --endpoint-url http://localhost:4566 --region %AWS_REGION% ecr create-repository --repository-name microservices-frontend

                aws --endpoint-url http://localhost:4566 --region %AWS_REGION% ecr describe-repositories --repository-names microservices-user >nul 2>&1 || aws --endpoint-url http://localhost:4566 --region %AWS_REGION% ecr create-repository --repository-name microservices-user

                aws --endpoint-url http://localhost:4566 --region %AWS_REGION% ecr describe-repositories --repository-names microservices-product >nul 2>&1 || aws --endpoint-url http://localhost:4566 --region %AWS_REGION% ecr create-repository --repository-name microservices-product

                aws --endpoint-url http://localhost:4566 --region %AWS_REGION% ecr describe-repositories --repository-names microservices-order >nul 2>&1 || aws --endpoint-url http://localhost:4566 --region %AWS_REGION% ecr create-repository --repository-name microservices-order

                echo ECR repository check completed.
            '''
        }
    }
}

        stage('Push Images to Floci ECR') {
            steps {
                bat 'docker tag microservices-frontend:%IMAGE_TAG% %ECR_REGISTRY%/microservices-frontend:%IMAGE_TAG%'
                bat 'docker tag microservices-user:%IMAGE_TAG% %ECR_REGISTRY%/microservices-user:%IMAGE_TAG%'
                bat 'docker tag microservices-product:%IMAGE_TAG% %ECR_REGISTRY%/microservices-product:%IMAGE_TAG%'
                bat 'docker tag microservices-order:%IMAGE_TAG% %ECR_REGISTRY%/microservices-order:%IMAGE_TAG%'

                bat 'docker push %ECR_REGISTRY%/microservices-frontend:%IMAGE_TAG%'
                bat 'docker push %ECR_REGISTRY%/microservices-user:%IMAGE_TAG%'
                bat 'docker push %ECR_REGISTRY%/microservices-product:%IMAGE_TAG%'
                bat 'docker push %ECR_REGISTRY%/microservices-order:%IMAGE_TAG%'
            }
        }

        stage('Deploy') {
    steps {
        bat '''
            echo Deploying version %IMAGE_TAG% to Kubernetes...

            kubectl -n ecommerce set image deployment/frontend frontend=host.docker.internal:5100/microservices-frontend:%IMAGE_TAG%
            kubectl -n ecommerce set image deployment/user-service user-service=host.docker.internal:5100/microservices-user:%IMAGE_TAG%
            kubectl -n ecommerce set image deployment/product-service product-service=host.docker.internal:5100/microservices-product:%IMAGE_TAG%
            kubectl -n ecommerce set image deployment/order-service order-service=host.docker.internal:5100/microservices-order:%IMAGE_TAG%

            kubectl -n ecommerce rollout status deployment/frontend --timeout=120s
            kubectl -n ecommerce rollout status deployment/user-service --timeout=120s
            kubectl -n ecommerce rollout status deployment/product-service --timeout=120s
            kubectl -n ecommerce rollout status deployment/order-service --timeout=120s
        '''
    }
}

        stage('Health Check') {
    steps {
        bat '''
            echo Checking Kubernetes deployments...

            kubectl -n ecommerce rollout status deployment/frontend --timeout=120s
            kubectl -n ecommerce rollout status deployment/user-service --timeout=120s
            kubectl -n ecommerce rollout status deployment/product-service --timeout=120s
            kubectl -n ecommerce rollout status deployment/order-service --timeout=120s

            echo.
            echo Checking Kubernetes pods...
            kubectl get pods -n ecommerce

            echo.
            echo Kubernetes Health Check completed successfully.
        '''
    }
}
    }
}