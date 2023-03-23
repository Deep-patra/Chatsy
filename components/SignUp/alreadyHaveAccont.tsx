export default function DontHaveAccount() {
  return (
    <div className="p-2">
      <span className="text-white2 text-lg" >
        Already have an account? <a href="/login" title="login" className="text-white1 hover:underline">log in</a>
      </span>
    </div>
  )
}