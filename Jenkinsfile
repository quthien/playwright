pipeline {
    agent any
    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }
        stage('Install Playwright') {
            steps {
                script {
                    powershell '''
                        $workspace = "${env.WORKSPACE}".Replace("\", "/")
                        docker run --rm -v "$workspace:/workspace" -w /workspace mcr.microsoft.com/playwright:v1.44.1-jammy /bin/bash -c "
                        npm i -D @playwright/test &&
                        npx playwright install
                        "
                    '''
                }
            }
        }
        stage('Run Playwright Tests') {
            steps {
                script {
                    powershell '''
                        $workspace = "${env.WORKSPACE}".Replace("\", "/")
                        docker run --rm -v "$workspace:/workspace" -w /workspace mcr.microsoft.com/playwright:v1.44.1-jammy /bin/bash -c "
                        npx playwright test --list &&
                        npx playwright test
                        "
                    '''
                }
            }
        }
    }
    post {
        always {
            archiveArtifacts artifacts: 'playwright-report/**/*', allowEmptyArchive: true
            junit 'playwright-report/*.xml'
        }
    }
}
