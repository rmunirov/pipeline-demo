pipeline {

    agent any

    environment {
        IMAGE_NAME = "demo-app"
    }

    stages {
	    stage('Docker Test') {
            steps {
                sh '''
                    whoami
                    docker ps
                '''
            }
        }

        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Install') {
            steps {
                sh 'npm install'
            }
        }

        stage('Test') {
            steps {
                sh 'npm test'
            }
        }

        stage('Build') {
            steps {
                sh 'npm run build'
            }
        }

        stage('Package') {
            steps {
                archiveArtifacts artifacts: 'dist/**'
            }
        }

        stage('Docker Build') {
            steps {
                sh '''
                docker build \
                    -t ${IMAGE_NAME}:${BUILD_NUMBER} .
                '''
            }
        }

		stage('Images') {
			steps {
				sh 'docker images'
			}
		}

        stage('Cleanup') {
            steps {
                sh 'docker image prune -f'
            }
        }
    }

    post {

        success {
            echo 'SUCCESS'
        }

        failure {
            echo 'FAILED'
        }

        always {
            echo 'FINISHED'
        }
    }
}