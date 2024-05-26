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
                    sh '''                        
                        docker run --rm -v "$(System.DefaultWorkingDirectory):/workspace/test_playwright" -w /workspace mcr.microsoft.com/playwright:v1.44.1-jammy /bin/bash -c "npm install @playwright/test@1.44.1 && npx playwright test"
                    '''
                    }
                }
            }
        }
    }
    post {
        always {
            archiveArtifacts artifacts: 'playwright-report/**/*', allowEmptyArchive: true
        }
    }
}
