import { mockUsers } from "./constants.mjs";

export const resolveIndexByUserById = (req, res, next) => {
    const {
        params: { id }} = req;

    const parsedID = parseInt(id);
    if (isNaN(parsedID)) return res.sendStatus(400);
    const findUserIndex = mockUsers.findIndex((user) => user.id === parsedID);
    if (findUserIndex === -1) return res.sendStatus(404);
    req.findUserIndex = findUserIndex;
    next();
}