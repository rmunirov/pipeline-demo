pipeline {
    agent any

    stages {

        stage('Hello') {
            steps {
                sh 'echo From Jenkinsfile'
            }
        }

        stage('System Info') {
            steps {
                sh 'hostname'
                sh 'pwd'
            }
        }
    }
}