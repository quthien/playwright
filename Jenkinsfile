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
        stage('Run Playwright Tests') {
            steps {
                ansiColor('xterm') {
                script {             
                    bat '''                        
                        docker run --rm -v "%WORKSPACE%:/workspace/test_playwright" -w /workspace/test_playwright mcr.microsoft.com/playwright:v1.44.1-jammy /bin/bash -c "npm install @playwright/test@1.44.1 && ls && npx playwright test && ls"
                        '''
                    }
                }
            }
        }
    }
    post {
        always {
                archiveArtifacts artifacts: 'playwright-report/**', allowEmptyArchive: true
        }
    }
}
