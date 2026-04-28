import { useMutation } from "@tanstack/react-query"
import { useRef } from "react"
import { signupUser } from "../../api/auth.ts"
import { useNavigate } from "react-router-dom"

export default function Signup() {
  const nameRef = useRef<HTMLInputElement | null>(null)
  const emailRef = useRef<HTMLInputElement | null>(null)
  const passwordRef = useRef<HTMLInputElement | null>(null)
  const navigate = useNavigate()

  const { mutate: signupMutation, isPending } = useMutation({
    mutationFn: signupUser,
    onSuccess: () => {
      navigate("/login")
    },
    onError: (error) => {
      console.error(error)
      alert("Registration failed")
    },
  })

  function signup() {
    const name = nameRef.current?.value
    const email = emailRef.current?.value
    const password = passwordRef.current?.value

    if (!name || !email || !password) {
      alert("All fields are required")
      return
    }

    signupMutation({ name, email, password })
  }

  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-4">
      <div className="w-full max-w-sm">

        <div className="mb-8">
          <h1 className="text-xl font-semibold text-gray-900 tracking-tight">Create account</h1>
          <p className="text-sm text-gray-500 mt-1">Fill in the details below to get started</p>
        </div>

        <div className="space-y-3">
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Name</label>
            <input
              ref={nameRef}
              type="text"
              placeholder="Your name"
              className="w-full border border-gray-300 rounded px-3 py-2 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:border-gray-600"
            />
          </div>

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
            onClick={signup}
            disabled={isPending}
            className="w-full bg-gray-900 text-white text-sm font-medium py-2 rounded hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed mt-1"
          >
            {isPending ? "Creating account..." : "Create account"}
          </button>
        </div>

        <p className="text-xs text-gray-400 mt-6">
          Already have an account?{" "}
          <a href="/login" className="text-gray-900 underline underline-offset-2">
            Sign in
          </a>
        </p>
      </div>
    </div>
  )
}
