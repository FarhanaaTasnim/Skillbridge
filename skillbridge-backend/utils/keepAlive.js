import https from "https";

const keepAlive = () => {
  setInterval(() => {
    https.get("https://skillbridge-backend.onrender.com/", (res) => {
      console.log("Keep alive ping:", res.statusCode);
    }).on("error", (err) => {
      console.log("Ping error:", err.message);
    });
  }, 10 * 60 * 1000);
};

export default keepAlive;