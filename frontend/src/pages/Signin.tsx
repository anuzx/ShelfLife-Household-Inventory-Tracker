import { useMutation } from "@tanstack/react-query"
import { useRef } from "react"
import { useNavigate } from "react-router-dom"
import { signinUser } from "../../api/auth"

export default function Signin() {
  const emailRef = useRef<HTMLInputElement | null>(null)
  const passwordRef = useRef<HTMLInputElement | null>(null)
  const navigate = useNavigate()

  const { mutate: signinMutation, isPending } = useMutation({
    mutationFn: signinUser,
    onSuccess: (data) => {
      localStorage.setItem("token", data.token)
      navigate("/household")
    },
    onError: (error) => {
      console.error("Signin failed:", error)
      alert("Invalid credentials")
    },
  })

  function signin() {
    const email = emailRef.current?.value
    const password = passwordRef.current?.value

    if (!email || !password) {
      alert("All fields are required")
      return
    }

    signinMutation({ email, password })
  }

  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-4">
      <div className="w-full max-w-sm">

        <div className="mb-8">
          <h1 className="text-xl font-semibold text-gray-900 tracking-tight">Sign in</h1>
          <p className="text-sm text-gray-500 mt-1">Enter your credentials to continue</p>
        </div>

        <div className="space-y-3">
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Email</label>
            <input
              ref={emailRef}
              type="email"
              placeholder="you@example.com"
              className="w-full border border-gray-300 rounded px-3 py-2 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:border-gray-600"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Password</label>
            <input
              ref={passwordRef}
              type="password"
              placeholder="••••••••"
              className="w-full border border-gray-300 rounded px-3 py-2 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:border-gray-600"
            />
          </div>

          <button
            onClick={signin}
            disabled={isPending}
            className="w-full bg-gray-900 text-white text-sm font-medium py-2 rounded hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed mt-1"
          >
            {isPending ? "Signing in..." : "Sign in"}
          </button>
        </div>

        <p className="text-xs text-gray-400 mt-6">
          Don't have an account?{" "}
          <a href="/signup" className="text-gray-900 underline underline-offset-2">
            Sign up
          </a>
        </p>
      </div>
    </div>
  )
}
