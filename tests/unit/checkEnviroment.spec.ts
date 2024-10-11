import { loadEnvConfig } from '@next/env'

loadEnvConfig(process.cwd())

test('Checking if the environment variables loaded correctly', () => {
  expect(process.env.NEXT_PUBLIC_NODE_ENV).toBe('development')
})
