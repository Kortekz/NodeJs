

import express from "express";
import {getFriends, getFriend, addFriend, deleteFriend, editFriend} from '../models/database.js';
import controller from '../controller/friends.js'
const router = express.Router()


router
    .route('/')
        .get(controller.getMany)
        .post(controller.postMany)

router
    .route('/:id')
        .get(controller.getID)
        .patch(controller.patchID)

router
    .route('/:name')
    .delete(controller.deleteID)

// module.exports = router (common JS)

export default router