import { useMutation } from "@tanstack/react-query"
import { useRef, useState } from "react"
import { useNavigate } from "react-router-dom"
import { createHouseHold, joinHouseHold } from "../../api/household"

type Mode = null | "create" | "join"

export default function Household() {
  const nameRef = useRef<HTMLInputElement | null>(null)
  const inviteInputRef = useRef<HTMLInputElement | null>(null)
  const navigate = useNavigate()
  const [mode, setMode] = useState<Mode>(null)
  const [generatedCode, setGeneratedCode] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)

  const { mutate: createMutate, isPending: isCreating } = useMutation({
    mutationFn: () => createHouseHold({ name: nameRef.current?.value ?? "" }),
    onSuccess: (data) => {
      const code = data.houseHold?.inviteCode
      if (code) setGeneratedCode(code)
      else navigate("/dashboard")
    },
    onError: (error) => {
      console.error("Create failed:", error)
      alert("Failed to create household. Please try again.")
    },
  })

  const { mutate: joinMutate, isPending: isJoining } = useMutation({
    mutationFn: () => joinHouseHold({ inviteCode: inviteInputRef.current?.value ?? "" }),
    onSuccess: () => {
      navigate("/dashboard")
    },
    onError: (error) => {
      console.error("Join failed:", error)
      alert("Invalid invite code. Please try again.")
    },
  })

  function handleCopy() {
    if (!generatedCode) return
    navigator.clipboard.writeText(generatedCode)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-4">
      <div className="w-full max-w-sm">

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-xl font-semibold text-gray-900 tracking-tight">Household</h1>
          <p className="text-sm text-gray-500 mt-1">Create a new room or join an existing one</p>
        </div>

        {/* Mode selector */}
        {!mode && (
          <div className="flex gap-2">
            <button
              onClick={() => setMode("create")}
              className="flex-1 border border-gray-900 text-gray-900 text-sm font-medium py-2 rounded hover:bg-gray-900 hover:text-white transition-colors"
            >
              Create room
            </button>
            <button
              onClick={() => setMode("join")}
              className="flex-1 border border-gray-300 text-gray-700 text-sm font-medium py-2 rounded hover:border-gray-500 transition-colors"
            >
              Join room
            </button>
          </div>
        )}

        {/* Create flow */}
        {mode === "create" && !generatedCode && (
          <div className="space-y-3">
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Room name</label>
              <input
                ref={nameRef}
                type="text"
                placeholder="e.g. The Smith Family"
                autoFocus
                className="w-full border border-gray-300 rounded px-3 py-2 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:border-gray-600"
              />
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setMode(null)}
                className="px-4 py-2 text-sm text-gray-500 hover:text-gray-800 border border-gray-200 rounded"
              >
                Back
              </button>
              <button
                onClick={() => createMutate()}
                disabled={isCreating}
                className="flex-1 bg-gray-900 text-white text-sm font-medium py-2 rounded hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isCreating ? "Creating..." : "Create"}
              </button>
            </div>
          </div>
        )}

        {/* Create success — invite code */}
        {mode === "create" && generatedCode && (
          <div className="space-y-4">
            <div>
              <p className="text-sm font-medium text-gray-700 mb-1">Room created</p>
              <p className="text-xs text-gray-500">Share this code with your household members</p>
            </div>

            <div className="flex items-center justify-between border border-gray-200 rounded px-3 py-3 bg-gray-50">
              <span className="font-mono text-lg font-semibold tracking-widest text-gray-900">
                {generatedCode}
              </span>
              <button
                onClick={handleCopy}
                className="text-xs text-gray-500 hover:text-gray-900 border border-gray-300 rounded px-2 py-1"
              >
                {copied ? "Copied" : "Copy"}
              </button>
            </div>

            <button
              onClick={() => navigate("/dashboard")}
              className="w-full bg-gray-900 text-white text-sm font-medium py-2 rounded hover:bg-gray-700"
            >
              Go to dashboard
            </button>
          </div>
        )}

        {/* Join flow */}
        {mode === "join" && (
          <div className="space-y-3">
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Invite code</label>
              <input
                ref={inviteInputRef}
                type="text"
                placeholder="6-character code"
                maxLength={6}
                autoFocus
                className="w-full border border-gray-300 rounded px-3 py-2 text-sm font-mono tracking-widest text-gray-900 placeholder-gray-400 placeholder:tracking-normal focus:outline-none focus:border-gray-600"
              />
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setMode(null)}
                className="px-4 py-2 text-sm text-gray-500 hover:text-gray-800 border border-gray-200 rounded"
              >
                Back
              </button>
              <button
                onClick={() => joinMutate()}
                disabled={isJoining}
                className="flex-1 bg-gray-900 text-white text-sm font-medium py-2 rounded hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isJoining ? "Joining..." : "Join"}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
