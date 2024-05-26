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
                        docker run  -v "%WORKSPACE%:/workspace/test_playwright" -w /workspace mcr.microsoft.com/playwright:v1.44.1-jammy /bin/bash -c "npm install @playwright/test @playwright/test@1.44.1"
                    '''
                }
            }
        }
        stage('Verify Playwright Installation') {
            steps {
                script {
                    bat '''
                        docker run -v "%WORKSPACE%:/workspace/test_playwright" -w /workspace mcr.microsoft.com/playwright:v1.44.1-jammy /bin/bash -c "npm list @playwright/test --depth=0"
                    '''
                }
            }
        }
        stage('Run Playwright Tests') {
            steps {
                script {
                    bat '''                        
                        docker run --rm -v "%WORKSPACE%:/workspace/test_playwright" -w /workspace mcr.microsoft.com/playwright:v1.44.1-jammy /bin/bash -c "npx playwright test --list && npx playwright test"
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
