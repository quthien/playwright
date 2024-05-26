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
                    // Running Docker commands directly in a bat script
                    bat '''
                        docker run --rm -v %cd%:/workspace -w /workspace mcr.microsoft.com/playwright:v1.44.1-jammy /bin/bash -c "
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
                    bat '''
                        docker run --rm -v %cd%:/workspace -w /workspace mcr.microsoft.com/playwright:v1.44.1-jammy /bin/bash -c "
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
