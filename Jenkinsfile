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
                        docker run -v "%WORKSPACE%:/workspace/test_playwright" -w /workspace mcr.microsoft.com/playwright:v1.44.1-jammy /bin/bash -c "npm install @playwright/test@1.44.1 && ls -l /workspace && npx playwright test"
                        '''
                    }
                }
            }
        }
    }
    post {
        always {
                echo "Listing files in the workspace before archiving..."
                bat 'dir %WORKSPACE%'
                echo "Listing files in the report directory before archiving..."
                bat 'dir %WORKSPACE%\\playwright-report'
                
                echo "Archiving artifacts..."
                archiveArtifacts artifacts: 'playwright-report/**', allowEmptyArchive: true
                echo "Archiving complete."
        }
    }
}
