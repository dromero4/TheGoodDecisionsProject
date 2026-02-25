import authenticate from "../lib/toptex/auth.js";

export default async function test() {
    const token = await authenticate();

    console.log("Token:", token);
}

test();