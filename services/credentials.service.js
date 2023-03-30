import { client } from "../index.js";

export async function updatePassword(username, Hashedpassword) {
    return await client.db("jujutsustore").collection("login").updateOne({ username: username }, { $set: { password: Hashedpassword } });
}
export async function otpCheck(username) {
    return await client.db("jujutsustore").collection("otp").findOne({ username: username });
}
export async function ForgetCheck(username) {
    return await client.db("jujutsustore").collection("login").findOne({ username: username });
}
export async function lLoginCheck(data) {
    return await client.db("jujutsustore").collection("login").findOne({ username: data.username });
}
export async function unsetVerify_link(username, link) {
    await client.db("jujutsustore").collection("signupusers").updateOne({ username: username }, { $unset: { verify_link: link } });
}
export async function verify_linkCheck(link) {
    return await client.db("jujutsustore").collection("signupusers").findOne({ verify_link: link });
}
export async function signupInsert(finalData) {
    return await client.db("jujutsustore").collection("signupusers").insertOne(finalData);
}
export async function loginEmailCheck(email) {
    return await client.db("jujutsustore").collection("login").findOne({ email: email });
}
export async function loginUserCheck(username) {
    return await client.db("jujutsustore").collection("login").findOne({ username: username });
}
export async function signupEmailCheck(email) {
    return await client.db("jujutsustore").collection("signusers").findOne({ email: email });
}
export async function signupUserCheck(username) {
    return await client.db("jujutsustore").collection("signupusers").findOne({ username: username });
}
