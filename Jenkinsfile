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
        stage('Test Docker Desktop Engine') {
    steps {
        bat '''
            docker -H npipe:////./pipe/dockerDesktopLinuxEngine info
        '''
    }
}
stage('Check Jenkins Docker Environment') {
    steps {
        powershell '''
            Write-Host "=== Jenkins identity ==="
            whoami

            Write-Host ""
            Write-Host "=== Docker environment variables ==="

            Get-ChildItem Env: |
                Where-Object {
                    $_.Name -match '^(DOCKER|HTTP_PROXY|HTTPS_PROXY|NO_PROXY)'
                } |
                Sort-Object Name |
                ForEach-Object {
                    Write-Host "$($_.Name) = $($_.Value)"
                }

            Write-Host ""
            Write-Host "=== Docker context ==="
            docker context show

            Write-Host ""
            Write-Host "=== Docker client/server ==="
            docker version --format "Client={{.Client.Version}} Server={{.Server.Version}}"
        '''
    }
}
stage('Test Docker Hub API Authentication') {
    steps {
        withCredentials([
            usernamePassword(
                credentialsId: 'dockerhub-credentials',
                usernameVariable: 'DOCKER_USERNAME',
                passwordVariable: 'DOCKER_PASSWORD'
            )
        ]) {
            powershell '''
                $pair = "$env:DOCKER_USERNAME`:$env:DOCKER_PASSWORD"
                $bytes = [System.Text.Encoding]::UTF8.GetBytes($pair)
                $base64 = [Convert]::ToBase64String($bytes)

                $headers = @{
                    Authorization = "Basic $base64"
                }

                try {
                    $response = Invoke-RestMethod `
                        -Uri "https://hub.docker.com/v2/users/login/" `
                        -Method Post `
                        -Headers $headers

                    Write-Host "Docker Hub API authentication succeeded"
                }
                catch {
                    Write-Host "Docker Hub API authentication failed"
                    Write-Host $_.Exception.Message
                }
            '''
        }
    }
}
        stage('Compare Docker CLI') {
    steps {
        bat '''
            echo === JENKINS USER ===
            whoami

            echo === DOCKER VERSION ===
            docker --version

            echo === DOCKER PATH ===
            where docker

            echo === DOCKER CONTEXT ===
            docker context show
        '''
    }
}
        stage('Test Docker Hub with Clean Config') {
    steps {
        withCredentials([
            usernamePassword(
                credentialsId: 'dockerhub-credentials',
                usernameVariable: 'DOCKER_USERNAME',
                passwordVariable: 'DOCKER_PASSWORD'
            )
        ]) {
            powershell '''
                $configDir = "$env:WORKSPACE\\docker-config-test"

                if (Test-Path $configDir) {
                    Remove-Item $configDir -Recurse -Force
                }

                New-Item -ItemType Directory -Path $configDir | Out-Null

                $env:DOCKER_CONFIG = $configDir

                Write-Host "Docker config: $env:DOCKER_CONFIG"
                Write-Host "Docker user: $env:DOCKER_USERNAME"

                $env:DOCKER_PASSWORD | docker login `
                    --username $env:DOCKER_USERNAME `
                    --password-stdin
            '''
        }
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