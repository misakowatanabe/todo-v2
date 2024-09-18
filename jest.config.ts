import type { Config } from 'jest'
import nextJest from 'next/jest.js'
import { compilerOptions } from './tsconfig.json'

const createJestConfig = nextJest({
  dir: './',
})

const config: Config = {
  coverageProvider: 'v8',
  testEnvironment: 'jsdom',
  modulePaths: [compilerOptions.baseUrl],
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/$1',
  },
}

export default createJestConfig(config)
