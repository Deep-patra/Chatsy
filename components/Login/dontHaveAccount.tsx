export default function DontHaveAccount() {
  return (
    <div className="p-2">
      <span className="text-white2 text-lg">
        Don&apos;t have an account?{' '}
        <a href="/signup" title="login" className="text-white1 hover:underline">
          sign up
        </a>
      </span>
    </div>
  )
}
