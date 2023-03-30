import express from 'express'


const router = express.Router()
import { auth } from '../middleware/auth.js';
import { getProducts, getProductbyID, insertProduct, updateProduct, delProduct } from '../services/mobiles.service.js';


router.get("/", express.json(), auth, async function (request, response) {
    const products = await getProducts()
    response.send(products);
});



router.get("/:id", auth, async function (request, response) {
    const { id } = request.params
    const products = await getProductbyID(id)
    response.send(products);
});
router.post("/addproducts", auth, express.json(), async function (request, response) {
    const data = request.body
    const insertProducts = await insertProduct(data)


    response.send(insertProducts);
});

router.put("/updateproducts/:id", express.json(), auth, async function (request, response) {
    const data = request.body
    const { id } = request.params
    const updateProducts = await updateProduct(id, data)
    if (updateProducts) {
        response.send({ message: "update success" });

    } else {
        response.send({ message: "error" })
    }
});

router.delete("/deleteproduct/:id", auth, async function (request, response) {
    const { id } = request.params
    const deleteProduct = await delProduct(id)
    if (deleteProduct) {
        response.send({ message: "successfully deleted" });
    } else {
        response.send({ message: "error" })
    }
})

export default router


