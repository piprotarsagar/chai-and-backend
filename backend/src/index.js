import dotenv from "dotenv";

dotenv.config({
    path: "./.env",
});

console.log("Cloud Name:", process.env.CLOUD_NAME);
console.log("Mongo URI:", process.env.URI);

const startServer = async () => {

    const { default: app } = await import("./app.js");
    const { default: Connection } = await import("./db/Connection.js");

    try {

        await Connection();

        app.listen(process.env.PORT || 4000, () => {
            console.log(`Server running on port ${process.env.PORT}`);
        });

    } catch (error) {

        console.log("MongoDB connection failed:", error);

    }
};

startServer();