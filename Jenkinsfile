pipeline {
  agent { 
    docker { 
      image 'mcr.microsoft.com/playwright:v1.44.1-jammy'
      args '-u root' // Use root user for Docker container to avoid permission issues
    } 
  }
  stages {
    stage('install playwright') {
      steps {
         script {
         def osName = isUnix() ? 'sh' : 'bat'
        "${osName}" '''
          npm i -D @playwright/test
          npx playwright install
        '''
         }
      }
    }
    stage('help') {
      steps {
         script {
          def osName = isUnix() ? 'sh' : 'bat'
          "${osName}" 'npx playwright test --help'
        }
      }
    }
    stage('test') {
      steps {
        script {
          def osName = isUnix() ? 'sh' : 'bat'
        "${osName}" '''
          npx playwright test --list
          npx playwright test
        '''
      }
    }
  }
}
}