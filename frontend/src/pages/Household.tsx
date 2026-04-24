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

  // Create household 
  const { mutate: createMutate, isPending: isCreating } = useMutation({
    mutationFn: () => createHouseHold({ name: nameRef.current?.value ?? "" }),
    onSuccess: (data) => {
      // Show the invite code so the user can share it before navigating
      const code = data.houseHold?.inviteCode
      if (code) setGeneratedCode(code)
      navigate("/dashboard")
    },
    onError: (error) => {
      console.error("Create failed:", error)
      alert("Failed to create household. Please try again.")
    },
  })

  // Join household 
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

  function handleDone() {
    navigate("/dashboard")
  }

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        {/* Header */}
        <div style={styles.header}>
          <h1 style={styles.title}>Your Household</h1>
          <p style={styles.subtitle}>Create a new room or join an existing one</p>
        </div>

        {/* Mode selector — only show if no mode chosen yet */}
        {!mode && (
          <div style={styles.btnRow}>
            <button style={{ ...styles.btn, ...styles.btnPrimary }} onClick={() => setMode("create")}>
              + Create Room
            </button>
            <button style={{ ...styles.btn, ...styles.btnSecondary }} onClick={() => setMode("join")}>
              Join Room
            </button>
          </div>
        )}

        {/* ── CREATE FLOW ── */}
        {mode === "create" && !generatedCode && (
          <div style={styles.form}>
            <label style={styles.label}>Room Name</label>
            <input
              ref={nameRef}
              style={styles.input}
              placeholder="e.g. The Smith Family"
              autoFocus
            />
            <div style={styles.btnRow}>
              <button style={{ ...styles.btn, ...styles.btnGhost }} onClick={() => setMode(null)}>
                ← Back
              </button>
              <button
                style={{ ...styles.btn, ...styles.btnPrimary }}
                onClick={() => createMutate()}
                disabled={isCreating}
              >
                {isCreating ? "Creating…" : "Create →"}
              </button>
            </div>
          </div>
        )}

        {/* ── CREATE SUCCESS — show invite code ── */}
        {mode === "create" && generatedCode && (
          <div style={styles.form}>
            <p style={styles.successText}>🎉 Household created!</p>
            <label style={styles.label}>Invite Code — share this with your household members</label>
            <div style={styles.codeRow}>
              <span style={styles.code}>{generatedCode}</span>
              <button style={{ ...styles.btn, ...styles.btnGhost }} onClick={handleCopy}>
                {copied ? "✓ Copied" : "Copy"}
              </button>
            </div>
            <button style={{ ...styles.btn, ...styles.btnPrimary, width: "100%" }} onClick={handleDone}>
              Done → Go to Dashboard
            </button>
          </div>
        )}

        {/* ── JOIN FLOW ── */}
        {mode === "join" && (
          <div style={styles.form}>
            <label style={styles.label}>Invite Code</label>
            <input
              ref={inviteInputRef}
              style={styles.input}
              placeholder="Paste 6-character code"
              maxLength={6}
              autoFocus
            />
            <div style={styles.btnRow}>
              <button style={{ ...styles.btn, ...styles.btnGhost }} onClick={() => setMode(null)}>
                ← Back
              </button>
              <button
                style={{ ...styles.btn, ...styles.btnPrimary }}
                onClick={() => joinMutate()}
                disabled={isJoining}
              >
                {isJoining ? "Joining…" : "Join →"}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

// ── Inline styles (swap for Tailwind / CSS modules if preferred) ──
const styles: Record<string, React.CSSProperties> = {
  page: {
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "#f5f5f0",
    fontFamily: "'Segoe UI', sans-serif",
  },
  card: {
    background: "#fff",
    borderRadius: 16,
    padding: "40px 36px",
    width: "100%",
    maxWidth: 440,
    boxShadow: "0 4px 24px rgba(0,0,0,0.10)",
  },
  header: {
    textAlign: "center",
    marginBottom: 32,
  },
  icon: { fontSize: 40 },
  title: { margin: "8px 0 4px", fontSize: 26, fontWeight: 700, color: "#1a1a1a" },
  subtitle: { margin: 0, color: "#666", fontSize: 14 },
  form: { display: "flex", flexDirection: "column", gap: 16 },
  label: { fontSize: 13, fontWeight: 600, color: "#444", marginBottom: -8 },
  input: {
    padding: "12px 14px",
    border: "1.5px solid #ddd",
    borderRadius: 10,
    fontSize: 15,
    outline: "none",
    transition: "border-color .2s",
  },
  btnRow: { display: "flex", gap: 12, marginTop: 4 },
  btn: {
    flex: 1,
    padding: "12px 20px",
    borderRadius: 10,
    fontSize: 15,
    fontWeight: 600,
    cursor: "pointer",
    border: "none",
    transition: "opacity .15s",
  },
  btnPrimary: { background: "#2e7d32", color: "#fff" },
  btnSecondary: { background: "#1565c0", color: "#fff" },
  btnGhost: { background: "#f0f0f0", color: "#333", flex: "0 0 auto" },
  codeRow: {
    display: "flex",
    alignItems: "center",
    gap: 12,
    background: "#f5f5f0",
    borderRadius: 10,
    padding: "12px 16px",
  },
  code: { flex: 1, fontFamily: "monospace", fontSize: 22, fontWeight: 700, letterSpacing: 4, color: "#1a1a1a" },
  successText: { textAlign: "center", fontSize: 18, fontWeight: 600, margin: 0 },
}
