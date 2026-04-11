import { useNavigate } from "react-router-dom";
import i18n from "../i18n";

function LanguageSelect() {
  const navigate = useNavigate();

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
    localStorage.setItem("lang", lng);
    navigate("/");
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-sehat-light">
      
      <h1 className="text-2xl font-bold mb-8 text-sehat-green">
        🌍 Choose Language 💛
      </h1>

      <div className="flex flex-col gap-4 w-[250px]">

        <button
          onClick={() => changeLanguage("en")}
          className="px-6 py-3 bg-green-600 text-white rounded-xl hover:bg-green-700 transition"
        >
          🇬🇧 English
        </button>

        <button
          onClick={() => changeLanguage("hi")}
          className="px-6 py-3 bg-yellow-500 text-white rounded-xl hover:bg-yellow-600 transition"
        >
          🇮🇳 हिंदी
        </button>

        {/* ✅ NEW BHOJPURI BUTTON */}
        <button
          onClick={() => changeLanguage("bho")}
          className="px-6 py-3 bg-red-500 text-white rounded-xl hover:bg-red-600 transition"
        >
          🧡 भोजपुरी
        </button>

      </div>

    </div>
  );
}

export default LanguageSelect;