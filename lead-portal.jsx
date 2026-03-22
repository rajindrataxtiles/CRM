import { useState, useEffect } from "react";

const SK = { employees: "lhub:employees", leads: "lhub:leads", creds: "lhub:credentials", adminPwd: "lhub:adminpwd" };
const DEFAULT_ADMIN_PASSWORD = "admin@123";
const INITIAL_EMPLOYEES = [
  { id: "e1", name: "Rahul Sharma", phone: "9876543210", email: "rahul@company.com", role: "Sales Executive", avatar: "RS" },
  { id: "e2", name: "Priya Singh", phone: "9123456789", email: "priya@company.com", role: "Senior Executive", avatar: "PS" },
];
const INITIAL_LEADS = [
  { id: "l1", name: "Amit Verma", phone: "9000000001", email: "amit@gmail.com", source: "Website", priority: "high", status: "new", assignedTo: "e1", notes: "Interested in Premium Plan", createdAt: new Date().toISOString(), value: 25000 },
  { id: "l2", name: "Sunita Patel", phone: "9000000002", email: "sunita@gmail.com", source: "Referral", priority: "medium", status: "contacted", assignedTo: "e2", notes: "Follow up on Monday", createdAt: new Date().toISOString(), value: 15000 },
];
const STATUS_CONFIG = {
  new: { label: "New", color: "#3b82f6", bg: "#1e3a5f" },
  contacted: { label: "Contacted", color: "#f59e0b", bg: "#3d2a05" },
  interested: { label: "Interested", color: "#8b5cf6", bg: "#2d1f4e" },
  converted: { label: "Converted", color: "#10b981", bg: "#0a3728" },
  lost: { label: "Lost", color: "#ef4444", bg: "#3d1212" },
};
const PRIORITY_CONFIG = { high: { label: "High", color: "#ef4444" }, medium: { label: "Medium", color: "#f59e0b" }, low: { label: "Low", color: "#6b7280" } };

function genId(p) { return p + Date.now() + Math.random().toString(36).slice(2, 5); }
function genLoginId(name) { return name.toLowerCase().replace(/\s+/g, ".").replace(/[^a-z.]/g, "").slice(0, 12) + Math.floor(Math.random() * 90 + 10); }
function genPassword() { const c = "ABCDEFGHJKMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789@#!"; return Array.from({ length: 8 }, () => c[Math.floor(Math.random() * c.length)]).join(""); }

function Avatar({ initials = "?", size = 36, color }) {
  const colors = ["#f97316","#3b82f6","#8b5cf6","#10b981","#f59e0b","#ec4899"];
  const bg = color || colors[(initials.charCodeAt(0) || 0) % colors.length];
  return <div style={{ width: size, height: size, borderRadius: "50%", background: bg, display: "flex", alignItems: "center", justifyContent: "center", fontSize: size * 0.35, fontWeight: 700, color: "#fff", flexShrink: 0 }}>{initials}</div>;
}
function Badge({ status, type = "status" }) {
  const cfg = type === "status" ? STATUS_CONFIG[status] : PRIORITY_CONFIG[status];
  if (!cfg) return null;
  return <span style={{ padding: "3px 10px", borderRadius: 20, fontSize: 11, fontWeight: 600, color: cfg.color, background: cfg.bg || "transparent", border: `1px solid ${cfg.color}33`, letterSpacing: 0.5 }}>{cfg.label}</span>;
}
function Modal({ title, onClose, children, maxWidth = 520 }) {
  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.82)", zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center", padding: 16, backdropFilter: "blur(6px)" }} onClick={e => e.target === e.currentTarget && onClose()}>
      <div style={{ background: "#161b2e", border: "1px solid #2a3150", borderRadius: 16, width: "100%", maxWidth, maxHeight: "90vh", overflowY: "auto", padding: 28, boxShadow: "0 25px 60px rgba(0,0,0,0.7)" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
          <h3 style={{ margin: 0, fontSize: 18, color: "#f1f5f9", fontWeight: 700 }}>{title}</h3>
          <button onClick={onClose} style={{ background: "none", border: "none", color: "#64748b", cursor: "pointer", fontSize: 24, lineHeight: 1, padding: 0 }}>×</button>
        </div>
        {children}
      </div>
    </div>
  );
}
function FInput({ label, ...props }) {
  const [f, setF] = useState(false);
  return (
    <div style={{ marginBottom: 14 }}>
      {label && <label style={{ display: "block", fontSize: 11, color: "#94a3b8", marginBottom: 6, fontWeight: 700, letterSpacing: 0.8, textTransform: "uppercase" }}>{label}</label>}
      <input {...props} style={{ width: "100%", background: "#0d1117", border: `1px solid ${f ? "#f97316" : "#2a3150"}`, borderRadius: 8, padding: "10px 12px", color: "#f1f5f9", fontSize: 14, outline: "none", boxSizing: "border-box", fontFamily: "inherit", transition: "border-color 0.2s", ...props.style }}
        onFocus={() => setF(true)} onBlur={() => setF(false)} />
    </div>
  );
}
function FSelect({ label, options, ...props }) {
  return (
    <div style={{ marginBottom: 14 }}>
      {label && <label style={{ display: "block", fontSize: 11, color: "#94a3b8", marginBottom: 6, fontWeight: 700, letterSpacing: 0.8, textTransform: "uppercase" }}>{label}</label>}
      <select {...props} style={{ width: "100%", background: "#0d1117", border: "1px solid #2a3150", borderRadius: 8, padding: "10px 12px", color: "#f1f5f9", fontSize: 14, outline: "none", cursor: "pointer", fontFamily: "inherit", boxSizing: "border-box" }}>
        {options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
      </select>
    </div>
  );
}
function FTextarea({ label, ...props }) {
  const [f, setF] = useState(false);
  return (
    <div style={{ marginBottom: 14 }}>
      {label && <label style={{ display: "block", fontSize: 11, color: "#94a3b8", marginBottom: 6, fontWeight: 700, letterSpacing: 0.8, textTransform: "uppercase" }}>{label}</label>}
      <textarea {...props} rows={3} style={{ width: "100%", background: "#0d1117", border: `1px solid ${f ? "#f97316" : "#2a3150"}`, borderRadius: 8, padding: "10px 12px", color: "#f1f5f9", fontSize: 14, outline: "none", resize: "vertical", boxSizing: "border-box", fontFamily: "inherit" }}
        onFocus={() => setF(true)} onBlur={() => setF(false)} />
    </div>
  );
}
function Btn({ children, variant = "primary", onClick, style = {}, small, disabled }) {
  const base = { border: "none", borderRadius: 8, cursor: disabled ? "not-allowed" : "pointer", fontWeight: 600, padding: small ? "6px 14px" : "10px 20px", fontSize: small ? 12 : 14, transition: "all 0.2s", fontFamily: "inherit", letterSpacing: 0.3, opacity: disabled ? 0.5 : 1 };
  const V = { primary: { background: "#f97316", color: "#fff" }, secondary: { background: "#1e2a45", color: "#94a3b8", border: "1px solid #2a3150" }, danger: { background: "#3d1212", color: "#ef4444", border: "1px solid #ef444433" }, success: { background: "#0a3728", color: "#10b981", border: "1px solid #10b98133" }, ghost: { background: "transparent", color: "#64748b" } };
  return <button style={{ ...base, ...V[variant], ...style }} onClick={onClick} disabled={disabled}>{children}</button>;
}

// ─── LOGIN ───────────────────────────────────────────────────────────
function LoginScreen({ onLogin, employees, credentials, adminPassword }) {
  const [role, setRole] = useState("admin");
  const [loginId, setLoginId] = useState("");
  const [password, setPassword] = useState("");
  const [showPwd, setShowPwd] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  function handleLogin() {
    setError(""); setLoading(true);
    setTimeout(() => {
      setLoading(false);
      if (role === "admin") {
        if (loginId.trim() === "admin" && password === adminPassword) onLogin({ role: "admin" });
        else setError("Invalid Admin ID ya Password");
      } else {
        const cred = credentials.find(c => c.loginId === loginId.trim() && c.password === password);
        if (cred) {
          const emp = employees.find(e => e.id === cred.empId);
          if (emp) onLogin({ role: "employee", empId: emp.id, name: emp.name, avatar: emp.avatar });
          else setError("Employee nahi mila");
        } else setError("Invalid Login ID ya Password");
      }
    }, 700);
  }

  return (
    <div style={{ minHeight: "100vh", background: "#080c14", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'DM Sans','Segoe UI',sans-serif", padding: 16 }}>
      <div style={{ position: "fixed", top: "15%", left: "50%", transform: "translateX(-50%)", width: 700, height: 500, background: "radial-gradient(ellipse,#f9731612 0%,transparent 70%)", pointerEvents: "none" }} />
      <div style={{ width: "100%", maxWidth: 420, position: "relative" }}>
        <div style={{ textAlign: "center", marginBottom: 36 }}>
          <div style={{ width: 68, height: 68, borderRadius: 20, background: "linear-gradient(135deg,#f97316,#ef4444)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 34, margin: "0 auto 14px", boxShadow: "0 8px 32px #f9731640" }}>⚡</div>
          <h1 style={{ margin: 0, fontSize: 30, fontWeight: 900, color: "#f1f5f9", letterSpacing: -1 }}>LeadHub</h1>
          <p style={{ margin: "6px 0 0", fontSize: 13, color: "#475569" }}>Lead Management Portal</p>
        </div>
        <div style={{ background: "#0f1623", border: "1px solid #1e2a45", borderRadius: 20, padding: 32, boxShadow: "0 24px 64px rgba(0,0,0,0.6)" }}>
          <div style={{ display: "flex", background: "#080c14", borderRadius: 10, padding: 4, marginBottom: 24, border: "1px solid #1e2a45" }}>
            {["admin", "employee"].map(r => (
              <button key={r} onClick={() => { setRole(r); setError(""); setLoginId(""); setPassword(""); }} style={{ flex: 1, padding: "9px 0", borderRadius: 8, border: "none", cursor: "pointer", fontWeight: 700, fontSize: 13, fontFamily: "inherit", transition: "all 0.2s", background: role === r ? "#f97316" : "transparent", color: role === r ? "#fff" : "#475569" }}>
                {r === "admin" ? "👑 Admin" : "👤 Employee"}
              </button>
            ))}
          </div>
          {role === "admin" && (
            <div style={{ background: "#1a2035", borderRadius: 8, padding: "9px 14px", marginBottom: 18, fontSize: 12, color: "#64748b" }}>
              <span style={{ color: "#f97316" }}>ℹ</span> Default: ID <strong style={{ color: "#94a3b8" }}>admin</strong> · Pass <strong style={{ color: "#94a3b8" }}>{adminPassword}</strong>
            </div>
          )}
          <FInput label="Login ID" value={loginId} onChange={e => setLoginId(e.target.value)} placeholder={role === "admin" ? "admin" : "Employee login ID"} onKeyDown={e => e.key === "Enter" && handleLogin()} />
          <div style={{ position: "relative" }}>
            <FInput label="Password" type={showPwd ? "text" : "password"} value={password} onChange={e => setPassword(e.target.value)} placeholder="Password dalein" onKeyDown={e => e.key === "Enter" && handleLogin()} style={{ paddingRight: 44 }} />
            <button onClick={() => setShowPwd(p => !p)} style={{ position: "absolute", right: 12, top: 34, background: "none", border: "none", color: "#475569", cursor: "pointer", fontSize: 16 }}>{showPwd ? "🙈" : "👁"}</button>
          </div>
          {error && <div style={{ background: "#3d1212", border: "1px solid #ef444433", borderRadius: 8, padding: "10px 14px", fontSize: 13, color: "#ef4444", marginBottom: 14 }}>⚠ {error}</div>}
          <Btn onClick={handleLogin} disabled={loading} style={{ width: "100%", padding: "13px", fontSize: 15, borderRadius: 10, textAlign: "center" }}>
            {loading ? "Logging in..." : "Login →"}
          </Btn>
        </div>
        <p style={{ textAlign: "center", fontSize: 11, color: "#1e2a45", marginTop: 20 }}>LeadHub v2.0 · Secure Portal</p>
      </div>
    </div>
  );
}

// ─── EMPLOYEE VIEW ───────────────────────────────────────────────────
function EmployeeDashboard({ user, leads, onUpdateLead, onLogout }) {
  const myLeads = leads.filter(l => l.assignedTo === user.empId);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const filtered = myLeads.filter(l => {
    const ms = !search || l.name.toLowerCase().includes(search.toLowerCase()) || l.phone.includes(search);
    return ms && (filterStatus === "all" || l.status === filterStatus);
  });
  const stats = { total: myLeads.length, active: myLeads.filter(l => l.status !== "lost" && l.status !== "converted").length, converted: myLeads.filter(l => l.status === "converted").length, value: myLeads.filter(l => l.status === "converted").reduce((s, l) => s + (l.value || 0), 0) };

  return (
    <div style={{ minHeight: "100vh", background: "#080c14", fontFamily: "'DM Sans','Segoe UI',sans-serif", color: "#f1f5f9" }}>
      <div style={{ background: "#0a0f1e", borderBottom: "1px solid #1a2035", padding: "14px 24px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ width: 34, height: 34, borderRadius: 10, background: "linear-gradient(135deg,#f97316,#ef4444)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18 }}>⚡</div>
          <div><div style={{ fontWeight: 800, fontSize: 15 }}>LeadHub</div><div style={{ fontSize: 10, color: "#475569" }}>Employee Portal</div></div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <Avatar initials={user.avatar} size={32} />
            <div style={{ fontSize: 13 }}><div style={{ fontWeight: 600 }}>{user.name}</div><div style={{ fontSize: 11, color: "#475569" }}>Employee</div></div>
          </div>
          <Btn small variant="secondary" onClick={onLogout}>Logout</Btn>
        </div>
      </div>
      <div style={{ padding: 24, maxWidth: 900, margin: "0 auto" }}>
        <div style={{ display: "flex", gap: 14, marginBottom: 20, flexWrap: "wrap" }}>
          {[{ icon: "📋", l: "My Leads", v: stats.total, c: "#3b82f6" }, { icon: "🔥", l: "Active", v: stats.active, c: "#f97316" }, { icon: "✅", l: "Converted", v: stats.converted, c: "#10b981" }, { icon: "💰", l: "Revenue", v: `₹${(stats.value / 1000).toFixed(0)}K`, c: "#8b5cf6" }].map(s => (
            <div key={s.l} style={{ flex: 1, minWidth: 120, background: "#0f1623", border: "1px solid #1e2a45", borderRadius: 12, padding: "16px 18px", borderTop: `3px solid ${s.c}` }}>
              <div style={{ fontSize: 20, marginBottom: 5 }}>{s.icon}</div>
              <div style={{ fontSize: 24, fontWeight: 800 }}>{s.v}</div>
              <div style={{ fontSize: 12, color: "#64748b", marginTop: 2 }}>{s.l}</div>
            </div>
          ))}
        </div>
        <div style={{ background: "#1a2035", border: "1px solid #2a3150", borderRadius: 10, padding: "10px 16px", marginBottom: 18, fontSize: 13, color: "#64748b" }}>
          ℹ️ Sirf apne assigned leads dikh rahe hain. Status update kar sakte ho.
        </div>
        <div style={{ display: "flex", gap: 10, marginBottom: 16, flexWrap: "wrap" }}>
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="🔍  Search..." style={{ flex: 1, minWidth: 160, background: "#0f1623", border: "1px solid #1e2a45", borderRadius: 8, padding: "9px 14px", color: "#f1f5f9", fontSize: 13, outline: "none", fontFamily: "inherit" }} />
          <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)} style={{ background: "#0f1623", border: "1px solid #1e2a45", borderRadius: 8, padding: "9px 14px", color: "#94a3b8", fontSize: 13, fontFamily: "inherit" }}>
            <option value="all">All Status</option>
            {Object.entries(STATUS_CONFIG).map(([v, c]) => <option key={v} value={v}>{c.label}</option>)}
          </select>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {filtered.length === 0 && <div style={{ textAlign: "center", padding: 60, color: "#334155" }}><div style={{ fontSize: 40, marginBottom: 10 }}>📭</div><div>Koi lead nahi mili</div></div>}
          {filtered.map(lead => (
            <div key={lead.id} style={{ background: "#0f1623", border: "1px solid #1e2a45", borderRadius: 12, padding: "16px 18px" }}>
              <div style={{ display: "flex", gap: 12, marginBottom: 12 }}>
                <Avatar initials={lead.name.slice(0, 2).toUpperCase()} size={42} />
                <div style={{ flex: 1 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
                    <span style={{ fontWeight: 700, fontSize: 15 }}>{lead.name}</span>
                    <Badge status={lead.priority} type="priority" /><Badge status={lead.status} />
                  </div>
                  <div style={{ fontSize: 12, color: "#475569", marginTop: 3 }}>📞 {lead.phone}{lead.email ? ` · ✉️ ${lead.email}` : ""}</div>
                  <div style={{ fontSize: 12, color: "#475569" }}>Source: {lead.source}{lead.value ? ` · ₹${Number(lead.value).toLocaleString()}` : ""}</div>
                  {lead.notes && <div style={{ fontSize: 12, color: "#64748b", marginTop: 6, background: "#080c14", borderRadius: 6, padding: "6px 10px" }}>📝 {lead.notes}</div>}
                </div>
              </div>
              <div style={{ display: "flex", gap: 6, flexWrap: "wrap", alignItems: "center" }}>
                <span style={{ fontSize: 11, color: "#475569" }}>Status update:</span>
                {Object.entries(STATUS_CONFIG).map(([s, c]) => (
                  <button key={s} onClick={() => onUpdateLead(lead.id, s)} style={{ padding: "4px 11px", borderRadius: 20, border: `1px solid ${c.color}55`, cursor: "pointer", background: lead.status === s ? c.bg : "transparent", color: c.color, fontSize: 11, fontWeight: 600, fontFamily: "inherit" }}>{c.label}</button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── MAIN APP ────────────────────────────────────────────────────────
export default function App() {
  const [appState, setAppState] = useState("loading");
  const [currentUser, setCurrentUser] = useState(null);
  const [employees, setEmployees] = useState(INITIAL_EMPLOYEES);
  const [leads, setLeads] = useState(INITIAL_LEADS);
  const [credentials, setCredentials] = useState([]);
  const [adminPassword, setAdminPassword] = useState(DEFAULT_ADMIN_PASSWORD);

  useEffect(() => {
    async function load() {
      try {
        const e = await window.storage.get(SK.employees); if (e) setEmployees(JSON.parse(e.value));
        const l = await window.storage.get(SK.leads); if (l) setLeads(JSON.parse(l.value));
        const c = await window.storage.get(SK.creds); if (c) setCredentials(JSON.parse(c.value));
        const a = await window.storage.get(SK.adminPwd); if (a) setAdminPassword(a.value);
      } catch {}
      setAppState("login");
    }
    load();
  }, []);

  async function saveEmployees(d) { setEmployees(d); try { await window.storage.set(SK.employees, JSON.stringify(d)); } catch {} }
  async function saveLeads(d) { setLeads(d); try { await window.storage.set(SK.leads, JSON.stringify(d)); } catch {} }
  async function saveCredentials(d) { setCredentials(d); try { await window.storage.set(SK.creds, JSON.stringify(d)); } catch {} }
  async function saveAdminPassword(p) { setAdminPassword(p); try { await window.storage.set(SK.adminPwd, p); } catch {} }

  if (appState === "loading") return (
    <div style={{ minHeight: "100vh", background: "#080c14", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "inherit", color: "#475569" }}>
      <div style={{ textAlign: "center" }}><div style={{ fontSize: 40, marginBottom: 10 }}>⚡</div>Loading...</div>
    </div>
  );

  if (appState === "login") return <LoginScreen onLogin={u => { setCurrentUser(u); setAppState(u.role === "admin" ? "admin" : "employee"); }} employees={employees} credentials={credentials} adminPassword={adminPassword} />;

  if (appState === "employee") return <EmployeeDashboard user={currentUser} leads={leads} onUpdateLead={(id, status) => saveLeads(leads.map(l => l.id === id ? { ...l, status } : l))} onLogout={() => { setCurrentUser(null); setAppState("login"); }} />;

  return <AdminPortal employees={employees} leads={leads} credentials={credentials} adminPassword={adminPassword}
    saveEmployees={saveEmployees} saveLeads={saveLeads} saveCredentials={saveCredentials}
    saveAdminPassword={saveAdminPassword} onLogout={() => { setCurrentUser(null); setAppState("login"); }} />;
}

// ─── ADMIN PORTAL ────────────────────────────────────────────────────
function AdminPortal({ employees, leads, credentials, adminPassword, saveEmployees, saveLeads, saveCredentials, saveAdminPassword, onLogout }) {
  const [tab, setTab] = useState("dashboard");
  const [modal, setModal] = useState(null);
  const [selected, setSelected] = useState(null);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterEmployee, setFilterEmployee] = useState("all");
  const emptyLead = { name: "", phone: "", email: "", source: "Website", priority: "medium", status: "new", assignedTo: employees[0]?.id || "", notes: "", value: "" };
  const emptyEmp = { name: "", phone: "", email: "", role: "Sales Executive" };
  const [leadForm, setLeadForm] = useState(emptyLead);
  const [empForm, setEmpForm] = useState(emptyEmp);
  const [credModal, setCredModal] = useState(false);
  const [credEmp, setCredEmp] = useState(null);
  const [generatedCred, setGeneratedCred] = useState(null);
  const [credCopied, setCredCopied] = useState(false);
  const [adminPwdModal, setAdminPwdModal] = useState(false);
  const [newAdminPwd, setNewAdminPwd] = useState("");

  function getCred(empId) { return credentials.find(c => c.empId === empId); }

  function openCredModal(emp) {
    setCredEmp(emp);
    const ex = getCred(emp.id);
    setGeneratedCred(ex ? { loginId: ex.loginId, password: ex.password } : null);
    setCredCopied(false);
    setCredModal(true);
  }

  function doGenerate() {
    const cred = { empId: credEmp.id, loginId: genLoginId(credEmp.name), password: genPassword() };
    saveCredentials([...credentials.filter(c => c.empId !== credEmp.id), cred]);
    setGeneratedCred({ loginId: cred.loginId, password: cred.password });
    setCredCopied(false);
  }

  function copyCred() {
    if (!generatedCred || !credEmp) return;
    navigator.clipboard.writeText(`LeadHub Login\nEmployee: ${credEmp.name}\nLogin ID: ${generatedCred.loginId}\nPassword: ${generatedCred.password}`).then(() => setCredCopied(true));
  }

  function revokeCred(empId) { saveCredentials(credentials.filter(c => c.empId !== empId)); setCredModal(false); setGeneratedCred(null); }

  function submitLead() {
    if (!leadForm.name || !leadForm.phone) return;
    if (modal === "addLead") saveLeads([...leads, { ...leadForm, id: genId("l"), createdAt: new Date().toISOString(), value: Number(leadForm.value) || 0 }]);
    else saveLeads(leads.map(l => l.id === selected.id ? { ...leadForm, id: l.id, createdAt: l.createdAt, value: Number(leadForm.value) || 0 } : l));
    setModal(null);
  }

  function deleteLead(id) { saveLeads(leads.filter(l => l.id !== id)); setModal(null); }

  function submitEmployee() {
    if (!empForm.name || !empForm.phone) return;
    const avatar = empForm.name.split(" ").map(w => w[0]).join("").toUpperCase().slice(0, 2);
    if (modal === "addEmployee") saveEmployees([...employees, { ...empForm, id: genId("e"), avatar }]);
    else saveEmployees(employees.map(e => e.id === selected.id ? { ...empForm, id: e.id, avatar } : e));
    setModal(null);
  }

  function deleteEmployee(id) { saveEmployees(employees.filter(e => e.id !== id)); saveLeads(leads.map(l => l.assignedTo === id ? { ...l, assignedTo: "" } : l)); saveCredentials(credentials.filter(c => c.empId !== id)); setModal(null); }

  const filteredLeads = leads.filter(l => {
    const ms = !search || l.name.toLowerCase().includes(search.toLowerCase()) || l.phone.includes(search) || (l.email || "").toLowerCase().includes(search.toLowerCase());
    return ms && (filterStatus === "all" || l.status === filterStatus) && (filterEmployee === "all" || l.assignedTo === filterEmployee);
  });

  const empStats = employees.map(e => ({ ...e, total: leads.filter(l => l.assignedTo === e.id).length, converted: leads.filter(l => l.assignedTo === e.id && l.status === "converted").length, active: leads.filter(l => l.assignedTo === e.id && l.status !== "lost" && l.status !== "converted").length, hasCred: !!getCred(e.id) }));
  const stats = { total: leads.length, new: leads.filter(l => l.status === "new").length, converted: leads.filter(l => l.status === "converted").length, value: leads.filter(l => l.status === "converted").reduce((s, l) => s + (l.value || 0), 0) };
  const empOptions = [{ value: "", label: "— Unassigned —" }, ...employees.map(e => ({ value: e.id, label: e.name }))];
  const sourceOptions = ["Website","Referral","Social Media","Cold Call","Advertisement","Other"].map(s => ({ value: s, label: s }));
  const priorityOptions = Object.entries(PRIORITY_CONFIG).map(([v, c]) => ({ value: v, label: c.label }));
  const statusOptions = Object.entries(STATUS_CONFIG).map(([v, c]) => ({ value: v, label: c.label }));

  const navItems = [
    { id: "dashboard", icon: "◈", label: "Dashboard" },
    { id: "leads", icon: "◉", label: "Leads" },
    { id: "employees", icon: "◎", label: "Employees" },
    { id: "credentials", icon: "🔐", label: "Login Access" },
  ];

  return (
    <div style={{ display: "flex", height: "100vh", background: "#080c14", fontFamily: "'DM Sans','Segoe UI',sans-serif", color: "#f1f5f9", overflow: "hidden" }}>
      {/* Sidebar */}
      <div style={{ width: 220, background: "#0a0f1e", borderRight: "1px solid #1a2035", display: "flex", flexDirection: "column", flexShrink: 0 }}>
        <div style={{ padding: "20px 18px 14px", borderBottom: "1px solid #1a2035" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ width: 36, height: 36, borderRadius: 10, background: "linear-gradient(135deg,#f97316,#ef4444)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18 }}>⚡</div>
            <div><div style={{ fontWeight: 800, fontSize: 15 }}>LeadHub</div><div style={{ fontSize: 10, color: "#f97316", letterSpacing: 1, fontWeight: 700 }}>ADMIN</div></div>
          </div>
        </div>
        <nav style={{ padding: "10px 10px", flex: 1 }}>
          {navItems.map(item => (
            <button key={item.id} onClick={() => setTab(item.id)} style={{ display: "flex", alignItems: "center", gap: 10, width: "100%", padding: "10px 14px", borderRadius: 10, border: "none", cursor: "pointer", background: tab === item.id ? "#f97316" : "transparent", color: tab === item.id ? "#fff" : "#64748b", fontWeight: tab === item.id ? 700 : 500, fontSize: 13, marginBottom: 3, transition: "all 0.2s", textAlign: "left", fontFamily: "inherit" }}>
              <span style={{ fontSize: 15 }}>{item.icon}</span>{item.label}
              {item.id === "credentials" && <span style={{ marginLeft: "auto", background: "#f9731622", color: "#f97316", fontSize: 10, fontWeight: 800, padding: "2px 7px", borderRadius: 20 }}>{credentials.length}/{employees.length}</span>}
            </button>
          ))}
        </nav>
        <div style={{ padding: "12px 18px", borderTop: "1px solid #1a2035" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
            <Avatar initials="AD" size={28} color="#f97316" />
            <div style={{ fontSize: 12, fontWeight: 600 }}>Admin</div>
          </div>
          <Btn small variant="secondary" onClick={onLogout} style={{ width: "100%" }}>Logout</Btn>
        </div>
      </div>

      {/* Main Content */}
      <div style={{ flex: 1, overflow: "hidden", display: "flex", flexDirection: "column" }}>
        <div style={{ padding: "14px 24px", borderBottom: "1px solid #1a2035", display: "flex", alignItems: "center", justifyContent: "space-between", flexShrink: 0 }}>
          <div>
            <h1 style={{ margin: 0, fontSize: 20, fontWeight: 800 }}>{tab === "dashboard" ? "Dashboard" : tab === "leads" ? "Lead Management" : tab === "employees" ? "Employees" : "Login Access Control"}</h1>
            <p style={{ margin: 0, fontSize: 12, color: "#475569", marginTop: 1 }}>{tab === "credentials" ? "Employees ke login ID & password manage karo" : "Admin Panel"}</p>
          </div>
          <div style={{ display: "flex", gap: 10 }}>
            {tab === "leads" && <Btn onClick={() => { setLeadForm({ ...emptyLead, assignedTo: employees[0]?.id || "" }); setModal("addLead"); }}>+ New Lead</Btn>}
            {tab === "employees" && <Btn onClick={() => { setEmpForm(emptyEmp); setModal("addEmployee"); }}>+ Add Employee</Btn>}
            {tab === "credentials" && <Btn small variant="secondary" onClick={() => setAdminPwdModal(true)}>🔑 Change Admin Pass</Btn>}
          </div>
        </div>

        <div style={{ flex: 1, overflowY: "auto", padding: 24 }}>

          {/* DASHBOARD */}
          {tab === "dashboard" && (
            <div>
              <div style={{ display: "flex", gap: 14, marginBottom: 24, flexWrap: "wrap" }}>
                {[{ icon: "📋", l: "Total Leads", v: stats.total, c: "#3b82f6" }, { icon: "🆕", l: "New Leads", v: stats.new, c: "#f97316" }, { icon: "✅", l: "Converted", v: stats.converted, c: "#10b981" }, { icon: "💰", l: "Revenue", v: `₹${(stats.value / 1000).toFixed(0)}K`, c: "#8b5cf6" }].map(s => (
                  <div key={s.l} style={{ flex: 1, minWidth: 130, background: "#0f1623", border: "1px solid #1e2a45", borderRadius: 12, padding: "18px 20px", borderTop: `3px solid ${s.c}` }}>
                    <div style={{ fontSize: 22, marginBottom: 6 }}>{s.icon}</div>
                    <div style={{ fontSize: 26, fontWeight: 800 }}>{s.v}</div>
                    <div style={{ fontSize: 12, color: "#64748b", marginTop: 2 }}>{s.l}</div>
                  </div>
                ))}
              </div>
              <h2 style={{ fontSize: 12, fontWeight: 700, color: "#475569", textTransform: "uppercase", letterSpacing: 1, marginBottom: 12 }}>Team Performance</h2>
              <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 24 }}>
                {empStats.map(e => {
                  const rate = e.total ? Math.round((e.converted / e.total) * 100) : 0;
                  return (
                    <div key={e.id} style={{ background: "#0f1623", border: "1px solid #1e2a45", borderRadius: 12, padding: "14px 18px", display: "flex", alignItems: "center", gap: 14 }}>
                      <Avatar initials={e.avatar} size={42} />
                      <div style={{ flex: 1 }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                          <span style={{ fontWeight: 700 }}>{e.name}</span>
                          {e.hasCred ? <span style={{ fontSize: 10, background: "#0a3728", color: "#10b981", padding: "2px 8px", borderRadius: 20, fontWeight: 700 }}>✓ Login Active</span> : <span style={{ fontSize: 10, background: "#3d1212", color: "#ef4444", padding: "2px 8px", borderRadius: 20, fontWeight: 700 }}>✗ No Login</span>}
                        </div>
                        <div style={{ fontSize: 11, color: "#475569", marginTop: 2 }}>{e.role}</div>
                        <div style={{ marginTop: 8, height: 4, background: "#1e2a45", borderRadius: 99 }}><div style={{ width: `${rate}%`, height: "100%", background: "linear-gradient(90deg,#f97316,#ef4444)", borderRadius: 99 }} /></div>
                      </div>
                      <div style={{ display: "flex", gap: 16, textAlign: "center" }}>
                        {[{ v: e.total, l: "Total", c: "#f1f5f9" }, { v: e.active, l: "Active", c: "#f59e0b" }, { v: e.converted, l: "Done", c: "#10b981" }, { v: `${rate}%`, l: "Rate", c: "#8b5cf6" }].map(s => (
                          <div key={s.l}><div style={{ fontWeight: 800, fontSize: 18, color: s.c }}>{s.v}</div><div style={{ fontSize: 10, color: "#475569" }}>{s.l}</div></div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
              <h2 style={{ fontSize: 12, fontWeight: 700, color: "#475569", textTransform: "uppercase", letterSpacing: 1, marginBottom: 12 }}>Recent Leads</h2>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {[...leads].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 6).map(lead => {
                  const emp = employees.find(e => e.id === lead.assignedTo);
                  return (
                    <div key={lead.id} style={{ background: "#0f1623", border: "1px solid #1e2a45", borderRadius: 10, padding: "12px 16px", display: "flex", alignItems: "center", gap: 12, cursor: "pointer" }}
                      onClick={() => { setSelected(lead); setModal("viewLead"); }}>
                      <Avatar initials={lead.name.slice(0, 2).toUpperCase()} size={34} />
                      <div style={{ flex: 1 }}><div style={{ fontWeight: 600, fontSize: 14 }}>{lead.name}</div><div style={{ fontSize: 12, color: "#475569" }}>{lead.phone}</div></div>
                      <Badge status={lead.status} /><Badge status={lead.priority} type="priority" />
                      {emp && <div style={{ fontSize: 12, color: "#64748b", display: "flex", alignItems: "center", gap: 6 }}><Avatar initials={emp.avatar} size={20} />{emp.name}</div>}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* LEADS */}
          {tab === "leads" && (
            <div>
              <div style={{ display: "flex", gap: 10, marginBottom: 16, flexWrap: "wrap" }}>
                <input value={search} onChange={e => setSearch(e.target.value)} placeholder="🔍  Search leads..." style={{ flex: 1, minWidth: 160, background: "#0f1623", border: "1px solid #1e2a45", borderRadius: 8, padding: "9px 14px", color: "#f1f5f9", fontSize: 13, outline: "none", fontFamily: "inherit" }} />
                <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)} style={{ background: "#0f1623", border: "1px solid #1e2a45", borderRadius: 8, padding: "9px 14px", color: "#94a3b8", fontSize: 13, fontFamily: "inherit" }}>
                  <option value="all">All Status</option>
                  {Object.entries(STATUS_CONFIG).map(([v, c]) => <option key={v} value={v}>{c.label}</option>)}
                </select>
                <select value={filterEmployee} onChange={e => setFilterEmployee(e.target.value)} style={{ background: "#0f1623", border: "1px solid #1e2a45", borderRadius: 8, padding: "9px 14px", color: "#94a3b8", fontSize: 13, fontFamily: "inherit" }}>
                  <option value="all">All Employees</option>
                  {employees.map(e => <option key={e.id} value={e.id}>{e.name}</option>)}
                </select>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {filteredLeads.length === 0 && <div style={{ textAlign: "center", padding: 60, color: "#334155" }}><div style={{ fontSize: 40, marginBottom: 10 }}>📭</div><div>No leads found</div></div>}
                {filteredLeads.map(lead => {
                  const emp = employees.find(e => e.id === lead.assignedTo);
                  return (
                    <div key={lead.id} style={{ background: "#0f1623", border: "1px solid #1e2a45", borderRadius: 12, padding: "14px 18px", display: "flex", alignItems: "center", gap: 12 }}>
                      <Avatar initials={lead.name.slice(0, 2).toUpperCase()} size={40} />
                      <div style={{ flex: 1 }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}><span style={{ fontWeight: 700 }}>{lead.name}</span><Badge status={lead.priority} type="priority" /></div>
                        <div style={{ fontSize: 12, color: "#475569", marginTop: 2 }}>{lead.phone}{lead.email ? ` · ${lead.email}` : ""}</div>
                        <div style={{ fontSize: 12, color: "#475569" }}>{lead.source}{lead.value ? ` · ₹${Number(lead.value).toLocaleString()}` : ""}</div>
                      </div>
                      <div style={{ textAlign: "right" }}>
                        <Badge status={lead.status} />
                        {emp && <div style={{ display: "flex", alignItems: "center", gap: 5, marginTop: 5, justifyContent: "flex-end" }}><Avatar initials={emp.avatar} size={18} /><span style={{ fontSize: 11, color: "#64748b" }}>{emp.name}</span></div>}
                      </div>
                      <div style={{ display: "flex", gap: 6 }}>
                        <Btn small variant="secondary" onClick={() => { setSelected(lead); setModal("viewLead"); }}>View</Btn>
                        <Btn small variant="secondary" onClick={() => { setSelected(lead); setLeadForm({ ...lead }); setModal("editLead"); }}>Edit</Btn>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* EMPLOYEES */}
          {tab === "employees" && (
            <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
              {employees.map(emp => {
                const es = empStats.find(e => e.id === emp.id) || emp;
                return (
                  <div key={emp.id} style={{ background: "#0f1623", border: "1px solid #1e2a45", borderRadius: 14, padding: 22, width: 270, flexShrink: 0 }}>
                    <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 14 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                        <Avatar initials={emp.avatar} size={48} />
                        <div>
                          <div style={{ fontWeight: 700, fontSize: 15 }}>{emp.name}</div>
                          <div style={{ fontSize: 11, color: "#f97316", marginTop: 1, fontWeight: 600 }}>{emp.role}</div>
                          {es.hasCred ? <div style={{ fontSize: 10, color: "#10b981", marginTop: 3 }}>✓ Login Active</div> : <div style={{ fontSize: 10, color: "#ef4444", marginTop: 3 }}>✗ No Login</div>}
                        </div>
                      </div>
                      <Btn small variant="ghost" onClick={() => { setSelected(emp); setEmpForm({ ...emp }); setModal("editEmployee"); }}>✏️</Btn>
                    </div>
                    <div style={{ fontSize: 12, color: "#475569", marginBottom: 2 }}>📞 {emp.phone}</div>
                    <div style={{ fontSize: 12, color: "#475569", marginBottom: 14 }}>✉️ {emp.email}</div>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 6, background: "#080c14", borderRadius: 8, padding: 10, marginBottom: 12 }}>
                      {[{ v: es.total || 0, l: "Leads", c: "#3b82f6" }, { v: es.active || 0, l: "Active", c: "#f59e0b" }, { v: es.converted || 0, l: "Done", c: "#10b981" }].map(s => (
                        <div key={s.l} style={{ textAlign: "center" }}><div style={{ fontWeight: 800, fontSize: 18, color: s.c }}>{s.v}</div><div style={{ fontSize: 10, color: "#475569" }}>{s.l}</div></div>
                      ))}
                    </div>
                    <div style={{ display: "flex", gap: 8 }}>
                      <Btn small style={{ flex: 1, textAlign: "center" }} onClick={() => openCredModal(emp)}>{es.hasCred ? "🔑 Manage Login" : "🔑 Create Login"}</Btn>
                      <Btn small variant="secondary" onClick={() => { setTab("leads"); setFilterEmployee(emp.id); }}>Leads →</Btn>
                    </div>
                  </div>
                );
              })}
              {employees.length === 0 && <div style={{ textAlign: "center", padding: 60, color: "#334155", width: "100%" }}><div style={{ fontSize: 40, marginBottom: 10 }}>👥</div><div>No employees yet</div></div>}
            </div>
          )}

          {/* LOGIN ACCESS */}
          {tab === "credentials" && (
            <div>
              <div style={{ background: "#1a2035", border: "1px solid #2a3150", borderRadius: 12, padding: "12px 18px", marginBottom: 20, fontSize: 13, color: "#64748b", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 10 }}>
                <span><strong style={{ color: "#94a3b8" }}>Admin Login:</strong> ID = <strong style={{ color: "#f97316", fontFamily: "monospace" }}>admin</strong> · Password = <strong style={{ color: "#f97316", fontFamily: "monospace" }}>{adminPassword}</strong></span>
                <button onClick={() => setAdminPwdModal(true)} style={{ background: "none", border: "none", color: "#f97316", cursor: "pointer", fontSize: 13, fontFamily: "inherit", fontWeight: 700 }}>Change →</button>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                {employees.map(emp => {
                  const cred = getCred(emp.id);
                  return (
                    <div key={emp.id} style={{ background: "#0f1623", border: `1px solid ${cred ? "#10b98133" : "#1e2a45"}`, borderRadius: 12, padding: "18px 22px", display: "flex", alignItems: "center", gap: 16 }}>
                      <Avatar initials={emp.avatar} size={44} />
                      <div style={{ flex: 1 }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
                          <span style={{ fontWeight: 700, fontSize: 15 }}>{emp.name}</span>
                          {cred ? <span style={{ fontSize: 11, background: "#0a3728", color: "#10b981", padding: "2px 10px", borderRadius: 20, fontWeight: 700 }}>✓ Login Active</span> : <span style={{ fontSize: 11, background: "#3d1212", color: "#ef4444", padding: "2px 10px", borderRadius: 20, fontWeight: 700 }}>✗ No Login</span>}
                        </div>
                        <div style={{ fontSize: 12, color: "#475569", marginTop: 3 }}>{emp.role} · {emp.phone}</div>
                        {cred && (
                          <div style={{ display: "flex", gap: 12, marginTop: 10, flexWrap: "wrap" }}>
                            <div style={{ background: "#080c14", borderRadius: 6, padding: "5px 12px", fontSize: 12 }}><span style={{ color: "#475569" }}>Login ID: </span><span style={{ color: "#f97316", fontWeight: 700, fontFamily: "monospace" }}>{cred.loginId}</span></div>
                            <div style={{ background: "#080c14", borderRadius: 6, padding: "5px 12px", fontSize: 12 }}><span style={{ color: "#475569" }}>Password: </span><span style={{ color: "#8b5cf6", fontWeight: 700, fontFamily: "monospace" }}>{cred.password}</span></div>
                          </div>
                        )}
                      </div>
                      <div style={{ display: "flex", gap: 8, flexShrink: 0 }}>
                        <Btn small onClick={() => openCredModal(emp)}>{cred ? "🔄 Reset" : "🔑 Create Login"}</Btn>
                        {cred && <Btn small variant="danger" onClick={() => { if (confirm(`${emp.name} ka login revoke karein?`)) revokeCred(emp.id); }}>Revoke</Btn>}
                      </div>
                    </div>
                  );
                })}
                {employees.length === 0 && <div style={{ textAlign: "center", padding: 60, color: "#334155" }}><div style={{ fontSize: 40, marginBottom: 10 }}>👥</div><div>Pehle employee add karo</div></div>}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ══ MODALS ══ */}

      {/* Credential Generator */}
      {credModal && credEmp && (
        <Modal title={`Login Access — ${credEmp.name}`} onClose={() => setCredModal(false)} maxWidth={460}>
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 22, padding: "12px 16px", background: "#080c14", borderRadius: 10 }}>
            <Avatar initials={credEmp.avatar} size={46} />
            <div><div style={{ fontWeight: 700 }}>{credEmp.name}</div><div style={{ fontSize: 12, color: "#475569" }}>{credEmp.role}</div></div>
          </div>
          {!generatedCred ? (
            <div style={{ textAlign: "center", padding: "20px 0" }}>
              <div style={{ fontSize: 48, marginBottom: 14 }}>🔑</div>
              <p style={{ color: "#64748b", fontSize: 14, marginBottom: 22 }}>Is employee ke liye login credentials generate karo</p>
              <Btn onClick={doGenerate} style={{ padding: "12px 32px" }}>Generate Login Credentials</Btn>
            </div>
          ) : (
            <div>
              <div style={{ background: "#080c14", border: "1px solid #10b98133", borderRadius: 12, padding: 20, marginBottom: 16 }}>
                <div style={{ fontSize: 12, color: "#10b981", marginBottom: 16, fontWeight: 700, textTransform: "uppercase", letterSpacing: 0.8 }}>✓ Credentials Ready — Employee ko share karo</div>
                <div style={{ marginBottom: 14 }}>
                  <div style={{ fontSize: 11, color: "#475569", marginBottom: 6, textTransform: "uppercase", letterSpacing: 0.5 }}>Login ID</div>
                  <div style={{ fontFamily: "monospace", fontSize: 20, fontWeight: 800, color: "#f97316", background: "#0d1117", borderRadius: 8, padding: "11px 16px", letterSpacing: 1.5, userSelect: "all" }}>{generatedCred.loginId}</div>
                </div>
                <div>
                  <div style={{ fontSize: 11, color: "#475569", marginBottom: 6, textTransform: "uppercase", letterSpacing: 0.5 }}>Password</div>
                  <div style={{ fontFamily: "monospace", fontSize: 20, fontWeight: 800, color: "#8b5cf6", background: "#0d1117", borderRadius: 8, padding: "11px 16px", letterSpacing: 2, userSelect: "all" }}>{generatedCred.password}</div>
                </div>
              </div>
              <div style={{ display: "flex", gap: 10, marginBottom: 10 }}>
                <Btn onClick={copyCred} variant={credCopied ? "success" : "primary"} style={{ flex: 1, textAlign: "center" }}>{credCopied ? "✓ Copied to Clipboard!" : "📋 Copy & Share"}</Btn>
                <Btn onClick={doGenerate} variant="secondary">🔄 New Credentials</Btn>
              </div>
              <Btn variant="danger" onClick={() => { if (confirm("Login access revoke karein?")) revokeCred(credEmp.id); }} style={{ width: "100%", textAlign: "center" }}>🚫 Revoke Access</Btn>
            </div>
          )}
        </Modal>
      )}

      {/* Admin Password Change */}
      {adminPwdModal && (
        <Modal title="Admin Password Change" onClose={() => setAdminPwdModal(false)} maxWidth={400}>
          <div style={{ background: "#1a2035", borderRadius: 8, padding: "10px 14px", marginBottom: 18, fontSize: 13, color: "#64748b" }}>Current: <strong style={{ color: "#f97316", fontFamily: "monospace" }}>{adminPassword}</strong></div>
          <FInput label="New Password (min 6 char)" value={newAdminPwd} onChange={e => setNewAdminPwd(e.target.value)} placeholder="New password dalein" type="text" />
          <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
            <Btn variant="secondary" onClick={() => { setAdminPwdModal(false); setNewAdminPwd(""); }}>Cancel</Btn>
            <Btn onClick={() => { if (newAdminPwd.length >= 6) { saveAdminPassword(newAdminPwd); setNewAdminPwd(""); setAdminPwdModal(false); } }}>Save</Btn>
          </div>
        </Modal>
      )}

      {/* Add/Edit Lead */}
      {(modal === "addLead" || modal === "editLead") && (
        <Modal title={modal === "addLead" ? "Add New Lead" : "Edit Lead"} onClose={() => setModal(null)}>
          <FInput label="Client Name *" value={leadForm.name} onChange={e => setLeadForm(p => ({ ...p, name: e.target.value }))} placeholder="Full name" />
          <FInput label="Phone *" value={leadForm.phone} onChange={e => setLeadForm(p => ({ ...p, phone: e.target.value }))} placeholder="10-digit number" />
          <FInput label="Email" value={leadForm.email} onChange={e => setLeadForm(p => ({ ...p, email: e.target.value }))} />
          <div style={{ display: "flex", gap: 12 }}>
            <div style={{ flex: 1 }}><FSelect label="Source" options={sourceOptions} value={leadForm.source} onChange={e => setLeadForm(p => ({ ...p, source: e.target.value }))} /></div>
            <div style={{ flex: 1 }}><FInput label="Value (₹)" type="number" value={leadForm.value} onChange={e => setLeadForm(p => ({ ...p, value: e.target.value }))} placeholder="25000" /></div>
          </div>
          <div style={{ display: "flex", gap: 12 }}>
            <div style={{ flex: 1 }}><FSelect label="Priority" options={priorityOptions} value={leadForm.priority} onChange={e => setLeadForm(p => ({ ...p, priority: e.target.value }))} /></div>
            <div style={{ flex: 1 }}><FSelect label="Status" options={statusOptions} value={leadForm.status} onChange={e => setLeadForm(p => ({ ...p, status: e.target.value }))} /></div>
          </div>
          <FSelect label="Assign To" options={empOptions} value={leadForm.assignedTo} onChange={e => setLeadForm(p => ({ ...p, assignedTo: e.target.value }))} />
          <FTextarea label="Notes" value={leadForm.notes} onChange={e => setLeadForm(p => ({ ...p, notes: e.target.value }))} />
          <div style={{ display: "flex", gap: 10, justifyContent: "flex-end", marginTop: 8 }}>
            {modal === "editLead" && <Btn variant="danger" onClick={() => { if (confirm("Delete?")) deleteLead(selected.id); }}>Delete</Btn>}
            <Btn variant="secondary" onClick={() => setModal(null)}>Cancel</Btn>
            <Btn onClick={submitLead}>Save Lead</Btn>
          </div>
        </Modal>
      )}

      {/* View Lead */}
      {modal === "viewLead" && selected && (() => {
        const lead = leads.find(l => l.id === selected.id) || selected;
        const emp = employees.find(e => e.id === lead.assignedTo);
        return (
          <Modal title="Lead Details" onClose={() => setModal(null)}>
            <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 16, padding: "12px 16px", background: "#080c14", borderRadius: 10 }}>
              <Avatar initials={lead.name.slice(0, 2).toUpperCase()} size={48} />
              <div><div style={{ fontWeight: 700, fontSize: 17 }}>{lead.name}</div><div style={{ fontSize: 13, color: "#475569" }}>📞 {lead.phone}</div>{lead.email && <div style={{ fontSize: 13, color: "#475569" }}>✉️ {lead.email}</div>}</div>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 12 }}>
              {[["Source", lead.source], ["Value", lead.value ? `₹${Number(lead.value).toLocaleString()}` : "—"]].map(([k, v]) => (
                <div key={k} style={{ background: "#080c14", borderRadius: 8, padding: "10px 12px" }}><div style={{ fontSize: 10, color: "#475569", marginBottom: 5, textTransform: "uppercase" }}>{k}</div><div style={{ fontWeight: 600, fontSize: 13 }}>{v}</div></div>
              ))}
              <div style={{ background: "#080c14", borderRadius: 8, padding: "10px 12px" }}><div style={{ fontSize: 10, color: "#475569", marginBottom: 5, textTransform: "uppercase" }}>Status</div><Badge status={lead.status} /></div>
              <div style={{ background: "#080c14", borderRadius: 8, padding: "10px 12px" }}><div style={{ fontSize: 10, color: "#475569", marginBottom: 5, textTransform: "uppercase" }}>Priority</div><Badge status={lead.priority} type="priority" /></div>
            </div>
            {emp && <div style={{ background: "#080c14", borderRadius: 8, padding: "10px 12px", marginBottom: 12, display: "flex", alignItems: "center", gap: 8 }}><span style={{ fontSize: 10, color: "#475569", textTransform: "uppercase" }}>Assigned To</span><Avatar initials={emp.avatar} size={24} /><span style={{ fontWeight: 600, fontSize: 13 }}>{emp.name}</span></div>}
            {lead.notes && <div style={{ background: "#080c14", borderRadius: 8, padding: "10px 12px", marginBottom: 14, fontSize: 13, color: "#94a3b8" }}>📝 {lead.notes}</div>}
            <div style={{ marginBottom: 18 }}>
              <div style={{ fontSize: 11, color: "#475569", marginBottom: 8, textTransform: "uppercase" }}>Quick Status</div>
              <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                {Object.entries(STATUS_CONFIG).map(([s, c]) => (
                  <button key={s} onClick={() => { saveLeads(leads.map(l => l.id === lead.id ? { ...l, status: s } : l)); setSelected(p => ({ ...p, status: s })); }} style={{ padding: "4px 12px", borderRadius: 20, border: `1px solid ${c.color}55`, cursor: "pointer", background: lead.status === s ? c.bg : "transparent", color: c.color, fontSize: 11, fontWeight: 600, fontFamily: "inherit" }}>{c.label}</button>
                ))}
              </div>
            </div>
            <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
              <Btn variant="secondary" onClick={() => setModal(null)}>Close</Btn>
              <Btn onClick={() => { setLeadForm({ ...lead }); setModal("editLead"); }}>Edit Lead</Btn>
            </div>
          </Modal>
        );
      })()}

      {/* Add/Edit Employee */}
      {(modal === "addEmployee" || modal === "editEmployee") && (
        <Modal title={modal === "addEmployee" ? "Add Employee" : "Edit Employee"} onClose={() => setModal(null)} maxWidth={440}>
          <FInput label="Full Name *" value={empForm.name} onChange={e => setEmpForm(p => ({ ...p, name: e.target.value }))} placeholder="Employee ka naam" />
          <FInput label="Phone *" value={empForm.phone} onChange={e => setEmpForm(p => ({ ...p, phone: e.target.value }))} placeholder="10-digit number" />
          <FInput label="Email" value={empForm.email} onChange={e => setEmpForm(p => ({ ...p, email: e.target.value }))} placeholder="work email" />
          <FInput label="Role / Designation" value={empForm.role} onChange={e => setEmpForm(p => ({ ...p, role: e.target.value }))} placeholder="e.g. Sales Executive" />
          <div style={{ display: "flex", gap: 10, justifyContent: "flex-end", marginTop: 8 }}>
            {modal === "editEmployee" && <Btn variant="danger" onClick={() => { if (confirm("Delete employee?")) deleteEmployee(selected.id); }}>Delete</Btn>}
            <Btn variant="secondary" onClick={() => setModal(null)}>Cancel</Btn>
            <Btn onClick={submitEmployee}>Save</Btn>
          </div>
        </Modal>
      )}
    </div>
  );
}
