pipeline {
    agent any
    stages {
        stage('Checkout') {
            steps {
                script {
                    deleteDir()
                    checkout scm
                }
            }
        }
        stage('Run Playwright Tests') {
            steps {
                ansiColor('xterm') {
                script {             
                    bat '''                        
                        docker run --rm -v "%WORKSPACE%:/workspace/test_playwright" -w /workspace mcr.microsoft.com/playwright:v1.44.1-jammy /bin/bash -c "npm install @playwright/test@1.44.1; ls /workspace/test_playwright; npx playwright test; ls /workspace/test_playwright"
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
