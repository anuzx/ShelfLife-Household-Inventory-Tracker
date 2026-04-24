import { useMutation } from "@tanstack/react-query"
import { useRef } from "react"
import { useNavigate } from "react-router-dom"
import { signinUser } from "../../api/auth"

export default function Signin() {
  const emailRef = useRef<HTMLInputElement | null>(null)
  const passwordRef = useRef<HTMLInputElement | null>(null)
  const navigate = useNavigate()

  const { mutate: signinMutation } = useMutation({
    mutationFn: signinUser,
    onSuccess: (data) => {
      const token = data.token

      localStorage.setItem("token", token)
      navigate("/household")
    },
    onError: (error) => {
      console.error("Signin failed:", error);
      alert("Invalid credentials");
    },
  })

  function singin() {
    const email = emailRef.current?.value
    const password = passwordRef.current?.value

    if (!email || !password) {
      alert("invalid credentials")
      return
    }

    signinMutation({ email, password })
  }
  return (
    <div>
      <input placeholder="test@gmail.com" ref={emailRef} />
      <input placeholder="password..." ref={passwordRef} />
      <button onClick={singin}>Signin</button>
    </div>
  )
}

