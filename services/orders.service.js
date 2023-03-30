import { client } from "../index.js";

export async function updatingDeliveryStatus(data) {
    return await client.db("jujutsustore").collection("login").updateOne({ email: data.email, "OrderData.order_no": data.order }, {
        $set: { "OrderData.$.delivered": !data.delivered }
    });
}
export async function getAllOrders() {
    return await client.db("jujutsustore").collection("login").find({}).project({ OrderData: 1, username: 1, email: 1 }).toArray();
}
export async function dataForMyOrders(id) {
    return await client.db("jujutsustore").collection("login").findOne({ username: id }, { OrderData: 1 });
}
export async function addingOrders(id, finaldata) {
    return await client.db("jujutsustore").collection("login").updateOne({ username: id }, { $push: { OrderData: finaldata } });
}
export async function datasCheck(id) {
    return await client.db("jujutsustore").collection("login").findOne({ username: id });
}
