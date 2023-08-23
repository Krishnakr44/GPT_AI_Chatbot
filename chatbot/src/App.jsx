import React, { useState, useEffect, useRef } from "react";
import { Configuration, OpenAIApi } from "openai";

const configuration = new Configuration({
  organization: "org-GUb3m6qyQijuzphP5p2PeOd8",
  apiKey: "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",
});

const openai = new OpenAIApi(configuration);

function App() {
  const [message, setMessage] = useState("");
  const [chats, setChats] = useState([]);
  const [isTyping, setIsTyping] = useState(false);

  const chatSectionRef = useRef(null);

  useEffect(() => {
    if (chatSectionRef.current) {
      chatSectionRef.current.scrollIntoView({
        behavior: "smooth",
        block: "end",
        inline: "nearest",
      });
    }
  }, [chats]);

  const chat = async (e, message) => {
    e.preventDefault();

    if (!message) return;
    setIsTyping(true);

    let msgs = [...chats];
    msgs.push({ role: "Krishna", content: message });
    setChats(msgs);

    setMessage("");

    try {
      const response = await openai.createChatCompletion({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content: "You are a KrishnaGPT. You can help with graphic design tasks",
          },
          ...chats,
        ],
      });

      console.log("API Response:", response);

      msgs.push(response.data.choices[0].message);
      setChats(msgs);
      setIsTyping(false);

      console.log("Response:", response);
    } catch (error) {
      console.error("API Error:", error);
    }
  };

  return (
    <main className="maine">
      <h1>GPT AI Chatbot</h1>

      <section className="chat-section">
        {chats.map((chat, index) => (
          <p
            key={index}
            className={chat.role === "Krishna" ? "user_msg krishna" : ""}
          >
            <span>
              <b>{chat.role.toUpperCase()}</b>
            </span>
            <span>:</span>
            <span>{chat.content}</span>
          </p>
        ))}
        <div ref={chatSectionRef}></div>
        <div className={isTyping ? "" : "hide"}>
        <p>
          <i>{isTyping ? "Typing" : ""}</i>
          <br />
          <i>{isTyping ? "Api Error" : ""}</i>
        </p>
      </div>

      </section>

     
      <form onSubmit={(e) => chat(e, message)}>
        <input
        
          type="text"
          name="message"
          value={message}
          placeholder="Type a message here..."
          onChange={(e) => setMessage(e.target.value)}
        />
      </form>
    </main>
  );
}

export default App;
