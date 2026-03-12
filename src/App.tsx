import { useState, useEffect } from "react";
import Icon from "@/components/ui/icon";

// ── Types ──────────────────────────────────────────────────────────────────
type Page = "home" | "booking" | "profile" | "admin";

interface User {
  id: number;
  name: string;
  email: string;
  role: "student" | "admin";
  avatar: string;
}

interface Booking {
  userId: number;
  userName: string;
  row: number;
  seat: number;
}

// ── Constants ──────────────────────────────────────────────────────────────
const ROWS = 5;
const SEATS_PER_ROW = 6;
const DISABLED_SEATS = [{ row: 4, seat: 4 }, { row: 4, seat: 5 }];

const MOCK_USERS: User[] = [
  { id: 1, name: "Алиса Петрова", email: "alice@school.ru", role: "student", avatar: "А" },
  { id: 2, name: "Борис Иванов", email: "boris@school.ru", role: "student", avatar: "Б" },
  { id: 3, name: "Вера Смирнова", email: "vera@school.ru", role: "student", avatar: "В" },
  { id: 4, name: "Геннадий Козлов", email: "gen@school.ru", role: "student", avatar: "Г" },
  { id: 100, name: "Мария Учителева", email: "teacher@school.ru", role: "admin", avatar: "М" },
];

const INITIAL_BOOKINGS: Booking[] = [
  { userId: 2, userName: "Борис Иванов", row: 0, seat: 1 },
  { userId: 3, userName: "Вера Смирнова", row: 1, seat: 3 },
  { userId: 4, userName: "Геннадий Козлов", row: 2, seat: 0 },
];

const ROW_LABELS = ["1-й ряд", "2-й ряд", "3-й ряд", "4-й ряд", "5-й ряд"];

function isDisabled(row: number, seat: number) {
  return DISABLED_SEATS.some((d) => d.row === row && d.seat === seat);
}

// ── NavBar ─────────────────────────────────────────────────────────────────
function NavBar({ page, setPage, user, onLogout }: {
  page: Page; setPage: (p: Page) => void; user: User | null; onLogout: () => void;
}) {
  const [menuOpen, setMenuOpen] = useState(false);
  const links: { id: Page; label: string; icon: string }[] = [
    { id: "home", label: "Главная", icon: "Home" },
    { id: "booking", label: "Бронирование", icon: "MapPin" },
    { id: "profile", label: "Профиль", icon: "User" },
    ...(user?.role === "admin" ? [{ id: "admin" as Page, label: "Панель", icon: "Shield" }] : []),
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50">
      <div className="glass mx-4 mt-3 rounded-2xl px-5 py-3 flex items-center justify-between shadow-lg shadow-black/5">
        <div className="flex items-center gap-2 cursor-pointer" onClick={() => setPage("home")}>
          <div className="w-8 h-8 gradient-primary rounded-xl flex items-center justify-center">
            <span className="text-white text-xs font-black font-display">КМ</span>
          </div>
          <span className="font-display font-black text-lg text-foreground">КлассМест</span>
        </div>
        <div className="hidden md:flex items-center gap-1">
          {links.map((l) => (
            <button key={l.id} onClick={() => setPage(l.id)}
              className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200 flex items-center gap-2
                ${page === l.id ? "gradient-primary text-white shadow-md" : "text-muted-foreground hover:bg-muted hover:text-foreground"}`}>
              <Icon name={l.icon} size={15} />{l.label}
            </button>
          ))}
        </div>
        {user && (
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 gradient-accent rounded-full flex items-center justify-center text-white font-bold text-sm">
              {user.avatar}
            </div>
            <button onClick={onLogout} className="hidden md:flex items-center gap-1 text-sm text-muted-foreground hover:text-destructive transition-colors">
              <Icon name="LogOut" size={15} />Выйти
            </button>
            <button className="md:hidden" onClick={() => setMenuOpen(!menuOpen)}>
              <Icon name={menuOpen ? "X" : "Menu"} size={20} />
            </button>
          </div>
        )}
      </div>
      {menuOpen && (
        <div className="glass mx-4 mt-2 rounded-2xl px-4 py-4 flex flex-col gap-2 md:hidden animate-fade-in shadow-xl">
          {links.map((l) => (
            <button key={l.id} onClick={() => { setPage(l.id); setMenuOpen(false); }}
              className={`px-4 py-3 rounded-xl text-sm font-semibold transition-all flex items-center gap-3
                ${page === l.id ? "gradient-primary text-white" : "hover:bg-muted"}`}>
              <Icon name={l.icon} size={16} />{l.label}
            </button>
          ))}
          <button onClick={() => { onLogout(); setMenuOpen(false); }}
            className="px-4 py-3 rounded-xl text-sm font-semibold text-destructive hover:bg-red-50 flex items-center gap-3">
            <Icon name="LogOut" size={16} />Выйти
          </button>
        </div>
      )}
    </nav>
  );
}

// ── Auth Screen ─────────────────────────────────────────────────────────────
function AuthScreen({ onLogin }: { onLogin: (u: User) => void }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true); setError("");
    setTimeout(() => {
      const user = MOCK_USERS.find((u) => u.email === email);
      if (user && password === "1234") { onLogin(user); }
      else { setError("Неверный email или пароль"); }
      setLoading(false);
    }, 700);
  };

  const quickLogin = (u: User) => {
    setLoading(true);
    setTimeout(() => { onLogin(u); setLoading(false); }, 350);
  };

  return (
    <div className="min-h-screen gradient-bg flex items-center justify-center px-4">
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full opacity-30 animate-float"
          style={{ background: "radial-gradient(circle, hsl(255,85%,70%), transparent 70%)" }} />
        <div className="absolute -bottom-32 -right-32 w-96 h-96 rounded-full opacity-20"
          style={{ background: "radial-gradient(circle, hsl(195,90%,60%), transparent 70%)", animation: "float 4s ease-in-out 1.5s infinite" }} />
      </div>
      <div className="w-full max-w-md animate-scale-in relative z-10">
        <div className="text-center mb-8">
          <div className="w-20 h-20 gradient-primary rounded-3xl flex items-center justify-center mx-auto mb-4 shadow-2xl shadow-purple-500/30">
            <span className="text-white text-3xl font-black font-display">КМ</span>
          </div>
          <h1 className="font-display font-black text-3xl text-foreground mb-1">КлассМест</h1>
          <p className="text-muted-foreground text-sm">Система бронирования мест в классе</p>
        </div>

        <div className="glass rounded-3xl p-8 shadow-2xl shadow-purple-500/10">
          <h2 className="font-display font-bold text-xl mb-6 text-foreground">Войти в систему</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-sm font-semibold text-foreground mb-1.5 block">Email</label>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="your@school.ru"
                className="w-full px-4 py-3 rounded-xl border border-border bg-white/80 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all text-sm" required />
            </div>
            <div>
              <label className="text-sm font-semibold text-foreground mb-1.5 block">Пароль</label>
              <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••"
                className="w-full px-4 py-3 rounded-xl border border-border bg-white/80 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all text-sm" required />
            </div>
            {error && (
              <div className="text-destructive text-sm bg-red-50 border border-red-200 rounded-xl px-4 py-2 flex items-center gap-2">
                <Icon name="AlertCircle" size={14} />{error}
              </div>
            )}
            <button type="submit" disabled={loading}
              className="w-full gradient-primary text-white font-bold py-3 rounded-xl shadow-lg shadow-purple-500/30 hover:opacity-90 active:scale-95 transition-all duration-200 flex items-center justify-center gap-2 mt-2">
              {loading
                ? <div className="w-5 h-5 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                : <><Icon name="LogIn" size={16} />Войти</>}
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-border">
            <p className="text-xs text-muted-foreground mb-3 text-center font-medium">Быстрый вход для демо (пароль: 1234)</p>
            <div className="grid grid-cols-2 gap-2">
              {MOCK_USERS.slice(0, 4).map((u) => (
                <button key={u.id} onClick={() => quickLogin(u)}
                  className="flex items-center gap-2 px-3 py-2 rounded-xl bg-muted hover:bg-primary/10 hover:text-primary transition-all text-xs font-semibold">
                  <div className="w-6 h-6 gradient-accent rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0">{u.avatar}</div>
                  <span className="truncate">{u.name.split(" ")[0]}</span>
                </button>
              ))}
            </div>
            <button onClick={() => quickLogin(MOCK_USERS[4])}
              className="w-full mt-2 flex items-center gap-2 px-3 py-2 rounded-xl bg-gradient-to-r from-purple-50 to-blue-50 hover:from-purple-100 hover:to-blue-100 text-primary transition-all text-xs font-semibold border border-primary/20">
              <div className="w-6 h-6 gradient-primary rounded-full flex items-center justify-center text-white text-xs font-bold">М</div>
              <span>Мария Учителева</span>
              <span className="ml-auto text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full">Админ</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Home Page ───────────────────────────────────────────────────────────────
function HomePage({ user, bookings, setPage }: { user: User; bookings: Booking[]; setPage: (p: Page) => void }) {
  const myBooking = bookings.find((b) => b.userId === user.id);
  const freeCount = ROWS * SEATS_PER_ROW - DISABLED_SEATS.length - bookings.length;
  const stats = [
    { label: "Всего мест", value: 28, icon: "LayoutGrid", color: "from-purple-500 to-blue-500" },
    { label: "Занято", value: bookings.length, icon: "Users", color: "from-pink-500 to-rose-500" },
    { label: "Свободно", value: freeCount, icon: "CheckCircle", color: "from-green-400 to-emerald-500" },
  ];

  return (
    <div className="min-h-screen gradient-bg pt-24 pb-10 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="mb-8 animate-fade-in">
          <div className="text-4xl mb-3">👋</div>
          <h1 className="font-display font-black text-3xl text-foreground leading-tight">
            Привет, {user.name.split(" ")[0]}!
          </h1>
          <p className="text-muted-foreground mt-1">
            {myBooking ? `Твоё место: ${ROW_LABELS[myBooking.row]}, парта ${myBooking.seat + 1}` : "У тебя пока нет забронированного места"}
          </p>
        </div>

        <div className="grid grid-cols-3 gap-3 mb-6">
          {stats.map((s, i) => (
            <div key={s.label} className="glass rounded-2xl p-4 animate-fade-in shadow-sm" style={{ animationDelay: `${i * 0.1}s` }}>
              <div className={`w-10 h-10 bg-gradient-to-br ${s.color} rounded-xl flex items-center justify-center mb-3 shadow-md`}>
                <Icon name={s.icon} size={18} className="text-white" />
              </div>
              <div className="font-display font-black text-2xl text-foreground">{s.value}</div>
              <div className="text-xs text-muted-foreground mt-0.5 font-medium">{s.label}</div>
            </div>
          ))}
        </div>

        <div className="glass rounded-3xl p-6 mb-4 animate-fade-in shadow-md" style={{ animationDelay: "0.3s" }}>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 gradient-primary rounded-2xl flex items-center justify-center shadow-md">
              <Icon name="MapPin" size={18} className="text-white" />
            </div>
            <h2 className="font-display font-bold text-lg text-foreground">Моё место</h2>
          </div>
          {myBooking ? (
            <div className="flex items-center justify-between">
              <div>
                <div className="font-bold text-foreground text-lg">{ROW_LABELS[myBooking.row]}, парта {myBooking.seat + 1}</div>
                <div className="text-sm text-muted-foreground mt-0.5">Место успешно забронировано ✓</div>
              </div>
              <div className="w-16 h-16 seat-mine rounded-2xl flex items-center justify-center shadow-lg">
                <span className="text-white text-sm font-black">{myBooking.row + 1}–{myBooking.seat + 1}</span>
              </div>
            </div>
          ) : (
            <div className="text-center py-4">
              <div className="text-3xl mb-2">🪑</div>
              <p className="text-muted-foreground text-sm mb-4">Вы ещё не выбрали место</p>
              <button onClick={() => setPage("booking")}
                className="gradient-primary text-white font-bold px-6 py-2.5 rounded-xl shadow-lg shadow-purple-500/30 hover:opacity-90 active:scale-95 transition-all text-sm flex items-center gap-2 mx-auto">
                <Icon name="Plus" size={15} />Выбрать место
              </button>
            </div>
          )}
        </div>

        <div className="grid grid-cols-2 gap-3 animate-fade-in" style={{ animationDelay: "0.4s" }}>
          {[
            { page: "booking" as Page, icon: "Grid3x3", title: "Карта класса", sub: "Выбрать или изменить место", color: "from-purple-500 to-blue-500" },
            { page: "profile" as Page, icon: "User", title: "Профиль", sub: "Личные данные", color: "from-pink-500 to-rose-500" },
          ].map((item) => (
            <button key={item.page} onClick={() => setPage(item.page)}
              className="glass rounded-2xl p-5 text-left hover:shadow-md transition-all active:scale-95 group">
              <div className={`w-10 h-10 bg-gradient-to-br ${item.color} rounded-xl flex items-center justify-center mb-3 shadow-md group-hover:scale-110 transition-transform`}>
                <Icon name={item.icon} size={18} className="text-white" />
              </div>
              <div className="font-bold text-foreground text-sm">{item.title}</div>
              <div className="text-xs text-muted-foreground mt-0.5">{item.sub}</div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── Booking Page ────────────────────────────────────────────────────────────
function BookingPage({ user, bookings, setBookings }: {
  user: User; bookings: Booking[]; setBookings: (b: Booking[]) => void;
}) {
  const [selected, setSelected] = useState<{ row: number; seat: number } | null>(null);
  const [success, setSuccess] = useState(false);
  const myBooking = bookings.find((b) => b.userId === user.id);

  const getSeatState = (row: number, seat: number) => {
    if (isDisabled(row, seat)) return "disabled";
    const booking = bookings.find((b) => b.row === row && b.seat === seat);
    if (!booking) return "free";
    if (booking.userId === user.id) return "mine";
    return "taken";
  };

  const handleSeatClick = (row: number, seat: number) => {
    const state = getSeatState(row, seat);
    if (state === "disabled" || state === "taken") return;
    if (state === "mine") { setSelected(null); return; }
    setSelected({ row, seat });
  };

  const handleBook = () => {
    if (!selected) return;
    const newBookings = bookings.filter((b) => b.userId !== user.id);
    newBookings.push({ userId: user.id, userName: user.name, row: selected.row, seat: selected.seat });
    setBookings(newBookings);
    setSuccess(true);
    setTimeout(() => setSuccess(false), 2500);
    setSelected(null);
  };

  const handleCancel = () => {
    setBookings(bookings.filter((b) => b.userId !== user.id));
    setSelected(null);
  };

  const freeCount = ROWS * SEATS_PER_ROW - DISABLED_SEATS.length - bookings.length;

  return (
    <div className="min-h-screen gradient-bg pt-24 pb-10 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="mb-6 animate-fade-in">
          <h1 className="font-display font-black text-2xl text-foreground">Карта класса</h1>
          <p className="text-muted-foreground text-sm mt-1">28 парт · 5 рядов · свободно: {freeCount}</p>
        </div>

        <div className="glass rounded-2xl px-5 py-3 flex items-center flex-wrap gap-4 mb-5 animate-fade-in shadow-sm" style={{ animationDelay: "0.1s" }}>
          {[
            { cls: "bg-gradient-to-br from-green-100 to-green-200 border-green-400", label: "Свободно" },
            { cls: "gradient-primary border-purple-400", label: "Моё" },
            { cls: "bg-gradient-to-br from-pink-100 to-pink-200 border-pink-400", label: "Занято" },
            { cls: "bg-muted border-dashed border-border opacity-50", label: "Недоступно" },
          ].map((item) => (
            <div key={item.label} className="flex items-center gap-2">
              <div className={`w-6 h-6 rounded-lg border-2 ${item.cls}`} />
              <span className="text-xs font-medium text-muted-foreground">{item.label}</span>
            </div>
          ))}
        </div>

        <div className="glass rounded-3xl p-5 shadow-xl animate-scale-in" style={{ animationDelay: "0.15s" }}>
          <div className="mb-5 text-center">
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-100 to-blue-100 border border-purple-200 px-6 py-2 rounded-2xl">
              <Icon name="Monitor" size={16} className="text-primary" />
              <span className="text-sm font-bold text-primary">Доска / Учитель</span>
            </div>
          </div>

          <div className="space-y-3">
            {Array.from({ length: ROWS }).map((_, row) => (
              <div key={row} className="flex items-center gap-2">
                <span className="text-xs font-bold text-muted-foreground w-8 flex-shrink-0 text-right">{row + 1}</span>
                <div className="flex gap-1.5 flex-1 justify-center">
                  {Array.from({ length: SEATS_PER_ROW }).map((_, seat) => {
                    const state = getSeatState(row, seat);
                    const isSelected = selected?.row === row && selected?.seat === seat;
                    const booking = bookings.find((b) => b.row === row && b.seat === seat);
                    return (
                      <button key={seat} onClick={() => handleSeatClick(row, seat)}
                        title={booking ? booking.userName : state === "free" ? "Свободно" : "Недоступно"}
                        className={`
                          w-11 h-11 rounded-xl flex flex-col items-center justify-center text-xs font-bold transition-all duration-200
                          ${state === "free" ? "seat-free text-green-700" : ""}
                          ${state === "mine" ? "seat-mine text-white" : ""}
                          ${state === "taken" ? "seat-taken text-pink-700" : ""}
                          ${state === "disabled" ? "bg-muted border-2 border-dashed border-border text-muted-foreground opacity-40 cursor-not-allowed" : ""}
                          ${isSelected ? "ring-4 ring-primary ring-offset-2 scale-110 shadow-lg shadow-primary/40" : ""}
                        `}>
                        {state === "taken" && (
                          <div className="w-5 h-5 bg-pink-400 rounded-full flex items-center justify-center text-white text-[8px] font-bold">{booking?.userName.charAt(0)}</div>
                        )}
                        {state === "mine" && <Icon name="Star" size={12} className="text-white" />}
                        {state === "free" && <span className="text-[10px] font-bold">{seat + 1}</span>}
                        {state === "disabled" && <span>×</span>}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>

        {selected && getSeatState(selected.row, selected.seat) === "free" && (
          <div className="mt-4 glass rounded-2xl p-5 shadow-lg animate-fade-in border border-primary/10 flex items-center justify-between">
            <div>
              <div className="font-bold text-foreground">Выбрано: {ROW_LABELS[selected.row]}, парта {selected.seat + 1}</div>
              {myBooking && <div className="text-xs text-muted-foreground mt-0.5">Текущее место будет снято</div>}
            </div>
            <button onClick={handleBook}
              className="gradient-primary text-white font-bold px-5 py-2.5 rounded-xl shadow-lg shadow-purple-500/30 hover:opacity-90 active:scale-95 transition-all text-sm flex items-center gap-2">
              <Icon name="Check" size={15} />Забронировать
            </button>
          </div>
        )}

        {myBooking && !selected && (
          <div className="mt-4 glass rounded-2xl p-5 shadow-lg animate-fade-in border border-green-200 flex items-center justify-between">
            <div>
              <div className="font-bold text-foreground">{ROW_LABELS[myBooking.row]}, парта {myBooking.seat + 1}</div>
              <div className="text-xs text-muted-foreground mt-0.5">Ваше текущее место</div>
            </div>
            <button onClick={handleCancel}
              className="bg-destructive text-white font-bold px-5 py-2.5 rounded-xl hover:opacity-90 active:scale-95 transition-all text-sm flex items-center gap-2">
              <Icon name="X" size={15} />Отменить
            </button>
          </div>
        )}

        {success && (
          <div className="mt-3 bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-2xl px-5 py-4 flex items-center gap-3 animate-fade-in">
            <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0">
              <Icon name="Check" size={16} className="text-white" />
            </div>
            <div>
              <div className="font-bold text-green-800 text-sm">Место забронировано!</div>
              <div className="text-xs text-green-600">Успешно сохранено</div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ── Profile Page ────────────────────────────────────────────────────────────
function ProfilePage({ user, bookings, setPage }: { user: User; bookings: Booking[]; setPage: (p: Page) => void }) {
  const myBooking = bookings.find((b) => b.userId === user.id);

  return (
    <div className="min-h-screen gradient-bg pt-24 pb-10 px-4">
      <div className="max-w-md mx-auto">
        <div className="glass rounded-3xl p-8 text-center mb-4 shadow-xl animate-scale-in">
          <div className="w-24 h-24 gradient-accent rounded-3xl flex items-center justify-center text-white text-4xl font-black mx-auto mb-4 shadow-2xl shadow-pink-500/30">{user.avatar}</div>
          <h1 className="font-display font-black text-2xl text-foreground">{user.name}</h1>
          <p className="text-muted-foreground text-sm mt-1">{user.email}</p>
          <div className={`inline-flex items-center gap-1.5 mt-3 px-3 py-1 rounded-full text-xs font-bold
            ${user.role === "admin" ? "bg-purple-100 text-primary" : "bg-blue-50 text-blue-700"}`}>
            <Icon name={user.role === "admin" ? "Shield" : "GraduationCap"} size={12} />
            {user.role === "admin" ? "Администратор" : "Ученик"}
          </div>
        </div>

        <div className="glass rounded-3xl p-6 mb-4 shadow-md animate-fade-in" style={{ animationDelay: "0.1s" }}>
          <h2 className="font-display font-bold text-base text-foreground mb-4 flex items-center gap-2">
            <Icon name="MapPin" size={16} className="text-primary" />Моё место
          </h2>
          {myBooking ? (
            <div className="flex items-center justify-between">
              <div>
                <div className="font-bold text-foreground">{ROW_LABELS[myBooking.row]}</div>
                <div className="text-muted-foreground text-sm">Парта {myBooking.seat + 1}</div>
              </div>
              <div className="w-14 h-14 seat-mine rounded-2xl flex items-center justify-center shadow-lg">
                <span className="text-white font-black text-sm">{myBooking.row + 1}–{myBooking.seat + 1}</span>
              </div>
            </div>
          ) : (
            <div className="text-center py-3">
              <p className="text-muted-foreground text-sm mb-3">Место не выбрано</p>
              <button onClick={() => setPage("booking")}
                className="gradient-primary text-white font-bold px-5 py-2 rounded-xl text-sm shadow-lg shadow-purple-500/30 hover:opacity-90 active:scale-95 transition-all flex items-center gap-2 mx-auto">
                <Icon name="Plus" size={14} />Выбрать место
              </button>
            </div>
          )}
        </div>

        {[
          { icon: "User", label: "Имя", value: user.name },
          { icon: "Mail", label: "Email", value: user.email },
          { icon: "Hash", label: "ID", value: `#${user.id}` },
        ].map((item, i) => (
          <div key={item.label} className="glass rounded-2xl px-5 py-4 mb-2 flex items-center gap-4 animate-fade-in shadow-sm"
            style={{ animationDelay: `${0.15 + i * 0.05}s` }}>
            <div className="w-9 h-9 bg-muted rounded-xl flex items-center justify-center flex-shrink-0">
              <Icon name={item.icon} size={16} className="text-muted-foreground" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-xs text-muted-foreground font-medium">{item.label}</div>
              <div className="font-semibold text-foreground text-sm truncate">{item.value}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Admin Page ──────────────────────────────────────────────────────────────
function AdminPage({ bookings, setBookings, user }: { bookings: Booking[]; setBookings: (b: Booking[]) => void; user: User }) {
  const [search, setSearch] = useState("");

  if (user.role !== "admin") {
    return (
      <div className="min-h-screen gradient-bg pt-24 flex items-center justify-center">
        <div className="glass rounded-3xl p-10 text-center shadow-xl animate-scale-in">
          <Icon name="ShieldX" size={40} className="text-destructive mx-auto mb-4" />
          <h2 className="font-display font-black text-xl text-foreground">Доступ запрещён</h2>
          <p className="text-muted-foreground mt-2 text-sm">Только для администраторов</p>
        </div>
      </div>
    );
  }

  const freeSeats = ROWS * SEATS_PER_ROW - DISABLED_SEATS.length - bookings.length;
  const filtered = bookings.filter(
    (b) => b.userName.toLowerCase().includes(search.toLowerCase()) || `${b.row + 1}-${b.seat + 1}`.includes(search)
  );

  return (
    <div className="min-h-screen gradient-bg pt-24 pb-10 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="mb-6 animate-fade-in">
          <div className="flex items-center gap-3 mb-1">
            <div className="w-8 h-8 gradient-primary rounded-xl flex items-center justify-center shadow-md">
              <Icon name="Shield" size={16} className="text-white" />
            </div>
            <h1 className="font-display font-black text-2xl text-foreground">Панель управления</h1>
          </div>
          <p className="text-muted-foreground text-sm ml-11">Управление бронями класса</p>
        </div>

        <div className="grid grid-cols-3 gap-3 mb-5 animate-fade-in" style={{ animationDelay: "0.1s" }}>
          {[
            { value: 28, label: "Всего парт", color: "from-purple-500 to-blue-500", icon: "Grid3x3" },
            { value: bookings.length, label: "Забронировано", color: "from-orange-400 to-pink-500", icon: "Lock" },
            { value: freeSeats, label: "Свободно", color: "from-green-400 to-emerald-500", icon: "Unlock" },
          ].map((s) => (
            <div key={s.label} className="glass rounded-2xl p-4 text-center shadow-sm">
              <div className={`w-9 h-9 bg-gradient-to-br ${s.color} rounded-xl flex items-center justify-center mx-auto mb-2`}>
                <Icon name={s.icon} size={16} className="text-white" />
              </div>
              <div className="font-display font-black text-2xl text-foreground">{s.value}</div>
              <div className="text-xs text-muted-foreground mt-0.5">{s.label}</div>
            </div>
          ))}
        </div>

        <div className="glass rounded-2xl px-4 py-3 flex items-center gap-3 mb-4 shadow-sm animate-fade-in" style={{ animationDelay: "0.15s" }}>
          <Icon name="Search" size={16} className="text-muted-foreground flex-shrink-0" />
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Поиск по имени или месту..."
            className="flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground focus:outline-none" />
        </div>

        <div className="space-y-2">
          {filtered.length === 0 && (
            <div className="glass rounded-2xl p-8 text-center shadow-sm animate-fade-in">
              <div className="text-3xl mb-2">🔍</div>
              <p className="text-muted-foreground text-sm">{bookings.length === 0 ? "Нет активных броней" : "Ничего не найдено"}</p>
            </div>
          )}
          {filtered.map((b, i) => (
            <div key={b.userId} className="glass rounded-2xl px-5 py-4 flex items-center gap-4 shadow-sm animate-fade-in hover:shadow-md transition-all"
              style={{ animationDelay: `${i * 0.04}s` }}>
              <div className="w-10 h-10 gradient-accent rounded-xl flex items-center justify-center text-white font-bold flex-shrink-0 shadow-md">
                {b.userName.charAt(0)}
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-bold text-foreground text-sm truncate">{b.userName}</div>
                <div className="text-xs text-muted-foreground mt-0.5">{ROW_LABELS[b.row]} · Парта {b.seat + 1}</div>
              </div>
              <div className="flex items-center gap-2">
                <div className="seat-mine w-10 h-10 rounded-xl flex items-center justify-center shadow-md">
                  <span className="text-white text-xs font-black">{b.row + 1}–{b.seat + 1}</span>
                </div>
                <button onClick={() => setBookings(bookings.filter((x) => x.userId !== b.userId))}
                  className="w-9 h-9 bg-red-50 hover:bg-red-100 border border-red-200 rounded-xl flex items-center justify-center text-destructive transition-colors active:scale-90">
                  <Icon name="Trash2" size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>

        {bookings.length > 0 && (
          <button onClick={() => setBookings([])}
            className="w-full mt-4 bg-red-50 hover:bg-red-100 border border-red-200 text-destructive font-bold py-3 rounded-2xl text-sm flex items-center justify-center gap-2 transition-all active:scale-95 animate-fade-in">
            <Icon name="Trash2" size={15} />Сбросить все брони
          </button>
        )}
      </div>
    </div>
  );
}

// ── Main App ────────────────────────────────────────────────────────────────
export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [page, setPage] = useState<Page>("home");
  const [bookings, setBookings] = useState<Booking[]>(INITIAL_BOOKINGS);

  useEffect(() => {
    const saved = localStorage.getItem("classmest_user");
    if (saved) {
      try { setUser(JSON.parse(saved)); } catch { /* ignore */ }
    }
  }, []);

  const handleLogin = (u: User) => {
    setUser(u);
    localStorage.setItem("classmest_user", JSON.stringify(u));
    setPage("home");
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem("classmest_user");
    setPage("home");
  };

  if (!user) return <AuthScreen onLogin={handleLogin} />;

  return (
    <div className="min-h-screen gradient-bg">
      <NavBar page={page} setPage={setPage} user={user} onLogout={handleLogout} />
      {page === "home" && <HomePage user={user} bookings={bookings} setPage={setPage} />}
      {page === "booking" && <BookingPage user={user} bookings={bookings} setBookings={setBookings} />}
      {page === "profile" && <ProfilePage user={user} bookings={bookings} setPage={setPage} />}
      {page === "admin" && <AdminPage bookings={bookings} setBookings={setBookings} user={user} />}
    </div>
  );
}
