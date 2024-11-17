import { getUserFromSession } from '@/utils/getUserFromSession'
import { NextRequest } from 'next/server'

jest.mock('@/utils/getUserFromSession', () => {
  return {
    __esModule: true,
    getUserFromSession: jest.fn(),
  }
})

it('if the getUserSession module is mocked', () => {
  ;(getUserFromSession as jest.Mock).mockImplementation((req: NextRequest) => {
    return {}
  })

  expect(
    getUserFromSession(new NextRequest(new URL('/', 'http://localhost:5000')))
  ).toStrictEqual({})
})
