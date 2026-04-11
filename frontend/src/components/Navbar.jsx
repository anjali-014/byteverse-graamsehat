// import { Link, useNavigate } from "react-router-dom";
// import { Menu } from "lucide-react";
// import { useState } from "react";

// export default function Navbar() {
//   const navigate = useNavigate();
//   const [open, setOpen] = useState(false);

//   const user = JSON.parse(localStorage.getItem("loggedInUser"));

//   const logout = () => {
//     localStorage.removeItem("loggedInUser");
//     navigate("/login");
//   };

//   return (
//     <div className="bg-white shadow-md sticky top-0 z-50 px-6 py-3 flex justify-between items-center">

//       <h1 className="font-bold text-green-700 text-lg">
//         🌿 GraamSehat
//       </h1>

//       {/* Desktop Menu */}
//       <div className="hidden md:flex gap-6 items-center">
//         <Link to="/">Home</Link>
//         <Link to="/dashboard">Dashboard</Link>
//         <Link to="/profile">Profile</Link>
//         <Link to="/about">About</Link>

//         <span className="text-green-600 font-semibold">
//           Hi {user?.username || "User"} 💛
//         </span>

//         <button
//           onClick={logout}
//           className="bg-red-500 text-white px-4 py-1 rounded-lg"
//         >
//           Logout
//         </button>
//       </div>

//       {/* Mobile Menu */}
//       <Menu className="md:hidden" onClick={() => setOpen(!open)} />

//       {open && (
//         <div className="absolute top-16 right-4 bg-white shadow-lg rounded-xl p-4 flex flex-col gap-3 md:hidden">
//           <Link to="/">Home</Link>
//           <Link to="/dashboard">Dashboard</Link>
//           <Link to="/profile">Profile</Link>
//           <Link to="/about">About</Link>
//         </div>
//       )}
//     </div>
//   );
// }



// import { Link, useNavigate } from "react-router-dom";
// import { Menu, X, LogOut } from "lucide-react";
// import { useState } from "react";

// export default function Navbar() {
//   const navigate = useNavigate();
//   const [open, setOpen] = useState(false);

//   const user = JSON.parse(localStorage.getItem("loggedInUser"));

//   const logout = () => {
//     localStorage.removeItem("loggedInUser");
//     navigate("/login");
//   };

//   return (
//     <div className="sticky top-0 z-50 backdrop-blur-md bg-white/80 border-b shadow-sm">

//       <div className="flex justify-between items-center px-6 py-3">

//         {/* LOGO */}
//         <h1 className="font-bold text-green-700 text-lg flex items-center gap-2">
//           🌿 GraamSehat
//         </h1>

//         {/* DESKTOP MENU */}
//         <div className="hidden md:flex items-center gap-6">

//           {["Home", "Dashboard", "Profile", "About"].map((item) => (
//             <Link
//               key={item}
//               to={item === "Home" ? "/" : `/${item.toLowerCase()}`}
//               className="text-gray-700 font-medium relative group"
//             >
//               {item}
//               <span className="absolute left-0 -bottom-1 w-0 h-[2px] bg-green-600 transition-all group-hover:w-full"></span>
//             </Link>
//           ))}

//           {/* USER */}
//           <span className="text-green-600 font-semibold">
//             Hi {user?.username || "User"} 💛
//           </span>

//           {/* LOGOUT */}
//           <button
//             onClick={logout}
//             className="flex items-center gap-1 bg-red-500 hover:bg-red-600 text-white px-4 py-1.5 rounded-xl transition"
//           >
//             <LogOut size={16} />
//             Logout
//           </button>
//         </div>

//         {/* MOBILE ICON */}
//         <div className="md:hidden">
//           {open ? (
//             <X onClick={() => setOpen(false)} />
//           ) : (
//             <Menu onClick={() => setOpen(true)} />
//           )}
//         </div>
//       </div>

//       {/* MOBILE DROPDOWN */}
//       {open && (
//         <div className="md:hidden px-6 pb-4 flex flex-col gap-4 bg-white border-t animate-fadeIn">

//           <Link to="/" onClick={() => setOpen(false)}>Home</Link>
//           <Link to="/dashboard" onClick={() => setOpen(false)}>Dashboard</Link>
//           <Link to="/profile" onClick={() => setOpen(false)}>Profile</Link>
//           <Link to="/about" onClick={() => setOpen(false)}>About</Link>

//           <span className="text-green-600 font-semibold">
//             Hi {user?.username || "User"} 💛
//           </span>

//           <button
//             onClick={logout}
//             className="bg-red-500 text-white py-2 rounded-xl"
//           >
//             Logout
//           </button>
//         </div>
//       )}
//     </div>
//   );
// }



import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "./Navbar.css";

export default function Navbar({ user, onLogout }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  const links = [
    { label: "Home", path: "/" },
    { label: "Dashboard", path: "/dashboard" },
    { label: "Profile", path: "/profile" },
    { label: "About", path: "/about" },
  ];

  return (
    <nav className="gs-nav">
      <div className="gs-nav-inner">
        {/* Logo */}
        <div className="gs-nav-logo" onClick={() => navigate("/")}>
          🌿 <span>GraamSehat</span>
        </div>

        {/* Links */}
        <ul className={`gs-nav-links ${menuOpen ? "open" : ""}`}>
          {links.map((l) => (
            <li key={l.path}>
              <button
                className={`gs-nav-link ${location.pathname === l.path ? "active" : ""}`}
                onClick={() => { navigate(l.path); setMenuOpen(false); }}
              >
                {l.label}
              </button>
            </li>
          ))}
        </ul>

        {/* Auth */}
        <div className="gs-nav-auth">
          {user ? (
            <>
              <span className="gs-nav-user">Hi {user.name || "User"} 🧡</span>
              <button className="gs-nav-btn-outline" onClick={onLogout}>
                Logout
              </button>
            </>
          ) : (
            <>
              <button className="gs-nav-btn-ghost" onClick={() => navigate("/login")}>
                Sign in
              </button>
              <button className="gs-nav-btn-primary" onClick={() => navigate("/register")}>
                Sign up
              </button>
            </>
          )}
        </div>

        {/* Hamburger */}
        <button className="gs-hamburger" onClick={() => setMenuOpen(!menuOpen)}>
          <span /><span /><span />
        </button>
      </div>
    </nav>
  );
}
