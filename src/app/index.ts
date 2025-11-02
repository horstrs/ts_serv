import express, { response } from "express";
import { Request, Response } from "express";

const app = express();
const PORT = 8080; 

app.get("/healthz", (req, res) => {
    res.set({
            "Content-type": "text/plain",
            "charset": "utf-8"
        })
    res.send("OK")
});

app.use("/app", express.static("./src/app"));

app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
});

async function handlerReadiness(req: Request, res: Response): Promise<void> {
    res.set
    res.send()
}