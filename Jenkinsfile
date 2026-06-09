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
		
		stage('Checks') {

			parallel {

				stage('Lint') {
					steps {
						sh 'sleep 5'
					}
				}

				stage('Tests') {
					steps {
						sh 'sleep 10'
					}
				}

				stage('Security') {
					steps {
						sh 'sleep 7'
					}
				}
			}
		}
		
		stage('Quality Checks') {

			parallel {

				stage('Lint') {
					steps {
						sh 'echo Lint'
					}
				}

				stage('Unit Tests') {
					steps {
						sh 'echo Tests'
					}
				}

				stage('Coverage') {
					steps {
						sh 'echo Coverage'
					}
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
				mkdir -p dist
				echo "build result" > dist/result.txt
				'''

				stash(
					name: 'app',
					includes: 'dist/**'
				)
			}
		}
		
		stage('Build Image') {

			steps {

				sh '''
				docker build \
					-t demo-app:${BUILD_NUMBER} .
				'''
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
		
		stage('Tag Image') {

			steps {

				sh '''
				docker tag \
				demo-app:${BUILD_NUMBER} \
				railko/demo-app:${BUILD_NUMBER}
				'''
			}
		}
		
		stage('Push Image') {

			steps {

				withCredentials([
					usernamePassword(
						credentialsId: 'dockerhub',
						usernameVariable: 'DOCKER_USER',
						passwordVariable: 'DOCKER_PASS'
					)
				]) {

					sh '''
					docker login \
						-u $DOCKER_USER \
						-p $DOCKER_PASS

					docker push \
						railko/demo-app:${BUILD_NUMBER}
					'''
				}
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