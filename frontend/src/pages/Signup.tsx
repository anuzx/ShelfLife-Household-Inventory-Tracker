import { useMutation } from "@tanstack/react-query"
import { useRef } from "react"
import { signupUser } from "../../api/auth.ts"
import { useNavigate } from "react-router-dom"

export default function Signup() {
  const nameRef = useRef<HTMLInputElement | null>(null)
  const emailRef = useRef<HTMLInputElement | null>(null)
  const passwordRef = useRef<HTMLInputElement | null>(null)
  const navigate = useNavigate()

  const { mutate: signupMutation } = useMutation({
    mutationFn: signupUser,
    onSuccess: () => {
      navigate("/login")
    },
    onError: (error) => {
      console.error(error)
      alert("registration failed")
    }
  })

  function signup() {
    const name = nameRef.current?.value
    const email = emailRef.current?.value
    const password = passwordRef.current?.value

    if (!name || !password || !email) {
      alert("all fields required")
      return
    }

    signupMutation({ name, email, password })
  }
  return (
    <div>
      <input placeholder="name" ref={nameRef} />
      <input placeholder="test@gmail.com" ref={emailRef} />
      <input placeholder="password..." ref={passwordRef} />
      <button onClick={signup}>Signup</button>
    </div>
  )
}

