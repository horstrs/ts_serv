import express from "express";

const app = express();
const PORT = 8080; 

app.get("/healthz", (req, res) => {
    res.set({
            "Content-type": "text/plain",
            "charset": "utf-8"
        });
    res.send("OK");
});

app.get("/", (req, res) => {
    res.set({
            "Content-type": "text/plain",
            "charset": "utf-8"
        });
    res.redirect(302, "/app/");
});

app.use("/app", express.static("./src/app"));

app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
});
