import { useContext, useEffect, useState } from "react";
import { userDataContext } from "../context/UserContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import aiImg from "../../../assets/ai.gif";
import userImg from "../../../assets/user.gif";
import { TiThMenu } from "react-icons/ti";
import { RxCross2 } from "react-icons/rx";

const Home = () => {
  const { userData, serverUrl, setUserData, getGeminiResponse } =
    useContext(userDataContext);
  const navigate = useNavigate();
  const [userText, setUserText] = useState("");
  const [aiText, setAiText] = useState("");
  const [ham, setHam] = useState(false);

  const handleLogout = async () => {
    try {
      const result = await axios.get(`${serverUrl}/api/auth/logout`, {
        withCredentials: true,
      });
      setUserData(null);
      navigate("/signin");
    } catch (error) {
      setUserData(null);
      console.log(error);
    }
  };

  const speak = (text) => {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "hi-IN";
    const voices = window.speechSynthesis.getVoices();
    const hindiVoice = voices.find((v) => v.lang === "hi-IN");
    if (hindiVoice) {
      utterance.voice = hindiVoice;
    }
    utterance.onend = () => {
      setAiText("");
    };
    window.speechSynthesis.speak(utterance);
  };
  const handleCommand = (data) => {
    const { type, userInput, response } = data;
    speak(response);
    // if (type === "google_search") {
    //   const query = encodeURIComponent(userInput);
    //   window.open(`https://www.google.com/search?q=${query}`, "_blank");
    // }
    if (type === "google_search") {
      if (userInput.toLowerCase().includes("open google")) {
        window.open("https://www.google.com", "_blank");
      } else {
        const query = encodeURIComponent(userInput);
        window.open(`https://www.google.com/search?q=${query}`, "_blank");
      }
    }

    if (type === "calculator_open") {
      window.open(`https://www.google.com/search?q=calculator`, "_blank");
    }
    if (type === "instagram_open") {
      window.open(`https://www.instagram.com/`, "_blank");
    }
    if (type === "facebook_open") {
      window.open(`https://www.facebook.com/`, "_blank");
    }
    if (type === "weather_show") {
      window.open(`https://www.google.com/search?q=weather`, "_blank");
    }
    if (type === "youtube_search" || type === "youtube_play") {
      const query = encodeURIComponent(userInput);
      window.open(
        `https://www.youtube.com/results?search_query=${query}`,
        "_blank"
      );
    }
    // if (type === "send_whatsapp") {
    //   const phone = encodeURIComponent(userPhone || ""); // leave blank to open chat selector
    //   const message = encodeURIComponent(userInput); // whatever assistant hears
    //   window.open(
    //     `https://web.whatsapp.com/send?phone=${phone}&text=${message}`,
    //     "_blank"
    //   );
    // }
    if (type === "send_whatsapp") {
      // Remove the assistant wake word and WhatsApp keywords
      const messageOnly = userInput
        .replace(/^(friday\s*)?(send\s*)?/i, "") // remove "Friday send" if present
        .replace(/\s*on\s*whatsapp$/i, "") // remove "on WhatsApp" at the end
        .trim();

      window.open(
        `https://web.whatsapp.com/send?text=${encodeURIComponent(messageOnly)}`,
        "_blank"
      );
    }
    if (type === "spotify_open" || type === "music_play") {
      const song = userInput
        .replace(/(spotify\s*(open|play)?|play)/i, "")
        .trim();

      fetch(`http://localhost:8000/play?song=${encodeURIComponent(song)}`);
    }
  };

  useEffect(() => {
    // 1️⃣ Warm up backend to avoid cold start delay
    axios.get(`${serverUrl}/ping`).catch(() => {});
    // window.speechSynthesis.onvoiceschanged = () => {
    //   window.speechSynthesis.getVoices();
    // };

    // 2️⃣ Init SpeechRecognition
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.lang = "en-US";

    // // Set initial greeting texts
    // const greeting = "Jai Siya Ram, what can I do for you?";
    // setUserText(greeting);
    // setAiText(greeting);

    // Speak the greeting
    // speak(greeting);

    // const SpeechRecognition =
    // window.SpeechRecognition || window.webkitSpeechRecognition;

    // const recognition = new SpeechRecognition();
    // recognition.continuous = true;
    // recognition.lang = "en-US";
    recognition.onresult = async (e) => {
      const transcript = e.results[e.results.length - 1][0].transcript.trim();
      console.log("heard : " + transcript);
      if (
        transcript.toLowerCase().includes(userData.assistantName.toLowerCase())
      ) {
        setAiText("");
        setUserText(transcript);
        // const data = await getGeminiResponse(transcript);
        // console.log(data);
        // // speak(data.response);
        // handleCommand(data);
        // setAiText(data.response);
        // setUserText("");

        // Call Gemini without blocking UI
        getGeminiResponse(transcript)
          .then((data) => {
            console.log(data);
            handleCommand(data);
            setAiText(data.response);
            setUserText("");
          })
          .catch((err) => console.error(err));
      }
    };
    // recognition.start();
    recognition.onerror = (e) => {
      console.error("Recognition error", e);
    };

    recognition.onend = () => {
      setTimeout(() => recognition.start(), 300); // Restart after each session ends
    };

    // 3️⃣ Load voices and greet user without blocking recognition
    const loadVoicesAndGreet = () => {
      const voices = window.speechSynthesis.getVoices();
      const greeting =
        "Jai Siya Ram, hmare bhagya khulgye jo apne hmmme pukaraa , kahiye mai apki kaise madad kr sakti hun";
      setUserText(greeting);
      setAiText(greeting);
      speak(greeting); // Your existing speak() function
    };

    if (window.speechSynthesis.getVoices().length > 0) {
      loadVoicesAndGreet();
    } else {
      // window.speechSynthesis.onvoiceschanged = loadVoicesAndGreet;
      window.speechSynthesis.onvoiceschanged = () => {
        const voices = window.speechSynthesis.getVoices();
        if (voices.length > 0) {
          loadVoicesAndGreet();
          window.speechSynthesis.onvoiceschanged = null; // prevent re-triggering
        }
      };
    }

    // 4️⃣ Start recognition immediately

    recognition.start();

    return () => recognition.stop(); // Cleanup
  }, []);

  return (
    <div className="  w-full h-[100vh] bg-gradient-to-t from-[black] to-[#02023d] flex justify-center items-center flex-col gap-[20px] overflow-hidden">
      <TiThMenu
        className="lg:hidden text-white absolute top-[20px] right-[20px] w-[25px] h-[25px]"
        onClick={() => setHam(true)}
      />
      <div
        className={`absolute lg:hidden top-0 w-full h-full bg-[#00000052] backdrop-blur-lg p-[20px] flex flex-col gap-[20px] items-start ${
          ham ? "translate-x-0" : "translate-x-full"
        }  transition-transform  `}
      >
        <RxCross2
          className="text-white absolute top-[20px] right-[20px] w-[25px] h-[25px]"
          onClick={() => setHam(false)}
        />
        <button
          className="min-w-[150px] h-[60px] bg-white rounded-full text-black font-semibold text-[19px]  cursor-pointer"
          onClick={handleLogout}
        >
          Log Out
        </button>
        <button
          className="min-w-[150px] h-[60px] bg-white rounded-full text-black font-semibold text-[19px] mt-[30px]  px-[20px] py-[10px] cursor-pointer"
          onClick={() => navigate("/customize")}
        >
          Customize Your Assistant
        </button>
        <div className="w-full h-[2px] bg-gray-400"></div>
        <h1 className="text-white font-semibold text-[19px]">History</h1>
        <div className="w-full h-[60%] overflow-auto flex flex-col gap-[20px] ">
          {userData.history?.map((his, index) => (
            <span key={index} className="text-white text-[18px] ">
              {his}
            </span>
          ))}
        </div>
      </div>
      <button
        className="min-w-[150px] h-[60px] bg-white rounded-full text-black font-semibold text-[19px] mt-[30px] absolute hidden lg:block top-[20px] right-[20px] cursor-pointer"
        onClick={handleLogout}
      >
        Log Out
      </button>
      <button
        className="min-w-[150px] h-[60px] bg-white rounded-full text-black font-semibold text-[19px] mt-[30px] absolute hidden lg:block top-[100px] right-[20px] px-[20px] py-[10px] cursor-pointer"
        onClick={() => navigate("/customize")}
      >
        Customize Your Assistant
      </button>
      <div className="w-[300px] h-[400px] flex justify-center items-center overflow-hidden rounded-4xl shadow-lg ">
        <img
          src={userData?.assistantImage}
          alt=""
          className="h-full object-cover"
        />
      </div>
      <h1 className="text-white text-[18px] font-semibold">
        I'm {userData?.assistantName}
      </h1>
      {!aiText && <img src={userImg} alt="" className="w-[200px]" />}
      {aiText && <img src={aiImg} alt="" className="w-[200px]" />}
      <h1 className="text-white text-[18px] font-semibold text-wrap">
        {userText ? userText : aiText ? aiText : null}
      </h1>
    </div>
  );
};

export default Home;
