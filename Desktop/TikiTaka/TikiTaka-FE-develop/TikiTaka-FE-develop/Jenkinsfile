pipeline {
    agent any
    tools {
        nodejs 'NodeJS 22.13.1'
    }

    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Prepare .env File') {
            steps {
                withCredentials([string(credentialsId: 'REACT_APP_BASE_URL', variable: 'REACT_APP_BASE_URL')]) {
                    script {
                        sh '''
                        echo "MODE=development" > .env
                        echo "PORT=3000" >> .env
                        echo "REACT_APP_BASE_URL=${REACT_APP_BASE_URL}" >> .env
                        
                        # 생성된 .env 파일 확인
                        echo "Generated .env file contents:"
                        cat .env
                        '''
                    }
                }
            }
        }

        stage('Install Dependencies') {
            steps {
                script {
                    sh 'npm install'
                }
            }
        }

        stage('Build') {
            steps {
                script {
                    sh '''
                    # .env 파일 로드
                    export $(grep -v '^#' .env | xargs)
                    # 빌드 실행
                    npm run build
                    '''
                }
            }
        }

        stage('Validate Build') {
            steps {
                script {
                    sh '''
                    # 빌드 디렉토리 존재 확인
                    if [ ! -d "./build" ]; then
                        echo "Error: Build directory not found!"
                        exit 1
                    fi
                    # 필수 파일 확인
                    if [ ! -f "./build/index.html" ]; then
                        echo "Error: index.html not found in build directory!"
                        exit 1
                    fi
                    echo "Build validation passed!"
                    '''
                }
            }
        }  
        
        stage('Deploy to VM') {
            steps {
                withCredentials([
                    sshUserPrivateKey(credentialsId: 'front-instance-ssh-key', keyFileVariable: 'SSH_KEY')
                ]) {
                    script {
                        sh '''
                        echo "🚀 Deploying React to VM…"

                        # FRONTEND_PUBLIC_IP 직접 명시
                        FRONTEND_PUBLIC_IP="210.109.52.252"

                        # SSH Key 파일 권한 변경 (필요한 경우)
                        chmod 600 "$SSH_KEY"

                        # 소유자 변경 (ubuntu가 파일 업로드 가능하도록)
                        ssh -o StrictHostKeyChecking=no -i "$SSH_KEY" ubuntu@"$FRONTEND_PUBLIC_IP" "sudo chown -R ubuntu:www-data /var/www/react-app"

                        # scp 실행 전에 권한 변경 (ubuntu 사용자가 업로드 가능하도록)
                        ssh -o StrictHostKeyChecking=no -i "$SSH_KEY" ubuntu@"$FRONTEND_PUBLIC_IP" "sudo chmod -R 775 /var/www/react-app"

                        # 기존 빌드 파일 삭제
                        ssh -o StrictHostKeyChecking=no -i "$SSH_KEY" ubuntu@"$FRONTEND_PUBLIC_IP" "sudo rm -rf /var/www/react-app/*"

                        # 새 빌드 파일 업로드
                        scp -o StrictHostKeyChecking=no -i "$SSH_KEY" -r ./build/* ubuntu@"$FRONTEND_PUBLIC_IP":/var/www/react-app/

                        # 업로드 후 다시 권한 변경 (Nginx 접근 가능하도록)
                        ssh -o StrictHostKeyChecking=no -i "$SSH_KEY" ubuntu@"$FRONTEND_PUBLIC_IP" "sudo chown -R www-data:www-data /var/www/react-app"

                        # Nginx 재시작
                        ssh -o StrictHostKeyChecking=no -i "$SSH_KEY" ubuntu@"$FRONTEND_PUBLIC_IP" "sudo systemctl reload nginx"

                        echo "✅ Deployment completed successfully!"
                        '''
                    }
                }
            }
        }
    }
    
post {
        success {
            echo "Build and Deployment successful!"

            sh """
            curl -H "Content-Type: application/json" -X POST \
                -d '{"content": "✅ FE Deployment Successful"}' \
                https://discord.com/api/webhooks/1335591978762768384/GN2TZLNWOKRkQ2WQf6j7eB8Aq-FB52iMY2m0lEVJs8ICcFur0fhGhj6oeWEmQfheWmPk
            """

        }
        failure {
            echo "Build or Deployment failed!"

            sh """
            curl -H "Content-Type: application/json" -X POST \
                -d '{"content": "❌ FE Deployment Failed"}' \
                https://discord.com/api/webhooks/1335591978762768384/GN2TZLNWOKRkQ2WQf6j7eB8Aq-FB52iMY2m0lEVJs8ICcFur0fhGhj6oeWEmQfheWmPk
            """

        }
    }
}
