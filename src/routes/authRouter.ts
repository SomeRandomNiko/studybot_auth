import express, { NextFunction, Request, Response } from "express";
import config from "../shared/config";
import { createUser, disconnectDigreg, getUser, setDigregTokens } from "../shared/database";
import { getDiscordOAuthTokens, getDiscordUserData, getDiscordUserDataByToken } from "../shared/discord";
import jwt from "jsonwebtoken";
import { AxiosError } from "axios";
import { getDigregOAuthTokens } from "../shared/digreg";
import { requireLogin } from "../middleware";

const authRouter = express.Router();

authRouter.get("/discord", discordOAuthCallback);
authRouter.get("/digreg", digregOAuthCallback);
authRouter.post("/linkDigreg", requireLogin, linkDigreg);
authRouter.post("/unlinkDigreg", requireLogin, unlinkDigreg);

async function discordOAuthCallback(req: Request, res: Response, next: NextFunction) {
    const code = req.query.code?.toString();

    if (!code)
        return next({ status: 400, message: "Missing discord code" });

    const tokens = await getDiscordOAuthTokens(code).catch((err: AxiosError) => next({ status: err.response?.status, message: err.response?.statusText }));

    if (!tokens)
        return next({ status: 500, message: "Could not get discord tokens" });

    const discordUser = await getDiscordUserDataByToken(tokens.access_token).catch(() => next({ status: 500, message: "Could not get Tokens from Discord API" }));

    if (!discordUser)
        return next({ status: 500, message: "Could not get discord user data" });

    let dbUser = await getUser(discordUser.id);

    if (!dbUser)
        dbUser = await createUser(discordUser.id);

    // create a jwt with the discordId in the payload
    const token = jwt.sign({ discordId: discordUser.id }, config.jwtSecret, { expiresIn: config.jwtExpiration });

    res.redirect(`${config.frontendServerUri}/callback/discord/${token}`);
}

async function digregOAuthCallback(req: Request, res: Response, next: NextFunction) {
    const code = req.query.code?.toString();

    if (!code)
        return next({ status: 400, message: "Missing digreg code" });

    const token = jwt.sign({ code }, config.jwtSecret, { expiresIn: 60 });

    res.redirect(`${config.frontendServerUri}/callback/digreg/${token}`);
}

async function linkDigreg(req: Request, res: Response, next: NextFunction) {
    const { digregToken } = req.body;
    if (!digregToken)
        return next({ status: 400, message: "Missing digreg token" });

    // checks if expiered
    jwt.verify(digregToken, config.jwtSecret, async (error: any, decoded: any) => {
        if (error)
            return next({ status: 400, message: "Invalid digreg token" });

        if (!decoded?.code)
            return next({ status: 400, message: "Missing digreg code in token" });

        const tokens = await getDigregOAuthTokens(decoded.code).catch((err: AxiosError) => next({ status: err.response?.status, message: err.response?.statusText }));

        if (!tokens)
            return next({ status: 500, message: "Could not get digreg tokens" });

        await setDigregTokens(req.discordId, tokens.token, new Date(tokens.expiration), tokens.user_id, tokens.refresh_token);

        res.sendStatus(200);
    });
}

async function unlinkDigreg(req: Request, res: Response, next: NextFunction) {
    await disconnectDigreg(req.discordId).catch(() => next({ status: 500, message: "Could not disconnect digreg" }));
    res.sendStatus(200);
}

export default authRouter;