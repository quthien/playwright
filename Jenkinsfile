pipeline {
     agent any
    stages {
        stage('Checkout') {
            steps {
                script {
                    cleanWs()
                    checkout scm
                }
            }
        }
        stage('Run Playwright Tests') {
            steps {
                ansiColor('xterm') {
                script {             
                    bat '''                        
                        docker run --rm -v "%WORKSPACE%:/workspace/test_playwright" -w /workspace mcr.microsoft.com/playwright:v1.44.1-jammy /bin/bash -c "npm install @playwright/test@1.44.1; ls /workspace/test_playwright; npx playwright test --config=/workspace/test_playwright/playwright.config.ts"
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
