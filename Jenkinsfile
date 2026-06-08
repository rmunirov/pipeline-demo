pipeline {

    agent any

    environment {
        IMAGE_NAME = "demo-app"
    }

    stages {

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
		
		stage('Lint') {
			steps {
				sh 'npx eslint .'
			}
		}

        stage('Test') {
            steps {
                sh 'npm test'
            }
        }
		
		stage('Quality Gate') {
			steps {

				script {
					def coverage = readFile('coverage.txt').trim() as Integer

					if (coverage < 80) {
						error("Coverage too low: ${coverage}%")
					}

					echo "Coverage OK"
				}
			}
		}

        stage('Build') {
            steps {
                sh 'npm run build'
            }
        }
		
		stage('Build-stash') {

			agent any

			steps {

				sh '''
				mkdir dist
				echo "build result" > dist/result.txt
				'''

				stash(
					name: 'app',
					includes: 'dist/**'
				)
			}
		}
		
		stage('Test-unstash') {
			agent any

			steps {

				unstash 'app'

				sh 'cat dist/result.txt'
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
		
		stage('Deploy') {

			when {
				expression {
					currentBuild.result == null
				}
			}

			steps {
				echo "Deploying..."
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
			junit 'junit.xml'
            echo 'FINISHED'
        }
    }
}