import { ObjectId } from 'mongodb';
import { client } from "../index.js";

export async function delProduct(id) {
    return await client.db("jujutsustore").collection("products").deleteOne({ _id: ObjectId(id) });
}
export async function updateProduct(id, data) {
    return await client.db("jujutsustore").collection("products").updateOne({ _id: ObjectId(id) }, { $set: data });
}
export async function insertProduct(data) {
    return await client.db("jujutsustore").collection("products").insertOne(data);
}
export async function getProductbyID(id) {
    return await client.db("jujutsustore").collection("products").findOne({ _id: ObjectId(id) });
}
export async function getProducts() {
    return await client.db("jujutsustore").collection("products").find({}).toArray();
}
