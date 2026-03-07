import io from "socket.io-client";

export const createSocketConnection = () => {
    const opts = {
        withCredentials: true,
        transports: ["websocket", "polling"],
    };

    if (location.hostname === "localhost" || location.hostname === "127.0.0.1") {
        return io("http://" + location.hostname + ":3000", opts);
    } else {
        return io("/", { ...opts, path: "/api/socket.io" });
    }
};