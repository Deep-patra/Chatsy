import { pathsToModuleNameMapper } from 'ts-jest'
import { compilerOptions } from './tsconfig.json'

export default {
  preset: 'ts-jest',
  transform: {
    '^.+\\.(ts|tsx|js)?$': 'ts-jest',
  },

  transformIgnorePatterns: ['node_modules/(?!@dicebear)'],

  moduleDirectories: ['node_modules', '<rootDir>'],
  moduleNameMapper: pathsToModuleNameMapper(compilerOptions.paths, {
    prefix: '<rootDir>',
  }),
}
