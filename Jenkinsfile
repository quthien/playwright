pipeline {
    agent any
    stages {
        stage('Checkout') {
            steps {
                script {
                    checkout scm
                }
            }
        }

        stage('Install Playwright') {
            steps {
                script {
                    bat '''
                        echo "Workspace path: %WORKSPACE%"
                        docker run --rm -v "%WORKSPACE%:/workspace" -w /workspace mcr.microsoft.com/playwright:v1.44.1-jammy /bin/bash -c "npm install -D @playwright/test && npx playwright install"
                    '''
                }
            }
        }

        stage('Run Playwright Tests') {
            steps {
                script {
                    bat '''
                        echo "Workspace path: %WORKSPACE%"
                        docker run --rm -v "%WORKSPACE%:/workspace" -w /workspace mcr.microsoft.com/playwright:v1.44.1-jammy /bin/bash -c "npx playwright test --list && npx playwright test"
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
